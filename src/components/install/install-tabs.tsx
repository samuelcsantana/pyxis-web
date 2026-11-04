'use client';

import { type KeyboardEvent, type ReactNode, useRef, useState } from 'react';
import { CONTROL_TRANSITION, FOCUS_RING, SLIDING_INDICATOR } from '@/components/ui/control-classes';
import { SlidingIndicator } from '@/components/ui/sliding-indicator';
import { choiceMark, useSlidingIndicator } from '@/components/ui/use-sliding-indicator';

export interface InstallTab {
  readonly id: string;
  readonly label: ReactNode;
  readonly panel: ReactNode;
}

export interface InstallTabsProps {
  readonly label: string;
  readonly tabs: readonly InstallTab[];
}

const TAB_LIST =
  'group/install-tabs relative flex max-w-full flex-wrap self-start gap-1 rounded-input border border-line-strong bg-card p-1 shadow-sm';
const TAB = `relative z-[1] flex min-h-10 max-w-full flex-wrap items-center gap-x-2 gap-y-1 py-1.5 text-left rounded-control px-3.5 text-sm font-semibold ${FOCUS_RING} ${CONTROL_TRANSITION}`;
const TAB_SELECTED = 'bg-accent text-accent-ink group-data-sliding/install-tabs:bg-transparent';
const TAB_IDLE = 'text-ink hover:bg-soft active:bg-soft';
const TAB_THUMB = `rounded-control bg-accent shadow-sm ${SLIDING_INDICATOR}`;

const PANEL_ENTRANCE = 'motion-safe:animate-settle';

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
  const [chosen, setChosen] = useState(false);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const { attach, frame, sliding } = useSlidingIndicator(String(selected));

  const select = (next: number) => {
    setChosen(true);
    setSelected(next);
  };

  const moveWith = (event: KeyboardEvent<HTMLButtonElement>) => {
    const next = tabAfterKey(event.key, selected, tabs.length);
    if (next === undefined) {
      return;
    }
    event.preventDefault();
    select(next);
    buttons.current[next]?.focus();
  };

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div
        ref={attach}
        role="tablist"
        aria-label={label}
        data-sliding={sliding}
        className={TAB_LIST}
      >
        <SlidingIndicator frame={frame} shape="fill" className={TAB_THUMB} />
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(node) => {
              buttons.current[index] = node;
            }}
            type="button"
            role="tab"
            id={tabIdOf(tab.id)}
            {...choiceMark(String(index))}
            aria-controls={panelIdOf(tab.id)}
            aria-selected={index === selected}
            tabIndex={index === selected ? 0 : -1}
            onClick={() => {
              select(index);
            }}
            onKeyDown={moveWith}
            className={`${TAB} ${index === selected ? TAB_SELECTED : TAB_IDLE}`}
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
          className={`flex min-w-0 flex-col gap-3 ${chosen ? PANEL_ENTRANCE : ''}`}
        >
          {tab.panel}
        </div>
      ))}
    </div>
  );
}
