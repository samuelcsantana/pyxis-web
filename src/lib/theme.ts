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
