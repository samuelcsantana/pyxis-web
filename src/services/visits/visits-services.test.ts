import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { todayIn } from '@/domain/period';
import { NO_VISIT_FILTERS, type VisitFilters } from '@/domain/visits';
import { demoAcquisitionWire } from '../acquisition/demo-acquisition';
import { ApiReader } from '../api-reader';
import { DEMO_DOCS, DEMO_STORE } from '../demo/demo-projects';
import type { DemoEventRecord, DemoVisitRecord } from '../demo/demo-records';
import { demoDevicesWire } from '../devices/demo-devices';
import { demoOverviewWire } from '../overview/demo-overview';
import { demoTimelineReport } from '../timeline/demo-timeline';
import {
  DEMO_VISITS_PAGE_SIZE,
  demoVisitsReport,
  demoVisitsWire,
  demoVisitSummary,
} from './demo-visit-list';
import { HttpVisitsService } from './http-visits-service';
import { MockVisitsService } from './mock-visits-service';
import { createVisitsService } from './visits-service.factory';

const API = 'https://api.pyxis.example.com';
const RANGE = { from: '2026-09-22', to: '2026-10-05' };
const SHOWCASE_DAYS = { from: '2026-10-01', to: '2026-10-05' };
const NOW = new Date('2026-10-06T02:30:00.000Z');
const STORE = DEMO_STORE.id;

vi.mock('next/headers', () => ({
  cookies: () => Promise.resolve({ get: () => undefined }),
}));

const RECORD: DemoVisitRecord = {
  sessionId: '1b2c3d4e-0000-4000-8000-000000000009',
  userId: null,
  deviceType: 'desktop',
  browser: 'chrome',
  os: 'windows',
  country: 'BR',
  channel: 'paid',
  source: 'google',
  medium: 'cpc',
  campaign: 'spring_sale',
  fromAdClick: true,
  events: [],
};

function event(name: string, path: string, second: number): DemoEventRecord {
  const at = Date.parse('2026-10-05T10:00:00.000Z') + second * 1000;
  return {
    at,
    date: '2026-10-05',
    time: '07:00:00.000',
    name,
    path,
    properties: {},
    request: null,
  };
}

function answering(body: unknown) {
  const fetchMock = vi.fn<typeof fetch>(() => Promise.resolve(new Response(JSON.stringify(body))));
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

function service() {
  return new HttpVisitsService(new ApiReader(API, () => Promise.resolve('token')));
}

describe('HttpVisitsService', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('asks the visits of the range', async () => {
    const fetchMock = answering(demoVisitsWire(STORE, RANGE, NO_VISIT_FILTERS, null, NOW));

    const report = await service().visits('p 1', RANGE, NO_VISIT_FILTERS, null);

    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      `${API}/v1/projects/p%201/visits?from=2026-09-22&to=2026-10-05`,
    );
    expect(report.visits).toHaveLength(DEMO_VISITS_PAGE_SIZE);
  });

  it('sends every filter, one path parameter per page, and the cursor', async () => {
    const fetchMock = answering({ visits: [], next_cursor: null });

    await service().visits(
      'p1',
      RANGE,
      {
        paths: ['/calculator-shipping', '/calculator-*'],
        event: 'calculator_result_shown',
        property: 'calculator=margin',
        channel: 'paid',
        device: 'mobile',
        identity: 'anonymous',
        country: 'BR',
        source: 'google',
        campaign: 'spring_sale',
        route: 'POST /orders',
        failed: true,
      },
      '2026-10-05T09:30:04.000Z~506cf1d6-18b8-4b20-87a4-8ba68956bf5b',
    );

    const requested = fetchMock.mock.calls[0]?.[0];
    const url = new URL(typeof requested === 'string' ? requested : 'about:blank');
    expect(url.searchParams.getAll('path')).toEqual(['/calculator-shipping', '/calculator-*']);
    expect(Object.fromEntries([...url.searchParams].filter(([name]) => name !== 'path'))).toEqual({
      from: '2026-09-22',
      to: '2026-10-05',
      event: 'calculator_result_shown',
      property: 'calculator=margin',
      channel: 'paid',
      device: 'mobile',
      identity: 'anonymous',
      country: 'BR',
      source: 'google',
      campaign: 'spring_sale',
      route: 'POST /orders',
      failed: 'true',
      cursor: '2026-10-05T09:30:04.000Z~506cf1d6-18b8-4b20-87a4-8ba68956bf5b',
    });
  });
});

