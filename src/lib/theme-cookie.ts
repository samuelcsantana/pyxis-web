import { cookies } from 'next/headers';
import { parseTheme, type Theme, THEME_COOKIE_NAME } from './theme';

export async function chosenTheme(): Promise<Theme | undefined> {
  return parseTheme((await cookies()).get(THEME_COOKIE_NAME)?.value);
}
