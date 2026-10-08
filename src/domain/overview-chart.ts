import type { I18n } from '@/i18n/i18n';
import { formatCount, formatPercent, NO_VALUE, rate } from './metrics';
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

export function formatChartValue(value: ChartValue, format: ValueFormat, i18n: I18n): string {
  if (value === null) {
    return NO_VALUE;
  }
  return format === 'count'
    ? formatCount(value, i18n)
    : formatPercent(value / PERCENT_POINTS, i18n);
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
  i18n: I18n,
): ChartSeries {
  const values = report.days.map((day) => day[key]);
  const previous = report.previousDays?.map((day) => day[key]) ?? [];
  return {
    key,
    label,
    color,
    values,
    previous,
    total: formatCount(sum(values), i18n),
  };
}

function activityChart(report: OverviewReport, i18n: I18n): OverviewChart {
  return {
    metric: ACTIVITY,
    title: i18n.t('overviewChart.activityTitle'),
    subject: i18n.t('overviewChart.activitySubject'),
    format: 'count',
    additive: true,
    gapLabel: i18n.t('overviewChart.gaps.noValue'),
    dates: report.days.map((day) => day.date),
    previousDates: previousDatesOf(report),
    series: [
      activitySeries(report, 'pageViews', i18n.t('overviewChart.pageViews'), 'sky', i18n),
      activitySeries(report, 'events', i18n.t('overviewChart.namedEvents'), 'violet', i18n),
    ],
    previousTotal: null,
  };
}

function countSource(
  label: string,
  kpi: CountKpi,
  previousOf: (day: PreviousDay) => ChartValue,
  additive: boolean,
  i18n: I18n,
): MetricSource {
  return {
    label,
    format: 'count',
    additive,
    gapLabel: i18n.t('overviewChart.gaps.noValue'),
    values: kpi.daily,
    previousOf,
    total: kpi.current,
    previousTotal: kpi.previous,
  };
}

function writeErrorsSource(
  writeErrors: OverviewReport['kpis']['writeErrors'],
  i18n: I18n,
): MetricSource {
  return {
    label: i18n.t('overview.kpis.writeErrorRate'),
    format: 'percent',
    additive: false,
    gapLabel: i18n.t('overviewChart.gaps.noWrites'),
    values: writeErrors.daily.map(percentPoints),
    previousOf: (day) => percentPoints(day.writeErrors),
    total: percentPoints(writeErrors.current),
    previousTotal: percentPoints(writeErrors.previous),
  };
}

function conversionsSource(
  conversions: CountKpi | null,
  convertingVisits: CountKpi | null,
  i18n: I18n,
): MetricSource | null {
  const label = i18n.t('overview.kpis.conversions');
  if (convertingVisits !== null) {
    return countSource(label, convertingVisits, (day) => day.convertingVisits, true, i18n);
  }
  return conversions === null
    ? null
    : countSource(label, conversions, (day) => day.conversions, true, i18n);
}

function metricSource(report: OverviewReport, id: KpiId, i18n: I18n): MetricSource | null {
  const { visits, identifiedUsers, conversions, convertingVisits, writeErrors } = report.kpis;
  switch (id) {
    case 'visits':
      return countSource(i18n.t('overview.kpis.visits'), visits, (day) => day.visits, true, i18n);
    case 'identified-users':
      return countSource(
        i18n.t('overview.kpis.identifiedUsers'),
        identifiedUsers,
        (day) => day.identifiedUsers,
        false,
        i18n,
      );
    case 'conversions':
      return conversionsSource(conversions, convertingVisits, i18n);
    case 'write-errors':
      return writeErrorsSource(writeErrors, i18n);
  }
}

export function overviewChart(
  report: OverviewReport,
  metric: ChartMetric,
  i18n: I18n,
): OverviewChart {
  const source = metric === ACTIVITY ? null : metricSource(report, metric, i18n);
  if (metric === ACTIVITY || source === null) {
    return activityChart(report, i18n);
  }
  const previous = report.previousDays?.map(source.previousOf) ?? [];
  return {
    metric,
    title: i18n.t('overviewChart.metricTitle', { metric: source.label }),
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
        total: formatChartValue(source.total, source.format, i18n),
      },
    ],
    previousTotal:
      report.previousDays === null
        ? null
        : formatChartValue(source.previousTotal, source.format, i18n),
  };
}

export function chartValues(chart: OverviewChart): readonly number[] {
  return chart.series.flatMap((series) => knownValues([...series.values, ...series.previous]));
}

