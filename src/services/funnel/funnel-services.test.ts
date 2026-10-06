import { afterEach, describe, expect, it, vi } from 'vitest';
import type { FunnelStep } from '@/domain/funnel';
import { ApiReader } from '../api-reader';
import { DEMO_FUNNEL_STEPS, demoFunnelWire } from './demo-funnel';
import { createFunnelService } from './funnel-service.factory';
import { HttpFunnelService } from './http-funnel-service';
import { MockFunnelService } from './mock-funnel-service';

const API = 'https://api.pyxis.example.com';
const RANGE = { from: '2026-09-06', to: '2026-10-05' };
const TWO: readonly FunnelStep[] = [
  { type: 'page', path: '/' },
  { type: 'event', name: 'cta_clicked' },
];

vi.mock('next/headers', () => ({
  cookies: () => Promise.resolve({ get: () => undefined }),
}));

describe('HttpFunnelService', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('asks the funnel of the steps, mode and range', async () => {
    const fetchMock = vi.fn<typeof fetch>(() =>
      Promise.resolve(new Response(JSON.stringify(demoFunnelWire(RANGE, 'user', TWO)))),
    );
    vi.stubGlobal('fetch', fetchMock);

    const report = await new HttpFunnelService(
      new ApiReader(API, () => Promise.resolve('token')),
    ).funnel('p1', RANGE, 'user', TWO);

    const [requested] = fetchMock.mock.calls[0] ?? [];
    const url = new URL(typeof requested === 'string' ? requested : API);
    expect(url.pathname).toBe('/v1/projects/p1/funnel');
    expect(url.searchParams.get('mode')).toBe('user');
    expect(JSON.parse(url.searchParams.get('steps') ?? '')).toEqual(TWO);
    expect(report.steps).toHaveLength(2);
  });
});

describe('MockFunnelService', () => {
  it('reproduces the board: each step a share of the one before', async () => {
    const report = await new MockFunnelService().funnel('demo', RANGE, 'visit', DEMO_FUNNEL_STEPS);

    expect(report.steps.map((step) => step.count)).toEqual([1950, 1219, 501, 270, 214, 98]);
  });

  it('counts fewer people than visits, and keeps going past the board', async () => {
    const eight = [...DEMO_FUNNEL_STEPS, ...TWO];
    const people = await new MockFunnelService().funnel('demo', RANGE, 'user', eight);

    expect(people.steps).toHaveLength(8);
    expect(people.steps[0]?.count).toBe(1560);
    expect(people.steps.at(-1)?.count).toBeLessThan(people.steps.at(-2)?.count ?? 0);
  });
});

describe('createFunnelService', () => {
  it('talks to the API when its URL is set', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', API);

    expect(createFunnelService()).toBeInstanceOf(HttpFunnelService);
  });

  it('uses the demo service without an API URL', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    expect(createFunnelService()).toBeInstanceOf(MockFunnelService);
  });
});
