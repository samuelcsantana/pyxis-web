import {
  type Lookup,
  type TimelineReport,
  timelineResponseSchema,
  type TimelineWire,
} from '@/domain/timeline';

export const DEMO_USER_ID = 'u_7f3a';

type Properties = Readonly<Record<string, string | number | boolean>>;

interface DemoEvent {
  readonly second: number;
  readonly name: string;
  readonly path: string;
  readonly properties?: Properties;
}

interface DemoVisit {
  readonly sessionId: string;
  readonly daysAgo: number;
  readonly startHour: number;
  readonly startMinute: number;
  readonly deviceType: string;
  readonly browser: string;
  readonly os: string;
  readonly channel: 'paid' | 'direct';
  readonly events: readonly DemoEvent[];
}

const MILLISECONDS_PER_DAY = 86_400_000;
const MILLISECONDS_PER_SECOND = 1000;

function request(
  method: string,
  route: string,
  status: number,
  durationMs: number,
  errorCode?: string,
): Properties {
  return {
    method,
    route,
    status,
    duration_ms: durationMs,
    ...(errorCode === undefined ? {} : { error_code: errorCode }),
  };
}

const DEMO_VISITS: readonly DemoVisit[] = [
  {
    sessionId: '3c07a1b2-6d4e-4f10-9a2b-5c8d7e6f1a01',
    daysAgo: 1,
    startHour: 21,
    startMinute: 40,
    deviceType: 'desktop',
    browser: 'chrome',
    os: 'windows',
    channel: 'direct',
    events: [
      { second: 12, name: 'page_view', path: '/orders' },
      {
        second: 65,
        name: 'api_request',
        path: '/orders',
        properties: request('POST', '/orders', 409, 140, 'order_number_in_use'),
      },
      {
        second: 90,
        name: 'api_request',
        path: '/orders',
        properties: request('POST', '/orders', 201, 158),
      },
      { second: 91, name: 'order_created', path: '/orders' },
    ],
  },
  {
    sessionId: '2a81c3d4-5e6f-4a70-8b91-0c1d2e3f4a02',
    daysAgo: 3,
    startHour: 12,
    startMinute: 12,
    deviceType: 'mobile',
    browser: 'chrome',
    os: 'android',
    channel: 'direct',
    events: [
      { second: 4, name: 'page_view', path: '/dashboard' },
      { second: 100, name: 'page_view', path: '/products' },
      {
        second: 182,
        name: 'api_request',
        path: '/products',
        properties: request('POST', '/products', 201, 168),
      },
      { second: 183, name: 'product_created', path: '/products' },
      { second: 407, name: 'page_view', path: '/orders' },
      {
        second: 450,
        name: 'api_request',
        path: '/orders',
        properties: request('POST', '/orders', 201, 152),
      },
      { second: 451, name: 'order_created', path: '/orders', properties: { first: true } },
    ],
  },
  {
    sessionId: '19c2e5f6-a7b8-4c90-9d01-2e3f4a5b6c03',
    daysAgo: 4,
    startHour: 17,
    startMinute: 3,
    deviceType: 'mobile',
    browser: 'safari',
    os: 'ios',
    channel: 'paid',
    events: [
      { second: 10, name: 'page_view', path: '/calculator' },
      {
        second: 42,
        name: 'calculator_result_shown',
        path: '/calculator',
        properties: { calculator: 'ifood', used_plan_preset: true },
      },
      {
        second: 65,
        name: 'cta_clicked',
        path: '/calculator',
        properties: { cta: 'start_trial', location: 'calculator_result' },
      },
      { second: 66, name: 'page_view', path: '/sign-up' },
      {
        second: 141,
        name: 'signup_submitted',
        path: '/sign-up',
        properties: { method: 'email_code' },
      },
      {
        second: 141,
        name: 'api_request',
        path: '/sign-up',
        properties: request('POST', '/auth/sign-up', 200, 233),
      },
      {
        second: 178,
        name: 'api_request',
        path: '/sign-up',
        properties: request('POST', '/auth/verify-code', 400, 190, 'invalid_code'),
      },
      {
        second: 200,
        name: 'api_request',
        path: '/sign-up',
        properties: request('POST', '/auth/verify-code', 200, 201),
      },
      { second: 200, name: 'identify', path: '/sign-up' },
      {
        second: 201,
        name: 'signup_completed',
        path: '/sign-up',
        properties: { method: 'email_code' },
      },
      { second: 202, name: 'page_view', path: '/dashboard' },
    ],
  },
];

function visitStart(visit: DemoVisit, now: Date): number {
  const midnight = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return (
    midnight -
    visit.daysAgo * MILLISECONDS_PER_DAY +
    Date.UTC(1970, 0, 1, visit.startHour, visit.startMinute)
  );
}

function eventId(sessionId: string, index: number): string {
  return `${sessionId.slice(0, 24)}${String(index).padStart(12, '0')}`;
}

function demoVisitWire(visit: DemoVisit, now: Date) {
  const start = visitStart(visit, now);
  const at = (second: number) => new Date(start + second * MILLISECONDS_PER_SECOND).toISOString();
  const seconds = visit.events.map((event) => event.second);
  return {
    session_id: visit.sessionId,
    started_at: at(Math.min(...seconds)),
    ended_at: at(Math.max(...seconds)),
    device_type: visit.deviceType,
    browser: visit.browser,
    os: visit.os,
    country: 'BR',
    channel: visit.channel,
    events: visit.events.map((event, index) => ({
      id: eventId(visit.sessionId, index),
      occurred_at: at(event.second),
      name: event.name,
      path: event.path,
      properties: event.properties ?? {},
    })),
  };
}

function matchingVisits(lookup: Lookup): readonly DemoVisit[] {
  if (lookup.kind === 'user') {
    return lookup.id === DEMO_USER_ID ? DEMO_VISITS : [];
  }
  return DEMO_VISITS.filter((visit) => visit.sessionId === lookup.id);
}

export function demoTimelineWire(lookup: Lookup, now: Date): TimelineWire {
  return {
    visits: matchingVisits(lookup).map((visit) => demoVisitWire(visit, now)),
    next_before: null,
  };
}

export function demoTimelineReport(lookup: Lookup, now: Date): TimelineReport {
  return timelineResponseSchema.parse(demoTimelineWire(lookup, now));
}
