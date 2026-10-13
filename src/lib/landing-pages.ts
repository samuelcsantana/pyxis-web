import type { Locale } from '@/i18n/locales';
import { LANDING_ORIGIN } from './site';

export interface LandingPage {
  readonly locale: Locale;
  readonly path: string;
  readonly slug: string;
}

const ENGLISH: LandingPage = { locale: 'en', path: '/', slug: 'en' };
const BRAZILIAN_PORTUGUESE: LandingPage = { locale: 'pt-BR', path: '/pt-br', slug: 'pt-br' };

export const DEFAULT_LANDING_PAGE = ENGLISH;
export const LANDING_PAGES: readonly LandingPage[] = [ENGLISH, BRAZILIAN_PORTUGUESE];

const LANDING_PAGE_OF_LOCALE: Readonly<Record<Locale, LandingPage>> = {
  en: ENGLISH,
  'pt-BR': BRAZILIAN_PORTUGUESE,
  es: ENGLISH,
};

const INTERNAL_PREFIX = '/landing';

export function landingPageAt(path: string): LandingPage | undefined {
  return LANDING_PAGES.find((page) => page.path === path);
}

export function landingPageOfSlug(slug: string): LandingPage | undefined {
  return LANDING_PAGES.find((page) => page.slug === slug);
}

export function landingPageOfLocale(locale: Locale): LandingPage {
  return LANDING_PAGE_OF_LOCALE[locale];
}

export function internalPathOf(page: LandingPage): string {
  return `${INTERNAL_PREFIX}/${page.slug}`;
}

export function isInternalLandingPath(path: string): boolean {
  return path === INTERNAL_PREFIX || path.startsWith(`${INTERNAL_PREFIX}/`);
}

export function landingPageOfInternalPath(path: string): LandingPage {
  const slug = path
    .slice(INTERNAL_PREFIX.length + 1)
    .split('/', 1)
    .join('');
  return landingPageOfSlug(slug) ?? DEFAULT_LANDING_PAGE;
}

export function landingUrlOf(page: LandingPage): string {
  return new URL(page.path, LANDING_ORIGIN).toString();
}

const X_DEFAULT = 'x-default';

export function languageAlternatesOf(
  addressOf: (page: LandingPage) => string,
): Record<string, string> {
  return {
    ...Object.fromEntries(LANDING_PAGES.map((page) => [page.locale, addressOf(page)])),
    [X_DEFAULT]: addressOf(DEFAULT_LANDING_PAGE),
  };
}
