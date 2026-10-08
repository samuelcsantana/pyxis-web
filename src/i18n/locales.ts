export const LOCALES = ['en', 'pt-BR'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALE_COOKIE_NAME = 'pyxis_locale';

export function parseLocale(value: string | undefined): Locale | undefined {
  return LOCALES.find((locale) => locale === value);
}
