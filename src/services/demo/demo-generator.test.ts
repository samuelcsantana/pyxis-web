import { describe, expect, it } from 'vitest';
import { OTHER_VALUE } from '@/domain/devices';
import type { DemoProject } from './demo-catalog';
import { clockOf, demoGeneratedVisits, demoPeople, demoShareOf } from './demo-generator';
import { DEMO_DOCS, DEMO_STORE } from './demo-projects';
import { type DemoEventRecord, type DemoVisitRecord, localDateAndTime } from './demo-records';
import { textSalt } from './demo-series';

const DATE = '2026-10-05';
const WEEK = ['2026-09-29', '2026-09-30', '2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04'];
const STORE_WEEK = [DATE, ...WEEK].flatMap((date) => demoGeneratedVisits(DEMO_STORE, date));
const NO_CHANNELS = {
  paid: 0,
  email: 0,
  social: 0,
  campaign: 0,
  organic: 0,
  referral: 0,
  direct: 0,
};

function crafted(id: string, overrides: Partial<DemoProject>): DemoProject {
  return {
    ...DEMO_STORE,
    id,
    pages: [{ path: '/', perDay: 10, visitsPerView: 0.1, stage: 0 }],
    visitsPerPageView: 1,
    events: [],
    routes: [],
    failedReads: [],
    showcase: [],
    ...overrides,
  };
}

function named(visit: DemoVisitRecord, name: string): readonly DemoEventRecord[] {
  return visit.events.filter((event) => event.name === name);
}

function requestsTo(visit: DemoVisitRecord, method: string, route: string) {
  return visit.events.flatMap((event) =>
    event.request?.method === method && event.request.route === route ? [event] : [],
  );
}

