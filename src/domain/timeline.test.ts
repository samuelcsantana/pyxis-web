import { describe, expect, it } from 'vitest';
import {
  formatVisitDuration,
  isFailedRequest,
  itemKind,
  lookupOf,
  lookupTitle,
  shortId,
  timelineFilterOf,
  type TimelineEvent,
  timelineTotals,
  type TimelineWire,
  USER_ID_PATTERN,
  visitViews,
} from './timeline';
import { timelineResponseSchema } from './timeline.schema';

const VISIT_ID = '3c07a1b2-0000-4000-8000-000000000001';

const WIRE: TimelineWire = {
  visits: [
    {
      session_id: VISIT_ID,
      started_at: '2026-10-05T21:40:00.000Z',
      ended_at: '2026-10-05T21:42:41.000Z',
      device_type: 'mobile',
      browser: 'samsung',
      os: 'android',
      country: 'BR',
      channel: 'paid',
      events: [
        {
          id: '00000000-0000-4000-8000-000000000001',
          occurred_at: '2026-10-05T21:40:00.000Z',
          name: 'page_view',
          path: '/calculator',
          properties: {},
        },
        {
          id: '00000000-0000-4000-8000-000000000002',
          occurred_at: '2026-10-05T21:40:30.000Z',
          name: 'calculator_result_shown',
          path: '/calculator',
          properties: { amount: 1200, monthly: true },
        },
        {
          id: '00000000-0000-4000-8000-000000000003',
          occurred_at: '2026-10-05T21:41:10.000Z',
          name: 'api_request',
          path: '/orders/new',
          properties: {
            method: 'POST',
            route: '/orders',
            status: 409,
            duration_ms: 164,
            error_code: 'order_number_in_use',
          },
        },
        {
          id: '00000000-0000-4000-8000-000000000004',
          occurred_at: '2026-10-05T21:41:50.000Z',
          name: 'api_request',
          path: '/orders/new',
          properties: { method: 'POST', route: '/orders', status: 201, duration_ms: 150 },
        },
        {
          id: '00000000-0000-4000-8000-000000000005',
          occurred_at: '2026-10-05T21:42:41.000Z',
          name: 'identify',
          path: '/sign-up',
          properties: {},
        },
      ],
    },
    {
      session_id: '2f90aaaa-0000-4000-8000-000000000002',
      started_at: '2026-10-04T12:00:00.000Z',
      ended_at: '2026-10-04T12:00:42.000Z',
      device_type: 'desktop',
      browser: 'chrome',
      os: 'macos',
      country: null,
      channel: null,
      events: [],
    },
  ],
  next_before: null,
};

const REPORT = timelineResponseSchema.parse(WIRE);
const EVENTS = REPORT.visits[0]?.events ?? [];

describe('lookupOf', () => {
  it('reads a visit id, a valid uuid, before a user id', () => {
    expect(lookupOf({ visit: VISIT_ID.toUpperCase(), user: 'u_7f3a' })).toEqual({
      kind: 'visit',
      id: VISIT_ID,
    });
    expect(lookupOf({ visit: 'v_3c07', user: ' u_7f3a ' })).toEqual({ kind: 'user', id: 'u_7f3a' });
  });

  it('ignores ids the API would refuse', () => {
    expect(USER_ID_PATTERN.source).toBe('^[A-Za-z0-9_-]{1,64}$');
    expect(lookupOf({ visit: '6512bd43-d9ca-a6e0-2c99-0b0a82652dca' })).toBeNull();
    expect(lookupOf({ user: 'ana@example.com' })).toBeNull();
    expect(lookupOf({ user: 'x'.repeat(65) })).toBeNull();
    expect(lookupOf({ user: ['a', 'b'] })).toBeNull();
    expect(lookupOf({})).toBeNull();
  });
});

describe('timelineFilterOf', () => {
  it('reads a known filter, all otherwise', () => {
    expect(timelineFilterOf({ show: 'errors' })).toBe('errors');
    expect(timelineFilterOf({ show: 'nonsense' })).toBe('all');
    expect(timelineFilterOf({})).toBe('all');
  });
});

