export const LOCALES = ['en', 'pt-BR'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALE_COOKIE_NAME = 'pyxis_locale';

export function parseLocale(value: string | undefined): Locale | undefined {
  return LOCALES.find((locale) => locale === value);
}

const CODE_LENGTH = 2;

export function localeCode(locale: Locale): string {
  return locale.slice(0, CODE_LENGTH).toUpperCase();
}

export function localeName(locale: Locale): string {
  const name = String(new Intl.DisplayNames([locale], { type: 'language' }).of(locale));
  return `${name.charAt(0).toLocaleUpperCase(locale)}${name.slice(1)}`;
}
