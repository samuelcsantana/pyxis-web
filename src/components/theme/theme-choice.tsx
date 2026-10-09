'use client';

import { useSyncExternalStore } from 'react';
import {
  NAV_CONTROL,
  NAV_ITEM_CURRENT,
  NAV_ITEM_IDLE,
  SLIDING_INDICATOR,
} from '@/components/ui/control-classes';
import { SlidingIndicator } from '@/components/ui/sliding-indicator';
import { choiceMark, useSlidingIndicator } from '@/components/ui/use-sliding-indicator';
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

const CHOICE = `relative z-[1] flex h-8 items-center rounded-control px-2.5 text-caption ${NAV_CONTROL}`;
const CHOSEN = `${NAV_ITEM_CURRENT} group-data-sliding/theme:bg-transparent`;
const HIGHLIGHT = `rounded-control bg-nav-active ${SLIDING_INDICATOR}`;

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
  const { attach, frame, sliding } = useSlidingIndicator(chosen);
  return (
    <div
      ref={attach}
      role="group"
      aria-label={t('theme.label')}
      data-sliding={sliding}
      className="group/theme relative flex flex-col gap-1"
    >
      <SlidingIndicator frame={frame} shape="fill" className={HIGHLIGHT} />
      {THEME_CHOICES.map((choice) => (
        <button
          key={choice}
          type="button"
          {...choiceMark(choice)}
          aria-pressed={choice === chosen}
          onClick={() => {
            apply(choice);
          }}
          className={`${CHOICE} ${choice === chosen ? CHOSEN : NAV_ITEM_IDLE}`}
        >
          {t(CHOICE_LABELS[choice])}
        </button>
      ))}
    </div>
  );
}
