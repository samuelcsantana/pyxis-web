import { ChartPanel } from '@/components/charts/chart-panel';
import { FOCUS_RING } from '@/components/ui/control-classes';
import { BODY_CELL, HEADER_CELL, TABLE_SCROLL } from '@/components/ui/panel-classes';
import { formatCount } from '@/domain/metrics';
import {
  busiestHour,
  cellLabel,
  HEAT_LEVELS,
  type HeatLevel,
  heatLevel,
  hourLabel,
  HOURS_IN_A_DAY,
  type TimeOfDayReport,
  timeOfDaySummary,
} from '@/domain/time-of-day';
import type { I18n } from '@/i18n/i18n';

export interface VisitStartsPanelProps {
  readonly report: TimeOfDayReport;
  readonly periodLabel: string;
  readonly i18n: I18n;
}

const LEVEL_COLORS: Readonly<Record<HeatLevel, string>> = {
  0: 'bg-soft',
  1: 'bg-sky/25',
  2: 'bg-sky/50',
  3: 'bg-sky/75',
  4: 'bg-sky',
};
const LABELED_HOUR_STEP = 3;
const PHONE_LABELED_HOUR_STEP = 6;
const HOURS = Array.from({ length: HOURS_IN_A_DAY }, (_, hour) => hour);
const GRID_COLUMNS = {
  gridTemplateColumns: `auto repeat(${String(HOURS_IN_A_DAY)}, minmax(0, 1fr))`,
};
const CELL = 'h-5 rounded-[3px] sm:h-6';

function hourLabelClass(hour: number): string {
  const visibility = hour % PHONE_LABELED_HOUR_STEP === 0 ? '' : 'invisible sm:visible';
  return `text-micro whitespace-nowrap text-muted tabular-nums ${visibility}`;
}

function HeatGrid({ report, i18n }: Omit<VisitStartsPanelProps, 'periodLabel'>) {
  const busiest = busiestHour(report)?.visits ?? 0;
  return (
    <div role="img" aria-label={timeOfDaySummary(report, i18n)} className="flex flex-col gap-3">
      <div aria-hidden="true" className="grid items-center gap-0.5" style={GRID_COLUMNS}>
        <span />
        {HOURS.map((hour) => (
          <span key={hour} className={hourLabelClass(hour)}>
            {hour % LABELED_HOUR_STEP === 0 ? hourLabel(hour).slice(0, 2) : ''}
          </span>
        ))}
        {report.map((day) => (
          <div key={day.weekday} className="contents">
            <span className="pr-2 text-caption text-muted">
              {i18n.format.weekday(day.weekday, 'short')}
            </span>
            {day.hours.map((visits, hour) => (
              <span
                key={hour}
                title={cellLabel({ weekday: day.weekday, hour, visits }, i18n)}
                className={`${CELL} ${LEVEL_COLORS[heatLevel(visits, busiest)]}`}
              />
            ))}
          </div>
        ))}
      </div>
      <p className="text-caption text-muted">{timeOfDaySummary(report, i18n)}</p>
    </div>
  );
}

function HeatLegend({ i18n }: { readonly i18n: I18n }) {
  return (
    <p className="flex items-center gap-1.5 text-caption text-muted">
      {i18n.t('timeOfDay.fewer')}
      {HEAT_LEVELS.map((level) => (
        <span
          key={level}
          aria-hidden="true"
          className={`size-2.5 rounded-[3px] ${LEVEL_COLORS[level]}`}
        />
      ))}
      {i18n.t('timeOfDay.more')}
    </p>
  );
}

function HeatTable({ report, i18n }: Omit<VisitStartsPanelProps, 'periodLabel'>) {
  return (
    <div
      role="region"
      aria-label={i18n.t('timeOfDay.table')}
      tabIndex={0}
      className={`${TABLE_SCROLL} ${FOCUS_RING}`}
    >
      <table className="w-full text-right text-caption tabular-nums">
        <caption className="sr-only">{i18n.t('timeOfDay.title')}</caption>
        <thead>
          <tr>
            <th scope="col" className={`${HEADER_CELL} text-left`}>
              {i18n.t('timeOfDay.weekday')}
            </th>
            {HOURS.map((hour) => (
              <th key={hour} scope="col" className={HEADER_CELL}>
                {hourLabel(hour)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {report.map((day) => (
            <tr key={day.weekday}>
              <th scope="row" className={`${BODY_CELL} text-left font-medium`}>
                {i18n.format.weekday(day.weekday, 'long')}
              </th>
              {day.hours.map((visits, hour) => (
                <td key={hour} className={BODY_CELL}>
                  {formatCount(visits, i18n)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function VisitStartsPanel({ report, periodLabel, i18n }: VisitStartsPanelProps) {
  return (
    <ChartPanel
      title={i18n.t('timeOfDay.title')}
      description={i18n.t('timeOfDay.description', { period: periodLabel })}
      legend={<HeatLegend i18n={i18n} />}
      chart={<HeatGrid report={report} i18n={i18n} />}
      table={<HeatTable report={report} i18n={i18n} />}
    />
  );
}
