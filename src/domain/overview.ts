import type { I18n } from '@/i18n/i18n';
import {
  countChange,
  formatCount,
  formatPercent,
  NO_CHANGE,
  pointChange,
  rate,
  type Tone,
  toneOf,
} from './metrics';
import type { OverviewReport, OverviewWire } from './overview.schema';
import { FAILING_ONLY, type RequestsSearch } from './requests';
import type { SparklineValue } from './sparkline';
import { NO_VISIT_FILTERS, type VisitFilters, visitFilterParameters } from './visits';

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

export type KpiId = 'visits' | 'identified-users' | 'conversions' | 'write-errors';

export interface KpiDrillDown {
  readonly label: string;
  readonly screen: 'visits' | 'requests';
  readonly filter: Readonly<Record<string, string>>;
}

export interface KpiView {
  readonly id: KpiId;
  readonly label: string;
  readonly value: string;
  readonly change: string;
  readonly tone: Tone;
  readonly comparison: string;
  readonly note: string | null;
  readonly series: readonly SparklineValue[];
  readonly drillDown: KpiDrillDown | null;
}

interface KpiText {
  readonly id: KpiId;
  readonly label: string;
  readonly note: string | null;
  readonly drillDown: KpiDrillDown;
}

function visitsDrillDown(label: string, filter: Partial<VisitFilters>): KpiDrillDown {
  return {
    label,
    screen: 'visits',
    filter: visitFilterParameters({ ...NO_VISIT_FILTERS, ...filter }),
  };
}

const FAILING_ROUTES: KpiDrillDown = {
  label: 'See failing routes',
  screen: 'requests',
  filter: { show: FAILING_ONLY } satisfies RequestsSearch,
};

function countKpi(kpi: Kpi, text: KpiText, comparison: string, i18n: I18n): KpiView {
  const change = countChange(kpi.current, kpi.previous, i18n);
  return {
    ...text,
    value: formatCount(kpi.current, i18n),
    change: change.text,
    tone: toneOf(change.trend, 'up'),
    comparison,
    series: kpi.daily,
    drillDown: kpi.current > 0 ? text.drillDown : null,
  };
}

function failureRate(count: FailureCount): number | null {
  return rate(count.failed, count.total);
}

function writeErrorsKpi(
  writeErrors: OverviewReport['kpis']['writeErrors'],
  comparison: string,
  i18n: I18n,
): KpiView {
  const current = failureRate(writeErrors.current);
  const change = pointChange(
    current,
    failureRate(writeErrors.previous),
    Math.min(writeErrors.current.total, writeErrors.previous.total),
    i18n,
  );
  return {
    id: 'write-errors',
    label: 'Write error rate',
    value: formatPercent(current, i18n),
    change: change.text,
    tone: toneOf(change.trend, 'down'),
    comparison,
    note: `${formatCount(writeErrors.current.failed, i18n)} of ${i18n.t('counts.write', { count: writeErrors.current.total })} failed`,
    series: writeErrors.daily.map(failureRate),
    drillDown: writeErrors.current.failed > 0 ? FAILING_ROUTES : null,
  };
}

const SPOKEN_TONES: Readonly<Record<Tone, string>> = {
  good: ', better',
  bad: ', worse',
  neutral: '',
};

export function spokenChange(change: string): string {
  return change === NO_CHANGE ? '' : ' change';
}

export function spokenTone(tone: Tone): string {
  return SPOKEN_TONES[tone];
}

export interface ComparedPeriod {
  readonly days: number;
  readonly endsToday: boolean;
}

function wholeDaysNote(days: number, i18n: I18n): string {
  return days === 1 ? 'vs. the day before' : `vs. previous ${formatCount(days, i18n)} days`;
}

function unfinishedTodayNote(days: number, i18n: I18n): string {
  return days === 1
    ? 'so far today vs. all of yesterday'
    : `vs. previous ${formatCount(days, i18n)} full days`;
}

export function previousPeriodNote(
  comparison: Comparison,
  period: ComparedPeriod,
  i18n: I18n,
): string {
  switch (comparison.kind) {
    case 'same-time':
      return period.days === 1
        ? `vs. yesterday until ${comparison.until}`
        : `vs. previous ${formatCount(period.days, i18n)} days, until ${comparison.until}`;
    case 'whole-days':
      return wholeDaysNote(period.days, i18n);
    case 'unknown':
      return period.endsToday
        ? unfinishedTodayNote(period.days, i18n)
        : wholeDaysNote(period.days, i18n);
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

function shareOfVisits(converted: number, visits: number, i18n: I18n): string {
  return `${formatPercent(rate(converted, visits), i18n)} of ${i18n.t('counts.visit', { count: visits })}`;
}

interface ConversionFigures {
  readonly event: string;
  readonly conversions: Kpi;
  readonly convertingVisits: Kpi | null;
  readonly visits: Kpi;
}

const CONVERSIONS_ID = 'conversions';
const CONVERSIONS_LABEL = 'Conversions';

function conversionsKpi(
  { event, conversions, convertingVisits, visits }: ConversionFigures,
  comparison: string,
  i18n: I18n,
): KpiView {
  const drillDown = visitsDrillDown('See converting visits', { event });
  if (convertingVisits === null) {
    const note = `${event} · ${shareOfVisits(conversions.current, visits.current, i18n)}`;
    return countKpi(
      conversions,
      { id: CONVERSIONS_ID, label: CONVERSIONS_LABEL, note, drillDown },
      comparison,
      i18n,
    );
  }
  const share = shareOfVisits(convertingVisits.current, visits.current, i18n);
  const events = i18n.t('counts.conversionEvent', { count: conversions.current });
  const note = `${share} sent ${event} · ${events}`;
  return countKpi(
    convertingVisits,
    { id: CONVERSIONS_ID, label: CONVERSIONS_LABEL, note, drillDown },
    comparison,
    i18n,
  );
}

export function overviewKpis(
  report: OverviewReport,
  period: ComparedPeriod,
  conversionEvent: string | null,
  i18n: I18n,
): readonly KpiView[] {
  const { visits, identifiedUsers, conversions, convertingVisits, writeErrors } = report.kpis;
  const comparison = previousPeriodNote(report.comparison, period, i18n);
  const kpis = [
    countKpi(
      visits,
      {
        id: 'visits',
        label: 'Visits',
        note: null,
        drillDown: visitsDrillDown('See the visits', {}),
      },
      comparison,
      i18n,
    ),
    countKpi(
      identifiedUsers,
      {
        id: 'identified-users',
        label: 'Identified users',
        note: 'signed in at least once',
        drillDown: visitsDrillDown('See identified visits', { identity: 'identified' }),
      },
      comparison,
      i18n,
    ),
    ...(conversions === null || conversionEvent === null
      ? []
      : [
          conversionsKpi(
            { event: conversionEvent, conversions, convertingVisits, visits },
            comparison,
            i18n,
          ),
        ]),
    writeErrorsKpi(writeErrors, comparison, i18n),
  ];
  return comparesUnfinishedDayWithWholeOne(report.comparison, period)
    ? kpis.map(withoutJudgement)
    : kpis;
}
