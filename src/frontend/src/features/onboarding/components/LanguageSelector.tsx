import { track } from '../../analytics';
import { useMenuDisclosure } from '../../../hooks/useMenuDisclosure';
import { LOCALES, useTranslation, type Locale } from '../../../i18n';

/**
 * Language drill-down.
 *
 * Replaces the two-button segmented toggle, which stopped working at three
 * locales and would not have survived the Bengali/Tamil/Telugu/Marathi list
 * the brief anticipates. A menu scales to any number.
 *
 * Implemented as a disclosure over a `listbox` rather than a native `<select>`
 * because the rows carry a flag and the language's own endonym at a size a
 * native select cannot style — but it keeps the native keyboard contract:
 * Enter/Space to open, arrows to move, Enter to choose, Escape to dismiss,
 * focus returned to the trigger. That contract now lives in
 * `useMenuDisclosure`, shared with the account menu.
 *
 * Every row is labelled in its OWN language ("Español", not "Spanish"), which
 * is the one rule of language pickers that actually matters: a user who cannot
 * read the current language must still recognise theirs.
 */
export function LanguageSelector() {
  const { locale, setLocale, t } = useTranslation();

  const codes = Object.keys(LOCALES) as Locale[];
  const current = LOCALES[locale];

  const choose = (next: Locale) => {
    if (next !== locale) {
      track({ name: 'language_changed', from: locale, to: next });
      setLocale(next);
    }
    menu.close();
  };

  const menu = useMenuDisclosure<HTMLDivElement>({
    itemCount: codes.length,
    // Open with the current language highlighted, not the first one.
    initialIndex: Math.max(0, codes.indexOf(locale)),
    onSelect: (i) => choose(codes[i]),
  });

  return (
    <div ref={menu.containerRef} className="relative" data-language-selector="">
      <button
        ref={menu.triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={menu.open}
        aria-label={t('language.label')}
        onClick={() => menu.setOpen((v) => !v)}
        onKeyDown={menu.onTriggerKeyDown}
        className="flex items-center gap-2 rounded-md border border-white/12 bg-carbon-2 px-2.5 py-2 font-body text-[12.5px] font-semibold text-chalk transition-colors hover:border-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-carbon sm:px-3"
      >
        <span aria-hidden="true" className="text-[15px] leading-none">
          {current.flag}
        </span>
        <span className="hidden sm:inline">{current.label}</span>
        <span className="sm:hidden">{current.short}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          aria-hidden="true"
          className={['transition-transform duration-150', menu.open ? 'rotate-180' : ''].join(' ')}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {menu.open && (
        <div
          ref={menu.listRef}
          role="listbox"
          aria-label={t('language.label')}
          aria-activedescendant={`lang-${codes[menu.activeIndex]}`}
          onKeyDown={menu.onListKeyDown}
          className="absolute right-0 z-30 mt-2 w-[212px] overflow-hidden rounded-lg border border-white/12 bg-carbon-2 shadow-[0_16px_40px_rgba(0,0,0,0.55)]"
        >
          <p className="border-b border-white/[0.08] px-3.5 py-2.5 font-body text-[10.5px] font-semibold uppercase tracking-[0.18em] text-chalk-mute">
            {t('language.label')}
          </p>

          {codes.map((code, i) => {
            const item = LOCALES[code];
            const selected = code === locale;
            return (
              <button
                key={code}
                id={`lang-${code}`}
                role="option"
                aria-selected={selected}
                data-menu-item=""
                // Its own language, so the row is legible to the speaker of it.
                lang={code}
                tabIndex={-1}
                onClick={() => choose(code)}
                onMouseEnter={() => menu.setActiveIndex(i)}
                className={[
                  'flex w-full items-center gap-3 px-3.5 py-3 text-left font-body text-[14px] transition-colors',
                  'focus-visible:outline-none',
                  i === menu.activeIndex ? 'bg-white/[0.07]' : '',
                  selected ? 'text-ember' : 'text-chalk',
                ].join(' ')}
              >
                <span aria-hidden="true" className="text-[17px] leading-none">
                  {item.flag}
                </span>
                <span className="flex-1 font-medium">{item.label}</span>
                {selected && (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
