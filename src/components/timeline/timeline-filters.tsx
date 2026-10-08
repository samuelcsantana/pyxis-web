import Link from 'next/link';
import type { TimelineFilter } from '@/domain/timeline';
import type { I18n } from '@/i18n/i18n';
import { PENDING_HOST, PILL, PILL_IDLE, PILL_SELECTED } from '@/components/ui/control-classes';
import { PendingMark } from '@/components/ui/pending-mark';

export interface TimelineFilterLink {
  readonly filter: TimelineFilter;
  readonly href: string;
}

export interface TimelineFiltersProps {
  readonly links: readonly TimelineFilterLink[];
  readonly current: TimelineFilter;
  readonly i18n: I18n;
}

export function TimelineFilters({ links, current, i18n }: TimelineFiltersProps) {
  return (
    <nav aria-label={i18n.t('timeline.filters.label')} className="flex flex-wrap gap-2">
      {links.map((link) => {
        const selected = link.filter === current;
        return (
          <Link
            key={link.filter}
            href={link.href}
            aria-current={selected ? 'page' : undefined}
            className={`min-h-9 px-3.5 ${PENDING_HOST} ${PILL} ${selected ? PILL_SELECTED : PILL_IDLE}`}
          >
            {i18n.t(`timeline.filters.${link.filter}`)}
            <PendingMark />
          </Link>
        );
      })}
    </nav>
  );
}
