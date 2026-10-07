export const THEME_COOKIE_NAME = 'pyxis_theme';
export const THEMES = ['light', 'dark'] as const;
export type Theme = (typeof THEMES)[number];

const ONE_YEAR_IN_SECONDS = 31_536_000;

export function parseTheme(value: string | undefined): Theme | undefined {
  return THEMES.find((theme) => theme === value);
}

export function oppositeTheme(theme: Theme): Theme {
  return theme === 'dark' ? 'light' : 'dark';
}

export function themeCookie(theme: Theme): string {
  return `${THEME_COOKIE_NAME}=${theme}; Path=/; Max-Age=${String(ONE_YEAR_IN_SECONDS)}; SameSite=Lax`;
}

export function themeFromCookies(cookies: string): Theme | undefined {
  const prefix = `${THEME_COOKIE_NAME}=`;
  const entry = cookies
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));
  return parseTheme(entry?.slice(prefix.length));
}

export const THEME_BACKGROUNDS: Readonly<Record<Theme, string>> = {
  light: '#f4f6fa',
  dark: '#0a1220',
};

export interface ThemeColorForMedia {
  readonly media: string;
  readonly color: string;
}

export function themeColorFor(theme: Theme | undefined): string | ThemeColorForMedia[] {
  if (theme !== undefined) {
    return THEME_BACKGROUNDS[theme];
  }
  return THEMES.map((each) => ({
    media: `(prefers-color-scheme: ${each})`,
    color: THEME_BACKGROUNDS[each],
  }));
}
