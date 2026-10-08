'use server';

import { cookies } from 'next/headers';
import { LOCALE_COOKIE_NAME, parseLocale } from './locales';

const ONE_YEAR_IN_SECONDS = 31_536_000;
const LOCALE_FIELD = 'locale';

export async function chooseLocale(form: FormData): Promise<void> {
  const value = form.get(LOCALE_FIELD);
  const locale = parseLocale(typeof value === 'string' ? value : undefined);
  if (locale === undefined) {
    return;
  }
  (await cookies()).set(LOCALE_COOKIE_NAME, locale, {
    path: '/',
    maxAge: ONE_YEAR_IN_SECONDS,
    sameSite: 'lax',
    httpOnly: true,
  });
}
