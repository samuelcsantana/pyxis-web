import { describe, expect, it } from 'vitest';
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';
import type { OverviewReport } from './overview';
import { landingPreviewOf, previewChartOf } from './landing-preview';

function kpi(current: number, previous: number, daily: number[]) {
  return { current, previous, daily };
}

const PREVIOUS_DAY = {
  date: '2026-09-10',
  pageViews: 10,
  events: 4,
  identifiedUsers: 1,
  conversions: 0,
  convertingVisits: 0,
  writeErrors: { failed: 0, total: 3 },
};

const REPORT: OverviewReport = {
  kpis: {
    visits: kpi(3214, 2870, [100, 120, 140]),
    identifiedUsers: kpi(418, 398, [12, 14, 16]),
    conversions: kpi(96, 81, [3, 4, 5]),
    convertingVisits: kpi(90, 77, [3, 4, 5]),
    writeErrors: {
      current: { failed: 4, total: 1000 },
      previous: { failed: 7, total: 1000 },
      daily: [{ failed: 1, total: 300 }],
    },
  },
  days: [{ date: '2026-10-11', pageViews: 400, events: 120 }],
  topPages: [
    { path: '/pricing', views: 1284, visits: 700 },
    { path: '/blog/:slug', views: 642, visits: 400 },
    { path: '/calculator', views: 321, visits: 200 },
    { path: '/orders', views: 100, visits: 50 },
  ],
  topEvents: [],
  comparison: { kind: 'whole-days' },
  previousDays: [
    { ...PREVIOUS_DAY, visits: 90 },
    { ...PREVIOUS_DAY, visits: 80 },
    { ...PREVIOUS_DAY, visits: 200 },
  ],
};

const PERIOD = { preset: '30d', from: '2026-09-14', to: '2026-10-13' } as const;

describe('landingPreviewOf', () => {
  it('shows the Overview figures of the demo, as the Overview screen words them', () => {
    const view = landingPreviewOf(REPORT, PERIOD, '2026-10-14', 'signup_completed', english);

    expect(view.kpis.map((each) => [each.label, each.value])).toEqual([
      ['Visits', '3,214'],
      ['Identified users', '418'],
      ['Conversions', '90'],
      ['Write error rate', '0.4%'],
    ]);
    expect(view.current).toEqual([100, 120, 140]);
    expect(view.previous).toEqual([90, 80, 200]);
  });

  it('keeps the three most viewed pages, each sized against the first', () => {
    const view = landingPreviewOf(REPORT, PERIOD, '2026-10-14', 'signup_completed', portuguese);

    expect(view.topPages).toEqual([
      { path: '/pricing', views: '1.284', share: 1 },
      { path: '/blog/:slug', views: '642', share: 0.5 },
      { path: '/calculator', views: '321', share: 0.25 },
    ]);
  });

  it('draws no previous period when the report has none, and no conversions without an event', () => {
    const view = landingPreviewOf(
      { ...REPORT, previousDays: null, topPages: [] },
      PERIOD,
      '2026-10-13',
      null,
      english,
    );

    expect(view.previous).toEqual([]);
    expect(view.topPages).toEqual([]);
    expect(view.kpis.map((each) => each.id)).not.toContain('conversions');
  });
});

describe('previewChartOf', () => {
  const BOX = { width: 300, height: 100, top: 10 };

  it('places both periods on one scale, the highest value at the top', () => {
    const chart = previewChartOf([0, 100, 50], [200, 0], BOX);

    expect(chart.current).toBe('0,100 150,55 300,77.5');
    expect(chart.previous).toBe('0,10 300,100');
    expect(chart.area).toBe('0,100 150,55 300,77.5 300,100 0,100');
    expect(chart.end).toEqual({ x: 300, y: 77.5 });
  });

  it('draws nothing without values, and never divides by zero', () => {
    expect(previewChartOf([], [], BOX)).toEqual({
      current: '',
      previous: '',
      area: '',
      end: null,
    });
    expect(previewChartOf([0], [], BOX).current).toBe('0,100');
  });
});
