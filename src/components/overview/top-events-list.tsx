import { barWidth, eventLabel, formatCount } from '@/domain/metrics';
import type { OverviewReport } from '@/domain/overview';
import type { I18n } from '@/i18n/i18n';
import { BAR_FILL, BAR_TRACK, PANEL, PANEL_TITLE } from '@/components/ui/panel-classes';
import { VisitsLink } from '@/components/ui/visits-link';

export interface TopEventsListProps {
  readonly events: OverviewReport['topEvents'];
  readonly visitsHref: (name: string) => string;
  readonly i18n: I18n;
}

export function TopEventsList({ events, visitsHref, i18n }: TopEventsListProps) {
  const mostCounted = Math.max(0, ...events.map((event) => event.count));
  return (
    <section aria-labelledby="top-events-heading" className={PANEL}>
      <h2 id="top-events-heading" className={PANEL_TITLE}>
        Top events
      </h2>
      {events.length === 0 ? (
        <p className="text-caption text-muted">
          No named events in this period. Events sent with{' '}
          <code className="font-mono">track()</code> show up here.
        </p>
      ) : (
        <ul className="flex flex-col">
          {events.map((event) => (
            <li key={event.name} className="flex flex-col gap-1.5 border-b border-line py-2.5">
              <span className="flex items-baseline justify-between gap-2 text-caption">
                <span className="flex min-w-0 flex-col">
                  <VisitsLink
                    href={visitsHref(event.name)}
                    label={eventLabel(event.name)}
                    className="w-fit"
                  />
                  <span className="font-mono text-xs text-muted wrap-anywhere">{event.name}</span>
                </span>
                <span className="shrink-0 text-right font-semibold tabular-nums">
                  {formatCount(event.count, i18n)}{' '}
                  <span className="font-normal text-muted">
                    in {i18n.t('counts.visit', { count: event.visits })}
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
