import { afterEach, describe, expect, it, vi } from 'vitest';
import type { FunnelStep } from '@/domain/funnel';
import { ApiReader } from '../api-reader';
import { demoFeaturesWire } from '../features/demo-features';
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
      Promise.resolve(new Response(JSON.stringify(demoFunnelWire('demo', RANGE, 'user', TWO)))),
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
  it('starts the example at the visits of its first screen, each step a share of the one before', async () => {
    const report = await new MockFunnelService().funnel('demo', RANGE, 'visit', DEMO_FUNNEL_STEPS);
    const calculator = demoFeaturesWire('demo', RANGE, 'screens').items.find(
      (item) => item.name === '/calculator',
    );
    const counts = report.steps.map((step) => step.count);

    expect(counts[0]).toBe(calculator?.visits);
    expect(counts).toEqual(counts.toSorted((left, right) => right - left));
    expect(counts.at(-1)).toBeGreaterThan(0);
  });

  it('counts fewer people than visits, and keeps going past the example', async () => {
    const eight = [...DEMO_FUNNEL_STEPS, ...TWO];
    const service = new MockFunnelService();
    const visits = await service.funnel('demo', RANGE, 'visit', eight);
    const people = await service.funnel('demo', RANGE, 'user', eight);

    expect(people.steps).toHaveLength(8);
    expect(people.steps[0]?.count).toBe(Math.round((visits.steps[0]?.count ?? 0) * 0.8));
    expect(people.steps.at(-1)?.count).toBeLessThan(people.steps.at(-2)?.count ?? 0);
  });
});

describe('demoFunnelWire step times', () => {
  it('times every reached step after the first, and the whole funnel as their sum', () => {
    const wire = demoFunnelWire('demo', RANGE, 'visit', DEMO_FUNNEL_STEPS);
    const [first, ...rest] = wire.steps;
    const gaps = rest.map((step) => step.median_seconds_from_previous ?? 0);

    expect(first?.median_seconds_from_previous).toBeNull();
    expect(gaps.every((seconds) => seconds >= 20 && seconds < 600)).toBe(true);
    expect(wire.median_seconds_overall).toBe(gaps.reduce((sum, seconds) => sum + seconds, 0));
  });

  it('has no time for a step nobody reached, and no overall time', () => {
    const wire = demoFunnelWire('demo', RANGE, 'visit', [
      ...TWO,
      { type: 'event', name: 'never_sent' },
    ]);

    expect(wire.steps.at(-1)).toEqual({ count: 0, median_seconds_from_previous: null });
    expect(wire.steps[1]?.median_seconds_from_previous).toBeGreaterThan(0);
    expect(wire.median_seconds_overall).toBeNull();
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
