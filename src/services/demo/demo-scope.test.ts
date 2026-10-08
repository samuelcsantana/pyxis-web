import { describe, expect, it } from 'vitest';
import { DEMO_STORE } from './demo-projects';
import type { DemoEventRecord, DemoVisitRecord } from './demo-records';
import {
  byKeys,
  countWhere,
  DEMO_FIRST_EVENT_DATE,
  demoRanking,
  demoScopeOf,
  demoShowcaseVisits,
  demoVisitsIn,
  demoVisitsOfDay,
  distinctCount,
  groupedBy,
  groupOf,
  hasFailed,
  hasPageView,
  isFailedRead,
  isFailedStatus,
  isNamedEvent,
  isPageView,
  isWrite,
  pathPattern,
  percentile,
  roundedPercentile,
  visitDate,
} from './demo-scope';
import { addDays } from '@/domain/period';

const NOW = new Date('2026-10-06T02:30:00.000Z');
const TODAY = '2026-10-05';

function event(name: string, overrides: Partial<DemoEventRecord> = {}): DemoEventRecord {
  return {
    at: 0,
    date: TODAY,
    time: '10:00:00.000',
    name,
    path: '/',
    properties: {},
    request: null,
    ...overrides,
  };
}

function call(method: string, status: number): DemoEventRecord {
  return event('api_request', {
    request: { method, route: '/orders', status, durationMs: 100 },
  });
}

const VISIT: DemoVisitRecord = {
  sessionId: 'a',
  userId: null,
  deviceType: 'desktop',
  browser: 'chrome',
  os: 'windows',
  country: 'BR',
  channel: 'direct',
  source: '(direct)',
  medium: null,
  campaign: null,
  fromAdClick: false,
  events: [event('page_view'), event('cta_clicked')],
};

describe('demoVisitsOfDay', () => {
  it('draws a day once and keeps it, and nothing before the first event of the demo', () => {
    const day = demoVisitsOfDay(DEMO_STORE, TODAY);

    expect(demoVisitsOfDay(DEMO_STORE, TODAY)).toBe(day);
    expect(day.length).toBeGreaterThan(0);
    expect(demoVisitsOfDay(DEMO_STORE, addDays(DEMO_FIRST_EVENT_DATE, -1))).toEqual([]);
  });

  it('starts over when it holds too many days, and still answers the same visits', () => {
    const quiet = {
      ...DEMO_STORE,
      id: 'quiet-days',
      pages: [{ path: '/', perDay: 1, visitsPerView: 1, stage: 0 }],
      events: [],
      routes: [],
      failedReads: [],
    };
    const first = demoVisitsOfDay(quiet, TODAY);

    for (let day = 1; day <= 800; day += 1) {
      demoVisitsOfDay(quiet, addDays(TODAY, day));
    }

    expect(demoVisitsOfDay(quiet, TODAY)).not.toBe(first);
    expect(demoVisitsOfDay(quiet, TODAY)).toEqual(first);
  });
});

describe('demoVisitsIn', () => {
  it('keeps the events of the period up to now, the showcase visits included', () => {
    const scope = demoScopeOf({ from: '2026-10-04', to: TODAY }, NOW);

    const visits = demoVisitsIn(DEMO_STORE, scope);
    const events = visits.flatMap((visit) => visit.events);

    expect(visits.map((visit) => visit.sessionId)).toEqual(
      expect.arrayContaining(
        demoShowcaseVisits(DEMO_STORE, NOW)
          .slice(0, 1)
          .map((visit) => visit.sessionId),
      ),
    );
    expect(events.every((found) => found.date >= '2026-10-04' && found.date <= TODAY)).toBe(true);
    expect(events.every((found) => found.at <= NOW.getTime())).toBe(true);
    expect(visits.every((visit) => visit.events.length > 0)).toBe(true);
  });

  it('stops the last day at the cut-off time, as a fair comparison does', () => {
    const range = { from: TODAY, to: TODAY };
    const until = '12:00:00.000';

    const cut = demoVisitsIn(DEMO_STORE, { range, now: NOW, until });
    const whole = demoVisitsIn(DEMO_STORE, { range, now: NOW, until: null });

    expect(cut.flatMap((visit) => visit.events).every((found) => found.time < until)).toBe(true);
    expect(cut.length).toBeLessThan(whole.length);
  });

  it('leaves out what has not happened yet today', () => {
    const early = new Date('2026-10-05T12:00:00.000Z');

    const visits = demoVisitsIn(DEMO_STORE, demoScopeOf({ from: TODAY, to: TODAY }, early));

    expect(
      visits.flatMap((visit) => visit.events).every((found) => found.at <= early.getTime()),
    ).toBe(true);
    expect(visits.length).toBeLessThan(demoVisitsOfDay(DEMO_STORE, TODAY).length);
  });
});

