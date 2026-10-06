import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiReader } from '../api-reader';
import { DEMO_ADMIN } from '../projects/mock-projects-service';
import { demoOverviewWire } from './demo-overview';
import { HttpOverviewService } from './http-overview-service';
import { MockOverviewService } from './mock-overview-service';
import { createOverviewService } from './overview-service.factory';

const API = 'https://api.pyxis.example.com';
const [STORE, DOCS] = DEMO_ADMIN.projects;
const RANGE = { from: '2026-09-29', to: '2026-10-05' };

vi.mock('next/headers', () => ({
  cookies: () => Promise.resolve({ get: () => undefined }),
}));

describe('HttpOverviewService', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('asks the overview of the project for the range and maps it', async () => {
    const fetchMock = vi.fn<typeof fetch>(() =>
      Promise.resolve(new Response(JSON.stringify(demoOverviewWire(STORE?.id ?? '', RANGE)))),
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
  it('gives one day per day of the range, the same numbers every time', async () => {
    const service = new MockOverviewService();

    const first = await service.overview(STORE?.id ?? '', RANGE);
    const again = await service.overview(STORE?.id ?? '', RANGE);

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
    expect(first.topPages).toHaveLength(6);
    expect(first.topEvents[0]?.name).toBe('calculator_result_shown');
  });

  it('keeps a day the same whatever range it is part of', async () => {
    const service = new MockOverviewService();

    const week = await service.overview(STORE?.id ?? '', RANGE);
    const day = await service.overview(STORE?.id ?? '', { from: '2026-10-05', to: '2026-10-05' });

    expect(day.days[0]).toEqual(week.days.at(-1));
  });

  it('has no conversions for a project without a conversion event', async () => {
    const report = await new MockOverviewService().overview(DOCS?.id ?? '', RANGE);

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
