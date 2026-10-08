import { describe, expect, it } from 'vitest';
import type { OverviewReport } from './overview';
import { overviewCsvTable } from './overview-export';

function kpi(daily: number[]) {
  return { current: 0, previous: 0, daily };
}

const REPORT: OverviewReport = {
  kpis: {
    visits: kpi([12, 9]),
    identifiedUsers: kpi([3, 2]),
    conversions: kpi([4, 1]),
    convertingVisits: kpi([3, 1]),
    writeErrors: {
      current: { failed: 0, total: 0 },
      previous: { failed: 0, total: 0 },
      daily: [
        { failed: 1, total: 20 },
        { failed: 0, total: 14 },
      ],
    },
  },
  days: [
    { date: '2026-10-05', pageViews: 40, events: 18 },
    { date: '2026-10-06', pageViews: 31, events: 11 },
  ],
  topPages: [{ path: '/pricing', views: 25, visits: 14 }],
  topEvents: [{ name: 'signup_completed', count: 5, visits: 4 }],
  comparison: { kind: 'whole-days' },
  previousDays: null,
};

describe('overviewCsvTable', () => {
  it('writes one row per day with every daily figure of the cards', () => {
    expect(overviewCsvTable(REPORT, 'daily')).toEqual({
      columns: [
        'date',
        'page_views',
        'events',
        'visits',
        'identified_users',
        'conversion_events',
        'converting_visits',
        'write_requests',
        'failed_writes',
      ],
      rows: [
        ['2026-10-05', 40, 18, 12, 3, 4, 3, 20, 1],
        ['2026-10-06', 31, 11, 9, 2, 1, 1, 14, 0],
      ],
    });
  });

  it('leaves the conversion columns out for a project without a conversion event', () => {
    const table = overviewCsvTable(
      { ...REPORT, kpis: { ...REPORT.kpis, conversions: null, convertingVisits: null } },
      'daily',
    );

    expect(table.columns).toEqual([
      'date',
      'page_views',
      'events',
      'visits',
      'identified_users',
      'write_requests',
      'failed_writes',
    ]);
    expect(table.rows[0]).toEqual(['2026-10-05', 40, 18, 12, 3, 20, 1]);
  });

  it('leaves a cell empty when a daily figure is missing for a day', () => {
    const table = overviewCsvTable(
      { ...REPORT, kpis: { ...REPORT.kpis, visits: kpi([12]) } },
      'daily',
    );

    expect(table.rows[1]?.[3]).toBeNull();
  });

  it('writes the top pages with their page views and visits', () => {
    expect(overviewCsvTable(REPORT, 'pages')).toEqual({
      columns: ['path', 'page_views', 'visits'],
      rows: [['/pricing', 25, 14]],
    });
  });

  it('writes the top events under the name the site sent', () => {
    expect(overviewCsvTable(REPORT, 'events')).toEqual({
      columns: ['event', 'count', 'visits'],
      rows: [['signup_completed', 5, 4]],
    });
  });
});
