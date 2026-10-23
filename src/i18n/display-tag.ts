import type { Locale } from './locales';

const DISPLAY_TAGS: Readonly<Record<Locale, string>> = {
  en: 'en-US',
  'pt-BR': 'pt-BR',
  es: 'es',
  de: 'de',
  fr: 'fr',
  it: 'it',
  nl: 'nl',
};

export function displayTag(locale: Locale): string {
  return DISPLAY_TAGS[locale];
}