describe('items', () => {
  it('tell pages, requests, the identify call and named events apart', () => {
    expect(EVENTS.map(itemKind)).toEqual(['page', 'event', 'request', 'request', 'identify']);
    expect(EVENTS.map(isFailedRequest)).toEqual([false, false, true, false, false]);
  });

  it('read like a story, in the time zone of the project', () => {
    const [visit, quiet] = visitViews(REPORT.visits, 'America/Sao_Paulo', 'all');

    expect(visit?.heading).toBe('Visit 3c07a1b2 · Mon, Oct 5, 18:40');
    expect(visit?.meta).toBe('Mobile · Samsung Internet · Android · Brazil · Paid · 2 min 41 s');
    expect(quiet?.meta).toBe('Desktop · Chrome · macOS · 42 s');
    expect(visit?.items).toEqual([
      {
        key: '00000000-0000-4000-8000-000000000001',
        time: '18:40:00',
        kind: 'page',
        title: 'Opened /calculator',
        detail: '',
        tag: null,
      },
      {
        key: '00000000-0000-4000-8000-000000000002',
        time: '18:40:30',
        kind: 'event',
        title: 'Calculator result shown',
        detail: '/calculator · amount=1200 · monthly=true',
        tag: null,
      },
      {
        key: '00000000-0000-4000-8000-000000000003',
        time: '18:41:10',
        kind: 'request',
        title: 'POST /orders',
        detail: 'status=409 · duration_ms=164 · error_code=order_number_in_use',
        tag: { label: '409', tone: 'client' },
      },
      {
        key: '00000000-0000-4000-8000-000000000004',
        time: '18:41:50',
        kind: 'request',
        title: 'POST /orders',
        detail: 'status=201 · duration_ms=150',
        tag: { label: '201', tone: 'success' },
      },
      {
        key: '00000000-0000-4000-8000-000000000005',
        time: '18:42:41',
        kind: 'identify',
        title: 'Visit linked to the user',
        detail: '',
        tag: null,
      },
    ]);
  });

  it('keep only the kind the filter asks for', () => {
    const titles = (filter: Parameters<typeof visitViews>[2]) =>
      visitViews(REPORT.visits, 'UTC', filter)[0]?.items.map((item) => item.kind);

    expect(titles('pages')).toEqual(['page']);
    expect(titles('events')).toEqual(['event', 'identify']);
    expect(titles('requests')).toEqual(['request', 'request']);
    expect(titles('errors')).toEqual(['request']);
  });

  it('ignore a request without a numeric status', () => {
    const odd: TimelineEvent = {
      id: '00000000-0000-4000-8000-000000000009',
      occurredAt: '2026-10-05T21:41:10.000Z',
      name: 'api_request',
      path: '/',
      properties: { method: 'POST', route: '/x', status: 'oops' },
    };

    expect(isFailedRequest(odd)).toBe(false);
  });
});

describe('totals and titles', () => {
  it('count the visits, events and failed requests shown', () => {
    expect(timelineTotals(REPORT.visits)).toEqual({
      visits: '2 visits',
      events: '5 events',
      failedRequests: '1 failed request',
      hasFailures: true,
    });
    expect(timelineTotals([]).hasFailures).toBe(false);
  });

  it('name the person or the visit looked up', () => {
    expect(lookupTitle({ kind: 'user', id: 'u_7f3a' })).toBe('User u_7f3a');
    expect(lookupTitle({ kind: 'visit', id: VISIT_ID })).toBe('Visit 3c07a1b2');
    expect(shortId(VISIT_ID)).toBe('3c07a1b2');
  });

  it('give a visit its length in minutes and seconds, never negative', () => {
    expect(formatVisitDuration('2026-10-05T10:00:00.000Z', '2026-10-05T10:00:09.000Z')).toBe('9 s');
    expect(formatVisitDuration('2026-10-05T10:00:00.000Z', '2026-10-05T09:59:00.000Z')).toBe('0 s');
    expect(formatVisitDuration('2026-10-05T10:00:00.000Z', '2026-10-05T12:05:30.000Z')).toBe(
      '2 h 5 min',
    );
  });
});
