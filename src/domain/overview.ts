import {
  countChange,
  formatCount,
  formatPercent,
  formatQuantity,
  NO_CHANGE,
  pointChange,
  rate,
  type Tone,
  toneOf,
} from './metrics';
import type { OverviewReport, OverviewWire } from './overview.schema';
import type { SparklineValue } from './sparkline';

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
  readonly series: readonly SparklineValue[];
}

function countKpi(kpi: Kpi, id: KpiId, label: string, note: string): KpiView {
  const change = countChange(kpi.current, kpi.previous);
  return {
    id,
    label,
    value: formatCount(kpi.current),
    change: change.text,
    tone: toneOf(change.trend, 'up'),
    note,
    series: kpi.daily,
  };
}

function failureRate(count: FailureCount): number | null {
  return rate(count.failed, count.total);
}

function writeErrorsKpi(writeErrors: OverviewReport['kpis']['writeErrors']): KpiView {
  const current = failureRate(writeErrors.current);
  const change = pointChange(
    current,
    failureRate(writeErrors.previous),
    Math.min(writeErrors.current.total, writeErrors.previous.total),
  );
  return {
    id: 'write-errors',
    label: 'Write error rate',
    value: formatPercent(current),
    change: change.text,
    tone: toneOf(change.trend, 'down'),
    note: `${formatCount(writeErrors.current.failed)} of ${formatQuantity(writeErrors.current.total, 'write', 'writes')} failed`,
    series: writeErrors.daily.map(failureRate),
  };
}

const SPOKEN_TONES: Readonly<Record<Tone, string>> = {
  good: ', better than the previous period',
  bad: ', worse than the previous period',
  neutral: '',
};

export function spokenChange(change: string, tone: Tone): string {
  return change === NO_CHANGE ? '' : ` change${SPOKEN_TONES[tone]}`;
}

export interface ComparedPeriod {
  readonly days: number;
  readonly endsToday: boolean;
}

function wholeDaysNote(days: number): string {
  return days === 1 ? 'vs. the day before' : `vs. previous ${formatCount(days)} days`;
}

function unfinishedTodayNote(days: number): string {
  return days === 1
    ? 'so far today vs. all of yesterday'
    : `vs. previous ${formatCount(days)} full days`;
}

export function previousPeriodNote(comparison: Comparison, period: ComparedPeriod): string {
  switch (comparison.kind) {
    case 'same-time':
      return period.days === 1
        ? `vs. yesterday until ${comparison.until}`
        : `vs. previous ${formatCount(period.days)} days, until ${comparison.until}`;
    case 'whole-days':
      return wholeDaysNote(period.days);
    case 'unknown':
      return period.endsToday ? unfinishedTodayNote(period.days) : wholeDaysNote(period.days);
  }
}

export function comparesUnfinishedDayWithWholeOne(
  comparison: Comparison,
  period: ComparedPeriod,
): boolean {
  return comparison.kind === 'unknown' && period.endsToday && period.days === 1;
}

function withoutJudgement(kpi: KpiView): KpiView {
  return { ...kpi, tone: 'neutral' };
}

function shareOfVisits(converted: number, visits: number): string {
  return `${formatPercent(rate(converted, visits))} of ${formatQuantity(visits, 'visit', 'visits')}`;
}

function conversionsKpi(conversions: Kpi, convertingVisits: Kpi | null, visits: Kpi): KpiView {
  if (convertingVisits === null) {
    return countKpi(
      conversions,
      'conversions',
      'Conversions',
      shareOfVisits(conversions.current, visits.current),
    );
  }
  const events = formatQuantity(conversions.current, 'conversion event', 'conversion events');
  return countKpi(
    convertingVisits,
    'conversions',
    'Conversions',
    `${shareOfVisits(convertingVisits.current, visits.current)} · ${events}`,
  );
}

export function overviewKpis(report: OverviewReport, period: ComparedPeriod): readonly KpiView[] {
  const { visits, identifiedUsers, conversions, convertingVisits, writeErrors } = report.kpis;
  const kpis = [
    countKpi(visits, 'visits', 'Visits', previousPeriodNote(report.comparison, period)),
    countKpi(identifiedUsers, 'identified-users', 'Identified users', 'signed in at least once'),
    ...(conversions === null ? [] : [conversionsKpi(conversions, convertingVisits, visits)]),
    writeErrorsKpi(writeErrors),
  ];
  return comparesUnfinishedDayWithWholeOne(report.comparison, period)
    ? kpis.map(withoutJudgement)
    : kpis;
}
