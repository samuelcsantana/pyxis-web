import { barWidth, eventLabel, formatCount } from '@/domain/metrics';
import type { OverviewReport } from '@/domain/overview';
import { BAR_FILL, BAR_TRACK, PANEL, PANEL_TITLE } from '@/components/ui/panel-classes';

export interface TopEventsListProps {
  readonly events: OverviewReport['topEvents'];
}

export function TopEventsList({ events }: TopEventsListProps) {
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
                  <span>{eventLabel(event.name)}</span>
                  <span className="font-mono text-xs text-muted wrap-anywhere">{event.name}</span>
                </span>
                <span className="font-semibold tabular-nums">{formatCount(event.count)}</span>
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
