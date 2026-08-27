import { LOCALES, useTranslation, type Locale } from '../../../i18n';

/**
 * Segmented language control for the onboarding header.
 *
 * A segmented control rather than a dropdown because there are two options
 * today and both fit; it stays a segmented control up to about four. Past
 * that this should become a menu, which is why it reads `LOCALES` rather than
 * hardcoding the two.
 */
export function LanguageToggle() {
  const { locale, setLocale, t } = useTranslation();
  const codes = Object.keys(LOCALES) as Locale[];

  return (
    <div
      role="radiogroup"
      aria-label={t('language.label')}
      data-language-switch=""
      className="flex items-center gap-0.5 rounded-md border border-white/10 bg-carbon-2 p-0.5"
    >
      {codes.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            role="radio"
            aria-checked={active}
            lang={code}
            onClick={() => setLocale(code)}
            className={[
              'min-w-[38px] rounded px-2.5 py-1.5 font-body text-[12px] font-semibold transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-carbon',
              active ? 'bg-ember text-white' : 'text-chalk-dim hover:bg-white/5 hover:text-chalk',
            ].join(' ')}
          >
            {LOCALES[code].short}
          </button>
        );
      })}
    </div>
  );
}
