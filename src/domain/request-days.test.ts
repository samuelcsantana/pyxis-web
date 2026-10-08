import { describe, expect, it } from 'vitest';
import {
  failureClassLabel,
  failureDayRows,
  failureDaysSummary,
  failureTotals,
  type RequestDay,
} from './request-days';
import { english } from '@/test-utils/english';

const DAYS: readonly RequestDay[] = [
  {
    date: '2026-10-04',
    byStatusClass: { success: 40, clientError: 3, serverError: 1, noResponse: 0 },
  },
  {
    date: '2026-10-05',
    byStatusClass: { success: 50, clientError: 0, serverError: 0, noResponse: 2 },
  },
];

describe('failureDayRows', () => {
  it('keeps the failures of each day, by what went wrong, with their total', () => {
    expect(failureDayRows(DAYS)).toEqual([
      { date: '2026-10-04', clientError: 3, serverError: 1, noResponse: 0, total: 4 },
      { date: '2026-10-05', clientError: 0, serverError: 0, noResponse: 2, total: 2 },
    ]);
  });

  it('adds the failures of the period up by what went wrong', () => {
    expect(failureTotals(failureDayRows(DAYS))).toEqual({
      clientError: 3,
      serverError: 1,
      noResponse: 2,
    });
  });
});

describe('failureDaysSummary', () => {
  it('describes the chart in words for a screen reader', () => {
    expect(failureDaysSummary(failureDayRows(DAYS), english)).toBe(
      'Stacked bar chart of 2 days, between 2 and 4 failures a day. By what went wrong: ' +
        'Client errors (4xx) 3, Server errors (5xx) 1, No response 2.',
    );
  });

  it('names each kind of failure', () => {
    expect(failureClassLabel('noResponse', english)).toBe('No response');
  });
});
