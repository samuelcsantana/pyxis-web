import { type ScreenSearch, screenSearchOf } from '@/components/shell/screen-search';
import { featureKindOf } from '@/domain/features';
import { type FunnelStep, funnelModeOf } from '@/domain/funnel';
import { funnelStepsOf } from '@/domain/funnel.schema';
import { funnelSegmentDimensionOf } from '@/domain/funnel-segments';
import {
  demoExampleFunnel,
  demoFunnelSegmentsWire,
  demoFunnelWire,
} from '@/services/funnel/demo-funnel';
import { demoEngagementWire } from '@/services/features/demo-engagement';
import { demoFeaturesWire } from '@/services/features/demo-features';
import { dashboardFiltersOf } from '@/domain/dashboard-filters';
import type { I18n } from '@/i18n/i18n';
import { demoAcquisitionWire } from '@/services/acquisition/demo-acquisition';
import { demoDevicesWire } from '@/services/devices/demo-devices';
import { demoGoalsSummaryWire, demoGoalsWire } from '@/services/demo/demo-goals';
import { DEMO_STORE, demoProjectNameOf, demoProjectOf } from '@/services/demo/demo-projects';
import type { DemoReportRange } from '@/services/demo/demo-scope';
import { demoOverviewWire } from '@/services/overview/demo-overview';
import { demoTimeOfDayWire } from '@/services/overview/demo-time-of-day';
import {
  DEMO_PROTECTED_SHARE_TOKEN,
  DEMO_SHARE_PASSWORD,
  DEMO_SHARE_TOKEN,
  DEMO_SHARE_UNLOCK,
} from '@/services/share-links/mock-share-links-service';

export const SHARE_LINK_NOT_FOUND = {
  status_code: 404,
  error: 'share_link_not_found',
  message: 'No open share link has this token or id.',
} as const;

export const SHARED_QUERY_REFUSED = {
  status_code: 400,
  error: 'invalid_query',
  message: 'A shared report needs from and to, and takes no identity or property filter.',
} as const;

export const SHARE_PASSWORD_REQUIRED = {
  status_code: 401,
  error: 'share_password_required',
  message: 'This share link has a password: unlock it first.',
} as const;

export const WRONG_SHARE_PASSWORD = {
  status_code: 401,
  error: 'wrong_share_password',
  message: 'This is not the password of this share link.',
} as const;

export const SHARE_PASSWORD_NOT_SET = {
  status_code: 409,
  error: 'share_password_not_set',
  message: 'This share link has no password.',
} as const;

const PASSWORD_REQUIRED_CARD = { password_required: true } as const;
const DEMO_UNLOCK_LIFETIME_MS = 8 * 60 * 60 * 1000;

const REFUSED_PARAMETERS = ['identity', 'property'] as const;

type DemoReport = (range: DemoReportRange, search: ScreenSearch, now: Date) => unknown;

function demoStepsOf(search: ScreenSearch): readonly FunnelStep[] {
  return funnelStepsOf(search) ?? demoExampleFunnel(DEMO_STORE.id);
}

function firstValue(value: string | readonly string[] | undefined): string | undefined {
  return typeof value === 'string' ? value : value?.[0];
}

const REPORTS: Readonly<Record<string, DemoReport>> = {
  overview: (range, _search, now) => demoOverviewWire(DEMO_STORE.id, range, now),
  'time-of-day': (range, _search, now) => demoTimeOfDayWire(DEMO_STORE.id, range, now),
  'goals/summary': (range, _search, now) => demoGoalsSummaryWire(DEMO_STORE.id, range, now),
  acquisition: (range, _search, now) => demoAcquisitionWire(DEMO_STORE.id, range, now),
  devices: (range, _search, now) => demoDevicesWire(DEMO_STORE.id, range, now),
  features: (range, search, now) =>
    demoFeaturesWire(DEMO_STORE.id, range, featureKindOf(search), now),
  engagement: (range, _search, now) => demoEngagementWire(DEMO_STORE.id, range, now),
  funnel: (range, search, now) =>
    demoFunnelWire(DEMO_STORE.id, range, funnelModeOf(search), demoStepsOf(search), now),
  'funnel/segments': (range, search, now) =>
    demoFunnelSegmentsWire(
      DEMO_STORE.id,
      range,
      demoStepsOf(search),
      funnelSegmentDimensionOf(firstValue(search.by)),
      now,
    ),
};

