import { barWidth, eventLabel, formatCount } from '@/domain/metrics';
import type { OverviewReport } from '@/domain/overview';
import type { I18n } from '@/i18n/i18n';
import { rich } from '@/i18n/rich';
import { FRESH_HIGHLIGHT, FreshCount } from '@/components/ui/fresh-slots';
import { BAR_FILL, BAR_TRACK, PANEL, PANEL_TITLE } from '@/components/ui/panel-classes';
import { VisitsLink } from '@/components/ui/visits-link';
import type { RowFilter } from '@/components/ui/row-filter-link';

export interface TopEventsListProps {
  readonly events: OverviewReport['topEvents'];
  readonly visitsHref: (name: string) => string;
  readonly filterOf?: (name: string) => RowFilter | null;
  readonly i18n: I18n;
}

const NO_ROW_FILTER = () => null;

export function TopEventsList({
  events,
  visitsHref,
  filterOf = NO_ROW_FILTER,
  i18n,
}: TopEventsListProps) {
  const mostCounted = Math.max(0, ...events.map((event) => event.count));
  return (
    <section aria-labelledby="top-events-heading" className={PANEL}>
      <h2 id="top-events-heading" className={PANEL_TITLE}>
        {i18n.t('overview.topEvents.title')}
      </h2>
      {events.length === 0 ? (
        <p className="text-caption text-muted">
          {rich(i18n.t('overview.topEvents.empty'), {
            code: (text) => <code className="font-mono">{text}</code>,
          })}
        </p>
      ) : (
        <ul className="flex flex-col">
          {events.map((event) => (
            <li
              key={event.name}
              className={`flex flex-col gap-1.5 border-b border-line py-2.5 ${FRESH_HIGHLIGHT}`}
            >
              <span className="flex items-baseline justify-between gap-2 text-caption">
                <span className="flex min-w-0 flex-col">
                  <VisitsLink
                    href={visitsHref(event.name)}
                    label={eventLabel(event.name)}
                    purpose={i18n.t('visitsLink.purpose')}
                    className="w-fit"
                    filter={filterOf(event.name)}
                  />
                  <span className="font-mono text-xs text-muted wrap-anywhere">{event.name}</span>
                </span>
                <span className="shrink-0 text-right font-semibold tabular-nums">
                  <FreshCount item={`event:${event.name}`} value={event.count} className="mr-1.5" />
                  {formatCount(event.count, i18n)}{' '}
                  <span className="font-normal text-muted">
                    {i18n.t('overview.topEvents.inVisits', {
                      visits: i18n.t('counts.visit', { count: event.visits }),
                    })}
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
