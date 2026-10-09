import { useSyncExternalStore } from 'react';
import { subscribeToNothing } from './static-store';
import { type Theme, themeFromCookies } from './theme';

function themeInCookie(): Theme | undefined {
  return themeFromCookies(document.cookie);
}

function noThemeOnTheServer(): undefined {
  return undefined;
}

export function useChosenTheme(): Theme | undefined {
  return useSyncExternalStore(subscribeToNothing, themeInCookie, noThemeOnTheServer);
}
