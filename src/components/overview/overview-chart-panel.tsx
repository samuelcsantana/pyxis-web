import { valueAxis, type ValueAxis } from '@/domain/chart-scale';
import { linePath } from '@/domain/line-chart';
import {
  chartCaption,
  chartColumns,
  chartDays,
  chartRows,
  chartSummary,
  chartValues,
  formatChartValue,
  type OverviewChart,
  type SeriesColor,
} from '@/domain/overview-chart';
import type { I18n } from '@/i18n/i18n';
import { ChartFrame } from '@/components/charts/chart-frame';
import { ChartHover, type HoverDay } from '@/components/charts/chart-hover';
import { ChartPanel, LegendItem } from '@/components/charts/chart-panel';
import { FOCUS_RING } from '@/components/ui/control-classes';
import { BODY_CELL, HEADER_CELL } from '@/components/ui/panel-classes';

const STROKES: Readonly<Record<SeriesColor, string>> = {
  sky: 'var(--color-sky)',
  violet: 'var(--color-violet)',
  accent: 'var(--color-accent)',
  bad: 'var(--color-bad)',
};

const SWATCHES: Readonly<Record<SeriesColor, string>> = {
  sky: 'bg-sky',
  violet: 'bg-violet',
  accent: 'bg-accent',
  bad: 'bg-bad',
};

const DASHED_MARKERS: Readonly<Record<SeriesColor, string>> = {
  sky: 'border-sky',
  violet: 'border-violet',
  accent: 'border-accent',
  bad: 'border-bad',
};

const SOLID_MARKER = 'size-2 rounded-[2px]';
const DASHED_MARKER = 'w-3.5 border-t-2 border-dashed';

const LINE_WIDTH = 2.5;
const PREVIOUS_LINE_WIDTH = 1.75;
const PREVIOUS_DASHES = '6 5';
const PREVIOUS_OPACITY = 0.6;

export interface OverviewChartPanelProps {
  readonly chart: OverviewChart;
  readonly periodLabel: string;
  readonly i18n: I18n;
}

function SeriesLines({ chart, axis }: { readonly chart: OverviewChart; readonly axis: ValueAxis }) {
  const days = chart.dates.length;
  return chart.series.map((series) => (
    <g key={series.key} stroke={STROKES[series.color]} fill="none">
      {chart.previousDates === null ? null : (
        <path
          d={linePath(series.previous, axis.top, days)}
          strokeWidth={PREVIOUS_LINE_WIDTH}
          strokeDasharray={PREVIOUS_DASHES}
          strokeOpacity={PREVIOUS_OPACITY}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          data-period="previous"
        />
      )}
      <path
        d={linePath(series.values, axis.top)}
        strokeWidth={LINE_WIDTH}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        data-period="current"
      />
    </g>
  ));
}

function hoverDays(chart: OverviewChart, i18n: I18n): readonly HoverDay[] {
  return chartDays(chart, i18n).map(({ day, points }) => ({
    label: day,
    rows: points.map((point) => ({
      label: point.label,
      value: point.value,
      marker: point.previous
        ? `${DASHED_MARKER} ${DASHED_MARKERS[point.color]}`
        : `${SOLID_MARKER} ${SWATCHES[point.color]}`,
    })),
  }));
}

function Chart({ chart, i18n }: { readonly chart: OverviewChart; readonly i18n: I18n }) {
  const axis = valueAxis(chartValues(chart));
  return (
    <ChartFrame
      summary={chartSummary(chart, i18n)}
      heightClassName="h-44 sm:h-60"
      axis={axis}
      dates={chart.dates}
      layout="points"
      formatTick={(tick) => formatChartValue(tick, chart.format, i18n)}
      hover={<ChartHover days={hoverDays(chart, i18n)} layout="points" />}
      i18n={i18n}
    >
      <SeriesLines chart={chart} axis={axis} />
    </ChartFrame>
  );
}

function ChartTable({ chart, periodLabel, i18n }: OverviewChartPanelProps) {
  const caption = chartCaption(chart, periodLabel, i18n);
  const columns = chartColumns(chart, i18n);
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
              Day
            </th>
            {columns.map((column) => (
              <th
                key={column.label}
                scope="col"
                className={`${HEADER_CELL} ${column.numeric ? 'text-right' : 'text-left'}`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {chartRows(chart, i18n).map((row) => (
            <tr key={row.day}>
              <th scope="row" className={`${BODY_CELL} text-left font-normal`}>
                {row.day}
              </th>
              {columns.map((column, index) => (
                <td
                  key={column.label}
                  className={`${BODY_CELL} ${column.numeric ? 'text-right' : 'text-left'}`}
                >
                  {row.cells[index]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PreviousPeriodLegend({ total }: { readonly total: string | null }) {
  return (
    <p className="flex items-center gap-2 text-caption">
      <span aria-hidden="true" className="w-3.5 border-t-2 border-dashed border-muted" />
      Previous period
      {total === null ? null : <strong className="tabular-nums">{total}</strong>}
    </p>
  );
}

export function OverviewChartPanel({ chart, periodLabel, i18n }: OverviewChartPanelProps) {
  return (
    <ChartPanel
      title={chart.title}
      description={`${chart.subject}, ${periodLabel}`}
      legend={
        <>
          {chart.series.map((series) => (
            <LegendItem
              key={series.key}
              swatch={SWATCHES[series.color]}
              label={series.label}
              total={series.total}
            />
          ))}
          {chart.previousDates === null ? null : (
            <PreviousPeriodLegend total={chart.previousTotal} />
          )}
        </>
      }
      chart={<Chart chart={chart} i18n={i18n} />}
      table={<ChartTable chart={chart} periodLabel={periodLabel} i18n={i18n} />}
    />
  );
}
