import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation, type TranslationKey } from '../i18n';
import { track } from '../features/analytics';
import { AuthForm, type AuthMode } from '../features/auth/components/AuthForm';
import { BrandMark } from '../features/onboarding/components/OnboardingLayout';
import { LanguageSelector } from '../features/onboarding/components/LanguageSelector';

/**
 * Sign-up, log-in and password reset share a page shell: same layout, same
 * chrome, only the copy and the form mode differ. Three near-identical page
 * components would drift.
 *
 * Note there is no HeaderAuth here — offering "Log In / Sign Up" in the header
 * of the log-in page is noise, and the form already links to its counterpart.
 */

const TITLE: Record<AuthMode, TranslationKey> = {
  signup: 'auth.signup.title',
  login: 'auth.login.title',
  reset: 'auth.reset.title',
};

const SUBTITLE: Record<AuthMode, TranslationKey> = {
  signup: 'auth.signup.subtitle',
  login: 'auth.login.subtitle',
  reset: 'auth.reset.subtitle',
};

export function AuthPage({ mode }: { mode: AuthMode }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (mode === 'signup') track({ name: 'signup_started' });
  }, [mode]);

  /**
   * Return the user to where they came from. HeaderAuth passes the originating
   * path in router state, so someone who signs up from question 9 of the
   * questionnaire lands back on question 9 rather than being dumped on the
   * analysis screen.
   */
  const from = (location.state as { from?: string } | null)?.from;

  return (
    <div className="grid-faint flex min-h-[100dvh] flex-col bg-carbon">
      <header className="border-b border-white/[0.07] bg-carbon/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-focus items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <BrandMark size={24} />
            <span className="font-display text-[15px] font-extrabold uppercase tracking-[0.22em] text-chalk">
              {t('brand.name')}
            </span>
          </Link>
          <LanguageSelector />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-center px-5 py-12 sm:px-8">
        <h1 className="display-tight text-[27px] text-chalk sm:text-[32px]">{t(TITLE[mode])}</h1>
        <p className="mb-8 mt-3 font-body text-[14.5px] font-light text-chalk-dim">
          {t(SUBTITLE[mode])}
        </p>

        <AuthForm
          mode={mode}
          onSuccess={() => {
            track({ name: mode === 'signup' ? 'signup_completed' : 'login_completed' });
            navigate(from ?? '/gym/onboarding/analysis');
          }}
        />
      </main>
    </div>
  );
}
