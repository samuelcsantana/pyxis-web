import { cookies, headers } from 'next/headers';
import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME, LOCALES, type Locale, parseLocale } from './locales';
import { negotiateLocale } from './negotiate';

export async function currentLocale(): Promise<Locale> {
  const chosen = parseLocale((await cookies()).get(LOCALE_COOKIE_NAME)?.value);
  if (chosen !== undefined) {
    return chosen;
  }
  return negotiateLocale((await headers()).get('accept-language'), LOCALES, DEFAULT_LOCALE);
}
