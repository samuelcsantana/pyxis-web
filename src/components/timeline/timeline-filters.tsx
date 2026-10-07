import Link from 'next/link';
import type { TimelineFilter } from '@/domain/timeline';
import { FOCUS_RING } from '@/components/ui/control-classes';

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
  errors: 'Errors only',
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
            className={`flex min-h-9 items-center rounded-pill border px-3.5 text-[13px] font-medium ${FOCUS_RING} ${selected ? 'border-ink bg-ink text-card' : 'border-line bg-card text-ink hover:bg-soft'}`}
          >
            {LABELS[link.filter]}
          </Link>
        );
      })}
    </nav>
  );
}
