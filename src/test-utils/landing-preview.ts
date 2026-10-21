import { type DigestPreviewView, digestPreviewOf } from '@/domain/digest-preview';
import type { FunnelStep } from '@/domain/funnel';
import { type LandingPreviewView, landingPreviewOf } from '@/domain/landing-preview';
import type { OverviewReport } from '@/domain/overview';
import type { RouteReport } from '@/domain/requests';
import type { I18n } from '@/i18n/i18n';

const DAYS = 30;
const PERIOD = { preset: '30d', from: '2026-09-14', to: '2026-10-13' } as const;
const TODAY = '2026-10-14';

function wave(base: number, rise: number): number[] {
  return Array.from({ length: DAYS }, (_, day) =>
    Math.round((base + day * rise) * (day % 7 >= 5 ? 0.72 : 1)),
  );
}

const PREVIOUS_DAY = {
  date: '2026-08-15',
  pageViews: 300,
  events: 90,
  identifiedUsers: 12,
  conversions: 3,
  convertingVisits: 3,
  writeErrors: { failed: 0, total: 40 },
};

export const SHOWCASE_OVERVIEW: OverviewReport = {
  kpis: {
    visits: { current: 3214, previous: 2870, daily: wave(92, 1.3) },
    identifiedUsers: { current: 418, previous: 398, daily: wave(12, 0.1) },
    conversions: { current: 96, previous: 81, daily: wave(3, 0.05) },
    convertingVisits: { current: 96, previous: 81, daily: wave(3, 0.05) },
    writeErrors: {
      current: { failed: 4, total: 1000 },
      previous: { failed: 7, total: 1000 },
      daily: [{ failed: 4, total: 1000 }],
    },
  },
  days: [{ date: PERIOD.to, pageViews: 410, events: 130 }],
  topPages: [
    { path: '/pricing', views: 1284, visits: 700 },
    { path: '/blog/:slug', views: 962, visits: 512 },
    { path: '/calculator', views: 731, visits: 402 },
  ],
  topEvents: [],
  comparison: { kind: 'whole-days' },
  previousDays: wave(84, 0.6).map((visits) => ({ ...PREVIOUS_DAY, visits })),
};

const SHOWCASE_STEPS: readonly FunnelStep[] = [
  { type: 'page', path: '/calculator' },
  { type: 'page', path: '/sign-up' },
  { type: 'event', name: 'signup_completed' },
  { type: 'event', name: 'order_created' },
];

function write(path: string, total: number, failed: number): RouteReport {
  return {
    method: 'POST',
    route: path,
    total,
    failed,
    statuses: [],
    medianDurationMs: 180,
    p95DurationMs: null,
    screens: [],
    recentFailures: [],
  };
}

export function showcasePreview(i18n: I18n): LandingPreviewView {
  return landingPreviewOf(
    {
      overview: SHOWCASE_OVERVIEW,
      funnelSteps: SHOWCASE_STEPS,
      funnel: {
        steps: [864, 113, 42, 4].map((count) => ({ count, medianSecondsFromPrevious: null })),
        medianSecondsOverall: null,
      },
      writes: {
        routes: [write('/orders', 640, 16), write('/payouts', 59, 6)],
        days: [],
        routeDays: null,
      },
    },
    PERIOD,
    TODAY,
    'signup_completed',
    i18n,
  );
}

const DIGEST_WEEK = { from: '2026-10-12', to: '2026-10-18' } as const;

export function showcaseDigest(i18n: I18n): DigestPreviewView {
  return digestPreviewOf(
    {
      project: i18n.t('demo.projectNames.store'),
      timeZone: 'America/Sao_Paulo',
      week: DIGEST_WEEK,
      overview: {
        ...SHOWCASE_OVERVIEW,
        kpis: {
          ...SHOWCASE_OVERVIEW.kpis,
          visits: { current: 642, previous: 617, daily: [98, 104, 96, 91, 87, 79, 87] },
          identifiedUsers: { current: 84, previous: 78, daily: [] },
          convertingVisits: { current: 29, previous: 27, daily: [] },
          writeErrors: {
            current: { failed: 9, total: 447 },
            previous: { failed: 6, total: 430 },
            daily: [],
          },
        },
      },
      writes: {
        routes: [write('/orders', 162, 4), write('/payouts', 14, 3), write('/auth/sign-up', 59, 2)],
        days: [],
        routeDays: null,
      },
    },
    i18n,
  );
}
