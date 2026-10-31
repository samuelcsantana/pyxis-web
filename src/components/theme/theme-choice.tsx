'use client';

import { useSyncExternalStore } from 'react';
import {
  SEGMENTED_GROUP,
  SEGMENTED_IDLE,
  SEGMENTED_OPTION,
  SEGMENTED_SELECTED,
  SEGMENTED_THUMB,
} from '@/components/ui/control-classes';
import { SlidingIndicator } from '@/components/ui/sliding-indicator';
import { choiceMark, useSlidingIndicator } from '@/components/ui/use-sliding-indicator';
import { useT } from '@/i18n/messages-provider';
import { parseTheme, type Theme, THEME_CHOICES, type ThemeChoice, themeCookie } from '@/lib/theme';

export interface ThemeChoiceProps {
  readonly initialTheme?: Theme;
  readonly labelledBy: string;
}

const CHOICE_LABELS = {
  light: 'theme.light',
  dark: 'theme.dark',
  system: 'theme.system',
} as const satisfies Readonly<Record<ThemeChoice, string>>;

const CHOICE = `min-h-11 px-3.5 lg:min-h-9 ${SEGMENTED_OPTION}`;

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

export function ThemeChoiceGroup({ initialTheme, labelledBy }: ThemeChoiceProps) {
  const t = useT();
  const chosen = useSyncExternalStore(
    subscribeToThemeChanges,
    choiceOnPage,
    () => initialTheme ?? 'system',
  );
  const { attach, frame, sliding } = useSlidingIndicator(chosen);
  return (
    <div
      ref={attach}
      role="group"
      aria-labelledby={labelledBy}
      data-sliding={sliding}
      className={`self-start ${SEGMENTED_GROUP}`}
    >
      <SlidingIndicator frame={frame} shape="fill" className={SEGMENTED_THUMB} />
      {THEME_CHOICES.map((choice) => (
        <button
          key={choice}
          type="button"
          {...choiceMark(choice)}
          aria-pressed={choice === chosen}
          onClick={() => {
            apply(choice);
          }}
          className={`${CHOICE} ${choice === chosen ? SEGMENTED_SELECTED : SEGMENTED_IDLE}`}
        >
          {t(CHOICE_LABELS[choice])}
        </button>
      ))}
    </div>
  );
}
