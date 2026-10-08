import { afterEach, describe, expect, it, vi } from 'vitest';
import { channelTotals, visitsTotal } from '@/domain/acquisition';
import { ApiReader } from '../api-reader';
import { demoVisitsTotal } from '../demo/demo-dataset';
import { DEMO_DOCS, DEMO_STORE } from '../demo/demo-projects';
import { createAcquisitionService } from './acquisition-service.factory';
import { demoAcquisitionWire } from './demo-acquisition';
import { HttpAcquisitionService } from './http-acquisition-service';
import { MockAcquisitionService } from './mock-acquisition-service';

const API = 'https://api.pyxis.example.com';
const RANGE = { from: '2026-09-06', to: '2026-10-05' };

vi.mock('next/headers', () => ({
  cookies: () => Promise.resolve({ get: () => undefined }),
}));

describe('HttpAcquisitionService', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('asks the acquisition of the project for the range and maps it', async () => {
    const fetchMock = vi.fn<typeof fetch>(() =>
      Promise.resolve(new Response(JSON.stringify(demoAcquisitionWire(DEMO_STORE.id, RANGE)))),
    );
    vi.stubGlobal('fetch', fetchMock);

    const report = await new HttpAcquisitionService(
      new ApiReader(API, () => Promise.resolve('token')),
    ).acquisition('p 1', RANGE);

    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      `${API}/v1/projects/p%201/acquisition?from=2026-09-06&to=2026-10-05`,
    );
    expect(report.days).toHaveLength(30);
  });
});

describe('MockAcquisitionService', () => {
  it('splits every demo visit of each day over the channels', async () => {
    const report = await new MockAcquisitionService().acquisition(DEMO_STORE.id, RANGE);

    expect(visitsTotal(report.days)).toBe(demoVisitsTotal(DEMO_STORE, RANGE));
    expect(report.days[0]?.date).toBe('2026-09-06');
  });

  it('splits each channel over its sources, the biggest first, with ad clicks on paid ones', async () => {
    const report = await new MockAcquisitionService().acquisition(DEMO_STORE.id, RANGE);
    const totals = channelTotals(report.days);
    const sourcesOf = (channel: string) =>
      report.sources
        .filter((source) => source.channel === channel)
        .reduce((sum, source) => sum + source.visits, 0);

    expect(sourcesOf('paid')).toBe(totals.paid);
    expect(sourcesOf('organic')).toBe(totals.organic);
    expect(sourcesOf('direct')).toBe(totals.direct);
    expect(report.sources.map((source) => source.visits)).toEqual(
      report.sources.map((source) => source.visits).toSorted((left, right) => right - left),
    );
    expect(
      report.sources.find((source) => source.source === 'google')?.fromAdClickVisits,
    ).toBeGreaterThan(0);
    expect(report.sources.find((source) => source.source === '(direct)')?.fromAdClickVisits).toBe(
      0,
    );
  });

  it('has no conversions for a project without a conversion event', async () => {
    const report = await new MockAcquisitionService().acquisition(DEMO_DOCS.id, RANGE);

    expect(report.sources.every((source) => source.conversions === null)).toBe(true);
  });
});

describe('demoAcquisitionWire campaigns', () => {
  it('splits the tagged share of a source over its campaigns, the biggest first', () => {
    const wire = demoAcquisitionWire(DEMO_STORE.id, RANGE);
    const google = wire.sources.find((source) => source.source === 'google');
    const fromGoogle = wire.campaigns?.filter((campaign) => campaign.source === 'google') ?? [];

    expect(wire.campaigns?.map((campaign) => `${campaign.campaign} ${campaign.source}`)).toEqual([
      'spring_sale google',
      'brand_search google',
      'spring_sale bing',
      'creator_week l.instagram.com',
    ]);
    expect(fromGoogle.reduce((sum, campaign) => sum + campaign.visits, 0)).toBeLessThan(
      google?.visits ?? 0,
    );
    expect(fromGoogle.every((campaign) => (campaign.conversions ?? 0) > 0)).toBe(true);
    expect(fromGoogle.every((campaign) => campaign.from_ad_click_visits > 0)).toBe(true);
  });

  it('has campaigns without conversions for a project without a conversion event', () => {
    const wire = demoAcquisitionWire(DEMO_DOCS.id, RANGE);

    expect(wire.campaigns).toEqual([
      expect.objectContaining({
        campaign: 'docs_v2_launch',
        conversions: null,
        converting_visits: null,
      }),
    ]);
  });
});

describe('createAcquisitionService', () => {
  it('talks to the API when its URL is set', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', API);

    expect(createAcquisitionService()).toBeInstanceOf(HttpAcquisitionService);
  });

  it('uses the demo service without an API URL', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    expect(createAcquisitionService()).toBeInstanceOf(MockAcquisitionService);
  });
});
