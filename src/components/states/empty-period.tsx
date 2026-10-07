import Link from 'next/link';
import type { EmptyPeriodView } from '@/domain/empty-period';
import { TEXT_LINK } from '@/components/ui/control-classes';
import { EmptyState } from './empty-state';
import { NoActivityYet } from './no-activity-yet';

export interface EmptyPeriodProps {
  readonly view: EmptyPeriodView;
  readonly widerPeriodHref: string;
  readonly endpoint: string | undefined;
}

export function EmptyPeriod({ view, widerPeriodHref, endpoint }: EmptyPeriodProps) {
  if (view.kind === 'first-run') {
    return <NoActivityYet endpoint={endpoint} />;
  }
  return (
    <EmptyState title="Nothing in this period">
      <p>
        No event arrived in this period.
        {view.latestEvent === null ? null : ` The latest one arrived on ${view.latestEvent}.`}
      </p>
      {view.offersWiderPeriod ? (
        <p>
          <Link href={widerPeriodHref} className={TEXT_LINK}>
            See the last 30 days
          </Link>
        </p>
      ) : null}
    </EmptyState>
  );
}