describe('demoGeneratedVisits', () => {
  it('draws the same visits for the same day and other visits for another day', () => {
    const visits = demoGeneratedVisits(DEMO_STORE, DATE);

    expect(demoGeneratedVisits(DEMO_STORE, DATE)).toEqual(visits);
    expect(demoGeneratedVisits(DEMO_STORE, '2026-10-04')[0]?.sessionId).not.toBe(
      visits[0]?.sessionId,
    );
    expect(visits.length).toBeGreaterThan(50);
    expect(new Set(visits.map((visit) => visit.sessionId)).size).toBe(visits.length);
  });

  it('opens every visit with a page view and keeps its events in order, on its own day', () => {
    for (const visit of demoGeneratedVisits(DEMO_DOCS, DATE)) {
      const times = visit.events.map((event) => event.at);

      expect(visit.events[0]?.name).toBe('page_view');
      expect(times).toEqual(times.toSorted((first, second) => first - second));
      for (const event of visit.events) {
        expect(localDateAndTime(DEMO_DOCS.timezone, event.at)).toEqual({
          date: DATE,
          time: event.time,
        });
      }
    }
  });

  it('runs software that fits each device and names a country for the other share', () => {
    const mobile = new Set(['android', 'ios']);

    for (const visit of STORE_WEEK) {
      expect(visit.deviceType === 'mobile' ? mobile.has(visit.os) : true).toBe(true);
      expect(visit.country).not.toBe(OTHER_VALUE);
    }
    expect(new Set(STORE_WEEK.map((visit) => visit.country)).size).toBeGreaterThan(5);
  });

  it('tags only the campaigns the source of a visit runs', () => {
    const tagged = STORE_WEEK.filter((visit) => visit.campaign !== null);

    expect(tagged.length).toBeGreaterThan(0);
    for (const visit of tagged) {
      const source = DEMO_STORE.sources.find((candidate) => candidate.source === visit.source);
      expect(source?.campaigns.map(([campaign]) => campaign)).toContain(visit.campaign);
    }
    expect(STORE_WEEK.some((visit) => visit.fromAdClick)).toBe(true);
  });

  it('names a person for every visit inside the app or that converts, and nobody else', () => {
    const people = new Set(demoPeople(DEMO_STORE));
    const insideTheApp = new Set(
      DEMO_STORE.pages.filter((page) => page.stage >= 4).map((page) => page.path),
    );

    for (const visit of STORE_WEEK) {
      const signedIn =
        visit.events.some((event) => event.name === 'page_view' && insideTheApp.has(event.path)) ||
        named(visit, 'signup_completed').length > 0;
      expect(visit.userId !== null).toBe(signedIn);
      expect(visit.userId === null || people.has(visit.userId)).toBe(true);
    }
    expect(
      [DATE, ...WEEK]
        .flatMap((date) => demoGeneratedVisits(DEMO_DOCS, date))
        .some((visit) => visit.userId !== null),
    ).toBe(false);
  });

  it('completes a sign-up after it was submitted, and calls the API right before an order', () => {
    for (const visit of STORE_WEEK) {
      const [submitted] = named(visit, 'signup_submitted');
      for (const completed of named(visit, 'signup_completed')) {
        expect(completed.at).toBeGreaterThan(submitted?.at ?? Number.NEGATIVE_INFINITY);
      }
      const calls = requestsTo(visit, 'POST', '/orders').filter(
        (event) => event.request?.status === 201,
      );
      expect(calls.map((call) => call.at + 1000)).toEqual(
        named(visit, 'order_created').map((order) => order.at),
      );
    }
  });

  it('gives the failed requests the error codes of the catalog and long waits to no answer', () => {
    const failures = STORE_WEEK.flatMap((visit) =>
      visit.events.flatMap((event) =>
        event.request !== null && (event.request.status === 0 || event.request.status >= 400)
          ? [event.request]
          : [],
      ),
    );

    expect(failures.some((failure) => failure.method === 'GET')).toBe(true);
    for (const failure of failures) {
      expect(failure.errorCode === undefined).toBe(failure.status === 0);
    }
    expect(failures.find((failure) => failure.status === 409)?.errorCode).toBe(
      'order_number_in_use',
    );
  });

  it('draws nothing for a day without page views', () => {
    const quiet = crafted('quiet', {
      pages: [{ path: '/', perDay: 0.1, visitsPerView: 1, stage: 0 }],
    });

    expect(demoGeneratedVisits(quiet, DATE)).toEqual([]);
  });

  it('lands a visit no page reached on the landing page, and skips what nobody reached', () => {
    const sparse = crafted('sparse', {
      pages: [
        { path: '/never', perDay: 0, visitsPerView: 1, stage: 1 },
        { path: '/', perDay: 10, visitsPerView: 0.1, stage: 0 },
      ],
      events: [{ name: 'ghost', page: '/never', perDay: 5, visitsPerCount: 1, properties: [] }],
      routes: [
        {
          method: 'POST',
          route: '/ghost',
          perDay: 5,
          successStatus: 201,
          failures: [],
          medianDurationMs: 100,
          screens: [['/never', 1]],
        },
      ],
    });

    const visits = demoGeneratedVisits(sparse, DATE);

    expect(visits.length).toBeGreaterThan(1);
    expect(visits.every((visit) => visit.events.every((event) => event.path === '/'))).toBe(true);
  });

  it('runs desktop software on an unknown device and reaches an unsourced channel directly', () => {
    const unusual = crafted('unusual', {
      deviceTypes: [{ value: 'tv', share: 1, conversionWeight: 1 }],
      channels: { ...NO_CHANNELS, email: 1 },
    });

    const visits = demoGeneratedVisits(unusual, DATE);

    expect(
      visits.every((visit) => ['windows', 'macos', 'linux', 'chromeos'].includes(visit.os)),
    ).toBe(true);
    expect(visits.every((visit) => visit.source === '(direct)')).toBe(true);
  });

  it('leaves a signed-in visit without a person when the project has nobody to name', () => {
    const nobody = crafted('nobody', { signedInStage: 0, people: 0 });

    expect(demoGeneratedVisits(nobody, DATE).every((visit) => visit.userId === null)).toBe(true);
  });
});

describe('demoPeople', () => {
  it('names the people once, never one the showcase visits already name', () => {
    const first = `u_${(textSalt('taken person 0') % 65_536).toString(16).padStart(4, '0')}`;
    const taken = crafted('taken', {
      people: 3,
      showcase: DEMO_STORE.showcase.slice(0, 1).map((visit) => ({ ...visit, userId: first })),
    });

    const people = demoPeople(taken);

    expect(people).toHaveLength(3);
    expect(people).not.toContain(first);
    expect(demoPeople(taken)).toBe(people);
  });
});

describe('demoShareOf', () => {
  const shares = [
    { value: 'chrome', share: 0.6, conversionWeight: 1 },
    { value: OTHER_VALUE, share: 0.1, conversionWeight: 1 },
  ];

  it('reads the share of a value, the other share for an unlisted one, else nothing', () => {
    expect(demoShareOf(shares, 'chrome')).toBe(0.6);
    expect(demoShareOf(shares, 'opera')).toBe(0.1);
    expect(demoShareOf(shares.slice(0, 1), 'opera')).toBe(0);
  });
});

describe('clockOf', () => {
  it('writes the second of a day as a clock', () => {
    expect(clockOf(0)).toBe('00:00:00.000');
    expect(clockOf(65_431)).toBe('18:10:31.000');
  });
});
