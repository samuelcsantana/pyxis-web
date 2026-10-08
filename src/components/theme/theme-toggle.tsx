'use client';

import { useSyncExternalStore } from 'react';
import { oppositeTheme, parseTheme, type Theme, themeCookie } from '@/lib/theme';
import { BUTTON_ICON, NAV_CONTROL } from '@/components/ui/control-classes';

const SUN_ICON =
  'M12 8a4 4 0 1 1 0 8a4 4 0 1 1 0-8 M12 2v2 M12 20v2 M4.9 4.9l1.4 1.4 M17.7 17.7l1.4 1.4 M2 12h2 M20 12h2 M4.9 19.1l1.4-1.4 M17.7 6.3l1.4-1.4';
const MOON_ICON = 'M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z';

export type ThemeToggleSurface = 'page' | 'nav';

const SURFACE_CLASSES: Readonly<Record<ThemeToggleSurface, string>> = {
  page: BUTTON_ICON,
  nav: `flex items-center justify-center border border-nav-border text-nav-strong hover:bg-nav-hover active:bg-nav-active ${NAV_CONTROL}`,
};

export interface ThemeToggleProps {
  readonly initialTheme?: Theme;
  readonly surface?: ThemeToggleSurface;
}

function subscribeToThemeChanges(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributeFilter: ['data-theme'] });
  return () => {
    observer.disconnect();
  };
}

function chosenThemeOnPage(): Theme | undefined {
  return parseTheme(document.documentElement.dataset.theme);
}

function themeOnScreen(): Theme {
  return (
    chosenThemeOnPage() ??
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  );
}

export function ThemeToggle({ initialTheme, surface = 'page' }: ThemeToggleProps) {
  const theme = useSyncExternalStore(
    subscribeToThemeChanges,
    chosenThemeOnPage,
    () => initialTheme,
  );

  const toggle = () => {
    const next = oppositeTheme(themeOnScreen());
    document.documentElement.dataset.theme = next;
    document.cookie = themeCookie(next);
  };

  const label = theme === undefined ? 'Switch theme' : `Switch to ${oppositeTheme(theme)} theme`;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      className={`size-11 rounded-input ${SURFACE_CLASSES[surface]}`}
    >
      <svg width={18} height={18} viewBox="0 0 24 24" aria-hidden="true">
        <path
          d={theme === 'dark' ? SUN_ICON : MOON_ICON}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
