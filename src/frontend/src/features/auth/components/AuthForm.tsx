import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation, type TranslationKey } from '../../../i18n';
import { AuthError, useAuth } from '../AuthProvider';
import type { AuthErrorCode } from '../types';

const ERROR_KEY: Record<AuthErrorCode, TranslationKey> = {
  invalid_credentials: 'auth.error.invalidCredentials',
  email_taken: 'auth.error.emailTaken',
  weak_password: 'auth.error.passwordTooShort',
  invalid_email: 'auth.error.emailInvalid',
  network: 'auth.error.network',
  session_expired: 'auth.error.sessionExpired',
  not_configured: 'auth.error.notConfigured',
  unknown: 'auth.error.unknown',
};

const MIN_PASSWORD = 8;
/** Deliberately permissive. Strict email regexes reject valid addresses; the
 *  authoritative check is the confirmation email the backend will send. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Props {
  mode: 'signup' | 'login';
  onSuccess: () => void;
}

function Field({
  id,
  label,
  type,
  value,
  onChange,
  error,
  hint,
  autoComplete,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  hint?: string;
  autoComplete: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block font-body text-[12.5px] font-medium text-chalk-dim"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={[
          'w-full rounded-md border bg-carbon-3 px-4 py-3.5 font-body text-[15px] text-chalk outline-none transition-colors',
          'placeholder:text-chalk-mute',
          error ? 'border-ember' : 'border-white/12 focus:border-ember',
        ].join(' ')}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 font-body text-[12px] text-ember">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 font-body text-[12px] text-chalk-mute">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/**
 * One form for both sign-up and log-in.
 *
 * Validation runs client-side for immediate feedback, and the backend is
 * expected to validate again — a client check is a courtesy, never a control.
 *
 * When no auth backend is configured the form is still fully rendered but
 * disabled behind an honest notice, rather than accepting a submission and
 * failing, or worse, pretending to succeed.
 */
export function AuthForm({ mode, onSuccess }: Props) {
  const { t } = useTranslation();
  const { signUp, logIn, isConfigured, supportsGoogle } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const isSignup = mode === 'signup';

  const validate = () => {
    const next: Record<string, string> = {};
    if (!email.trim()) next.email = t('auth.error.emailRequired');
    else if (!EMAIL_RE.test(email.trim())) next.email = t('auth.error.emailInvalid');

    if (!password) next.password = t('auth.error.passwordRequired');
    else if (isSignup && password.length < MIN_PASSWORD)
      next.password = t('auth.error.passwordTooShort');

    if (isSignup && confirm !== password) next.confirm = t('auth.error.passwordMismatch');

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;

    setBusy(true);
    try {
      const credentials = { email: email.trim(), password };
      if (isSignup) await signUp(credentials);
      else await logIn(credentials);
      onSuccess();
    } catch (err) {
      // Never render a raw backend message.
      const code: AuthErrorCode = err instanceof AuthError ? err.code : 'unknown';
      setFormError(t(ERROR_KEY[code]));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      {!isConfigured && (
        <div
          role="status"
          className="rounded-md border border-ember/40 bg-ember/[0.08] p-4"
        >
          <p className="mb-1 font-body text-[10.5px] font-semibold uppercase tracking-[0.16em] text-ember">
            {t('auth.notConfigured.badge')}
          </p>
          <p className="font-body text-[13px] font-light leading-relaxed text-chalk">
            {t('auth.error.notConfigured')}
          </p>
        </div>
      )}

      <Field
        id="email"
        label={t('auth.email')}
        type="email"
        value={email}
        onChange={setEmail}
        error={errors.email}
        autoComplete="email"
      />
      <Field
        id="password"
        label={t('auth.password')}
        type="password"
        value={password}
        onChange={setPassword}
        error={errors.password}
        hint={isSignup ? t('auth.passwordHint') : undefined}
        autoComplete={isSignup ? 'new-password' : 'current-password'}
      />
      {isSignup && (
        <Field
          id="confirm"
          label={t('auth.confirmPassword')}
          type="password"
          value={confirm}
          onChange={setConfirm}
          error={errors.confirm}
          autoComplete="new-password"
        />
      )}

      {formError && (
        <p role="alert" className="rounded-md border border-ember/40 bg-ember/[0.08] p-3 font-body text-[13px] text-chalk">
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={busy || !isConfigured}
        className="mt-1 w-full rounded-md bg-ember py-4 font-body text-[15px] font-semibold text-white transition-colors hover:bg-ember-lit disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-carbon"
      >
        {busy ? t('common.loading') : isSignup ? t('auth.createAccount') : t('auth.logIn')}
      </button>

      {/* Rendered only when OAuth is actually wired. An inert Google button is
          worse than no Google button. */}
      {supportsGoogle && (
        <>
          <div className="flex items-center gap-3 py-1">
            <span className="h-px flex-1 bg-white/10" />
            <span className="font-body text-[11px] uppercase tracking-wider text-chalk-mute">
              {t('common.or')}
            </span>
            <span className="h-px flex-1 bg-white/10" />
          </div>
          <button
            type="button"
            className="w-full rounded-md border border-white/15 py-3.5 font-body text-[14.5px] font-medium text-chalk transition-colors hover:bg-white/5"
          >
            {t('auth.continueWithGoogle')}
          </button>
        </>
      )}

      {!isSignup && (
        <p className="text-center">
          <Link to="/login" className="font-body text-[13px] text-chalk-dim hover:text-chalk">
            {t('auth.forgotPassword')}
          </Link>
        </p>
      )}

      <p className="mt-2 text-center font-body text-[13px] text-chalk-dim">
        {isSignup ? t('auth.haveAccount') : t('auth.noAccount')}{' '}
        <Link
          to={isSignup ? '/login' : '/signup'}
          className="font-semibold text-ember hover:text-ember-lit"
        >
          {isSignup ? t('auth.logIn') : t('auth.createAccount')}
        </Link>
      </p>
    </form>
  );
}
