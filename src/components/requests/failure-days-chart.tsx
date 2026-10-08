import { valueAxis } from '@/domain/chart-scale';
import { formatCount } from '@/domain/metrics';
import { formatDay } from '@/domain/period';
import {
  FAILURE_CLASSES,
  type FailureClass,
  failureClassLabel,
  type FailureDayRow,
  failureDayRows,
  failureDaysSummary,
  failureTotals,
  type RequestDay,
} from '@/domain/request-days';
import { stackedBars } from '@/domain/stacked-bars';
import type { I18n } from '@/i18n/i18n';
import { ChartFrame } from '@/components/charts/chart-frame';
import { ChartHover, type HoverDay } from '@/components/charts/chart-hover';
import { ChartPanel, LegendItem } from '@/components/charts/chart-panel';
import { FOCUS_RING } from '@/components/ui/control-classes';
import { BODY_CELL, HEADER_CELL, PANEL, PANEL_TITLE } from '@/components/ui/panel-classes';

const SEPARATOR_WIDTH = 1;
const MARKER = 'size-2 rounded-[2px]';

export const FAILURE_COLORS: Readonly<
  Record<FailureClass, { readonly fill: string; readonly swatch: string }>
> = {
  clientError: { fill: 'var(--color-warn)', swatch: 'bg-warn' },
  serverError: { fill: 'var(--color-bad)', swatch: 'bg-bad' },
  noResponse: { fill: 'var(--color-slate)', swatch: 'bg-slate' },
};

export interface FailureDaysChartProps {
  readonly days: readonly RequestDay[];
  readonly description: string;
  readonly periodLabel: string;
  readonly i18n: I18n;
}

function hoverDays(rows: readonly FailureDayRow[], i18n: I18n): readonly HoverDay[] {
  return rows.map((row) => ({
    label: formatDay(row.date, i18n),
    rows: [
      ...FAILURE_CLASSES.map((failure) => ({
        label: failureClassLabel(failure, i18n),
        value: formatCount(row[failure], i18n),
        marker: `${MARKER} ${FAILURE_COLORS[failure].swatch}`,
      })),
      {
        label: i18n.t('requests.failureDays.total'),
        value: formatCount(row.total, i18n),
        marker: MARKER,
      },
    ],
  }));
}

function FailureBars({
  rows,
  i18n,
}: {
  readonly rows: readonly FailureDayRow[];
  readonly i18n: I18n;
}) {
  const axis = valueAxis(rows.map((row) => row.total));
  const bars = stackedBars(rows, FAILURE_CLASSES, axis.top);
  return (
    <ChartFrame
      summary={failureDaysSummary(rows, i18n)}
      heightClassName="h-40 sm:h-48"
      axis={axis}
      dates={rows.map((row) => row.date)}
      layout="bars"
      hover={<ChartHover days={hoverDays(rows, i18n)} layout="bars" />}
      i18n={i18n}
    >
      {bars.segments.map((segment) => (
        <rect
          key={`${segment.key}-${String(segment.day)}`}
          x={segment.x}
          y={segment.y}
          width={segment.width}
          height={segment.height}
          fill={FAILURE_COLORS[segment.key].fill}
        />
      ))}
      <path
        d={bars.separators}
        fill="none"
        stroke="var(--color-card)"
        strokeWidth={SEPARATOR_WIDTH}
        vectorEffect="non-scaling-stroke"
      />
    </ChartFrame>
  );
}

function FailureTable({
  rows,
  periodLabel,
  i18n,
}: {
  readonly rows: readonly FailureDayRow[];
  readonly periodLabel: string;
  readonly i18n: I18n;
}) {
  const caption = i18n.t('requests.failureDays.caption', { period: periodLabel });
  return (
    <div
      className={`overflow-x-auto ${FOCUS_RING}`}
      role="region"
      aria-label={caption}
      tabIndex={0}
    >
      <table className="w-full border-collapse text-caption tabular-nums">
        <caption className="pb-2 text-left text-muted">{caption}</caption>
        <thead>
          <tr>
            <th scope="col" className={`${HEADER_CELL} text-left`}>
              {i18n.t('requests.failureDays.day')}
            </th>
            {FAILURE_CLASSES.map((failure) => (
              <th key={failure} scope="col" className={`${HEADER_CELL} text-right`}>
                {failureClassLabel(failure, i18n)}
              </th>
            ))}
            <th scope="col" className={`${HEADER_CELL} text-right`}>
              {i18n.t('requests.failureDays.total')}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.date}>
              <th scope="row" className={`${BODY_CELL} text-left font-normal whitespace-nowrap`}>
                {formatDay(row.date, i18n)}
              </th>
              {FAILURE_CLASSES.map((failure) => (
                <td key={failure} className={`${BODY_CELL} text-right`}>
                  {formatCount(row[failure], i18n)}
                </td>
              ))}
              <td className={`${BODY_CELL} text-right font-semibold`}>
                {formatCount(row.total, i18n)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function FailureDaysChart({ days, description, periodLabel, i18n }: FailureDaysChartProps) {
  const rows = failureDayRows(days);
  const totals = failureTotals(rows);
  const title = i18n.t('requests.failureDays.title');
  if (rows.every((row) => row.total === 0)) {
    return (
      <section aria-label={title} className={PANEL}>
        <h2 className={PANEL_TITLE}>{title}</h2>
        <p className="text-caption text-muted">{i18n.t('requests.failureDays.none')}</p>
      </section>
    );
  }
  return (
    <ChartPanel
      title={title}
      description={description}
      legend={FAILURE_CLASSES.map((failure) => (
        <LegendItem
          key={failure}
          swatch={FAILURE_COLORS[failure].swatch}
          label={failureClassLabel(failure, i18n)}
          total={formatCount(totals[failure], i18n)}
        />
      ))}
      chart={<FailureBars rows={rows} i18n={i18n} />}
      table={<FailureTable rows={rows} periodLabel={periodLabel} i18n={i18n} />}
    />
  );
}
