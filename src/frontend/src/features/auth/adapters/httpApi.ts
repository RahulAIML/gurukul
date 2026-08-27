import { AuthError, type AuthAdapter, type AuthErrorCode, type AuthUser } from '../types';

/**
 * The adapter for the real backend, written against
 * `docs/AUTH_BACKEND_CONTRACT.md`.
 *
 * NOT ACTIVE. It is selected only when `VITE_API_URL` is set, so the app runs
 * against the honest not-configured adapter until a backend actually exists.
 * It is checked in now so the contract is executable rather than prose.
 *
 * Session handling: the backend is expected to set an httpOnly, Secure,
 * SameSite=Lax refresh cookie and return a short-lived access token in the
 * body. This adapter keeps the access token IN MEMORY ONLY — never in
 * localStorage, which is readable by any XSS payload.
 */

const API = import.meta.env.VITE_API_URL as string | undefined;

let accessToken: string | null = null;

/** Maps the backend's error code to ours; never surfaces a raw message. */
function toAuthError(status: number, body: unknown): AuthError {
  const code = (body as { code?: string } | null)?.code;
  const known: Record<string, AuthErrorCode> = {
    INVALID_CREDENTIALS: 'invalid_credentials',
    EMAIL_TAKEN: 'email_taken',
    WEAK_PASSWORD: 'weak_password',
    INVALID_EMAIL: 'invalid_email',
    SESSION_EXPIRED: 'session_expired',
  };
  if (code && known[code]) return new AuthError(known[code]);
  if (status === 401) return new AuthError('invalid_credentials');
  if (status === 409) return new AuthError('email_taken');
  return new AuthError('unknown');
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API) throw new AuthError('not_configured');
  let res: Response;
  try {
    res = await fetch(`${API}${path}`, {
      ...init,
      // the refresh cookie rides here
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...init?.headers,
      },
    });
  } catch {
    throw new AuthError('network');
  }

  const body = await res.json().catch(() => null);
  if (!res.ok) throw toAuthError(res.status, body);
  return body as T;
}

interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}

export const httpApiAdapter: AuthAdapter = {
  id: 'http-api',
  isConfigured: Boolean(API),
  // Flip on once the backend exposes the OAuth callback. Faking it would be
  // worse than not offering it.
  supportsGoogle: false,

  async restore() {
    try {
      const { user, accessToken: token } = await call<AuthResponse>('/auth/refresh', {
        method: 'POST',
      });
      accessToken = token;
      return user;
    } catch {
      return null;
    }
  },

  async signUp(credentials) {
    const { user, accessToken: token } = await call<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    accessToken = token;
    return user;
  },

  async logIn(credentials) {
    const { user, accessToken: token } = await call<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    accessToken = token;
    return user;
  },

  async logOut() {
    try {
      await call('/auth/logout', { method: 'POST' });
    } finally {
      accessToken = null;
    }
  },

  async requestPasswordReset(email) {
    await call('/auth/password-reset', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
};
