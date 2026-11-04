'use client';

import { useSyncExternalStore } from 'react';
import { parseTheme, type Theme, type ThemeChoice, themeCookie } from '@/lib/theme';

function subscribeToThemeChanges(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributeFilter: ['data-theme'] });
  return () => {
    observer.disconnect();
  };
}

function choiceOnPage(): ThemeChoice {
  return parseTheme(document.documentElement.dataset.theme) ?? 'system';
}

export function applyTheme(choice: ThemeChoice): void {
  const root = document.documentElement;
  if (choice === 'system') {
    delete root.dataset.theme;
  } else {
    root.dataset.theme = choice;
  }
  document.cookie = themeCookie(choice);
}

export function useThemeOnPage(initialTheme?: Theme): ThemeChoice {
  return useSyncExternalStore(
    subscribeToThemeChanges,
    choiceOnPage,
    () => initialTheme ?? 'system',
  );
}
