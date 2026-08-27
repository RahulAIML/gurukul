/**
 * Authentication contract.
 *
 * The UI talks to an `AuthAdapter`, never to a transport directly. That is
 * what lets the real backend land behind this interface without touching a
 * single screen.
 *
 * DELIBERATE OMISSION: there is no `password` field on `AuthUser` and no
 * method that returns a password or a raw token to component code. Tokens are
 * the adapter's business.
 */

export interface AuthUser {
  id: string;
  email: string;
  /** ISO date. */
  createdAt: string;
}

/** Typed error codes so the UI can map to a friendly translated message and
 *  never render a raw backend string. */
export type AuthErrorCode =
  | 'invalid_credentials'
  | 'email_taken'
  | 'weak_password'
  | 'invalid_email'
  | 'network'
  | 'session_expired'
  | 'not_configured'
  | 'unknown';

export class AuthError extends Error {
  constructor(
    public code: AuthErrorCode,
    message?: string,
  ) {
    super(message ?? code);
    this.name = 'AuthError';
  }
}

export interface Credentials {
  email: string;
  password: string;
}

export interface AuthAdapter {
  /** Stable id, surfaced in diagnostics. */
  readonly id: string;
  /** False when the adapter cannot actually authenticate, so the UI can say so
   *  honestly instead of failing on submit. */
  readonly isConfigured: boolean;
  /** Whether OAuth is wired. Gates the Google button. */
  readonly supportsGoogle: boolean;

  /** Resolves the current user from a persisted session, or null. */
  restore(): Promise<AuthUser | null>;
  signUp(credentials: Credentials): Promise<AuthUser>;
  logIn(credentials: Credentials): Promise<AuthUser>;
  logOut(): Promise<void>;
  requestPasswordReset(email: string): Promise<void>;
  signInWithGoogle?(): Promise<AuthUser>;
}
