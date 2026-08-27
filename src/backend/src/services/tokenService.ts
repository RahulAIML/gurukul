import { createHash, randomBytes } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { loadEnv } from '../config/env.js';
import { Session } from '../models/Session.js';
import { AppError } from '../utils/AppError.js';

/**
 * Token strategy.
 *
 * ACCESS token: short-lived JWT, returned in the response body. The client
 * holds it in memory only. Stateless, so it cannot be revoked before expiry —
 * which is precisely why it is short-lived.
 *
 * REFRESH token: opaque random bytes, NOT a JWT. It is a database-backed
 * credential, so it can be revoked, rotated and audited. A JWT refresh token
 * would be revocable only by keeping a denylist, at which point it has all the
 * cost of a database session and none of the clarity.
 *
 * Only the HASH is stored. A database dump therefore yields no usable session.
 */

export interface AccessClaims {
  sub: string;
  type: 'access';
}

export function signAccessToken(userId: string): string {
  const env = loadEnv();
  return jwt.sign({ sub: userId, type: 'access' } satisfies AccessClaims, env.JWT_ACCESS_SECRET, {
    expiresIn: env.ACCESS_TOKEN_TTL,
  } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): AccessClaims {
  const env = loadEnv();
  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessClaims;
    // A refresh token presented as a bearer must not be accepted.
    if (decoded.type !== 'access') throw new Error('wrong token type');
    return decoded;
  } catch {
    throw new AppError('SESSION_EXPIRED');
  }
}

/** SHA-256 is correct here, unlike for passwords: the input is 48 bytes of
 *  entropy, so there is nothing to brute-force and no need to slow it down. */
export const hashRefreshToken = (raw: string): string =>
  createHash('sha256').update(raw).digest('hex');

export interface IssuedRefresh {
  raw: string;
  sessionId: string;
  expiresAt: Date;
}

export async function issueRefreshToken(
  userId: string,
  userAgent?: string,
): Promise<IssuedRefresh> {
  const env = loadEnv();
  const raw = randomBytes(48).toString('base64url');
  const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 86_400_000);

  const session = await Session.create({
    userId,
    tokenHash: hashRefreshToken(raw),
    expiresAt,
    userAgent: userAgent?.slice(0, 200) ?? null,
  });

  return { raw, sessionId: String(session._id), expiresAt };
}

/**
 * Consumes a refresh token and issues a fresh one — rotation on every use.
 *
 * Rotation matters: without it a stolen refresh token is valid for its full
 * lifetime. With it, the thief and the legitimate user cannot both keep using
 * the session, and the second one to present the old token is rejected.
 */
export async function rotateRefreshToken(
  raw: string,
  userAgent?: string,
): Promise<{ userId: string; refresh: IssuedRefresh }> {
  const tokenHash = hashRefreshToken(raw);
  const session = await Session.findOne({ tokenHash });

  if (!session) throw new AppError('SESSION_EXPIRED', 'refresh token not found');

  if (session.revokedAt) {
    // A revoked token being presented means it was captured. Kill every
    // session for this user rather than just refusing this one.
    await Session.updateMany(
      { userId: session.userId, revokedAt: null },
      { $set: { revokedAt: new Date() } },
    );
    throw new AppError('SESSION_EXPIRED', 'refresh token reuse detected');
  }

  if (session.expiresAt.getTime() < Date.now()) {
    throw new AppError('SESSION_EXPIRED', 'refresh token expired');
  }

  session.revokedAt = new Date();
  await session.save();

  const refresh = await issueRefreshToken(String(session.userId), userAgent);
  return { userId: String(session.userId), refresh };
}

export async function revokeRefreshToken(raw: string): Promise<void> {
  await Session.updateOne(
    { tokenHash: hashRefreshToken(raw), revokedAt: null },
    { $set: { revokedAt: new Date() } },
  );
}

export async function revokeAllSessions(userId: string): Promise<void> {
  await Session.updateMany({ userId, revokedAt: null }, { $set: { revokedAt: new Date() } });
}
