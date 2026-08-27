import type { CookieOptions, Request, Response } from 'express';
import { z } from 'zod';
import { loadEnv } from '../config/env.js';
import {
  getPublicUser,
  logIn,
  requestPasswordReset,
  signUp,
  type AuthResult,
} from '../services/authService.js';
import {
  revokeRefreshToken,
  rotateRefreshToken,
  signAccessToken,
} from '../services/tokenService.js';
import { AppError } from '../utils/AppError.js';
import type { AuthedRequest } from '../middleware/index.js';

export const REFRESH_COOKIE = 'gurukul_rt';

/**
 * Refresh cookie options.
 *
 * httpOnly    — JavaScript cannot read it, so XSS cannot steal the session.
 * sameSite    — 'lax' blocks the cross-site POST that CSRF needs while still
 *               surviving a normal top-level navigation back to the app.
 * secure      — HTTPS only. Off locally, or the browser drops it on http.
 * path        — scoped to the auth routes so it is not attached to every
 *               request to the API.
 */
function refreshCookieOptions(expires: Date): CookieOptions {
  const env = loadEnv();
  return {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: 'lax',
    path: '/api/v1/auth',
    expires,
  };
}

const credentials = z.object({
  email: z.string().trim().min(1).email(),
  // Length only. Composition rules ("one uppercase, one symbol") push users
  // toward predictable substitutions and measurably weaker passwords.
  password: z.string().min(8).max(200),
});

const emailOnly = z.object({ email: z.string().trim().min(1).email() });

export const credentialsSchema = credentials;
export const emailOnlySchema = emailOnly;

function send(res: Response, result: AuthResult, status: number) {
  res
    .cookie(REFRESH_COOKIE, result.refreshToken, refreshCookieOptions(result.refreshExpiresAt))
    .status(status)
    .json({ user: result.user, accessToken: result.accessToken });
}

export async function postSignUp(req: Request, res: Response) {
  const { email, password } = credentials.parse(req.body);
  const result = await signUp(email, password, req.headers['user-agent']);
  send(res, result, 201);
}

export async function postLogIn(req: Request, res: Response) {
  const { email, password } = credentials.parse(req.body);
  const result = await logIn(email, password, req.headers['user-agent']);
  send(res, result, 200);
}

/**
 * Exchanges the refresh cookie for a new access token, rotating the refresh
 * token in the process.
 */
export async function postRefresh(req: Request, res: Response) {
  const raw = req.cookies?.[REFRESH_COOKIE];
  if (typeof raw !== 'string' || raw.length === 0) {
    throw new AppError('SESSION_EXPIRED', 'no refresh cookie');
  }

  const { userId, refresh } = await rotateRefreshToken(raw, req.headers['user-agent']);
  const user = await getPublicUser(userId);

  res
    .cookie(REFRESH_COOKIE, refresh.raw, refreshCookieOptions(refresh.expiresAt))
    .status(200)
    .json({ user, accessToken: signAccessToken(userId) });
}

export async function postLogOut(req: Request, res: Response) {
  const raw = req.cookies?.[REFRESH_COOKIE];
  if (typeof raw === 'string' && raw.length > 0) {
    // Revoked server-side, not merely cleared client-side: a cookie the client
    // discards is still valid to anyone who copied it.
    await revokeRefreshToken(raw);
  }
  res.clearCookie(REFRESH_COOKIE, { path: '/api/v1/auth' }).status(204).end();
}

export async function postPasswordReset(req: Request, res: Response) {
  const { email } = emailOnly.parse(req.body);
  await requestPasswordReset(email);
  // 204 regardless of whether the address exists — anything else is an
  // account-enumeration oracle.
  res.status(204).end();
}

export async function getMe(req: AuthedRequest, res: Response) {
  const user = await getPublicUser(req.userId!);
  res.status(200).json({ user });
}
