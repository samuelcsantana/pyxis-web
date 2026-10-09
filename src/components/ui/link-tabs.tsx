'use client';

import Link from 'next/link';
import { PENDING_HOST, TAB, TAB_BAR, TAB_IDLE, TAB_LIST, TAB_SELECTED } from './control-classes';
import { PendingMark } from './pending-mark';
import { SlidingIndicator } from './sliding-indicator';
import { useChoiceAhead } from './use-choice-ahead';
import { choiceMark, useSlidingIndicator } from './use-sliding-indicator';

export interface LinkTab<Key extends string> {
  readonly key: Key;
  readonly label: string;
  readonly href: string;
}

export interface LinkTabsProps<Key extends string> {
  readonly label: string;
  readonly tabs: readonly LinkTab<Key>[];
  readonly current: Key;
}

const TAB_CLASS = `min-h-11 px-4 ${PENDING_HOST} ${TAB}`;

export function LinkTabs<Key extends string>({ label, tabs, current }: LinkTabsProps<Key>) {
  const [shown, choose] = useChoiceAhead(current);
  const { attach, frame, sliding } = useSlidingIndicator(shown);
  return (
    <nav ref={attach} aria-label={label} data-sliding={sliding} className={TAB_LIST}>
      <SlidingIndicator frame={frame} shape="underline" className={TAB_BAR} />
      {tabs.map((tab) => {
        const selected = tab.key === shown;
        return (
          <Link
            key={tab.key}
            href={tab.href}
            {...choiceMark(tab.key)}
            aria-current={tab.key === current ? 'page' : undefined}
            onClick={() => {
              choose(tab.key);
            }}
            className={`${TAB_CLASS} ${selected ? TAB_SELECTED : TAB_IDLE}`}
          >
            {tab.label}
            <PendingMark />
          </Link>
        );
      })}
    </nav>
  );
}
