import type { I18n } from '@/i18n/i18n';
import { formatCount } from './metrics';
import type { RequestsReport } from './requests';

export type RequestDay = RequestsReport['days'][number];

export const FAILURE_CLASSES = ['clientError', 'serverError', 'noResponse'] as const;
export type FailureClass = (typeof FAILURE_CLASSES)[number];

export type FailureCounts = Readonly<Record<FailureClass, number>>;

export interface FailureDayRow extends FailureCounts {
  readonly date: string;
  readonly total: number;
}

export function failureDayRows(days: readonly RequestDay[]): readonly FailureDayRow[] {
  return days.map((day) => ({
    date: day.date,
    clientError: day.byStatusClass.clientError,
    serverError: day.byStatusClass.serverError,
    noResponse: day.byStatusClass.noResponse,
    total: FAILURE_CLASSES.reduce((sum, failure) => sum + day.byStatusClass[failure], 0),
  }));
}

export function failureTotals(rows: readonly FailureDayRow[]): FailureCounts {
  return {
    clientError: rows.reduce((sum, row) => sum + row.clientError, 0),
    serverError: rows.reduce((sum, row) => sum + row.serverError, 0),
    noResponse: rows.reduce((sum, row) => sum + row.noResponse, 0),
  };
}

export function failureClassLabel(failure: FailureClass, i18n: I18n): string {
  return i18n.t(`requests.failureDays.classes.${failure}`);
}

export function failureDaysSummary(rows: readonly FailureDayRow[], i18n: I18n): string {
  const totals = failureTotals(rows);
  const daily = rows.map((row) => row.total);
  const classes = FAILURE_CLASSES.map((failure) =>
    i18n.t('requests.failureDays.summary.class', {
      label: failureClassLabel(failure, i18n),
      count: formatCount(totals[failure], i18n),
    }),
  );
  return [
    i18n.t('requests.failureDays.summary.bars', {
      days: i18n.t('counts.day', { count: rows.length }),
    }),
    i18n.t('requests.failureDays.summary.range', {
      lowest: formatCount(Math.min(...daily), i18n),
      highest: formatCount(Math.max(...daily), i18n),
    }),
    i18n.t('requests.failureDays.summary.classes', { classes: classes.join(', ') }),
  ].join(' ');
}