describe('MockVisitsService', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function everyPage(filters: Partial<VisitFilters>, range = RANGE, projectId = STORE) {
    const asked = { ...NO_VISIT_FILTERS, ...filters };
    const first = demoVisitsWire(projectId, range, asked, null, NOW);
    const pages = [first];
    for (let cursor = first.next_cursor; cursor !== null;) {
      const page = demoVisitsWire(projectId, range, asked, cursor, NOW);
      pages.push(page);
      cursor = page.next_cursor;
    }
    return { total: first.total ?? 0, visits: pages.flatMap((page) => page.visits) };
  }

  const totalOf = (filters: Partial<VisitFilters>) =>
    demoVisitsWire(STORE, RANGE, { ...NO_VISIT_FILTERS, ...filters }, null, NOW).total ?? 0;

  const ids = (filters: Partial<VisitFilters>) =>
    everyPage(filters, SHOWCASE_DAYS).visits.map((visit) => visit.session_id.slice(0, 8));

  it('lists every demo visit once, newest first, a page at a time', async () => {
    const first = await new MockVisitsService().visits(STORE, RANGE, NO_VISIT_FILTERS, null);
    const all = everyPage({}, SHOWCASE_DAYS);
    const starts = all.visits.map((visit) => `${visit.started_at}~${visit.session_id}`);

    expect(first.visits).toHaveLength(DEMO_VISITS_PAGE_SIZE);
    expect(all.visits).toHaveLength(all.total);
    expect(new Set(starts).size).toBe(all.total);
    expect(starts).toEqual(starts.toSorted().toReversed());
    expect(totalOf({})).toBe(demoOverviewWire(STORE, RANGE, NOW).kpis.visits.current);
  });

  it('sums each visit up the way the API does', () => {
    const summary = demoVisitSummary({
      ...RECORD,
      events: [
        event('page_view', '/', 0),
        event('identify', '/', 1),
        event('cta_clicked', '/', 2),
        event('page_view', '/pricing', 3),
        event('cta_clicked', '/pricing', 4),
        { ...event('api_request', '/pricing', 5), properties: { status: 500 } },
        { ...event('api_request', '/pricing', 6), properties: { status: 201 } },
      ],
    });

    expect(summary).toMatchObject({
      entry_path: '/',
      page_views: 2,
      highlights: ['cta_clicked'],
      failed_requests: 1,
      user_id: null,
      source: 'google',
      campaign: 'spring_sale',
    });
  });

  it('gives a visit without a page view no entry page', () => {
    const summary = demoVisitSummary({ ...RECORD, events: [event('cta_clicked', '/', 5)] });

    expect(summary).toMatchObject({ entry_path: null, page_views: 0, highlights: ['cta_clicked'] });
  });

  it('opens every listed visit in the demo timeline, with the same start', () => {
    const report = demoVisitsReport(STORE, RANGE, NO_VISIT_FILTERS, null, NOW);

    for (const listedVisit of report.visits) {
      const { visits } = demoTimelineReport(
        STORE,
        { kind: 'visit', id: listedVisit.sessionId },
        NOW,
      );
      expect(visits[0]?.startedAt).toBe(listedVisit.startedAt);
    }
  });

  it('keeps the visits that viewed every page asked, a star matching any characters', () => {
    expect(ids({ paths: ['/', '/pricing'] })).toContain('7e2b9c14');
    expect(totalOf({ paths: ['/', '/pricing'] })).toBeLessThan(totalOf({ paths: ['/pricing'] }));
    expect(totalOf({ paths: ['/orders*'] })).toBeGreaterThan(totalOf({ paths: ['/orders'] }));
    expect(totalOf({ paths: ['/.*'] })).toBe(0);
  });

  it('keeps the visits that sent an event, or an event that carried a property value', () => {
    const shown = totalOf({ event: 'calculator_result_shown' });
    const margin = totalOf({ event: 'calculator_result_shown', property: 'calculator=margin' });

    expect(ids({ event: 'signup_submitted' })).toContain('506cf1d6');
    expect(margin).toBeGreaterThan(0);
    expect(margin).toBeLessThan(shown);
    expect(ids({ event: 'calculator_result_shown', property: 'calculator=margin' })).toContain(
      '7e2b9c14',
    );
    expect(totalOf({ event: 'calculator_result_shown', property: 'missing=x' })).toBe(0);
  });

  it('filters by channel, device and identity as the other screens count them', () => {
    const devices = demoDevicesWire(STORE, RANGE, NOW).device_types;
    const organic = demoAcquisitionWire(STORE, RANGE, NOW)
      .sources.filter((source) => source.channel === 'organic')
      .reduce((sum, source) => sum + source.visits, 0);
    const anonymous = totalOf({ identity: 'anonymous' });
    const identified = totalOf({ identity: 'identified' });

    expect(totalOf({ channel: 'organic' })).toBe(organic);
    expect(totalOf({ device: 'tablet' })).toBe(
      devices.find((share) => share.value === 'tablet')?.visits,
    );
    expect(anonymous + identified).toBe(totalOf({}));
    expect(ids({ identity: 'identified' })).toContain('3c07a1b2');
    expect(ids({ identity: 'anonymous' })).not.toContain('3c07a1b2');
  });

  it('filters by country, source and campaign as Devices and Acquisition name them', () => {
    const { countries } = demoDevicesWire(STORE, RANGE, NOW);
    const { sources, campaigns } = demoAcquisitionWire(STORE, RANGE, NOW);
    const springSale = campaigns?.find(
      (campaign) => campaign.campaign === 'spring_sale' && campaign.source === 'google',
    );

    expect(totalOf({ country: 'PT' })).toBe(
      countries.find((share) => share.value === 'PT')?.visits,
    );
    expect(totalOf({ source: 'google' })).toBe(
      sources.find((source) => source.source === 'google')?.visits,
    );
    expect(totalOf({ source: 'google', campaign: 'spring_sale' })).toBe(springSale?.visits);
  });

  it('filters by a request the visit made, or one that failed, on a route or on any', () => {
    const failedOrders = totalOf({ route: 'POST /orders', failed: true });
    const failing = everyPage({ failed: true });

    expect(failedOrders).toBeGreaterThan(0);
    expect(failedOrders).toBeLessThan(totalOf({ route: 'POST /orders' }));
    expect(ids({ route: 'POST /orders', failed: true })).toContain('3c07a1b2');
    expect(failing.visits.every((visit) => visit.failed_requests > 0)).toBe(true);
    expect(failing.total).toBeLessThan(totalOf({}));
  });

  it('keeps the visits that started in the period, by the day of the project', () => {
    const lastDay = everyPage({}, { from: '2026-10-05', to: '2026-10-05' });

    expect(lastDay.total).toBeGreaterThan(0);
    expect(
      lastDay.visits.every(
        (visit) => todayIn(DEMO_STORE.timezone, new Date(visit.started_at)) === '2026-10-05',
      ),
    ).toBe(true);
  });

  it('lists the visits of the project it is asked about', async () => {
    const docs = await new MockVisitsService().visits(DEMO_DOCS.id, RANGE, NO_VISIT_FILTERS, null);

    expect(docs.visits).toHaveLength(DEMO_VISITS_PAGE_SIZE);
    expect(
      everyPage({}, SHOWCASE_DAYS, DEMO_DOCS.id).visits.map((visit) => visit.session_id),
    ).toContain(DEMO_DOCS.showcase[0]?.sessionId);
  });
});

describe('createVisitsService', () => {
  it('talks to the API when its URL is set', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', API);

    expect(createVisitsService()).toBeInstanceOf(HttpVisitsService);
  });

  it('uses the demo service without an API URL', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    expect(createVisitsService()).toBeInstanceOf(MockVisitsService);
  });
});
