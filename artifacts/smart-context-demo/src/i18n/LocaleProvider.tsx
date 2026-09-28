import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import arabic from './ar.json';
import english from './en.json';

export type Locale = 'en' | 'ar';
export const NUMBERING_SYSTEM = 'latn' as const;

const STORAGE_KEY = 'smart-context-locale';
const dictionaries: Record<Locale, Record<string, string>> = {
  en: english,
  ar: arabic,
};

type InterpolationValues = Record<string, string | number>;
type LocaleContextValue = {
  locale: Locale;
  isArabic: boolean;
  t: (key: string, values?: InterpolationValues) => string;
  setLocale: (locale: Locale) => void;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatDate: (value: Date | number, options?: Intl.DateTimeFormatOptions) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);
const missingKeys = new Set<string>();

function readInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'en';
  const queryLocale = new URLSearchParams(window.location.search).get('lang');
  if (queryLocale === 'ar' || queryLocale === 'en') return queryLocale;
  try {
    const storedLocale = window.localStorage.getItem(STORAGE_KEY);
    if (storedLocale === 'ar' || storedLocale === 'en') return storedLocale;
  } catch {
    // Language selection still works when browser storage is unavailable.
  }
  return 'en';
}

function interpolate(text: string, values?: InterpolationValues) {
  if (!values) return text;
  return text.replace(/\{\{(\w+)\}\}/g, (match, name: string) => (
    Object.prototype.hasOwnProperty.call(values, name) ? String(values[name]) : match
  ));
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readInitialLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    try {
      window.localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // The active locale remains available in memory if storage is blocked.
    }
  }, [locale]);

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
    try {
      const nextUrl = new URL(window.location.href);
      nextUrl.searchParams.set('lang', nextLocale);
      window.history.replaceState(window.history.state, '', nextUrl);
    } catch {
      // Updating the URL is best-effort; the current view still changes immediately.
    }
  }, []);

  const t = useCallback((key: string, values?: InterpolationValues) => {
    const dictionary = dictionaries[locale];
    const translated = dictionary[key];
    if (translated === undefined) {
      const warningKey = `${locale}:${key}`;
      if (locale === 'ar' && import.meta.env.DEV && !missingKeys.has(warningKey)) {
        missingKeys.add(warningKey);
        console.warn(`[i18n] Missing ${locale} translation: ${key}`);
      }
      return interpolate(dictionaries.en[key] ?? key, values);
    }
    return interpolate(translated, values);
  }, [locale]);

  const formatNumber = useCallback((value: number, options: Intl.NumberFormatOptions = {}) => (
    new Intl.NumberFormat(locale === 'ar' ? 'ar-JO' : 'en-US', {
      numberingSystem: NUMBERING_SYSTEM,
      ...options,
    }).format(value)
  ), [locale]);

  const formatDate = useCallback((value: Date | number, options: Intl.DateTimeFormatOptions = {}) => (
    new Intl.DateTimeFormat(locale === 'ar' ? 'ar-JO' : 'en-GB', {
      numberingSystem: NUMBERING_SYSTEM,
      timeZone: 'Asia/Amman',
      ...options,
    }).format(value)
  ), [locale]);

  const contextValue = useMemo(() => ({
    locale,
    isArabic: locale === 'ar',
    t,
    setLocale,
    formatNumber,
    formatDate,
  }), [locale, t, setLocale, formatNumber, formatDate]);

  return <LocaleContext.Provider value={contextValue}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const value = useContext(LocaleContext);
  if (!value) throw new Error('useLocale must be used inside LocaleProvider');
  return value;
}