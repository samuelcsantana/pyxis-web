import { formatCount, formatPercent, formatQuantity, NO_VALUE, rate } from './metrics';
import type { FailureCount, KpiId, OverviewReport } from './overview';
import { formatDay } from './period';

export const METRIC_PARAMETER = 'metric';
export const ACTIVITY = 'activity';

export type ChartMetric = typeof ACTIVITY | KpiId;
export type SeriesColor = 'sky' | 'violet' | 'accent' | 'bad';
export type ValueFormat = 'count' | 'percent';
export type ChartValue = number | null;

export const KPI_COLORS: Readonly<Record<KpiId, SeriesColor>> = {
  visits: 'sky',
  'identified-users': 'violet',
  conversions: 'accent',
  'write-errors': 'bad',
};

export interface ChartSeries {
  readonly key: string;
  readonly label: string;
  readonly color: SeriesColor;
  readonly values: readonly ChartValue[];
  readonly previous: readonly ChartValue[];
  readonly total: string;
}

export interface OverviewChart {
  readonly metric: ChartMetric;
  readonly title: string;
  readonly subject: string;
  readonly format: ValueFormat;
  readonly additive: boolean;
  readonly gapLabel: string;
  readonly dates: readonly string[];
  readonly previousDates: readonly string[] | null;
  readonly series: readonly ChartSeries[];
  readonly previousTotal: string | null;
}

export interface ChartColumn {
  readonly label: string;
  readonly numeric: boolean;
}

export interface ChartRow {
  readonly day: string;
  readonly cells: readonly string[];
}

export interface ChartPoint {
  readonly label: string;
  readonly value: string;
  readonly color: SeriesColor;
  readonly previous: boolean;
}

export interface ChartDay {
  readonly day: string;
  readonly points: readonly ChartPoint[];
}

type PreviousDay = NonNullable<OverviewReport['previousDays']>[number];
type CountKpi = OverviewReport['kpis']['visits'];

interface MetricSource {
  readonly label: string;
  readonly format: ValueFormat;
  readonly additive: boolean;
  readonly gapLabel: string;
  readonly values: readonly ChartValue[];
  readonly previousOf: (day: PreviousDay) => ChartValue;
  readonly total: ChartValue;
  readonly previousTotal: ChartValue;
}

const PERCENT_POINTS = 100;
const NO_VALUE_GAP = 'no value';
const NO_WRITES_GAP = 'no writes';

export function chartMetric(
  value: string | readonly string[] | null | undefined,
  available: readonly KpiId[],
): ChartMetric {
  return available.find((id) => id === value) ?? ACTIVITY;
}

export function withChartMetric(query: string, metric: ChartMetric): string {
  const parameters = new URLSearchParams(query);
  if (metric === ACTIVITY) {
    parameters.delete(METRIC_PARAMETER);
  } else {
    parameters.set(METRIC_PARAMETER, metric);
  }
  return parameters.toString();
}

export function keptMetric(metric: ChartMetric): Readonly<Record<string, string>> {
  return metric === ACTIVITY ? {} : { [METRIC_PARAMETER]: metric };
}

export function formatChartValue(value: ChartValue, format: ValueFormat): string {
  if (value === null) {
    return NO_VALUE;
  }
  return format === 'count' ? formatCount(value) : formatPercent(value / PERCENT_POINTS);
}

function knownValues(values: readonly ChartValue[]): readonly number[] {
  return values.filter((value): value is number => value !== null);
}

function sum(values: readonly ChartValue[]): number {
  return knownValues(values).reduce((total, value) => total + value, 0);
}

function percentPoints(count: FailureCount): ChartValue {
  const share = rate(count.failed, count.total);
  return share === null ? null : share * PERCENT_POINTS;
}

function previousDatesOf(report: OverviewReport): readonly string[] | null {
  return report.previousDays?.map((day) => day.date) ?? null;
}

function activitySeries(
  report: OverviewReport,
  key: 'pageViews' | 'events',
  label: string,
  color: SeriesColor,
): ChartSeries {
  const values = report.days.map((day) => day[key]);
  const previous = report.previousDays?.map((day) => day[key]) ?? [];
  return {
    key,
    label,
    color,
    values,
    previous,
    total: formatCount(sum(values)),
  };
}

function activityChart(report: OverviewReport): OverviewChart {
  return {
    metric: ACTIVITY,
    title: 'Activity per day',
    subject: 'Page views and named events',
    format: 'count',
    additive: true,
    gapLabel: NO_VALUE_GAP,
    dates: report.days.map((day) => day.date),
    previousDates: previousDatesOf(report),
    series: [
      activitySeries(report, 'pageViews', 'Page views', 'sky'),
      activitySeries(report, 'events', 'Named events', 'violet'),
    ],
    previousTotal: null,
  };
}

function countSource(
  label: string,
  kpi: CountKpi,
  previousOf: (day: PreviousDay) => ChartValue,
  additive: boolean,
): MetricSource {
  return {
    label,
    format: 'count',
    additive,
    gapLabel: NO_VALUE_GAP,
    values: kpi.daily,
    previousOf,
    total: kpi.current,
    previousTotal: kpi.previous,
  };
}

function writeErrorsSource(writeErrors: OverviewReport['kpis']['writeErrors']): MetricSource {
  return {
    label: 'Write error rate',
    format: 'percent',
    additive: false,
    gapLabel: NO_WRITES_GAP,
    values: writeErrors.daily.map(percentPoints),
    previousOf: (day) => percentPoints(day.writeErrors),
    total: percentPoints(writeErrors.current),
    previousTotal: percentPoints(writeErrors.previous),
  };
}

