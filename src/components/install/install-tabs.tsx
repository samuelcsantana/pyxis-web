'use client';

import { type KeyboardEvent, type ReactNode, useRef, useState } from 'react';
import {
  SEGMENTED_GROUP,
  SEGMENTED_IDLE,
  SEGMENTED_OPTION,
  SEGMENTED_SELECTED,
} from '@/components/ui/control-classes';

export interface InstallTab {
  readonly id: string;
  readonly label: ReactNode;
  readonly panel: ReactNode;
}

export interface InstallTabsProps {
  readonly label: string;
  readonly tabs: readonly InstallTab[];
}

export function tabAfterKey(key: string, current: number, count: number): number | undefined {
  switch (key) {
    case 'ArrowRight':
      return (current + 1) % count;
    case 'ArrowLeft':
      return (current - 1 + count) % count;
    case 'Home':
      return 0;
    case 'End':
      return count - 1;
    default:
      return undefined;
  }
}

export function tabIdOf(id: string): string {
  return `${id}-tab`;
}

export function panelIdOf(id: string): string {
  return `${id}-panel`;
}

export function InstallTabs({ label, tabs }: InstallTabsProps) {
  const [selected, setSelected] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  const moveWith = (event: KeyboardEvent<HTMLButtonElement>) => {
    const next = tabAfterKey(event.key, selected, tabs.length);
    if (next === undefined) {
      return;
    }
    event.preventDefault();
    setSelected(next);
    buttons.current[next]?.focus();
  };

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div role="tablist" aria-label={label} className={`self-start ${SEGMENTED_GROUP}`}>
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(node) => {
              buttons.current[index] = node;
            }}
            type="button"
            role="tab"
            id={tabIdOf(tab.id)}
            aria-controls={panelIdOf(tab.id)}
            aria-selected={index === selected}
            tabIndex={index === selected ? 0 : -1}
            onClick={() => {
              setSelected(index);
            }}
            onKeyDown={moveWith}
            className={`min-h-9 gap-1.5 px-3 ${SEGMENTED_OPTION} ${index === selected ? SEGMENTED_SELECTED : SEGMENTED_IDLE}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={panelIdOf(tab.id)}
          aria-labelledby={tabIdOf(tab.id)}
          hidden={index !== selected}
          className="flex min-w-0 flex-col gap-3"
        >
          {tab.panel}
        </div>
      ))}
    </div>
  );
}
