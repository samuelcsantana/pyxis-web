import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NO_VISIT_FILTERS, type VisitFilters, type VisitsReport } from '@/domain/visits';
import { ApiReader } from '../api-reader';
import { DEMO_DOCS, DEMO_STORE } from '../demo/demo-projects';
import { demoTimelineReport } from '../timeline/demo-timeline';
import {
  DEMO_VISITS_PAGE_SIZE,
  demoVisitsReport,
  demoVisitsWire,
  listedDemoVisit,
} from './demo-visit-list';
import { HttpVisitsService } from './http-visits-service';
import { MockVisitsService } from './mock-visits-service';
import { createVisitsService } from './visits-service.factory';

const API = 'https://api.pyxis.example.com';
const RANGE = { from: '2026-09-22', to: '2026-10-05' };
const NOW = new Date('2026-10-06T02:30:00.000Z');
const STORE = DEMO_STORE.id;

vi.mock('next/headers', () => ({
  cookies: () => Promise.resolve({ get: () => undefined }),
}));

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

  const ids = (report: VisitsReport) => report.visits.map((visit) => visit.sessionId.slice(0, 8));

  const listed = (filters: Partial<VisitFilters>) =>
    ids(demoVisitsReport(STORE, RANGE, { ...NO_VISIT_FILTERS, ...filters }, null, NOW));

  it('lists the demo visits newest first, a page at a time', async () => {
    const mock = new MockVisitsService();

    const first = await mock.visits(STORE, RANGE, NO_VISIT_FILTERS, null);
    const second = await mock.visits(STORE, RANGE, NO_VISIT_FILTERS, first.nextCursor);

    expect(ids(first)).toEqual([
      '3c07a1b2',
      '506cf1d6',
      '8c3f6a1d',
      '0645362d',
      '7e2b9c14',
      'a1fa5f88',
      'd073f2ad',
      '2a81c3d4',
    ]);
    expect(first.nextCursor).toBe('2026-10-03T12:12:04.000Z~2a81c3d4-5e6f-4a70-8b91-0c1d2e3f4a02');
    expect(ids(second)).toEqual(['19c2e5f6', '94810767', '930c9810', '6d4ebf3d', '5b8d2e7a']);
    expect(second.nextCursor).toBeNull();
  });

  it('sums each visit up the way the API does', async () => {
    const report = await new MockVisitsService().visits(
      STORE,
      RANGE,
      { ...NO_VISIT_FILTERS, paths: ['/', '/pricing'] },
      null,
    );

    expect(report.visits).toEqual([
      {
        sessionId: '7e2b9c14-3f5a-4d68-9b1e-0a2c4e6f8b10',
        startedAt: '2026-10-04T14:05:02.000Z',
        endedAt: '2026-10-04T14:07:21.000Z',
        entryPath: '/',
        pageViews: 4,
        highlights: ['calculator_result_shown', 'cta_clicked'],
        failedRequests: 0,
        deviceType: 'mobile',
        browser: 'chrome',
        os: 'android',
        country: 'BR',
        channel: 'paid',
        userId: null,
      },
    ]);
  });

  it('counts the failed requests and leaves identify out of the highlights', () => {
    const report = demoVisitsReport(STORE, RANGE, NO_VISIT_FILTERS, null, NOW);
    const pageTwo = demoVisitsReport(STORE, RANGE, NO_VISIT_FILTERS, report.nextCursor, NOW);
    const visit = (prefix: string) =>
      [...report.visits, ...pageTwo.visits].find((found) => found.sessionId.startsWith(prefix));

    expect(visit('930c9810')?.failedRequests).toBe(1);
    expect(visit('3c07a1b2')?.failedRequests).toBe(1);
    expect(visit('8c3f6a1d')).toMatchObject({
      highlights: ['login_completed'],
      userId: 'u_c41e',
    });
  });

  it('gives a visit without a page view no entry page', () => {
    const { summary } = listedDemoVisit(
      {
        sessionId: '1b2c3d4e-0000-4000-8000-000000000009',
        daysAgo: 1,
        startHour: 10,
        startMinute: 0,
        deviceType: 'desktop',
        browser: 'chrome',
        os: 'windows',
        country: 'BR',
        channel: 'direct',
        events: [{ second: 5, name: 'cta_clicked', path: '/' }],
      },
      NOW,
      { source: '(direct)', medium: null, campaign: null },
    );

    expect(summary).toMatchObject({ entry_path: null, page_views: 0, highlights: ['cta_clicked'] });
  });

  it('counts every matching visit on every page, and names where each came from', () => {
    const first = demoVisitsWire(STORE, RANGE, NO_VISIT_FILTERS, null, NOW);
    const second = demoVisitsWire(STORE, RANGE, NO_VISIT_FILTERS, first.next_cursor, NOW);

    expect(second.total).toBe(first.total);
    expect(first.total).toBeGreaterThan(DEMO_VISITS_PAGE_SIZE);
    expect(first.visits.every((visit) => typeof visit.source === 'string')).toBe(true);
    expect(
      first.visits.filter((visit) => visit.channel === 'direct').map((visit) => visit.source),
    ).toEqual(expect.arrayContaining(['(direct)']));
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
    expect(listed({ paths: ['/', '/pricing'] })).toEqual(['7e2b9c14']);
    expect(listed({ paths: ['/calculator'] })).toEqual(['7e2b9c14', '19c2e5f6']);
    expect(listed({ paths: ['/orders*'] })).toEqual([
      '3c07a1b2',
      '8c3f6a1d',
      'a1fa5f88',
      'd073f2ad',
      '2a81c3d4',
      '6d4ebf3d',
    ]);
    expect(listed({ paths: ['/.*'] })).toEqual([]);
  });

  it('keeps the visits that sent an event, or an event that carried a property value', () => {
    expect(listed({ event: 'signup_submitted' })).toEqual([
      '506cf1d6',
      '0645362d',
      '19c2e5f6',
      '5b8d2e7a',
    ]);
    expect(listed({ event: 'calculator_result_shown', property: 'calculator=margin' })).toEqual([
      '7e2b9c14',
    ]);
    expect(listed({ event: 'calculator_result_shown', property: 'used_plan_preset=true' })).toEqual(
      ['19c2e5f6'],
    );
    expect(listed({ event: 'calculator_result_shown', property: 'missing=x' })).toEqual([]);
  });

  it('filters by channel, device and whether the visit was identified', () => {
    expect(listed({ channel: 'organic' })).toEqual(['5b8d2e7a']);
    expect(listed({ device: 'tablet' })).toEqual(['8c3f6a1d']);
    expect(listed({ identity: 'anonymous' })).toEqual([
      '506cf1d6',
      '0645362d',
      '7e2b9c14',
      '5b8d2e7a',
    ]);
    expect(listed({ identity: 'identified' })).toEqual([
      '3c07a1b2',
      '8c3f6a1d',
      'a1fa5f88',
      'd073f2ad',
      '2a81c3d4',
      '19c2e5f6',
      '94810767',
      '930c9810',
    ]);
  });

  it('filters by country, source and campaign, as Acquisition names them', () => {
    expect(listed({ country: 'PT' })).toEqual(['5b8d2e7a']);
    expect(listed({ source: 'google' })).toEqual(['506cf1d6', '0645362d', '19c2e5f6']);
    expect(listed({ campaign: 'spring_sale' })).toEqual(['7e2b9c14', '19c2e5f6']);
    expect(listed({ source: 'google', campaign: 'spring_sale' })).toEqual(['19c2e5f6']);
  });

  it('filters by a request the visit made, or one that failed, on a route or on any', () => {
    const failing = demoVisitsWire(STORE, RANGE, { ...NO_VISIT_FILTERS, failed: true }, null, NOW);

    expect(listed({ route: 'POST /orders' })).toEqual([
      '3c07a1b2',
      'a1fa5f88',
      'd073f2ad',
      '2a81c3d4',
    ]);
    expect(listed({ route: 'POST /orders', failed: true })).toEqual([
      '3c07a1b2',
      'a1fa5f88',
      'd073f2ad',
    ]);
    expect(failing.total).toBe(9);
    expect(failing.visits.every((visit) => visit.failed_requests > 0)).toBe(true);
  });

  it('keeps the visits that started in the period, by the day of the project', async () => {
    const lastDay = { from: '2026-10-05', to: '2026-10-05' };

    const store = await new MockVisitsService().visits(STORE, lastDay, NO_VISIT_FILTERS, null);

    expect(ids(store)).toEqual(['3c07a1b2', '506cf1d6', '8c3f6a1d']);
  });

  it('lists the visits of the project it is asked about', async () => {
    const docs = await new MockVisitsService().visits(DEMO_DOCS.id, RANGE, NO_VISIT_FILTERS, null);

    expect(ids(docs)).toEqual(['e5a1c9d2', 'f6b2d0e3', '07c3e1f4']);
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
