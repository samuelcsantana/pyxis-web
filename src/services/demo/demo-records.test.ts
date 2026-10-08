import { describe, expect, it } from 'vitest';
import {
  demoVisitRecordWire,
  localDateAndTime,
  localMidnight,
  requestProperties,
  showcaseRecord,
  zoneOffset,
} from './demo-records';
import { type DemoVisit, request } from './demo-visits';

const HOUR = 3_600_000;
const NOW = new Date('2026-10-06T02:30:00.000Z');
const ATTRIBUTION = { source: 'google', medium: 'cpc', campaign: 'spring_sale' };

const VISIT: DemoVisit = {
  sessionId: '3c07a1b2-6d4e-4f10-9a2b-5c8d7e6f1a01',
  daysAgo: 1,
  startHour: 21,
  startMinute: 40,
  deviceType: 'desktop',
  browser: 'chrome',
  os: 'windows',
  country: 'BR',
  channel: 'paid',
  userId: 'u_7f3a',
  events: [
    { second: 12, name: 'page_view', path: '/orders' },
    request(65, '/orders', {
      method: 'POST',
      route: '/orders',
      status: 409,
      durationMs: 140,
      errorCode: 'order_number_in_use',
    }),
    { second: 91, name: 'order_created', path: '/orders', properties: { first: true } },
  ],
};

describe('zoneOffset', () => {
  it('measures how far a zone is from UTC at an instant, summer time included', () => {
    expect(zoneOffset('America/Sao_Paulo', Date.parse('2026-10-05T12:00:00.000Z'))).toBe(-3 * HOUR);
    expect(zoneOffset('Europe/Lisbon', Date.parse('2026-07-01T12:00:00.000Z'))).toBe(HOUR);
    expect(zoneOffset('Europe/Lisbon', Date.parse('2026-12-01T12:00:00.123Z'))).toBe(0);
  });
});

describe('localMidnight', () => {
  it('finds the instant a day starts in the zone', () => {
    expect(new Date(localMidnight('America/Sao_Paulo', '2026-10-05')).toISOString()).toBe(
      '2026-10-05T03:00:00.000Z',
    );
    expect(new Date(localMidnight('Europe/Lisbon', '2026-07-01')).toISOString()).toBe(
      '2026-06-30T23:00:00.000Z',
    );
  });
});

describe('localDateAndTime', () => {
  it('reads the day and the clock of an instant in the zone', () => {
    expect(localDateAndTime('America/Sao_Paulo', Date.parse('2026-10-06T02:30:00.250Z'))).toEqual({
      date: '2026-10-05',
      time: '23:30:00.250',
    });
  });
});

describe('requestProperties', () => {
  it('names the error code only when the request has one', () => {
    const write = { method: 'POST', route: '/orders', status: 201, durationMs: 150 };

    expect(requestProperties(write)).toEqual({
      method: 'POST',
      route: '/orders',
      status: 201,
      duration_ms: 150,
    });
    expect(requestProperties({ ...write, status: 409, errorCode: 'taken' })).toMatchObject({
      error_code: 'taken',
    });
  });
});

describe('showcaseRecord', () => {
  it('places a written visit in time, its requests as api_request events', () => {
    const record = showcaseRecord(VISIT, ATTRIBUTION, 'America/Sao_Paulo', NOW);

    expect(record).toMatchObject({ ...ATTRIBUTION, userId: 'u_7f3a', fromAdClick: false });
    expect(record.events.map((event) => [event.date, event.time, event.name])).toEqual([
      ['2026-10-05', '18:40:12.000', 'page_view'],
      ['2026-10-05', '18:41:05.000', 'api_request'],
      ['2026-10-05', '18:41:31.000', 'order_created'],
    ]);
    expect(record.events[0]?.properties).toEqual({});
    expect(record.events[1]?.properties).toMatchObject({ status: 409 });
    expect(record.events[1]?.request?.errorCode).toBe('order_number_in_use');
    expect(record.events[2]?.properties).toEqual({ first: true });
  });

  it('leaves a visit nobody signed in to without a person', () => {
    const anonymous = { ...VISIT, userId: undefined };

    expect(showcaseRecord(anonymous, ATTRIBUTION, 'America/Sao_Paulo', NOW).userId).toBeNull();
  });
});

describe('demoVisitRecordWire', () => {
  it('answers a visit the way the API timeline does', () => {
    const wire = demoVisitRecordWire(showcaseRecord(VISIT, ATTRIBUTION, 'America/Sao_Paulo', NOW));

    expect(wire).toMatchObject({
      session_id: VISIT.sessionId,
      started_at: '2026-10-05T21:40:12.000Z',
      ended_at: '2026-10-05T21:41:31.000Z',
      user_id: 'u_7f3a',
    });
    expect(wire.events.map((event) => event.id)).toEqual([
      '3c07a1b2-6d4e-4f10-9a2b-000000000000',
      '3c07a1b2-6d4e-4f10-9a2b-000000000001',
      '3c07a1b2-6d4e-4f10-9a2b-000000000002',
    ]);
  });
});
