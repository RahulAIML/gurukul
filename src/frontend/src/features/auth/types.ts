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
  /** Display name. Empty when the user did not give one — the UI falls back to
   *  the local part of the email rather than showing a blank menu. */
  name: string;
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

export interface SignUpInput extends Credentials {
  /** Optional: an account is valid without a name. */
  name?: string;
}

/**
 * One answer as the backend expects it. Mirrors the wire shape in
 * `docs/AUTH_BACKEND_CONTRACT.md` rather than the frontend `AnswerMap`, so the
 * onboarding types can change without breaking the transport.
 */
export interface OnboardingResponsePayload {
  questionId: string;
  section: string;
  type: 'single' | 'multiple' | 'measure';
  value: string[];
  /** The unit the stored value is expressed in, for measure questions — always
   *  the canonical one (cm, kg, years). Null for every other type. */
  canonicalUnit?: string | null;
}

/**
 * What the server made of a sync. It validates every answer itself and reports
 * what it would not accept instead of silently dropping it, and it returns the
 * profile it derived — including a BMI it recalculated rather than one we sent.
 */
export interface OnboardingSyncResult {
  /** The question ids that were stored. */
  accepted: string[];
  /** questionId → why it was refused. An object rather than a list because the
   *  reason is the useful part when an answer does not make it. */
  rejected: Record<string, string>;
  profile: unknown;
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
  signUp(input: SignUpInput): Promise<AuthUser>;
  logIn(credentials: Credentials): Promise<AuthUser>;
  logOut(): Promise<void>;
  requestPasswordReset(email: string): Promise<void>;
  signInWithGoogle?(): Promise<AuthUser>;

  /**
   * Attaches answers collected anonymously to the now-authenticated account.
   *
   * Separate from `signUp` on purpose: a user can also onboard, log in to an
   * existing account, and expect the same association. Callers must treat a
   * rejection as recoverable and keep the local copy.
   */
  syncOnboarding(
    responses: OnboardingResponsePayload[],
    locale: string,
  ): Promise<OnboardingSyncResult>;
}
