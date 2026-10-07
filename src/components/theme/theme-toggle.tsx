'use client';

import { useState } from 'react';
import { oppositeTheme, type Theme, themeCookie } from '@/lib/theme';
import { FOCUS_RING } from '@/components/ui/control-classes';

const SUN_ICON =
  'M12 8a4 4 0 1 1 0 8a4 4 0 1 1 0-8 M12 2v2 M12 20v2 M4.9 4.9l1.4 1.4 M17.7 17.7l1.4 1.4 M2 12h2 M20 12h2 M4.9 19.1l1.4-1.4 M17.7 6.3l1.4-1.4';
const MOON_ICON = 'M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z';

export interface ThemeToggleProps {
  readonly initialTheme?: Theme;
}

function themeOnScreen(): Theme {
  const chosen = document.documentElement.dataset.theme;
  if (chosen === 'light' || chosen === 'dark') {
    return chosen;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeToggle({ initialTheme }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme | undefined>(initialTheme);

  const toggle = () => {
    const next = oppositeTheme(theme ?? themeOnScreen());
    document.documentElement.dataset.theme = next;
    document.cookie = themeCookie(next);
    setTheme(next);
  };

  const label = theme === undefined ? 'Switch theme' : `Switch to ${oppositeTheme(theme)} theme`;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      className={`flex size-11 items-center justify-center rounded-input border border-line bg-card text-ink transition-colors hover:border-muted ${FOCUS_RING}`}
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
