import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MAX_ARRIVAL_TIMES } from '@/domain/arrivals';
import { ApiReader } from '../api-reader';
import { DEMO_DOCS, DEMO_STORE } from '../demo/demo-projects';
import { createArrivalsService } from './arrivals-service.factory';
import { HttpArrivalsService } from './http-arrivals-service';
import { MockArrivalsService } from './mock-arrivals-service';

const API = 'https://api.pyxis.example.com';
const NOW = new Date('2026-10-06T02:30:00.000Z');
const TODAY_IN_SAO_PAULO = { from: '2026-10-05', to: '2026-10-05' };
const LAST_30_DAYS = { from: '2026-09-06', to: '2026-10-05' };
const AFTERNOON_IN_SAO_PAULO = new Date('2026-10-05T17:00:00.000Z');
const TODAY_AFTERNOON = { from: '2026-10-05', to: '2026-10-05' };
const HOUR = 60 * 60 * 1_000;
const DAY = 24 * HOUR;

vi.mock('next/headers', () => ({
  cookies: () => Promise.resolve({ get: () => undefined }),
}));

describe('HttpArrivalsService', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('asks what arrived in the range since the moment, and maps the answer', async () => {
    const fetchMock = vi.fn<typeof fetch>(() =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            as_of: '2026-10-06T02:30:00Z',
            active_visits: 2,
            visits: { times: ['2026-10-06T02:29:01Z'], more: false },
            conversions: null,
            named_events: { times: [], more: false },
            failed_requests: { times: [], more: false },
          }),
        ),
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    const report = await new HttpArrivalsService(
      new ApiReader(API, () => Promise.resolve('token')),
    ).arrivals('p 1', TODAY_IN_SAO_PAULO, new Date('2026-10-06T02:00:00.000Z'));

    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      `${API}/v1/projects/p%201/arrivals?from=2026-10-05&to=2026-10-05&since=2026-10-06T02%3A00%3A00.000Z`,
    );
    expect(report.activeVisits).toBe(2);
    expect(report.visits.times).toEqual([Date.parse('2026-10-06T02:29:01Z')]);
  });
});

describe('MockArrivalsService', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('lets the demo store receive visits, events and conversions, newest first, up to now', async () => {
    const report = await new MockArrivalsService().arrivals(
      DEMO_STORE.id,
      TODAY_IN_SAO_PAULO,
      new Date(NOW.getTime() - 6 * HOUR),
    );

    expect(report.asOf).toBe(NOW.getTime());
    for (const arrivals of [report.visits, report.namedEvents, report.conversions]) {
      expect(arrivals?.times.length).toBeGreaterThan(0);
      expect(arrivals?.times).toEqual([...(arrivals?.times ?? [])].sort((a, b) => b - a));
      expect(Math.max(...(arrivals?.times ?? []))).toBeLessThanOrEqual(NOW.getTime());
      expect(Math.min(...(arrivals?.times ?? []))).toBeGreaterThan(NOW.getTime() - 6 * HOUR);
    }
  });

  it('rounds each arrival up to the second, as the API does', async () => {
    const report = await new MockArrivalsService().arrivals(
      DEMO_STORE.id,
      TODAY_IN_SAO_PAULO,
      new Date(NOW.getTime() - 6 * HOUR),
    );

    expect(report.namedEvents.times.every((time) => time % 1_000 === 0)).toBe(true);
  });

  it('answers no conversions for a project without a conversion event', async () => {
    const report = await new MockArrivalsService().arrivals(
      DEMO_DOCS.id,
      { from: '2026-10-06', to: '2026-10-06' },
      new Date(NOW.getTime() - 6 * HOUR),
    );

    expect(report.conversions).toBeNull();
  });

  it('caps each list at the API limit and says when more arrived', async () => {
    const report = await new MockArrivalsService().arrivals(
      DEMO_STORE.id,
      LAST_30_DAYS,
      new Date(NOW.getTime() - 7 * DAY),
    );

    expect(report.namedEvents.times).toHaveLength(MAX_ARRIVAL_TIMES);
    expect(report.namedEvents.more).toBe(true);
  });

  it('reads at most 7 days back, like the API', async () => {
    const report = await new MockArrivalsService().arrivals(
      DEMO_STORE.id,
      LAST_30_DAYS,
      new Date(NOW.getTime() - 20 * DAY),
    );

    expect(Math.min(...report.visits.times)).toBeGreaterThan(NOW.getTime() - 7 * DAY);
  });

  it('answers nothing for a moment in the future or a period that ended long ago', async () => {
    const future = await new MockArrivalsService().arrivals(
      DEMO_STORE.id,
      TODAY_IN_SAO_PAULO,
      new Date(NOW.getTime() + HOUR),
    );
    const longAgo = await new MockArrivalsService().arrivals(
      DEMO_STORE.id,
      { from: '2026-08-01', to: '2026-08-31' },
      new Date(NOW.getTime() - 7 * DAY),
    );

    expect(future.visits).toEqual({ times: [], more: false });
    expect(longAgo.namedEvents).toEqual({ times: [], more: false });
    expect(longAgo.visits).toEqual({ times: [], more: false });
  });

  it('counts the visits with an event in the last five minutes, whatever the period', async () => {
    vi.setSystemTime(AFTERNOON_IN_SAO_PAULO);
    const service = new MockArrivalsService();

    const today = await service.arrivals(DEMO_STORE.id, TODAY_AFTERNOON, AFTERNOON_IN_SAO_PAULO);
    const august = await service.arrivals(
      DEMO_STORE.id,
      { from: '2026-08-01', to: '2026-08-31' },
      AFTERNOON_IN_SAO_PAULO,
    );

    expect(today.activeVisits).toBeGreaterThan(0);
    expect(august.activeVisits).toBe(today.activeVisits);
  });
});

describe('createArrivalsService', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('reads the demo arrivals when no API is configured', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    expect(createArrivalsService()).toBeInstanceOf(MockArrivalsService);
  });

  it('asks the API when one is configured', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', API);

    expect(createArrivalsService()).toBeInstanceOf(HttpArrivalsService);
  });
});
