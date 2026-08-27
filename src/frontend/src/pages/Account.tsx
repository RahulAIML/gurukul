import { Link, Navigate, useParams } from 'react-router-dom';
import { useTranslation, type TranslationKey } from '../i18n';
import { useAuth } from '../features/auth/AuthProvider';
import { displayName } from '../features/auth/components/UserMenu';
import { buildOnboardingPayload } from '../features/auth/onboardingSync';
import { HeaderAuth } from '../features/auth/components/HeaderAuth';
import { BrandMark } from '../features/onboarding/components/OnboardingLayout';
import { LanguageSelector } from '../features/onboarding/components/LanguageSelector';

/**
 * The three destinations behind the account menu.
 *
 * Profile shows what actually exists: the account, and how many onboarding
 * answers are attached to it. Plan and Settings say plainly that they are
 * still being built rather than rendering an empty shell that implies a
 * feature — the same honesty the landing page uses about the wider product.
 * Filling them in is a later phase, not this one.
 */

const SECTIONS = ['profile', 'plan', 'settings'] as const;
type Section = (typeof SECTIONS)[number];

const TITLE: Record<Section, TranslationKey> = {
  profile: 'account.profile',
  plan: 'account.plan',
  settings: 'account.settings',
};

function isSection(value: string | undefined): value is Section {
  return SECTIONS.includes(value as Section);
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/[0.07] py-3.5 last:border-0">
      <span className="font-body text-[12.5px] font-medium uppercase tracking-[0.1em] text-chalk-mute">
        {label}
      </span>
      <span className="font-body text-[14.5px] text-chalk">{value}</span>
    </div>
  );
}

export function Account() {
  const { t, locale } = useTranslation();
  const { section } = useParams<{ section: string }>();
  const { status, user } = useAuth();

  // Wait for the session to resolve before deciding. Redirecting during
  // `restoring` would bounce a signed-in user to the log-in page on reload.
  if (status === 'restoring') {
    return (
      <div className="grid min-h-[100dvh] place-items-center bg-carbon">
        <p className="font-body text-[13.5px] text-chalk-mute">{t('common.loading')}</p>
      </div>
    );
  }

  if (status !== 'authenticated' || !user) {
    return <Navigate to="/login" replace state={{ from: `/account/${section ?? 'profile'}` }} />;
  }

  if (!isSection(section)) return <Navigate to="/account/profile" replace />;

  const answerCount = buildOnboardingPayload().length;

  return (
    <div className="grid-faint flex min-h-[100dvh] flex-col bg-carbon">
      <header className="border-b border-white/[0.07] bg-carbon/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-focus items-center justify-between gap-3 px-5 py-4 sm:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <BrandMark size={24} />
            <span className="font-display text-[15px] font-extrabold uppercase tracking-[0.22em] text-chalk">
              {t('brand.name')}
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSelector />
            <HeaderAuth />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-focus flex-1 px-5 py-8 sm:px-8 sm:py-11">
        <h1 className="display-tight text-[27px] text-chalk sm:text-[32px]">{t(TITLE[section])}</h1>

        <nav aria-label={t('account.menuLabel')} className="mt-6 flex flex-wrap gap-2">
          {SECTIONS.map((s) => (
            <Link
              key={s}
              to={`/account/${s}`}
              aria-current={s === section ? 'page' : undefined}
              className={[
                'rounded-md border px-3.5 py-2 font-body text-[12.5px] font-semibold transition-colors',
                s === section
                  ? 'border-ember/50 bg-ember/[0.12] text-ember'
                  : 'border-white/12 bg-carbon-2 text-chalk-dim hover:text-chalk',
              ].join(' ')}
            >
              {t(TITLE[s])}
            </Link>
          ))}
        </nav>

        <div className="mt-8 rounded-lg border border-white/[0.09] bg-carbon-2 p-5 sm:p-6">
          {section === 'profile' ? (
            <>
              <Row label={t('auth.name')} value={displayName(user)} />
              <Row label={t('auth.email')} value={user.email} />
              <Row
                label={t('account.memberSince')}
                value={new Date(user.createdAt).toLocaleDateString(locale)}
              />
              <Row
                label={t('account.answersSaved')}
                value={String(answerCount)}
              />
              {answerCount > 0 && (
                <Link
                  to="/gym/onboarding/analysis"
                  className="mt-5 inline-block font-body text-[13px] font-semibold text-ember hover:text-ember-lit"
                >
                  {t('account.viewResults')}
                </Link>
              )}
            </>
          ) : (
            <>
              <p className="mb-1.5 font-body text-[10.5px] font-semibold uppercase tracking-[0.16em] text-ember">
                {t('account.inDevelopment.badge')}
              </p>
              <p className="font-body text-[14px] font-light leading-relaxed text-chalk-dim">
                {t(
                  section === 'plan'
                    ? 'account.plan.inDevelopment'
                    : 'account.settings.inDevelopment',
                )}
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