function metricSource(report: OverviewReport, id: KpiId): MetricSource | null {
  const { visits, identifiedUsers, conversions, convertingVisits, writeErrors } = report.kpis;
  switch (id) {
    case 'visits':
      return countSource('Visits', visits, (day) => day.visits, true);
    case 'identified-users':
      return countSource('Identified users', identifiedUsers, (day) => day.identifiedUsers, false);
    case 'conversions':
      if (convertingVisits !== null) {
        return countSource('Conversions', convertingVisits, (day) => day.convertingVisits, true);
      }
      return conversions === null
        ? null
        : countSource('Conversions', conversions, (day) => day.conversions, true);
    case 'write-errors':
      return writeErrorsSource(writeErrors);
  }
}

export function overviewChart(report: OverviewReport, metric: ChartMetric): OverviewChart {
  const source = metric === ACTIVITY ? null : metricSource(report, metric);
  if (metric === ACTIVITY || source === null) {
    return activityChart(report);
  }
  const previous = report.previousDays?.map(source.previousOf) ?? [];
  return {
    metric,
    title: `${source.label} per day`,
    subject: source.label,
    format: source.format,
    additive: source.additive,
    gapLabel: source.gapLabel,
    dates: report.days.map((day) => day.date),
    previousDates: previousDatesOf(report),
    series: [
      {
        key: metric,
        label: source.label,
        color: KPI_COLORS[metric],
        values: source.values,
        previous,
        total: formatChartValue(source.total, source.format),
      },
    ],
    previousTotal:
      report.previousDays === null ? null : formatChartValue(source.previousTotal, source.format),
  };
}

export function chartValues(chart: OverviewChart): readonly number[] {
  return chart.series.flatMap((series) => knownValues([...series.values, ...series.previous]));
}

function seriesStatistics(values: readonly ChartValue[], chart: OverviewChart): string {
  const known = knownValues(values);
  if (known.length === 0) {
    return `${chart.gapLabel} on any day`;
  }
  const gaps = values.length - known.length;
  const lowest = formatChartValue(Math.min(...known), chart.format);
  const highest = formatChartValue(Math.max(...known), chart.format);
  return [
    ...(chart.additive ? [`${formatCount(sum(known))} in total`] : []),
    `between ${lowest} and ${highest} a day`,
    ...(gaps > 0 ? [`${chart.gapLabel} on ${formatQuantity(gaps, 'day', 'days')}`] : []),
  ].join(', ');
}

export function chartSummary(chart: OverviewChart): string {
  const current = chart.series.map(
    (series) => `${series.label}: ${seriesStatistics(series.values, chart)}.`,
  );
  const previous =
    chart.previousDates === null
      ? []
      : [
          'Dashed, the previous period.',
          ...chart.series.map(
            (series) => `${series.label}: ${seriesStatistics(series.previous, chart)}.`,
          ),
        ];
  return [
    `Line chart of ${formatQuantity(chart.dates.length, 'day', 'days')}.`,
    ...current,
    ...previous,
  ].join(' ');
}

export function chartCaption(chart: OverviewChart, periodLabel: string): string {
  const caption = `${chart.subject} per day, ${periodLabel}`;
  return chart.previousDates === null ? caption : `${caption}, with the previous period`;
}

export function chartColumns(chart: OverviewChart): readonly ChartColumn[] {
  const current = chart.series.map((series) => ({ label: series.label, numeric: true }));
  if (chart.previousDates === null) {
    return current;
  }
  return [
    ...current,
    { label: 'Compared with', numeric: false },
    ...chart.series.map((series) => ({ label: `${series.label} then`, numeric: true })),
  ];
}

function dayLabelAt(dates: readonly string[], index: number): string {
  const date = dates[index];
  return date === undefined ? NO_VALUE : formatDay(date);
}

function valueAt(values: readonly ChartValue[], index: number, chart: OverviewChart): string {
  return formatChartValue(values[index] ?? null, chart.format);
}

function previousCells(chart: OverviewChart, index: number): readonly string[] {
  if (chart.previousDates === null) {
    return [];
  }
  return [
    dayLabelAt(chart.previousDates, index),
    ...chart.series.map((series) => valueAt(series.previous, index, chart)),
  ];
}

export function chartRows(chart: OverviewChart): readonly ChartRow[] {
  return chart.dates.map((date, index) => ({
    day: formatDay(date),
    cells: [
      ...chart.series.map((series) => valueAt(series.values, index, chart)),
      ...previousCells(chart, index),
    ],
  }));
}

function previousPoints(chart: OverviewChart, index: number): readonly ChartPoint[] {
  if (chart.previousDates === null) {
    return [];
  }
  const day = dayLabelAt(chart.previousDates, index);
  return chart.series.map((series) => ({
    label: `${series.label}, ${day}`,
    value: valueAt(series.previous, index, chart),
    color: series.color,
    previous: true,
  }));
}

export function chartDays(chart: OverviewChart): readonly ChartDay[] {
  return chart.dates.map((date, index) => ({
    day: formatDay(date),
    points: [
      ...chart.series.map((series) => ({
        label: series.label,
        value: valueAt(series.values, index, chart),
        color: series.color,
        previous: false,
      })),
      ...previousPoints(chart, index),
    ],
  }));
}
