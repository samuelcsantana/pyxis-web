import { type Locale, parseLocale } from '@/i18n/locales';
import { LANDING_HOST } from './site';
import { parseTheme, type Theme } from './theme';

export const LANGUAGE_PARAMETER = 'lang';
export const THEME_PARAMETER = 'theme';

const OTHER_PYXIS_HOSTS: readonly string[] = [
  LANDING_HOST,
  `app.${LANDING_HOST}`,
  `demo.${LANDING_HOST}`,
];

export interface LinkPreferences {
  readonly locale: Locale | undefined;
  readonly theme: Theme | undefined;
}

export function preferencesIn(parameters: URLSearchParams): LinkPreferences {
  return {
    locale: parseLocale(parameters.get(LANGUAGE_PARAMETER) ?? undefined),
    theme: parseTheme(parameters.get(THEME_PARAMETER) ?? undefined),
  };
}

export function carriesPreferences(parameters: URLSearchParams): boolean {
  return parameters.has(LANGUAGE_PARAMETER) || parameters.has(THEME_PARAMETER);
}

export function withoutPreferences(url: URL): URL {
  const clean = new URL(url);
  clean.searchParams.delete(LANGUAGE_PARAMETER);
  clean.searchParams.delete(THEME_PARAMETER);
  return clean;
}

export interface CarriedPreferences {
  readonly locale: Locale;
  readonly theme: Theme | undefined;
  readonly currentHost: string;
}

export function carriedHref(href: string, carried: CarriedPreferences): string | undefined {
  const url = new URL(href);
  if (!OTHER_PYXIS_HOSTS.includes(url.hostname) || url.hostname === carried.currentHost) {
    return undefined;
  }
  if (url.hostname !== LANDING_HOST) {
    url.searchParams.set(LANGUAGE_PARAMETER, carried.locale);
  }
  if (carried.theme === undefined) {
    url.searchParams.delete(THEME_PARAMETER);
  } else {
    url.searchParams.set(THEME_PARAMETER, carried.theme);
  }
  return url.toString();
}
