import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiReader } from '../api-reader';
import { DEMO_DOCS } from '../demo/demo-projects';
import { demoFeaturesWire } from './demo-features';
import { demoPropertyBreakdownWire } from './demo-properties';
import { createFeaturesService } from './features-service.factory';
import { HttpFeaturesService } from './http-features-service';
import { MockFeaturesService } from './mock-features-service';

const NOW = new Date('2026-10-06T02:30:00.000Z');

const API = 'https://api.pyxis.example.com';
const RANGE = { from: '2026-09-22', to: '2026-10-05' };

vi.mock('next/headers', () => ({
  cookies: () => Promise.resolve({ get: () => undefined }),
}));

describe('HttpFeaturesService', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('asks the ranking of the kind for the range and parses it', async () => {
    const fetchMock = vi.fn<typeof fetch>(() =>
      Promise.resolve(
        new Response(JSON.stringify(demoFeaturesWire('demo', RANGE, 'screens', NOW))),
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    const report = await new HttpFeaturesService(
      new ApiReader(API, () => Promise.resolve('token')),
    ).features('p 1', RANGE, 'screens');

    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      `${API}/v1/projects/p%201/features?from=2026-09-22&to=2026-10-05&kind=screens`,
    );
    expect(report.items[0]?.name).toBe('/dashboard');
  });

  it('asks the property breakdown of one event for the range and parses it', async () => {
    const fetchMock = vi.fn<typeof fetch>(() =>
      Promise.resolve(
        new Response(JSON.stringify(demoPropertyBreakdownWire('demo', RANGE, 'cta_clicked', NOW))),
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    const report = await new HttpFeaturesService(
      new ApiReader(API, () => Promise.resolve('token')),
    ).properties('p 1', RANGE, 'cta_clicked');

    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      `${API}/v1/projects/p%201/features/properties?from=2026-09-22&to=2026-10-05&name=cta_clicked`,
    );
    expect(report.keys.map((key) => key.key)).toEqual(['cta', 'location']);
  });
});

describe('MockFeaturesService', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('ranks the demo events by count, each count the sum of its days', async () => {
    const report = await new MockFeaturesService().features('demo', RANGE, 'events');

    expect(report.items).toHaveLength(8);
    expect(report.items.map((item) => item.count)).toEqual(
      report.items.map((item) => item.count).toSorted((left, right) => right - left),
    );
    for (const item of report.items) {
      expect(item.daily).toHaveLength(14);
      expect(item.count).toBe(item.daily.reduce((sum, value) => sum + value, 0));
      expect(item.visits).toBeLessThanOrEqual(item.count);
    }
  });
});

describe('MockFeaturesService properties', () => {
  const EVENTS = demoFeaturesWire('demo', RANGE, 'events', NOW).items;

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function countOf(name: string): number {
    return EVENTS.find((item) => item.name === name)?.count ?? -1;
  }

  it('breaks each demo event down so that every key adds up to the events that carry it', async () => {
    for (const item of EVENTS) {
      const report = await new MockFeaturesService().properties('demo', RANGE, item.name);

      expect(report.events).toBe(item.count);
      for (const key of report.keys) {
        expect(key.events).toBeLessThanOrEqual(item.count);
        expect(key.values.reduce((sum, value) => sum + value.count, 0) + key.otherCount).toBe(
          key.events,
        );
        for (const value of key.values) {
          expect(value.visits).toBeLessThanOrEqual(value.count);
        }
      }
    }
  });

  it('splits the calculator results between the two invented calculators', async () => {
    const report = await new MockFeaturesService().properties(
      'demo',
      RANGE,
      'calculator_result_shown',
    );

    expect(report.keys.map((key) => key.key)).toEqual(['calculator', 'used_plan_preset']);
    expect(report.keys[0]?.values.map((value) => value.value)).toEqual(['shipping', 'margin']);
    expect(report.keys[0]?.events).toBe(countOf('calculator_result_shown'));
  });

  it('keeps the ten most frequent values of a key and counts the rest as other', async () => {
    const report = await new MockFeaturesService().properties('demo', RANGE, 'report_exported');
    const period = report.keys.find((key) => key.key === 'period');

    expect(period?.values).toHaveLength(10);
    expect(period?.otherCount).toBeGreaterThan(0);
  });

  it('has a key only some events carry', async () => {
    const report = await new MockFeaturesService().properties('demo', RANGE, 'order_created');

    expect(report.keys[0]?.key).toBe('first');
    expect(report.keys[0]?.events).toBeLessThan(report.events);
  });

  it('answers no keys for an event without properties or one the demo never sends', async () => {
    const service = new MockFeaturesService();

    expect((await service.properties('demo', RANGE, 'product_created')).keys).toEqual([]);
    expect(await service.properties('demo', RANGE, 'never_sent')).toEqual({
      name: 'never_sent',
      events: 0,
      keys: [],
    });
  });

  it('breaks down the events of the project it is asked about', async () => {
    const report = await new MockFeaturesService().properties(DEMO_DOCS.id, RANGE, 'code_copied');

    expect(report.keys.map((key) => key.key)).toEqual(['language']);
  });
});

describe('createFeaturesService', () => {
  it('talks to the API when its URL is set', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', API);

    expect(createFeaturesService()).toBeInstanceOf(HttpFeaturesService);
  });

  it('uses the demo service without an API URL', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    expect(createFeaturesService()).toBeInstanceOf(MockFeaturesService);
  });
});
