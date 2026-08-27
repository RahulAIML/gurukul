import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from '../i18n';
import { track } from '../features/analytics';
import { AuthForm } from '../features/auth/components/AuthForm';
import { BrandMark } from '../features/onboarding/components/OnboardingLayout';
import { LanguageSelector } from '../features/onboarding/components/LanguageSelector';

/**
 * Sign-up and log-in share a page shell: same layout, same shell chrome, only
 * the copy and the form mode differ. Two near-identical page components would
 * drift.
 */
export function AuthPage({ mode }: { mode: 'signup' | 'login' }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isSignup = mode === 'signup';

  useEffect(() => {
    if (isSignup) track({ name: 'signup_started' });
  }, [isSignup]);

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
        <h1 className="display-tight text-[27px] text-chalk sm:text-[32px]">
          {t(isSignup ? 'auth.signup.title' : 'auth.login.title')}
        </h1>
        <p className="mb-8 mt-3 font-body text-[14.5px] font-light text-chalk-dim">
          {t(isSignup ? 'auth.signup.subtitle' : 'auth.login.subtitle')}
        </p>

        <AuthForm
          mode={mode}
          onSuccess={() => {
            track({ name: isSignup ? 'signup_completed' : 'login_completed' });
            navigate('/gym/onboarding/analysis');
          }}
        />
      </main>
    </div>
  );
}
