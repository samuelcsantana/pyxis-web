import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiReader } from '../api-reader';
import { demoFeaturesWire } from './demo-features';
import { createFeaturesService } from './features-service.factory';
import { HttpFeaturesService } from './http-features-service';
import { MockFeaturesService } from './mock-features-service';

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
      Promise.resolve(new Response(JSON.stringify(demoFeaturesWire(RANGE, 'screens')))),
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
});

describe('MockFeaturesService', () => {
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
