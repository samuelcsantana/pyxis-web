import Link from 'next/link';
import { barWidth, eventLabel, formatCount, formatQuantity } from '@/domain/metrics';
import type { OverviewReport } from '@/domain/overview';
import { BAR_FILL, BAR_TRACK, PANEL, PANEL_TITLE, ROW_LINK } from '@/components/ui/panel-classes';

export interface TopEventsListProps {
  readonly events: OverviewReport['topEvents'];
  readonly visitsHref: (name: string) => string;
}

export function TopEventsList({ events, visitsHref }: TopEventsListProps) {
  const mostCounted = Math.max(0, ...events.map((event) => event.count));
  return (
    <section aria-labelledby="top-events-heading" className={PANEL}>
      <h2 id="top-events-heading" className={PANEL_TITLE}>
        Top events
      </h2>
      {events.length === 0 ? (
        <p className="text-[13px] text-muted">
          No named events in this period. Events sent with{' '}
          <code className="font-mono">track()</code> show up here.
        </p>
      ) : (
        <ul className="flex flex-col">
          {events.map((event) => (
            <li key={event.name} className="flex flex-col gap-1.5 border-b border-line py-2.5">
              <span className="flex items-baseline justify-between gap-2 text-[13px]">
                <span className="flex min-w-0 flex-col">
                  <Link
                    href={visitsHref(event.name)}
                    aria-label={`See the visits that had ${eventLabel(event.name)}`}
                    className={`w-fit ${ROW_LINK}`}
                  >
                    {eventLabel(event.name)}
                  </Link>
                  <span className="font-mono text-xs text-muted wrap-anywhere">{event.name}</span>
                </span>
                <span className="shrink-0 text-right font-semibold tabular-nums">
                  {formatCount(event.count)}{' '}
                  <span className="font-normal text-muted">
                    in {formatQuantity(event.visits, 'visit', 'visits')}
                  </span>
                </span>
              </span>
              <span aria-hidden="true" className={BAR_TRACK}>
                <span
                  className={`${BAR_FILL} bg-violet`}
                  style={{ width: barWidth(event.count, mostCounted) }}
                />
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
