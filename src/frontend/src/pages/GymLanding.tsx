import { Link } from 'react-router-dom';
import { BrandMark } from '../features/onboarding/components/OnboardingLayout';
import { LanguageSelector } from '../features/onboarding/components/LanguageSelector';
import { HeaderAuth } from '../features/auth/components/HeaderAuth';
import { PreviewEntry } from '../features/auth/components/PreviewEntry';
import { useTranslation } from '../i18n';

/**
 * TEMPORARY landing page (brief §4).
 *
 * Deliberately minimal: brand, one short introduction, an honest note that the
 * full experience is in development, and a single primary action into the
 * questionnaire. No marketing sections, testimonials, programme grids or AI
 * section — those come in a later phase. Styled to the athletic red/carbon
 * direction so it reads as one product with the questionnaire.
 */
export function GymLanding() {
  const { t } = useTranslation();
  return (
    <div className="grid-faint relative flex min-h-[100dvh] flex-col overflow-hidden bg-carbon">
      {/* single red light source */}
      <div
        aria-hidden="true"
        className="ember-glow pointer-events-none absolute left-1/2 top-[-380px] h-[860px] w-[980px] -translate-x-1/2"
      />

      <div className="relative flex items-center justify-end gap-2 px-5 pt-5 sm:gap-3 sm:px-8">
        <LanguageSelector />
        <HeaderAuth />
      </div>

      <main className="relative flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
        <div className="mb-14 flex items-center gap-3">
          <BrandMark size={34} />
          <span className="font-display text-[20px] font-extrabold uppercase tracking-[0.3em] text-chalk">
            {t('brand.name')}
          </span>
        </div>

        <div className="mx-auto max-w-[620px]">
          <p className="mb-6 font-body text-[11px] font-semibold uppercase tracking-[0.34em] text-ember">
            {t('landing.eyebrow')}
          </p>

          <h1 className="display-tight text-[42px] text-chalk sm:text-[60px]">
            {t('landing.headline.line1')}
            <br />
            {t('landing.headline.line2')}
            <br />
            <span className="text-ember">{t('landing.headline.line3')}</span>
          </h1>

          <p className="mx-auto mt-7 max-w-[440px] font-body text-[15px] font-light leading-relaxed text-chalk-dim sm:text-[16px]">
            {t('landing.body')}
          </p>
        </div>

        <Link
          to="/gym/onboarding"
          className="mt-11 inline-flex items-center gap-3 rounded-md bg-ember px-9 py-4 font-body text-[15px] font-semibold tracking-[0.01em] text-white transition-colors hover:bg-ember-lit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-carbon"
        >
          {t('landing.cta')}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <line x1="4" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>

        {/* the three reassurances from the reference funnel entry */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
          {([
            'landing.reassurance.noCard',
            'landing.reassurance.quick',
            'landing.reassurance.leave',
          ] as const).map((key) => (
            <span
              key={key}
              className="flex items-center gap-2 font-body text-[12.5px] font-light text-chalk-dim"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#E4262F" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {t(key)}
            </span>
          ))}
        </div>
        {/* Only rendered while no backend is wired. */}
        <div className="mt-10">
          <PreviewEntry variant="quiet" />
        </div>
      </main>

      <footer className="relative border-t border-white/[0.07] px-6 py-5 text-center">
        <p className="font-body text-[11.5px] font-light text-chalk-mute">
          {t('landing.footer')}
        </p>
      </footer>
    </div>
  );
}
