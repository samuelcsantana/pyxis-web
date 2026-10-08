import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { FunnelStep } from '@/domain/funnel';
import { ApiReader } from '../api-reader';
import { demoFeaturesWire } from '../features/demo-features';
import { DEMO_FUNNEL_STEPS, demoFunnelWire } from './demo-funnel';
import { createFunnelService } from './funnel-service.factory';
import { HttpFunnelService } from './http-funnel-service';
import { MockFunnelService } from './mock-funnel-service';

const NOW = new Date('2026-10-06T02:30:00.000Z');

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
      Promise.resolve(
        new Response(JSON.stringify(demoFunnelWire('demo', RANGE, 'user', TWO, NOW))),
      ),
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
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts the example at the visits of its first screen, each step at most the one before', async () => {
    const report = await new MockFunnelService().funnel('demo', RANGE, 'visit', DEMO_FUNNEL_STEPS);
    const calculator = demoFeaturesWire('demo', RANGE, 'screens', NOW).items.find(
      (item) => item.name === '/calculator',
    );
    const counts = report.steps.map((step) => step.count);

    expect(counts[0]).toBe(calculator?.visits);
    expect(counts).toEqual(counts.toSorted((left, right) => right - left));
    expect(counts[1]).toBeGreaterThan(0);
  });

  it('counts fewer people than visits, and keeps going past the example', async () => {
    const eight = [...DEMO_FUNNEL_STEPS, ...TWO];
    const service = new MockFunnelService();
    const visits = await service.funnel('demo', RANGE, 'visit', eight);
    const people = await service.funnel('demo', RANGE, 'user', eight);
    const counts = people.steps.map((step) => step.count);

    expect(people.steps).toHaveLength(8);
    expect(counts[0]).toBeLessThan(visits.steps[0]?.count ?? 0);
    expect(counts).toEqual(counts.toSorted((left, right) => right - left));
    expect(counts.at(-1)).toBeGreaterThan(0);
  });
});

describe('demoFunnelWire step times', () => {
  it('times every reached step after the first, and the whole funnel', () => {
    const wire = demoFunnelWire('demo', RANGE, 'user', DEMO_FUNNEL_STEPS, NOW);
    const [first, ...rest] = wire.steps;

    expect(first?.median_seconds_from_previous).toBeNull();
    expect(rest.every((step) => (step.median_seconds_from_previous ?? 0) > 0)).toBe(true);
    expect(wire.median_seconds_overall).toBeGreaterThan(0);
  });

  it('has no time for a step nobody reached, and no overall time', () => {
    const wire = demoFunnelWire(
      'demo',
      RANGE,
      'visit',
      [...TWO, { type: 'event', name: 'never_sent' }],
      NOW,
    );

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