export type DemoSharedAnswer =
  | { readonly status: 200; readonly body: unknown }
  | { readonly status: 400; readonly body: typeof SHARED_QUERY_REFUSED }
  | { readonly status: 401; readonly body: typeof SHARE_PASSWORD_REQUIRED }
  | { readonly status: 404; readonly body: typeof SHARE_LINK_NOT_FOUND };

export type DemoUnlockAnswer =
  | {
      readonly status: 200;
      readonly body: { readonly unlock: string; readonly expires_at: string };
    }
  | { readonly status: 401; readonly body: typeof WRONG_SHARE_PASSWORD }
  | { readonly status: 404; readonly body: typeof SHARE_LINK_NOT_FOUND }
  | { readonly status: 409; readonly body: typeof SHARE_PASSWORD_NOT_SET };

function isDemoToken(token: string): boolean {
  return token === DEMO_SHARE_TOKEN || token === DEMO_PROTECTED_SHARE_TOKEN;
}

function isLocked(token: string, unlock: string | null): boolean {
  return token === DEMO_PROTECTED_SHARE_TOKEN && unlock !== DEMO_SHARE_UNLOCK;
}

export function demoUnlockAnswer(token: string, password: unknown, now: Date): DemoUnlockAnswer {
  if (!isDemoToken(token)) {
    return { status: 404, body: SHARE_LINK_NOT_FOUND };
  }
  if (token === DEMO_SHARE_TOKEN) {
    return { status: 409, body: SHARE_PASSWORD_NOT_SET };
  }
  if (password !== DEMO_SHARE_PASSWORD) {
    return { status: 401, body: WRONG_SHARE_PASSWORD };
  }
  return {
    status: 200,
    body: {
      unlock: DEMO_SHARE_UNLOCK,
      expires_at: new Date(now.getTime() + DEMO_UNLOCK_LIFETIME_MS).toISOString(),
    },
  };
}

function demoCardWire(i18n: I18n) {
  const project = demoProjectOf(DEMO_STORE.id);
  return {
    password_required: false,
    project: {
      name: demoProjectNameOf(project, i18n.t),
      timezone: project.timezone,
      currency: project.currency,
      city_enabled: true,
      visitors_enabled: project.countsUniqueVisitors,
    },
    goals: demoGoalsWire(project.id).goals,
    expires_at: null,
  };
}

function rangeOf(parameters: URLSearchParams, i18n: I18n): DemoReportRange | null {
  const from = parameters.get('from');
  const to = parameters.get('to');
  if (from === null || to === null) {
    return null;
  }
  return {
    from,
    to,
    filters: dashboardFiltersOf(screenSearchOf(parameters), i18n).filters,
    goal: parameters.get('goal'),
  };
}

export function demoSharedAnswer(
  token: string,
  report: readonly string[],
  parameters: URLSearchParams,
  i18n: I18n,
  now: Date,
  unlock: string | null,
): DemoSharedAnswer {
  if (!isDemoToken(token)) {
    return { status: 404, body: SHARE_LINK_NOT_FOUND };
  }
  if (report.length === 0) {
    return {
      status: 200,
      body: isLocked(token, unlock) ? PASSWORD_REQUIRED_CARD : demoCardWire(i18n),
    };
  }
  if (isLocked(token, unlock)) {
    return { status: 401, body: SHARE_PASSWORD_REQUIRED };
  }
  const answer = REPORTS[report.join('/')];
  if (answer === undefined) {
    return { status: 404, body: SHARE_LINK_NOT_FOUND };
  }
  const range = rangeOf(parameters, i18n);
  if (range === null || REFUSED_PARAMETERS.some((name) => parameters.has(name))) {
    return { status: 400, body: SHARED_QUERY_REFUSED };
  }
  return { status: 200, body: answer(range, screenSearchOf(parameters), now) };
}
