import { describe, expect, it } from 'vitest';
import { CHANNELS } from '@/domain/acquisition';
import { addDays, todayIn } from '@/domain/period';
import { evenShares } from './demo-catalog';
import {
  demoDayFigures,
  demoEventTotals,
  demoFailures,
  demoFunnelCounts,
  demoPageTotals,
  demoShareCounts,
  demoVisitsTotal,
  pathPattern,
  RECENT_FAILURE_DAYS,
} from './demo-dataset';
import { DEMO_DOCS, DEMO_PROJECTS, DEMO_STORE } from './demo-projects';
import { demoFailedRequests, isFailedStatus } from './demo-visits';

const NOW = new Date('2026-10-06T02:30:00.000Z');
const MONTH = { from: '2026-09-06', to: '2026-10-05' };
const UNNAMED_EVENTS = new Set(['page_view', 'identify']);

describe('the demo visits of each project', () => {
  for (const project of DEMO_PROJECTS) {
    describe(project.name, () => {
      const events = project.visits.flatMap((visit) => visit.events);
      const named = events.flatMap((event) => ('request' in event ? [] : [event]));
      const requests = events.flatMap((event) => ('request' in event ? [event] : []));

      it('only open pages the project has', () => {
        const paths = new Set(project.pages.map((page) => page.path));

        expect(events.filter((event) => !paths.has(event.path))).toEqual([]);
      });

      it('only send events, properties and values the project has', () => {
        for (const event of named.filter((candidate) => !UNNAMED_EVENTS.has(candidate.name))) {
          const known = project.events.find((candidate) => candidate.name === event.name);
          expect(known, event.name).toBeDefined();
          for (const [key, value] of Object.entries(event.properties ?? {})) {
            const values = known?.properties.find((property) => property.key === key)?.values;
            expect(
              values?.map(([candidate]) => candidate),
              `${event.name}.${key}`,
            ).toContain(String(value));
          }
        }
      });

      it('only call routes the project has, from its screens, with its statuses', () => {
        for (const { path, request } of requests) {
          const route = project.routes.find(
            (candidate) => candidate.method === request.method && candidate.route === request.route,
          );
          const statuses = isFailedStatus(request.status)
            ? (route?.failures.map(([status]) => status) ?? [])
            : [route?.successStatus];
          expect(statuses, `${request.method} ${request.route}`).toContain(request.status);
          expect(route?.screens.map(([screen]) => screen)).toContain(path);
        }
      });

      it('come from devices, places and channels the project counts', () => {
        const valuesOf = (shares: readonly { value: string }[]) =>
          shares.map((share) => share.value);
        for (const visit of project.visits) {
          expect(valuesOf(project.deviceTypes)).toContain(visit.deviceType);
          expect(valuesOf(project.browsers)).toContain(visit.browser);
          expect(valuesOf(project.operatingSystems)).toContain(visit.os);
          expect(valuesOf(project.countries)).toContain(visit.country);
          expect(project.channels[visit.channel]).toBeGreaterThan(0);
        }
      });
    });
  }
});

describe('the demo catalog of each project', () => {
  for (const project of DEMO_PROJECTS) {
    it(`gives every channel of ${project.name} with visits a source to come from`, () => {
      for (const channel of CHANNELS.filter((candidate) => project.channels[candidate] > 0)) {
        expect(project.sources.map((source) => source.channel)).toContain(channel);
      }
    });

    it(`never gives a page or an event of ${project.name} more visits than the period has`, () => {
      const visits = demoVisitsTotal(project, MONTH);

      for (const total of [...demoPageTotals(project, MONTH), ...demoEventTotals(project, MONTH)]) {
        expect(total.visits, total.name).toBeLessThanOrEqual(visits);
      }
    });
  }
});

