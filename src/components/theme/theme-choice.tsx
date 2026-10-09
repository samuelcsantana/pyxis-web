'use client';

import { useSyncExternalStore } from 'react';
import { NAV_CONTROL, NAV_ITEM_CURRENT, NAV_ITEM_IDLE } from '@/components/ui/control-classes';
import { useT } from '@/i18n/messages-provider';
import { parseTheme, type Theme, THEME_CHOICES, type ThemeChoice, themeCookie } from '@/lib/theme';

export interface ThemeChoiceProps {
  readonly initialTheme?: Theme;
}

const CHOICE_LABELS = {
  light: 'theme.light',
  dark: 'theme.dark',
  system: 'theme.system',
} as const satisfies Readonly<Record<ThemeChoice, string>>;

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

function apply(choice: ThemeChoice): void {
  const root = document.documentElement;
  if (choice === 'system') {
    delete root.dataset.theme;
  } else {
    root.dataset.theme = choice;
  }
  document.cookie = themeCookie(choice);
}

export function ThemeChoiceGroup({ initialTheme }: ThemeChoiceProps) {
  const t = useT();
  const chosen = useSyncExternalStore(
    subscribeToThemeChanges,
    choiceOnPage,
    () => initialTheme ?? 'system',
  );
  return (
    <div role="group" aria-label={t('theme.label')} className="flex flex-col gap-1">
      {THEME_CHOICES.map((choice) => (
        <button
          key={choice}
          type="button"
          aria-pressed={choice === chosen}
          onClick={() => {
            apply(choice);
          }}
          className={`flex h-8 items-center rounded-control px-2.5 text-caption ${NAV_CONTROL} ${choice === chosen ? NAV_ITEM_CURRENT : NAV_ITEM_IDLE}`}
        >
          {t(CHOICE_LABELS[choice])}
        </button>
      ))}
    </div>
  );
}
