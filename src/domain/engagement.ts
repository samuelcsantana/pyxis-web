import type { I18n } from '@/i18n/i18n';
import { formatSeconds } from './timeline';

const SECONDS_PER_MINUTE = 60;
const PERCENT = 100;

export interface EntryPage {
  readonly path: string;
  readonly visits: number;
  readonly singlePageVisits: number;
}

export interface ExitPage {
  readonly path: string;
  readonly visits: number;
}

export interface VisitLengthBucket {
  readonly upToSeconds: number | null;
  readonly visits: number;
}

export interface EngagementReport {
  readonly visits: number;
  readonly singlePageVisits: number;
  readonly medianVisitSeconds: number | null;
  readonly visitLengths: readonly VisitLengthBucket[];
  readonly entryPages: readonly EntryPage[];
  readonly exitPages: readonly ExitPage[];
}

export interface VisitLengthRow {
  readonly label: string;
  readonly visits: number;
  readonly share: number;
  readonly barWidth: string;
}

function share(part: number, whole: number): number {
  return whole === 0 ? 0 : part / whole;
}

function compactDuration(seconds: number, i18n: I18n): string {
  return seconds < SECONDS_PER_MINUTE
    ? i18n.t('engagement.units.seconds', { count: String(seconds) })
    : i18n.t('engagement.units.minutes', { count: String(seconds / SECONDS_PER_MINUTE) });
}

function bucketLabel(bucket: VisitLengthBucket, lower: number | null, i18n: I18n): string {
  if (bucket.upToSeconds === null) {
    return i18n.t('engagement.lengths.atLeast', { lower: compactDuration(lower ?? 0, i18n) });
  }
  const upper = compactDuration(bucket.upToSeconds, i18n);
  return lower === null
    ? i18n.t('engagement.lengths.under', { upper })
    : i18n.t('engagement.lengths.between', { lower: compactDuration(lower, i18n), upper });
}

export function visitLengthRows(report: EngagementReport, i18n: I18n): readonly VisitLengthRow[] {
  const busiest = Math.max(0, ...report.visitLengths.map((bucket) => bucket.visits));
  return report.visitLengths.map((bucket, index) => ({
    label: bucketLabel(bucket, report.visitLengths[index - 1]?.upToSeconds ?? null, i18n),
    visits: bucket.visits,
    share: share(bucket.visits, report.visits),
    barWidth: `${String(share(bucket.visits, busiest) * PERCENT)}%`,
  }));
}

export function singlePageShare(report: EngagementReport): number {
  return share(report.singlePageVisits, report.visits);
}

export function medianVisitLabel(report: EngagementReport, i18n: I18n): string {
  return report.medianVisitSeconds === null
    ? i18n.t('engagement.noMedian')
    : formatSeconds(report.medianVisitSeconds, i18n);
}

export function engagementSummary(report: EngagementReport, i18n: I18n): string {
  return i18n.t('engagement.summary', {
    median: medianVisitLabel(report, i18n),
    share: i18n.format.percent(singlePageShare(report)),
  });
}
