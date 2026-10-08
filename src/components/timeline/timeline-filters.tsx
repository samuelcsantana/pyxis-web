import Link from 'next/link';
import type { TimelineFilter } from '@/domain/timeline';
import { PENDING_HOST, PILL, PILL_IDLE, PILL_SELECTED } from '@/components/ui/control-classes';
import { PendingMark } from '@/components/ui/pending-mark';

export interface TimelineFilterLink {
  readonly filter: TimelineFilter;
  readonly href: string;
}

export interface TimelineFiltersProps {
  readonly links: readonly TimelineFilterLink[];
  readonly current: TimelineFilter;
}

const LABELS: Readonly<Record<TimelineFilter, string>> = {
  all: 'Everything',
  pages: 'Page views',
  events: 'Events',
  requests: 'Requests',
  errors: 'Failing only',
};

export function TimelineFilters({ links, current }: TimelineFiltersProps) {
  return (
    <nav aria-label="Show" className="flex flex-wrap gap-2">
      {links.map((link) => {
        const selected = link.filter === current;
        return (
          <Link
            key={link.filter}
            href={link.href}
            aria-current={selected ? 'page' : undefined}
            className={`min-h-9 px-3.5 ${PENDING_HOST} ${PILL} ${selected ? PILL_SELECTED : PILL_IDLE}`}
          >
            {LABELS[link.filter]}
            <PendingMark />
          </Link>
        );
      })}
    </nav>
  );
}
