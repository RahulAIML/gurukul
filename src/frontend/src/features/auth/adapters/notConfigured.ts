import { AuthError, type AuthAdapter } from '../types';

/**
 * The DEFAULT adapter, and the honest one.
 *
 * There is no authentication backend yet (`src/backend` is scaffolding). The
 * alternative to this adapter would be a browser-local "auth" that stores
 * emails and passwords in localStorage and hands out a fake session. That
 * would be insecure, would teach users their account exists when it does not,
 * and would have to be ripped out later.
 *
 * So this adapter refuses cleanly and the UI explains why. See
 * `docs/AUTH_BACKEND_CONTRACT.md` for exactly what has to be built to replace
 * it — swapping adapters is a one-line change in `AuthProvider`.
 */
export const notConfiguredAdapter: AuthAdapter = {
  id: 'not-configured',
  isConfigured: false,
  supportsGoogle: false,

  async restore() {
    return null;
  },
  async signUp() {
    throw new AuthError('not_configured');
  },
  async logIn() {
    throw new AuthError('not_configured');
  },
  async logOut() {
    // Nothing to clear — no session was ever issued.
  },
  async requestPasswordReset() {
    throw new AuthError('not_configured');
  },
  async syncOnboarding() {
    // Refuses rather than reporting success, so the caller keeps the local
    // answers instead of clearing them on a sync that never happened.
    throw new AuthError('not_configured');
  },
};
