import type { I18n } from '@/i18n/i18n';
import { formatCount, NO_VALUE } from './metrics';
import { formatDay } from './period';
import { formatDuration, type RequestKind, type RequestsReport } from './requests';

export type RouteDay = NonNullable<RequestsReport['routeDays']>[number];

export interface RouteDayRow {
  readonly date: string;
  readonly day: string;
  readonly total: string;
  readonly failed: string;
  readonly hasFailures: boolean;
  readonly median: string;
  readonly p95: string;
}

export interface RouteDaysView {
  readonly rows: readonly RouteDayRow[];
  readonly note: string | null;
}

export interface RouteDaysText {
  readonly heading: string;
  readonly loading: string;
  readonly failed: string;
  readonly retry: string;
  readonly unavailable: string;
  readonly none: string;
  readonly columns: {
    readonly day: string;
    readonly total: string | null;
    readonly failed: string;
    readonly median: string;
    readonly p95: string;
  };
}

function durationOf(milliseconds: number | null, i18n: I18n): string {
  return milliseconds === null ? NO_VALUE : formatDuration(milliseconds, i18n);
}

function routeDayRow(day: RouteDay, i18n: I18n): RouteDayRow {
  return {
    date: day.date,
    day: formatDay(day.date, i18n),
    total: formatCount(day.total, i18n),
    failed: formatCount(day.failed, i18n),
    hasFailures: day.failed > 0,
    median: durationOf(day.medianDurationMs, i18n),
    p95: durationOf(day.p95DurationMs, i18n),
  };
}

export function routeDaysView(
  days: readonly RouteDay[],
  kind: RequestKind,
  i18n: I18n,
): RouteDaysView {
  const active = days.filter((day) => day.total > 0);
  const quiet = days.length - active.length;
  return {
    rows: active.map((day) => routeDayRow(day, i18n)),
    note:
      active.length === 0 || quiet === 0
        ? null
        : i18n.t(`requests.routeDays.quietDays.${kind}`, { count: quiet }),
  };
}

export function routeDaysText(kind: RequestKind, i18n: I18n): RouteDaysText {
  return {
    heading: i18n.t('requests.routeDays.heading'),
    loading: i18n.t('requests.routeDays.loading'),
    failed: i18n.t('requests.routeDays.failed'),
    retry: i18n.t('requests.routeDays.retry'),
    unavailable: i18n.t('requests.routeDays.unavailable'),
    none: i18n.t(`requests.routeDays.none.${kind}`),
    columns: {
      day: i18n.t('requests.routeDays.columns.day'),
      total: kind === 'writes' ? i18n.t('requests.routeDays.columns.total') : null,
      failed: i18n.t('requests.routeDays.columns.failed'),
      median: i18n.t('requests.routeDays.columns.median'),
      p95: i18n.t('requests.routeDays.columns.p95'),
    },
  };
}
