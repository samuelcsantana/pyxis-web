import { useSyncExternalStore } from 'react';
import { type Theme, themeFromCookies } from './theme';

function subscribeToNothing(): () => void {
  return () => undefined;
}

function themeInCookie(): Theme | undefined {
  return themeFromCookies(document.cookie);
}

function noThemeOnTheServer(): undefined {
  return undefined;
}

export function useChosenTheme(): Theme | undefined {
  return useSyncExternalStore(subscribeToNothing, themeInCookie, noThemeOnTheServer);
}