function seriesStatistics(values: readonly ChartValue[], chart: OverviewChart, i18n: I18n): string {
  const known = knownValues(values);
  if (known.length === 0) {
    return i18n.t('overviewChart.statistics.noneOnAnyDay', { gap: chart.gapLabel });
  }
  const gaps = values.length - known.length;
  const lowest = formatChartValue(Math.min(...known), chart.format, i18n);
  const highest = formatChartValue(Math.max(...known), chart.format, i18n);
  return i18n.format.list([
    ...(chart.additive
      ? [i18n.t('overviewChart.statistics.total', { total: formatCount(sum(known), i18n) })]
      : []),
    i18n.t('overviewChart.statistics.range', { lowest, highest }),
    ...(gaps > 0
      ? [
          i18n.t('overviewChart.statistics.gapDays', {
            gap: chart.gapLabel,
            days: i18n.t('counts.day', { count: gaps }),
          }),
        ]
      : []),
  ]);
}

function seriesSentence(
  series: ChartSeries,
  values: readonly ChartValue[],
  chart: OverviewChart,
  i18n: I18n,
): string {
  return i18n.t('overviewChart.summary.series', {
    series: series.label,
    statistics: seriesStatistics(values, chart, i18n),
  });
}

export function chartSummary(chart: OverviewChart, i18n: I18n): string {
  const current = chart.series.map((series) => seriesSentence(series, series.values, chart, i18n));
  const previous =
    chart.previousDates === null
      ? []
      : [
          i18n.t('overviewChart.summary.previous'),
          ...chart.series.map((series) => seriesSentence(series, series.previous, chart, i18n)),
        ];
  return [
    i18n.t('overviewChart.summary.lineChart', {
      days: i18n.t('counts.day', { count: chart.dates.length }),
    }),
    ...current,
    ...previous,
  ].join(' ');
}

export function chartCaption(chart: OverviewChart, periodLabel: string, i18n: I18n): string {
  const caption = i18n.t('overviewChart.caption', { subject: chart.subject, period: periodLabel });
  return chart.previousDates === null
    ? caption
    : i18n.t('overviewChart.captionWithPrevious', { caption });
}

export function chartColumns(chart: OverviewChart, i18n: I18n): readonly ChartColumn[] {
  const current = chart.series.map((series) => ({ label: series.label, numeric: true }));
  if (chart.previousDates === null) {
    return current;
  }
  return [
    ...current,
    { label: i18n.t('overviewChart.columns.comparedWith'), numeric: false },
    ...chart.series.map((series) => ({
      label: i18n.t('overviewChart.columns.previous', { series: series.label }),
      numeric: true,
    })),
  ];
}

function dayLabelAt(dates: readonly string[], index: number, i18n: I18n): string {
  const date = dates[index];
  return date === undefined ? NO_VALUE : formatDay(date, i18n);
}

function valueAt(
  values: readonly ChartValue[],
  index: number,
  chart: OverviewChart,
  i18n: I18n,
): string {
  return formatChartValue(values[index] ?? null, chart.format, i18n);
}

function previousCells(chart: OverviewChart, index: number, i18n: I18n): readonly string[] {
  if (chart.previousDates === null) {
    return [];
  }
  return [
    dayLabelAt(chart.previousDates, index, i18n),
    ...chart.series.map((series) => valueAt(series.previous, index, chart, i18n)),
  ];
}

export function chartRows(chart: OverviewChart, i18n: I18n): readonly ChartRow[] {
  return chart.dates.map((date, index) => ({
    day: formatDay(date, i18n),
    cells: [
      ...chart.series.map((series) => valueAt(series.values, index, chart, i18n)),
      ...previousCells(chart, index, i18n),
    ],
  }));
}

function previousPoints(chart: OverviewChart, index: number, i18n: I18n): readonly ChartPoint[] {
  if (chart.previousDates === null) {
    return [];
  }
  const day = dayLabelAt(chart.previousDates, index, i18n);
  return chart.series.map((series) => ({
    label: i18n.t('overviewChart.point', { series: series.label, day }),
    value: valueAt(series.previous, index, chart, i18n),
    color: series.color,
    previous: true,
  }));
}

export function chartDays(chart: OverviewChart, i18n: I18n): readonly ChartDay[] {
  return chart.dates.map((date, index) => ({
    day: formatDay(date, i18n),
    points: [
      ...chart.series.map((series) => ({
        label: series.label,
        value: valueAt(series.values, index, chart, i18n),
        color: series.color,
        previous: false,
      })),
      ...previousPoints(chart, index, i18n),
    ],
  }));
}
