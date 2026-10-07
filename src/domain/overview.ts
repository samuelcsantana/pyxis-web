import {
  displayedChange,
  displayedPointChange,
  formatChange,
  formatCount,
  formatPercent,
  formatPointChange,
  formatQuantity,
  percentChange,
  rate,
  type Tone,
  toneOf,
  trendOf,
} from './metrics';
import type { OverviewReport, OverviewWire } from './overview.schema';

export type { OverviewReport, OverviewWire };

const HOURS_AND_MINUTES = 5;

export type Comparison =
  | { readonly kind: 'whole-days' }
  | { readonly kind: 'same-time'; readonly until: string }
  | { readonly kind: 'unknown' };

export function comparisonOf(cutoff: string | null | undefined): Comparison {
  if (cutoff === undefined) {
    return { kind: 'unknown' };
  }
  return cutoff === null
    ? { kind: 'whole-days' }
    : { kind: 'same-time', until: cutoff.slice(0, HOURS_AND_MINUTES) };
}

export type Kpi = OverviewReport['kpis']['visits'];
export type DayActivity = OverviewReport['days'][number];

export type FailureCount = OverviewReport['kpis']['writeErrors']['current'];

export function hasActivity(report: OverviewReport): boolean {
  return report.days.some((day) => day.pageViews > 0 || day.events > 0);
}

export interface ActivityTotals {
  readonly pageViews: number;
  readonly events: number;
}

export function activityTotals(days: readonly DayActivity[]): ActivityTotals {
  return days.reduce(
    (totals, day) => ({
      pageViews: totals.pageViews + day.pageViews,
      events: totals.events + day.events,
    }),
    { pageViews: 0, events: 0 },
  );
}

function seriesSummary(label: string, values: readonly number[]): string {
  const total = values.reduce((sum, value) => sum + value, 0);
  const lowest = formatCount(Math.min(...values));
  const highest = formatCount(Math.max(...values));
  return `${label}: ${formatCount(total)} in total, between ${lowest} and ${highest} a day.`;
}

export function activitySummary(days: readonly DayActivity[]): string {
  return [
    `Area chart of ${formatQuantity(days.length, 'day', 'days')}.`,
    seriesSummary(
      'Page views',
      days.map((day) => day.pageViews),
    ),
    seriesSummary(
      'Named events',
      days.map((day) => day.events),
    ),
  ].join(' ');
}

export type KpiId = 'visits' | 'identified-users' | 'conversions' | 'write-errors';

export interface KpiView {
  readonly id: KpiId;
  readonly label: string;
  readonly value: string;
  readonly change: string;
  readonly tone: Tone;
  readonly note: string;
  readonly series: readonly number[];
}

function countKpi(kpi: Kpi, id: KpiId, label: string, note: string): KpiView {
  const change = percentChange(kpi.current, kpi.previous);
  return {
    id,
    label,
    value: formatCount(kpi.current),
    change: formatChange(change),
    tone: toneOf(trendOf(displayedChange(change)), 'up'),
    note,
    series: kpi.daily,
  };
}

function failureRate(count: FailureCount): number | null {
  return rate(count.failed, count.total);
}

function writeErrorsKpi(writeErrors: OverviewReport['kpis']['writeErrors']): KpiView {
  const current = failureRate(writeErrors.current);
  const previous = failureRate(writeErrors.previous);
  return {
    id: 'write-errors',
    label: 'Write error rate',
    value: formatPercent(current),
    change: formatPointChange(current, previous),
    tone: toneOf(trendOf(displayedPointChange(current, previous)), 'down'),
    note: `${formatCount(writeErrors.current.failed)} of ${formatQuantity(writeErrors.current.total, 'write', 'writes')} failed`,
    series: writeErrors.daily.map((day) => failureRate(day) ?? 0),
  };
}

export function previousPeriodNote(periodDays: number): string {
  return periodDays === 1 ? 'vs. the day before' : `vs. previous ${formatCount(periodDays)} days`;
}

export function overviewKpis(report: OverviewReport, periodDays: number): readonly KpiView[] {
  const { visits, identifiedUsers, conversions, writeErrors } = report.kpis;
  const conversionRate = conversions === null ? null : rate(conversions.current, visits.current);
  return [
    countKpi(visits, 'visits', 'Visits', previousPeriodNote(periodDays)),
    countKpi(identifiedUsers, 'identified-users', 'Identified users', 'signed in at least once'),
    ...(conversions === null
      ? []
      : [
          countKpi(
            conversions,
            'conversions',
            'Conversions',
            `${formatPercent(conversionRate)} of ${formatQuantity(visits.current, 'visit', 'visits')}`,
          ),
        ]),
    writeErrorsKpi(writeErrors),
  ];
}
