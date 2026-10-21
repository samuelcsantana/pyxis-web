import { describe, expect, it } from 'vitest';
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';
import type { FunnelReport, FunnelStep } from './funnel';
import {
  type LandingPreviewReports,
  landingPreviewOf,
  mostFailingWrite,
  previewChartOf,
} from './landing-preview';
import type { OverviewReport } from './overview';
import type { RequestsReport, RouteReport } from './requests';

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

const STEPS: readonly FunnelStep[] = [
  { type: 'page', path: '/calculator' },
  { type: 'event', name: 'calculator_result_shown' },
  { type: 'page', path: '/sign-up' },
  { type: 'event', name: 'signup_completed' },
];

function funnelOf(...counts: number[]): FunnelReport {
  return {
    steps: counts.map((count) => ({ count, medianSecondsFromPrevious: null })),
    medianSecondsOverall: null,
  };
}

function route(method: string, path: string, total: number, failed: number): RouteReport {
  return {
    method,
    route: path,
    total,
    failed,
    statuses: [],
    medianDurationMs: 120,
    p95DurationMs: null,
    screens: [],
    recentFailures: [],
  };
}

function writesOf(...routes: RouteReport[]): RequestsReport {
  return { routes, days: [], routeDays: null };
}

const REPORTS: LandingPreviewReports = {
  overview: REPORT,
  funnelSteps: STEPS,
  funnel: funnelOf(1000, 800, 120, 60),
  writes: writesOf(
    route('POST', '/orders', 1600, 40),
    route('POST', '/payouts', 140, 14),
    route('POST', '/auth/sign-up', 590, 0),
  ),
};

describe('landingPreviewOf', () => {
  it('shows the Overview figures of the demo, as the Overview screen words them', () => {
    const view = landingPreviewOf(REPORTS, PERIOD, '2026-10-14', 'signup_completed', english);

    expect(view.kpis.map((each) => [each.label, each.value])).toEqual([
      ['Visits', '3,214'],
      ['Identified users', '418'],
      ['Conversions', '90'],
      ['Write error rate', '0.4%'],
    ]);
    expect(view.current).toEqual([100, 120, 140]);
    expect(view.previous).toEqual([90, 80, 200]);
  });

  it('names the funnel step that loses the most people, as the Funnel screen counts it', () => {
    const view = landingPreviewOf(REPORTS, PERIOD, '2026-10-14', 'signup_completed', english);

    expect(view.dropOff).toEqual({
      subject: 'calculator_result_shown → /sign-up',
      value: '15.0% continued',
      share: 0.15,
    });
  });

  it('names the write that fails most often, by its share of failures, in the page language', () => {
    const view = landingPreviewOf(REPORTS, PERIOD, '2026-10-14', 'signup_completed', portuguese);

    expect(view.failingWrite).toEqual({
      subject: 'POST /payouts',
      value: '10,0% falharam',
      share: 0.1,
    });
  });

  it('draws no previous period when the report has none, and no conversions without an event', () => {
    const view = landingPreviewOf(
      { ...REPORTS, overview: { ...REPORT, previousDays: null } },
      PERIOD,
      '2026-10-13',
      null,
      english,
    );

    expect(view.previous).toEqual([]);
    expect(view.kpis.map((each) => each.id)).not.toContain('conversions');
  });

  it.each([
    ['a funnel of one step', STEPS.slice(0, 1), funnelOf(1000)],
    ['a funnel nobody started', STEPS, funnelOf(0, 0, 0, 0)],
  ] as const)('shows no drop-off for %s', (_case, steps, funnel) => {
    const view = landingPreviewOf(
      { ...REPORTS, funnelSteps: steps, funnel },
      PERIOD,
      '2026-10-14',
      null,
      english,
    );

    expect(view.dropOff).toBeNull();
  });

  it('shows no failing write when every write succeeded', () => {
    const view = landingPreviewOf(
      { ...REPORTS, writes: writesOf(route('POST', '/orders', 1600, 0)) },
      PERIOD,
      '2026-10-14',
      null,
      english,
    );

    expect(view.failingWrite).toBeNull();
  });
});

describe('mostFailingWrite', () => {
  it('breaks a tie of shares by the number of failures, then by the route', () => {
    const tied = [
      route('PUT', '/settings', 20, 2),
      route('POST', '/orders', 200, 20),
      route('DELETE', '/orders/:id', 200, 20),
    ];

    expect(mostFailingWrite(tied)?.route).toBe('/orders/:id');
    expect(mostFailingWrite(tied.slice(0, 2))?.route).toBe('/orders');
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
