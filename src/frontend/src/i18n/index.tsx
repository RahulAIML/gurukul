import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { en, type TranslationKey } from './locales/en';
import { hi } from './locales/hi';

/**
 * Minimal i18n, deliberately hand-rolled.
 *
 * A library (i18next and friends) buys plural rules, ICU message syntax, lazy
 * namespace loading and a formatting pipeline. This product currently needs
 * lookup plus `{placeholder}` substitution across ~200 keys and two locales,
 * so a library would be ~40 KB of runtime to solve a problem we do not have
 * yet. The public surface here — `useTranslation()` returning `t`, `locale`,
 * `setLocale` — is the same shape those libraries expose, so swapping one in
 * later is a change to this file rather than to every component.
 *
 * Add a locale: write `locales/<code>.ts` typed as
 * `Record<TranslationKey, string>`, then add it to `LOCALES` below.
 */

export const LOCALES = {
  en: { label: 'English', short: 'EN', dict: en, dir: 'ltr' as const },
  hi: { label: 'हिन्दी', short: 'हिं', dict: hi, dir: 'ltr' as const },
} satisfies Record<string, { label: string; short: string; dict: Record<TranslationKey, string>; dir: 'ltr' | 'rtl' }>;

export type Locale = keyof typeof LOCALES;

export const DEFAULT_LOCALE: Locale = 'en';

const STORAGE_KEY = 'gurukul.locale';

export type Translate = (key: TranslationKey, vars?: Record<string, string | number>) => string;

interface I18nContextValue {
  locale: Locale;
  setLocale: (next: Locale) => void;
  t: Translate;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && value in LOCALES;
}

/** Prefers a stored choice, then the browser language, then English. */
function detectLocale(): Locale {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLocale(stored)) return stored;
  } catch {
    // storage unavailable — fall through to language detection
  }
  const nav = typeof navigator === 'undefined' ? '' : navigator.language.toLowerCase();
  const base = nav.split('-')[0];
  return isLocale(base) ? base : DEFAULT_LOCALE;
}

/** Replaces `{name}` placeholders. Unknown placeholders are left intact so a
 *  missing variable is visible in review rather than silently blank. */
function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (whole, name: string) =>
    name in vars ? String(vars[name]) : whole,
  );
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale);

  // Keep the document language in sync so screen readers switch voice and
  // the browser applies the right hyphenation and font fallbacks.
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = LOCALES[locale].dir;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // storage unavailable — the choice still applies for this visit
    }
  }, []);

  const t = useCallback<Translate>(
    (key, vars) => {
      const dict = LOCALES[locale].dict;
      // Fall back to English rather than rendering a raw key if a locale is
      // ever incomplete at runtime (it cannot be at compile time).
      const template = dict[key] ?? en[key];
      if (template === undefined) {
        if (import.meta.env.DEV) console.warn(`[i18n] missing key: ${key}`);
        return key;
      }
      return interpolate(template, vars);
    },
    [locale],
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useTranslation must be used inside <I18nProvider>');
  return ctx;
}

export type { TranslationKey };
