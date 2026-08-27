import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { httpApiAdapter } from './adapters/httpApi';
import { notConfiguredAdapter } from './adapters/notConfigured';
import { syncPendingOnboarding, type SyncOutcome } from './onboardingSync';
import {
  AuthError,
  type AuthAdapter,
  type AuthUser,
  type Credentials,
  type SignUpInput,
} from './types';

/**
 * ADAPTER SELECTION — the one place that decides how auth works.
 *
 * With no `VITE_API_URL` the app uses the not-configured adapter, which
 * refuses cleanly and lets the UI say so. Set `VITE_API_URL` and the HTTP
 * adapter takes over with no other change. There is deliberately no
 * browser-local fallback that pretends to authenticate.
 */
function selectAdapter(): AuthAdapter {
  return httpApiAdapter.isConfigured ? httpApiAdapter : notConfiguredAdapter;
}

type Status = 'restoring' | 'anonymous' | 'authenticated';

interface AuthContextValue {
  status: Status;
  user: AuthUser | null;
  /** False when no backend is wired — the UI should explain rather than fail. */
  isConfigured: boolean;
  supportsGoogle: boolean;
  signUp: (input: SignUpInput) => Promise<void>;
  logIn: (c: Credentials) => Promise<void>;
  logOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  /**
   * What happened to the anonymously-collected onboarding answers on the last
   * sign-up or log-in. Screens use it to reassure ("your answers are saved")
   * or to be honest ("still on this device only") rather than staying silent.
   */
  onboardingSync: SyncOutcome | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const adapter = useMemo(selectAdapter, []);
  const [status, setStatus] = useState<Status>('restoring');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [onboardingSync, setOnboardingSync] = useState<SyncOutcome | null>(null);

  useEffect(() => {
    let cancelled = false;
    adapter
      .restore()
      .then((restored) => {
        if (cancelled) return;
        setUser(restored);
        setStatus(restored ? 'authenticated' : 'anonymous');
      })
      .catch(() => {
        if (!cancelled) setStatus('anonymous');
      });
    return () => {
      cancelled = true;
    };
  }, [adapter]);

  /**
   * Association runs AFTER the session exists and its failure is swallowed by
   * `syncPendingOnboarding`, so a sync problem can never fail an account that
   * was created successfully.
   */
  const adopt = useCallback(
    async (next: AuthUser) => {
      setUser(next);
      setStatus('authenticated');
      setOnboardingSync(await syncPendingOnboarding(adapter));
    },
    [adapter],
  );

  const signUp = useCallback(
    async (input: SignUpInput) => {
      await adopt(await adapter.signUp(input));
    },
    [adapter, adopt],
  );

  const logIn = useCallback(
    async (c: Credentials) => {
      await adopt(await adapter.logIn(c));
    },
    [adapter, adopt],
  );

  const logOut = useCallback(async () => {
    await adapter.logOut();
    setUser(null);
    setStatus('anonymous');
    setOnboardingSync(null);
    // The local onboarding answers are deliberately LEFT in place. Logging out
    // is not "discard my work" — a shared device is the one case where that
    // would matter, and it is the wrong trade against everyone who logs out
    // mid-funnel and comes back.
  }, [adapter]);

  const requestPasswordReset = useCallback(
    (email: string) => adapter.requestPasswordReset(email),
    [adapter],
  );

  const value = useMemo(
    () => ({
      status,
      user,
      isConfigured: adapter.isConfigured,
      supportsGoogle: adapter.supportsGoogle,
      signUp,
      logIn,
      logOut,
      requestPasswordReset,
      onboardingSync,
    }),
    [status, user, adapter, signUp, logIn, logOut, requestPasswordReset, onboardingSync],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

export { AuthError };
export type { AuthUser, Credentials, SignUpInput };
