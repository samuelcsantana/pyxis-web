import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiReader } from '../api-reader';
import { demoDays, demoVisitsOn } from '../demo/demo-series';
import { DEMO_ADMIN } from '../projects/mock-projects-service';
import { demoDevicesWire } from './demo-devices';
import { createDevicesService } from './devices-service.factory';
import { HttpDevicesService } from './http-devices-service';
import { MockDevicesService } from './mock-devices-service';

const API = 'https://api.pyxis.example.com';
const [STORE, DOCS] = DEMO_ADMIN.projects;
const RANGE = { from: '2026-09-06', to: '2026-10-05' };

vi.mock('next/headers', () => ({
  cookies: () => Promise.resolve({ get: () => undefined }),
}));

describe('HttpDevicesService', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('asks the devices of the project for the range and maps them', async () => {
    const fetchMock = vi.fn<typeof fetch>(() =>
      Promise.resolve(new Response(JSON.stringify(demoDevicesWire(STORE?.id ?? '', RANGE)))),
    );
    vi.stubGlobal('fetch', fetchMock);

    const report = await new HttpDevicesService(
      new ApiReader(API, () => Promise.resolve('token')),
    ).devices('p 1', RANGE);

    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      `${API}/v1/projects/p%201/devices?from=2026-09-06&to=2026-10-05`,
    );
    expect(report.operatingSystems).toHaveLength(6);
  });
});

describe('MockDevicesService', () => {
  it('splits the visits of the period over each breakdown without losing any', async () => {
    const report = await new MockDevicesService().devices(STORE?.id ?? '', RANGE);
    const visits = demoDays(RANGE).reduce((sum, date) => sum + demoVisitsOn(date), 0);
    const totalOf = (shares: readonly { visits: number }[]) =>
      shares.reduce((sum, share) => sum + share.visits, 0);

    expect(totalOf(report.deviceTypes)).toBe(visits);
    expect(totalOf(report.browsers)).toBe(visits);
    expect(totalOf(report.operatingSystems)).toBe(visits);
    expect(totalOf(report.countries)).toBe(visits);
    expect(report.deviceTypes.map((share) => share.value)).toEqual(['mobile', 'desktop', 'tablet']);
    expect(report.countries.at(-1)?.value).toBe('other');
    expect(report.deviceTypes[1]?.conversions).toBeGreaterThan(0);
  });

  it('has no conversions for a project without a conversion event', async () => {
    const report = await new MockDevicesService().devices(DOCS?.id ?? '', RANGE);

    expect(report.deviceTypes.every((share) => share.conversions === null)).toBe(true);
  });
});

describe('createDevicesService', () => {
  it('talks to the API when its URL is set', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', API);

    expect(createDevicesService()).toBeInstanceOf(HttpDevicesService);
  });

  it('uses the demo service without an API URL', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    expect(createDevicesService()).toBeInstanceOf(MockDevicesService);
  });
});
