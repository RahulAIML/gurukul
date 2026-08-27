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
import { AuthError, type AuthAdapter, type AuthUser, type Credentials } from './types';

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
  signUp: (c: Credentials) => Promise<void>;
  logIn: (c: Credentials) => Promise<void>;
  logOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const adapter = useMemo(selectAdapter, []);
  const [status, setStatus] = useState<Status>('restoring');
  const [user, setUser] = useState<AuthUser | null>(null);

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

  const signUp = useCallback(
    async (c: Credentials) => {
      const next = await adapter.signUp(c);
      setUser(next);
      setStatus('authenticated');
    },
    [adapter],
  );

  const logIn = useCallback(
    async (c: Credentials) => {
      const next = await adapter.logIn(c);
      setUser(next);
      setStatus('authenticated');
    },
    [adapter],
  );

  const logOut = useCallback(async () => {
    await adapter.logOut();
    setUser(null);
    setStatus('anonymous');
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
    }),
    [status, user, adapter, signUp, logIn, logOut, requestPasswordReset],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

export { AuthError };
export type { AuthUser, Credentials };
