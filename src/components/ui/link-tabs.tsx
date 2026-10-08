import Link from 'next/link';
import { PENDING_HOST, TAB, TAB_IDLE, TAB_SELECTED } from './control-classes';
import { PendingMark } from './pending-mark';

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
  return (
    <nav aria-label={label} className="flex gap-1 border-b border-line">
      {tabs.map((tab) => {
        const selected = tab.key === current;
        return (
          <Link
            key={tab.key}
            href={tab.href}
            aria-current={selected ? 'page' : undefined}
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
