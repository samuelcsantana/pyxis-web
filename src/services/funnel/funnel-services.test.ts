import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { FunnelStep } from '@/domain/funnel';
import { ApiReader } from '../api-reader';
import { demoFeaturesWire } from '../features/demo-features';
import {
  DEMO_FUNNEL_STEPS,
  demoFunnelSegmentsWire,
  demoFunnelSubjectsWire,
  demoFunnelWire,
  FUNNEL_SUBJECTS_PER_PAGE,
} from './demo-funnel';
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

  it('asks who is behind one step, with the cursor of an older page only when given', async () => {
    const fetchMock = vi.fn<typeof fetch>(() =>
      Promise.resolve(
        new Response(
          JSON.stringify(
            demoFunnelSubjectsWire(
              'demo',
              RANGE,
              'visit',
              TWO,
              { step: 2, outcome: 'dropped', cursor: null },
              NOW,
            ),
          ),
        ),
      ),
    );
    vi.stubGlobal('fetch', fetchMock);
    const service = new HttpFunnelService(new ApiReader(API, () => Promise.resolve('token')));

    const page = await service.subjects('p1', RANGE, 'visit', TWO, {
      step: 2,
      outcome: 'dropped',
      cursor: null,
    });
    await service.subjects('p1', RANGE, 'user', TWO, { step: 1, outcome: 'reached', cursor: 'c2' });

    const urls = fetchMock.mock.calls.map(
      ([requested]) => new URL(typeof requested === 'string' ? requested : API),
    );
    expect(urls[0]?.pathname).toBe('/v1/projects/p1/funnel/subjects');
    expect(Object.fromEntries(urls[0]?.searchParams ?? [])).toMatchObject({
      mode: 'visit',
      step: '2',
      outcome: 'dropped',
    });
    expect(urls[0]?.searchParams.has('cursor')).toBe(false);
    expect(urls[1]?.searchParams.get('cursor')).toBe('c2');
    expect(page.subjects.length).toBeGreaterThan(0);
  });
});

describe('HttpFunnelService segments', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('asks the funnel per channel for the range and steps, and reads the segments', async () => {
    const fetchMock = vi.fn<typeof fetch>(() =>
      Promise.resolve(
        new Response(JSON.stringify(demoFunnelSegmentsWire('demo', RANGE, TWO, 'channel', NOW))),
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    const report = await new HttpFunnelService(
      new ApiReader(API, () => Promise.resolve('token')),
    ).segments('p 1', RANGE, TWO, 'channel');

    const url = new URL(fetchMock.mock.calls[0]?.[0] as string);
    expect(url.pathname).toBe('/v1/projects/p%201/funnel/segments');
    expect(url.searchParams.get('by')).toBe('channel');
    expect(JSON.parse(url.searchParams.get('steps') ?? '[]')).toEqual(TWO);
    expect(report.by).toBe('channel');
  });
});

describe('MockFunnelService segments', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('splits the per-visit funnel by device and by channel, adding up to it, largest first', async () => {
    const service = new MockFunnelService();
    const funnel = await service.funnel('demo', RANGE, 'visit', DEMO_FUNNEL_STEPS);

    for (const by of ['device', 'channel'] as const) {
      const report = await service.segments('demo', RANGE, DEMO_FUNNEL_STEPS, by);
      const sums = DEMO_FUNNEL_STEPS.map((_, index) =>
        report.segments.reduce((total, segment) => total + (segment.steps[index] ?? 0), 0),
      );
      expect(report.by).toBe(by);
      expect(sums).toEqual(funnel.steps.map((step) => step.count));
      const firsts = report.segments.map((segment) => segment.steps[0] ?? 0);
      expect(firsts).toEqual(firsts.toSorted((left, right) => right - left));
    }
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

  it('lists as many as each step counts, page by page, newest first and never twice', async () => {
    const service = new MockFunnelService();
    const report = await service.funnel('demo', RANGE, 'visit', DEMO_FUNNEL_STEPS);
    const counts = report.steps.map((step) => step.count);
    const listed = async (step: number, outcome: 'reached' | 'dropped') => {
      const ids: string[] = [];
      const times: string[] = [];
      let cursor: string | null = null;
      do {
        const page = await service.subjects('demo', RANGE, 'visit', DEMO_FUNNEL_STEPS, {
          step,
          outcome,
          cursor,
        });
        expect(page.subjects.length).toBeLessThanOrEqual(FUNNEL_SUBJECTS_PER_PAGE);
        ids.push(...page.subjects.map((subject) => subject.id));
        times.push(...page.subjects.map((subject) => subject.lastStepAt));
        cursor = page.nextCursor;
      } while (cursor !== null);
      expect(times).toEqual(times.toSorted().toReversed());
      expect(new Set(ids).size).toBe(ids.length);
      return ids.length;
    };

    expect(await listed(1, 'reached')).toBe(counts[0]);
    expect(await listed(2, 'dropped')).toBe((counts[0] ?? 0) - (counts[1] ?? 0));
  });

  it('lists the identified people of a step', async () => {
    const page = await new MockFunnelService().subjects('demo', RANGE, 'user', DEMO_FUNNEL_STEPS, {
      step: 2,
      outcome: 'reached',
      cursor: null,
    });

    expect(page.subjects.length).toBeGreaterThan(0);
    expect(page.subjects.every((subject) => !/^[0-9a-f]{8}-/.test(subject.id))).toBe(true);
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