describe('demoFailures', () => {
  it('takes the failures of the last days only from the demo visits', () => {
    const today = todayIn(DEMO_STORE.timezone, NOW);
    const recent = { from: addDays(today, 1 - RECENT_FAILURE_DAYS), to: today };

    const failures = demoFailures(DEMO_STORE, recent, NOW);

    expect(failures.every((failure) => failure.request !== null)).toBe(true);
    expect(failures).toHaveLength(demoFailedRequests(DEMO_STORE.visits, NOW).length);
  });

  it('invents failures for older days, on the screens of each route', () => {
    const failures = demoFailures(DEMO_STORE, { from: '2026-08-01', to: '2026-09-15' }, NOW);
    const screensOf = (route: string) =>
      new Set(failures.filter((failure) => failure.route === route).map((failure) => failure.path));

    expect(failures.length).toBeGreaterThan(0);
    expect(failures.every((failure) => failure.request === null)).toBe(true);
    expect(screensOf('/orders')).toEqual(new Set(['/orders', '/orders/new']));
  });

  it('adds up to the failed writes of each day', () => {
    const days = demoDayFigures(DEMO_STORE, MONTH, NOW);
    const failures = demoFailures(DEMO_STORE, MONTH, NOW);

    expect(days.reduce((sum, day) => sum + day.failedWrites, 0)).toBe(
      failures.reduce((sum, failure) => sum + failure.count, 0),
    );
    expect(days.every((day) => day.failedWrites <= day.writes)).toBe(true);
  });
});

describe('demoDayFigures', () => {
  it('counts no conversions for a project without a conversion event', () => {
    expect(demoDayFigures(DEMO_DOCS, MONTH, NOW).every((day) => day.conversions === 0)).toBe(true);
    expect(demoDayFigures(DEMO_STORE, MONTH, NOW).every((day) => day.conversions > 0)).toBe(true);
  });
});

describe('demoShareCounts', () => {
  const shares = evenShares([
    ['chrome', 0.5],
    ['safari', 0.5],
  ]);

  it('splits the visits and the conversions of the period', () => {
    expect(demoShareCounts(11, 3, shares)).toEqual([
      { value: 'chrome', visits: 6, conversions: 2 },
      { value: 'safari', visits: 5, conversions: 1 },
    ]);
  });

  it('leaves conversions out when the project has no conversion event', () => {
    expect(demoShareCounts(4, null, shares)).toEqual([
      { value: 'chrome', visits: 2, conversions: null },
      { value: 'safari', visits: 2, conversions: null },
    ]);
  });
});

describe('pathPattern', () => {
  it('matches a star with any characters and everything else literally', () => {
    expect(pathPattern('/orders*').test('/orders/:id')).toBe(true);
    expect(pathPattern('/orders').test('/orders/:id')).toBe(false);
    expect(pathPattern('/.*').test('/orders')).toBe(false);
  });
});

describe('demoFunnelCounts', () => {
  it('counts nobody at a step the project never saw, nor after it', () => {
    expect(
      demoFunnelCounts(DEMO_STORE, MONTH, 'visit', [
        { type: 'page', path: '/calculator' },
        { type: 'event', name: 'never_sent' },
        { type: 'page', path: '/pricing' },
      ]),
    ).toEqual([expect.any(Number), 0, 0]);
  });

  it('reaches every page a star matches, never more than the visits of the period', () => {
    const [everyPage] = demoFunnelCounts(DEMO_STORE, MONTH, 'visit', [
      { type: 'page', path: '/*' },
      { type: 'page', path: '/pricing' },
    ]);

    expect(everyPage).toBe(demoVisitsTotal(DEMO_STORE, MONTH));
  });

  it('keeps half of each step once the listed continuations run out', () => {
    const counts = demoFunnelCounts(DEMO_DOCS, MONTH, 'visit', [
      ...DEMO_DOCS.exampleFunnel,
      { type: 'page', path: '/' },
      { type: 'page', path: '/' },
    ]);

    expect(counts).toHaveLength(6);
    expect(counts[4]).toBe(Math.round((counts[3] ?? 0) * 0.5));
    expect(counts[5]).toBe(Math.round((counts[4] ?? 0) * 0.5));
  });
});
