import bcrypt from 'bcryptjs';
import { loadEnv } from '../config/env.js';
import { User, type UserDoc } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { logger } from '../utils/logger.js';
import { issueRefreshToken, revokeAllSessions, signAccessToken } from './tokenService.js';

export interface PublicUser {
  id: string;
  email: string;
  createdAt: string;
}

export interface AuthResult {
  user: PublicUser;
  accessToken: string;
  refreshToken: string;
  refreshExpiresAt: Date;
}

const toPublic = (doc: UserDoc): PublicUser => ({
  id: String(doc._id),
  email: doc.email,
  createdAt: (doc.createdAt as Date | undefined)?.toISOString() ?? new Date().toISOString(),
});

/**
 * A dummy hash of the right shape and cost, used to equalise timing on the
 * "no such user" path.
 *
 * Without it, login against an unknown email returns before any hashing
 * happens, and the response-time difference reveals which addresses are
 * registered. Comparing against this instead makes both paths cost the same.
 */
let dummyHash: string | null = null;
async function getDummyHash(cost: number): Promise<string> {
  dummyHash ??= await bcrypt.hash('timing-equalisation-placeholder', cost);
  return dummyHash;
}

export async function signUp(
  email: string,
  password: string,
  userAgent?: string,
): Promise<AuthResult> {
  const env = loadEnv();
  const normalised = email.trim().toLowerCase();

  const existing = await User.findOne({ email: normalised }).lean();
  if (existing) throw new AppError('EMAIL_TAKEN');

  const passwordHash = await bcrypt.hash(password, env.BCRYPT_COST);

  let created: UserDoc;
  try {
    created = (await User.create({ email: normalised, passwordHash })) as unknown as UserDoc;
  } catch (err: unknown) {
    // Two simultaneous signups for the same address both pass the check above;
    // the unique index is what actually decides. Translate rather than 500.
    if ((err as { code?: number }).code === 11000) throw new AppError('EMAIL_TAKEN');
    throw err;
  }

  logger.info('user signed up', { userId: String(created._id) });

  const accessToken = signAccessToken(String(created._id));
  const refresh = await issueRefreshToken(String(created._id), userAgent);

  return {
    user: toPublic(created),
    accessToken,
    refreshToken: refresh.raw,
    refreshExpiresAt: refresh.expiresAt,
  };
}

export async function logIn(
  email: string,
  password: string,
  userAgent?: string,
): Promise<AuthResult> {
  const env = loadEnv();
  const normalised = email.trim().toLowerCase();

  const user = (await User.findOne({ email: normalised }).select('+passwordHash')) as
    | (UserDoc & { passwordHash: string })
    | null;

  if (!user) {
    // Still spend the hashing time, then fail with the SAME code as a wrong
    // password. "No such user" and "wrong password" must be indistinguishable
    // in both response and timing, or the endpoint enumerates accounts.
    await bcrypt.compare(password, await getDummyHash(env.BCRYPT_COST));
    throw new AppError('INVALID_CREDENTIALS');
  }

  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) {
    logger.warn('failed login', { userId: String(user._id) });
    throw new AppError('INVALID_CREDENTIALS');
  }

  const accessToken = signAccessToken(String(user._id));
  const refresh = await issueRefreshToken(String(user._id), userAgent);

  logger.info('user logged in', { userId: String(user._id) });

  return {
    user: toPublic(user),
    accessToken,
    refreshToken: refresh.raw,
    refreshExpiresAt: refresh.expiresAt,
  };
}

export async function getPublicUser(userId: string): Promise<PublicUser> {
  const user = (await User.findById(userId)) as UserDoc | null;
  if (!user) throw new AppError('SESSION_EXPIRED');
  return toPublic(user);
}

/**
 * Password reset request.
 *
 * Always resolves, whether or not the address exists — otherwise the endpoint
 * is an account-enumeration oracle. Sending the email is deliberately not
 * implemented: no mail transport is configured, and a silent no-op that looks
 * like success would be worse than an explicit gap.
 */
export async function requestPasswordReset(email: string): Promise<void> {
  const normalised = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalised }).lean();

  if (user) {
    // TODO(mail): issue a single-use, short-lived reset token and email it.
    // Until a transport exists, revoking sessions is the only safe action —
    // it is what a user asking for a reset most likely wants.
    await revokeAllSessions(String(user._id));
    logger.info('password reset requested', { userId: String(user._id) });
  } else {
    logger.info('password reset requested for unknown address');
  }
}
