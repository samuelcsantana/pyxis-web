import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NO_DASHBOARD_FILTERS } from '@/domain/dashboard-filters';
import { ApiReader } from '../api-reader';
import { DEMO_DOCS, DEMO_STORE } from '../demo/demo-projects';
import { demoDevicesWire } from './demo-devices';
import { createDevicesService } from './devices-service.factory';
import { HttpDevicesService } from './http-devices-service';
import { MockDevicesService } from './mock-devices-service';
import { demoOverviewWire } from '../overview/demo-overview';

const NOW = new Date('2026-10-06T02:30:00.000Z');

const API = 'https://api.pyxis.example.com';
const RANGE = { from: '2026-09-06', to: '2026-10-05', filters: NO_DASHBOARD_FILTERS };

vi.mock('next/headers', () => ({
  cookies: () => Promise.resolve({ get: () => undefined }),
}));

describe('HttpDevicesService', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('asks the devices of the project for the range and maps them', async () => {
    const fetchMock = vi.fn<typeof fetch>(() =>
      Promise.resolve(new Response(JSON.stringify(demoDevicesWire(DEMO_STORE.id, RANGE, NOW)))),
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
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('splits the visits of the period over each breakdown without losing any', async () => {
    const report = await new MockDevicesService().devices(DEMO_STORE.id, RANGE);
    const visits = demoOverviewWire(DEMO_STORE.id, RANGE, NOW).kpis.visits.current;
    const totalOf = (shares: readonly { visits: number }[]) =>
      shares.reduce((sum, share) => sum + share.visits, 0);

    expect(totalOf(report.deviceTypes)).toBe(visits);
    expect(totalOf(report.browsers)).toBe(visits);
    expect(totalOf(report.operatingSystems)).toBe(visits);
    expect(totalOf(report.countries)).toBe(visits);
    expect(totalOf(report.regions)).toBe(visits);
    expect(totalOf(report.cities)).toBe(visits);
    expect(report.deviceTypes.map((share) => share.value)).toEqual(['mobile', 'desktop', 'tablet']);
    expect(report.countries.at(-1)?.value).toBe('other');
    expect(report.deviceTypes[1]?.conversions).toBeGreaterThan(0);
  });

  it('ranks the ten regions with most visits, then the other ones, then the unknown', async () => {
    const { regions } = await new MockDevicesService().devices(DEMO_STORE.id, RANGE);
    const ranked = regions.slice(0, 10);

    expect(regions.map((share) => share.value).slice(-2)).toEqual(['other', null]);
    expect(ranked[0]).toMatchObject({ value: 'BR-SP', name: 'São Paulo' });
    expect(ranked.map((share) => share.visits)).toEqual(
      ranked.map((share) => share.visits).toSorted((first, second) => second - first),
    );
    expect(regions.at(-1)?.name).toBeNull();
    expect(ranked[0]?.conversions).toBeGreaterThan(0);
  });

  it('ranks the twenty cities with most visits in their regions, then the other ones, then the unknown', async () => {
    const { cities } = await new MockDevicesService().devices(DEMO_STORE.id, RANGE);
    const ranked = cities.slice(0, 20);

    expect(cities).toHaveLength(22);
    expect(cities.map((share) => share.value).slice(-2)).toEqual(['other', null]);
    expect(ranked[0]).toMatchObject({
      value: 'São Paulo',
      region: 'BR-SP',
      regionName: 'São Paulo',
    });
    expect(ranked.every((share) => share.region !== null && share.regionName !== null)).toBe(true);
    expect(ranked.map((share) => share.visits)).toEqual(
      ranked.map((share) => share.visits).toSorted((first, second) => second - first),
    );
    expect(cities.slice(-2).every((share) => share.region === null)).toBe(true);
    expect(cities.slice(-2).every((share) => share.regionName === null)).toBe(true);
    expect(ranked[0]?.conversions).toBeGreaterThan(0);
  });

  it('lists every city of a region without an other row when they fit', async () => {
    const { cities } = await new MockDevicesService().devices(DEMO_STORE.id, {
      ...RANGE,
      filters: { ...NO_DASHBOARD_FILTERS, region: 'BR-BA' },
    });

    expect(cities.map((share) => share.value)).toEqual([
      'Salvador',
      'Feira de Santana',
      'Vitória da Conquista',
      null,
    ]);
  });

  it('says how far the visits reached and where most came from', async () => {
    const report = await new MockDevicesService().devices(DEMO_STORE.id, RANGE);
    const visits = demoOverviewWire(DEMO_STORE.id, RANGE, NOW).kpis.visits.current;
    const named = report.cities.filter((share) => share.region !== null);

    expect(report.reach).toMatchObject({
      visits,
      continents: 2,
      topCountry: { value: 'BR', visits: report.countries[0]?.visits },
      topRegion: { value: 'BR-SP', name: 'São Paulo', visits: report.regions[0]?.visits },
    });
    expect(report.reach.countries).toBeGreaterThan(5);
    expect(report.reach.regions).toBeGreaterThan(10);
    expect(report.reach.cities).toBeGreaterThan(named.length);
  });

  it('reaches nowhere and lists no city when no visit matches', async () => {
    const report = await new MockDevicesService().devices(DEMO_STORE.id, {
      ...RANGE,
      filters: { ...NO_DASHBOARD_FILTERS, country: 'NZ' },
    });

    expect(report.cities).toEqual([]);
    expect(report.reach).toEqual({
      visits: 0,
      continents: 0,
      countries: 0,
      regions: 0,
      cities: 0,
      topCountry: null,
      topRegion: null,
    });
  });

  it('has no conversions for a project without a conversion event', async () => {
    const report = await new MockDevicesService().devices(DEMO_DOCS.id, RANGE);

    expect(report.deviceTypes.every((share) => share.conversions === null)).toBe(true);
    expect(report.regions.every((share) => share.convertingVisits === null)).toBe(true);
    expect(report.cities.every((share) => share.conversions === null)).toBe(true);
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
