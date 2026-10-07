import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiReader } from '../api-reader';
import { DEMO_DOCS, DEMO_STORE } from '../demo/demo-projects';
import { demoOverviewWire } from './demo-overview';
import { HttpOverviewService } from './http-overview-service';
import { MockOverviewService } from './mock-overview-service';
import { createOverviewService } from './overview-service.factory';

const API = 'https://api.pyxis.example.com';
const RANGE = { from: '2026-09-29', to: '2026-10-05' };
const NOW = new Date('2026-10-06T02:30:00.000Z');

vi.mock('next/headers', () => ({
  cookies: () => Promise.resolve({ get: () => undefined }),
}));

describe('HttpOverviewService', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('asks the overview of the project for the range and maps it', async () => {
    const fetchMock = vi.fn<typeof fetch>(() =>
      Promise.resolve(new Response(JSON.stringify(demoOverviewWire(DEMO_STORE.id, RANGE, NOW)))),
    );
    vi.stubGlobal('fetch', fetchMock);

    const report = await new HttpOverviewService(
      new ApiReader(API, () => Promise.resolve('token')),
    ).overview('p 1', RANGE);

    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      `${API}/v1/projects/p%201/overview?from=2026-09-29&to=2026-10-05`,
    );
    expect(report.days).toHaveLength(7);
  });
});

describe('MockOverviewService', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('gives one day per day of the range, the same numbers every time', async () => {
    const service = new MockOverviewService();

    const first = await service.overview(DEMO_STORE.id, RANGE);
    const again = await service.overview(DEMO_STORE.id, RANGE);

    expect(first.days.map((day) => day.date)).toEqual([
      '2026-09-29',
      '2026-09-30',
      '2026-10-01',
      '2026-10-02',
      '2026-10-03',
      '2026-10-04',
      '2026-10-05',
    ]);
    expect(again).toEqual(first);
    expect(first.kpis.visits.daily).toHaveLength(7);
    expect(first.kpis.visits.current).toBe(
      first.kpis.visits.daily.reduce((sum, value) => sum + value, 0),
    );
    expect(first.kpis.writeErrors.current.failed).toBeLessThan(
      first.kpis.writeErrors.current.total,
    );
    expect(first.topPages).toHaveLength(10);
    expect(first.topEvents.map((event) => event.name)).toContain('calculator_result_shown');
  });

  it('keeps a day the same whatever range it is part of', async () => {
    const service = new MockOverviewService();

    const week = await service.overview(DEMO_STORE.id, RANGE);
    const day = await service.overview(DEMO_STORE.id, { from: '2026-10-05', to: '2026-10-05' });

    expect(day.days[0]).toEqual(week.days.at(-1));
  });

  it('says the local time a range that ends today stops at, in the project zone', () => {
    const tenInSaoPaulo = new Date('2026-10-05T13:03:27.250Z');

    expect(demoOverviewWire(DEMO_STORE.id, RANGE, tenInSaoPaulo).comparison_cutoff).toBe(
      '10:03:27.250',
    );
    expect(demoOverviewWire(DEMO_DOCS.id, RANGE, tenInSaoPaulo).comparison_cutoff).toBe(
      '14:03:27.250',
    );
    expect(demoOverviewWire(DEMO_STORE.id, RANGE, NOW).comparison_cutoff).toBe('23:30:00.000');
    expect(
      demoOverviewWire(DEMO_STORE.id, RANGE, new Date('2026-10-06T15:00:00.000Z'))
        .comparison_cutoff,
    ).toBeNull();
  });

  it('sends the previous period day by day, without conversions when the project has none', () => {
    const store = demoOverviewWire(DEMO_STORE.id, RANGE, NOW);
    const docs = demoOverviewWire(DEMO_DOCS.id, RANGE, NOW);

    expect(store.previous_days?.map((day) => day.date)).toEqual([
      '2026-09-22',
      '2026-09-23',
      '2026-09-24',
      '2026-09-25',
      '2026-09-26',
      '2026-09-27',
      '2026-09-28',
    ]);
    expect(store.previous_days?.reduce((sum, day) => sum + day.visits, 0)).toBe(
      store.kpis.visits.previous,
    );
    expect(docs.previous_days?.every((day) => day.conversions === null)).toBe(true);
  });

  it('has no conversions for a project without a conversion event', async () => {
    const report = await new MockOverviewService().overview(DEMO_DOCS.id, RANGE);

    expect(report.kpis.conversions).toBeNull();
  });

  it('counts conversions for a project it does not know', async () => {
    const report = await new MockOverviewService().overview('unknown', RANGE);

    expect(report.kpis.conversions?.daily).toHaveLength(7);
  });
});

describe('createOverviewService', () => {
  it('talks to the API when its URL is set', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', API);

    expect(createOverviewService()).toBeInstanceOf(HttpOverviewService);
  });

  it('uses the demo service without an API URL', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    expect(createOverviewService()).toBeInstanceOf(MockOverviewService);
  });
});
