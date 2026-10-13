import { cookies, headers } from 'next/headers';
import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME, LOCALES, type Locale, parseLocale } from './locales';
import { negotiateLocale } from './negotiate';

export const PATH_LOCALE_HEADER = 'x-pyxis-path-locale';

export async function currentLocale(): Promise<Locale> {
  const requestHeaders = await headers();
  const fromPath = parseLocale(requestHeaders.get(PATH_LOCALE_HEADER) ?? undefined);
  if (fromPath !== undefined) {
    return fromPath;
  }
  const chosen = parseLocale((await cookies()).get(LOCALE_COOKIE_NAME)?.value);
  if (chosen !== undefined) {
    return chosen;
  }
  return negotiateLocale(requestHeaders.get('accept-language'), LOCALES, DEFAULT_LOCALE);
}