describe('event and visit tests', () => {
  it('tells page views, named events, writes, failed reads and failures apart', () => {
    expect([event('page_view'), event('identify'), call('POST', 201)].map(isNamedEvent)).toEqual([
      false,
      false,
      false,
    ]);
    expect(isNamedEvent(event('cta_clicked'))).toBe(true);
    expect(isPageView(event('page_view'))).toBe(true);
    expect(hasPageView(VISIT)).toBe(true);
    expect(hasPageView({ ...VISIT, events: [event('cta_clicked')] })).toBe(false);
    expect([call('POST', 201), call('GET', 404), event('page_view')].map(isWrite)).toEqual([
      true,
      false,
      false,
    ]);
    expect(
      [call('GET', 404), call('GET', 200), call('POST', 500), event('x')].map(isFailedRead),
    ).toEqual([true, false, false, false]);
    expect([call('POST', 0), call('POST', 201), event('x')].map(hasFailed)).toEqual([
      true,
      false,
      false,
    ]);
    expect([0, 200, 399, 400, 503].map(isFailedStatus)).toEqual([true, false, false, true, true]);
  });
});

describe('aggregation helpers', () => {
  it('counts, groups, reads a group and counts distinct values without nulls', () => {
    const groups = groupedBy(['ant', 'bee', 'ape'], (word) => word.slice(0, 1));

    expect(countWhere([1, 2, 3], (value) => value > 1)).toBe(2);
    expect([...groups]).toEqual([
      ['a', ['ant', 'ape']],
      ['b', ['bee']],
    ]);
    expect(groupOf(groups, 'c')).toEqual([]);
    expect(distinctCount(['u1', null, 'u1', 'u2'])).toBe(2);
    expect(visitDate(VISIT)).toBe(TODAY);
  });

  it('measures percentiles the way Postgres percentile_cont does', () => {
    expect(percentile([], 0.5)).toBeNull();
    expect(percentile([7], 0.95)).toBe(7);
    expect(percentile([40, 10, 20, 30], 0.5)).toBe(25);
    expect(percentile([10, 20, 30, 40], 0.95)).toBeCloseTo(38.5);
    expect(roundedPercentile([10, 20, 30, 40], 0.95)).toBe(39);
    expect(roundedPercentile([], 0.95)).toBeNull();
  });

  it('ranks by count, then by name, with the distinct visits of each', () => {
    const visits = [
      VISIT,
      { ...VISIT, sessionId: 'b', events: [event('page_view', { path: '/b' })] },
      { ...VISIT, sessionId: 'c', events: [event('page_view', { path: '/b' })] },
    ];

    expect(demoRanking(visits, isPageView, (found) => found.path)).toEqual([
      { name: '/b', count: 2, visits: 2 },
      { name: '/', count: 1, visits: 1 },
    ]);
  });

  it('sorts by keys, numbers by value and text by its order, ties kept', () => {
    const sorted = [
      { count: 2, name: 'b' },
      { count: 5, name: 'a' },
      { count: 2, name: 'a' },
      { count: 2, name: 'a' },
    ].toSorted(byKeys((item) => [-item.count, item.name]));

    expect(sorted.map((item) => `${String(item.count)}${item.name}`)).toEqual([
      '5a',
      '2a',
      '2a',
      '2b',
    ]);
    expect(byKeys((key: string | number) => [key])(1, 'a')).toBeLessThan(0);
  });

  it('reads a star in a path as any characters and every other character as itself', () => {
    expect(pathPattern('/orders*').test('/orders/:id')).toBe(true);
    expect(pathPattern('/.*').test('/orders')).toBe(false);
    expect(pathPattern('/.*').test('/.anything')).toBe(true);
  });
});
