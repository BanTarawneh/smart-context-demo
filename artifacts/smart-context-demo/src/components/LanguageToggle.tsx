import { useLocale } from '../i18n/LocaleProvider';

export function LanguageToggle({ dark = false }: { dark?: boolean }) {
  const { isArabic, setLocale, t } = useLocale();
  return (
    <button
      type="button"
      onClick={() => setLocale(isArabic ? 'en' : 'ar')}
      aria-label={t(isArabic ? 'Switch language to English' : 'Switch language to Arabic')}
      data-testid="button-language-toggle"
      className={`inline-flex shrink-0 items-center justify-center rounded-lg border px-3 py-2 text-xs font-black transition-colors ${
        dark
          ? 'border-white/15 bg-white/5 text-white/75 hover:border-sc-cyan/40 hover:text-sc-cyan'
          : 'border-sc-line bg-white text-sc-navy hover:border-sc-blue hover:text-sc-blue'
      }`}
    >
      {isArabic ? 'EN' : 'العربية'}
    </button>
  );
}