import { formatCount } from '@/domain/metrics';
import { activityTotals, type DayActivity } from '@/domain/overview';
import type { I18n } from '@/i18n/i18n';
import { PANEL, PANEL_TITLE } from '@/components/ui/panel-classes';

const HEADING_ID = 'day-activity-heading';

export interface DayActivityFiguresProps {
  readonly days: readonly DayActivity[];
  readonly periodLabel: string;
  readonly i18n: I18n;
}

export function DayActivityFigures({ days, periodLabel, i18n }: DayActivityFiguresProps) {
  const totals = activityTotals(days);
  const figures = [
    { label: 'Page views', value: totals.pageViews, swatch: 'bg-sky' },
    { label: 'Named events', value: totals.events, swatch: 'bg-violet' },
  ] as const;
  return (
    <section aria-labelledby={HEADING_ID} className={`${PANEL} gap-4`}>
      <div className="flex flex-col gap-1">
        <h2 id={HEADING_ID} className={PANEL_TITLE}>
          Activity of the day
        </h2>
        <p className="text-[13px] text-muted">Page views and named events, {periodLabel}</p>
      </div>
      <dl className="grid grid-cols-2 gap-3 sm:gap-4">
        {figures.map((figure) => (
          <div key={figure.label} className="flex flex-col gap-1">
            <dt className="flex items-center gap-2 text-[13px] text-muted">
              <span aria-hidden="true" className={`size-2.5 rounded-[3px] ${figure.swatch}`} />
              {figure.label}
            </dt>
            <dd className="text-[22px] leading-7 font-semibold tracking-tight tabular-nums sm:text-[28px] sm:leading-8">
              {formatCount(figure.value, i18n)}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
