type Properties = Readonly<Record<string, string | number | boolean>>;

interface DemoRequest {
  readonly method: string;
  readonly route: string;
  readonly status: number;
  readonly durationMs: number;
  readonly errorCode?: string;
}

interface DemoNamedEvent {
  readonly second: number;
  readonly name: string;
  readonly path: string;
  readonly properties?: Properties;
}

interface DemoRequestEvent {
  readonly second: number;
  readonly path: string;
  readonly request: DemoRequest;
}

type DemoEvent = DemoNamedEvent | DemoRequestEvent;

export interface DemoVisit {
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

export interface DemoFailedRequest {
  readonly method: string;
  readonly route: string;
  readonly occurredAt: string;
  readonly status: number;
  readonly errorCode: string | null;
  readonly sessionId: string;
}

const API_REQUEST_EVENT = 'api_request';
const NO_RESPONSE_STATUS = 0;
const FIRST_FAILING_STATUS = 400;
const MILLISECONDS_PER_DAY = 86_400_000;
const MILLISECONDS_PER_SECOND = 1000;

function request(second: number, path: string, demoRequest: DemoRequest): DemoRequestEvent {
  return { second, path, request: demoRequest };
}

export const DEMO_PERSON_VISITS: readonly DemoVisit[] = [
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
      request(65, '/orders', {
        method: 'POST',
        route: '/orders',
        status: 409,
        durationMs: 140,
        errorCode: 'order_number_in_use',
      }),
      request(90, '/orders', { method: 'POST', route: '/orders', status: 201, durationMs: 158 }),
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
      request(182, '/products', {
        method: 'POST',
        route: '/products',
        status: 201,
        durationMs: 168,
      }),
      { second: 183, name: 'product_created', path: '/products' },
      { second: 407, name: 'page_view', path: '/orders' },
      request(450, '/orders', { method: 'POST', route: '/orders', status: 201, durationMs: 152 }),
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
      request(141, '/sign-up', {
        method: 'POST',
        route: '/auth/sign-up',
        status: 200,
        durationMs: 233,
      }),
      request(178, '/sign-up', {
        method: 'POST',
        route: '/auth/verify-code',
        status: 400,
        durationMs: 190,
        errorCode: 'invalid_code',
      }),
      request(200, '/sign-up', {
        method: 'POST',
        route: '/auth/verify-code',
        status: 200,
        durationMs: 201,
      }),
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

const DEMO_FAILURE_VISITS: readonly DemoVisit[] = [
  {
    sessionId: 'a1fa5f88-c22d-4719-8fc0-c7d1fc8cd06f',
    daysAgo: 2,
    startHour: 11,
    startMinute: 1,
    deviceType: 'desktop',
    browser: 'firefox',
    os: 'linux',
    channel: 'direct',
    events: [
      { second: 3, name: 'page_view', path: '/orders' },
      { second: 24, name: 'page_view', path: '/orders/new' },
      request(61, '/orders/new', {
        method: 'POST',
        route: '/orders',
        status: 400,
        durationMs: 131,
        errorCode: 'invalid_quantity',
      }),
      request(88, '/orders/new', {
        method: 'POST',
        route: '/orders',
        status: 201,
        durationMs: 149,
      }),
      { second: 89, name: 'order_created', path: '/orders/new' },
    ],
  },
  {
    sessionId: 'd073f2ad-11c2-470a-8097-fb6f6173e8ae',
    daysAgo: 3,
    startHour: 15,
    startMinute: 59,
    deviceType: 'desktop',
    browser: 'edge',
    os: 'windows',
    channel: 'direct',
    events: [
      { second: 6, name: 'page_view', path: '/orders' },
      request(52, '/orders', { method: 'POST', route: '/orders', status: 409, durationMs: 152 }),
      request(80, '/orders', { method: 'POST', route: '/orders', status: 201, durationMs: 160 }),
      { second: 81, name: 'order_created', path: '/orders' },
    ],
  },
  {
    sessionId: '6d4ebf3d-222b-4591-8333-dc3a273941e2',
    daysAgo: 5,
    startHour: 10,
    startMinute: 19,
    deviceType: 'mobile',
    browser: 'chrome',
    os: 'android',
    channel: 'direct',
    events: [
      { second: 2, name: 'page_view', path: '/orders' },
      { second: 19, name: 'page_view', path: '/orders/:id' },
      request(44, '/orders/:id', {
        method: 'PATCH',
        route: '/orders/:id',
        status: 400,
        durationMs: 118,
        errorCode: 'invalid_status',
      }),
      request(63, '/orders/:id', {
        method: 'PATCH',
        route: '/orders/:id',
        status: 200,
        durationMs: 126,
      }),
    ],
  },
  {
    sessionId: '506cf1d6-18b8-4b20-87a4-8ba68956bf5b',
    daysAgo: 1,
    startHour: 9,
    startMinute: 30,
    deviceType: 'mobile',
    browser: 'safari',
    os: 'ios',
    channel: 'paid',
    events: [
      { second: 4, name: 'page_view', path: '/sign-up' },
      request(38, '/sign-up', {
        method: 'POST',
        route: '/auth/sign-up',
        status: 429,
        durationMs: 88,
        errorCode: 'too_many_requests',
      }),
      request(95, '/sign-up', {
        method: 'POST',
        route: '/auth/sign-up',
        status: 201,
        durationMs: 231,
      }),
      {
        second: 95,
        name: 'signup_submitted',
        path: '/sign-up',
        properties: { method: 'email_code' },
      },
    ],
  },
  {
    sessionId: '0645362d-d2d2-45ad-8a3d-4336e79a39c3',
    daysAgo: 2,
    startHour: 20,
    startMinute: 14,
    deviceType: 'desktop',
    browser: 'chrome',
    os: 'macos',
    channel: 'paid',
    events: [
      { second: 3, name: 'page_view', path: '/sign-up' },
      request(47, '/sign-up', {
        method: 'POST',
        route: '/auth/sign-up',
        status: 400,
        durationMs: 102,
        errorCode: 'invalid_email',
      }),
      request(71, '/sign-up', {
        method: 'POST',
        route: '/auth/sign-up',
        status: 201,
        durationMs: 229,
      }),
      {
        second: 71,
        name: 'signup_submitted',
        path: '/sign-up',
        properties: { method: 'email_code' },
      },
    ],
  },
  {
    sessionId: '94810767-edf6-4a05-833f-ca28d9e18bbf',
    daysAgo: 4,
    startHour: 11,
    startMinute: 59,
    deviceType: 'desktop',
    browser: 'chrome',
    os: 'windows',
    channel: 'direct',
    events: [
      { second: 5, name: 'page_view', path: '/payouts' },
      request(60, '/payouts', {
        method: 'POST',
        route: '/payouts',
        status: 500,
        durationMs: 1840,
        errorCode: 'internal_error',
      }),
    ],
  },
  {
    sessionId: '930c9810-9f74-4071-8fab-a9a84e220a9f',
    daysAgo: 4,
    startHour: 11,
    startMinute: 44,
    deviceType: 'desktop',
    browser: 'chrome',
    os: 'windows',
    channel: 'direct',
    events: [
      { second: 4, name: 'page_view', path: '/payouts' },
      request(56, '/payouts', { method: 'POST', route: '/payouts', status: 0, durationMs: 8000 }),
      request(90, '/payouts', { method: 'POST', route: '/payouts', status: 201, durationMs: 398 }),
    ],
  },
];

export const DEMO_VISITS: readonly DemoVisit[] = [...DEMO_PERSON_VISITS, ...DEMO_FAILURE_VISITS];

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

function requestProperties(demoRequest: DemoRequest): Properties {
  return {
    method: demoRequest.method,
    route: demoRequest.route,
    status: demoRequest.status,
    duration_ms: demoRequest.durationMs,
    ...(demoRequest.errorCode === undefined ? {} : { error_code: demoRequest.errorCode }),
  };
}

function eventWire(event: DemoEvent): { name: string; properties: Properties } {
  if ('request' in event) {
    return { name: API_REQUEST_EVENT, properties: requestProperties(event.request) };
  }
  return { name: event.name, properties: event.properties ?? {} };
}

function secondAfter(start: number, second: number): string {
  return new Date(start + second * MILLISECONDS_PER_SECOND).toISOString();
}

function failed(status: number): boolean {
  return status === NO_RESPONSE_STATUS || status >= FIRST_FAILING_STATUS;
}

export function demoFailedRequests(now: Date): readonly DemoFailedRequest[] {
  return DEMO_VISITS.flatMap((visit) => {
    const start = visitStart(visit, now);
    return visit.events.flatMap((event) =>
      'request' in event && failed(event.request.status)
        ? [
            {
              method: event.request.method,
              route: event.request.route,
              occurredAt: secondAfter(start, event.second),
              status: event.request.status,
              errorCode: event.request.errorCode ?? null,
              sessionId: visit.sessionId,
            },
          ]
        : [],
    );
  });
}

export function demoVisitWire(visit: DemoVisit, now: Date) {
  const start = visitStart(visit, now);
  const at = (second: number) => secondAfter(start, second);
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
    events: visit.events.map((event, index) => {
      const { name, properties } = eventWire(event);
      return {
        id: eventId(visit.sessionId, index),
        occurred_at: at(event.second),
        name,
        path: event.path,
        properties,
      };
    }),
  };
}
