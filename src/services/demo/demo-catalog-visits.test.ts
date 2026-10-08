import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { demoCatalogVisits, type DemoVisitCatalog, pick } from './demo-catalog-visits';
import { DEMO_PROJECTS, DEMO_STORE } from './demo-projects';

const SEED = 7;
const NO_CHANNELS = {
  paid: 0,
  email: 0,
  social: 0,
  campaign: 0,
  organic: 0,
  referral: 0,
  direct: 0,
} as const;

function catalog(overrides: Partial<DemoVisitCatalog>): DemoVisitCatalog {
  return { ...DEMO_STORE, events: [], ...overrides };
}

function namedEvents(visits: ReturnType<typeof demoCatalogVisits>) {
  return visits.flatMap((visit) =>
    visit.events.flatMap((event) => ('request' in event ? [] : [event])),
  );
}

describe('demoCatalogVisits', () => {
  it('sends each event once per value of its property with the most values', () => {
    const cta = DEMO_STORE.events.filter((event) => event.name === 'cta_clicked');

    const visits = demoCatalogVisits(catalog({ events: cta, pages: [] }), SEED);
    const sent = namedEvents(visits).filter((event) => event.name === 'cta_clicked');

    expect(sent).toHaveLength(5);
    expect(sent.map((event) => event.properties?.location)).toEqual([
      'calculator_result',
      'hero',
      'pricing',
      'nav',
      'final_cta',
    ]);
    expect(sent.map((event) => event.properties?.cta)).toEqual([
      'start_trial',
      'see_plans',
      'create_account',
      'view_demo',
      'start_trial',
    ]);
    expect(sent.every((event) => event.path === '/')).toBe(true);
  });

  it('sends an event without properties once, on its page after a page view', () => {
    const product = DEMO_STORE.events.filter((event) => event.name === 'product_created');

    const [visit] = demoCatalogVisits(catalog({ events: product, pages: [] }), SEED);

    expect(visit?.events).toEqual([
      { second: 3, name: 'page_view', path: '/products' },
      { second: 41, name: 'product_created', path: '/products', properties: {} },
    ]);
  });

  it('opens alone every page that no event visit reaches', () => {
    const signup = DEMO_STORE.events.filter((event) => event.name === 'signup_completed');
    const pages = [
      { path: '/sign-up', perDay: 1, visitsPerView: 1 },
      { path: '/pricing', perDay: 1, visitsPerView: 1 },
    ];

    const visits = demoCatalogVisits(catalog({ events: signup, pages }), SEED);

    expect(visits.map((visit) => visit.events.map((event) => event.path))).toEqual([
      ['/sign-up', '/sign-up'],
      ['/sign-up', '/sign-up'],
      ['/sign-up', '/sign-up'],
      ['/pricing'],
    ]);
  });

  it('takes turns over the device types, channels and countries the catalog counts', () => {
    const visits = demoCatalogVisits(catalog({ pages: DEMO_STORE.pages.slice(0, 4) }), SEED);

    expect(visits.map(({ deviceType, browser, os }) => [deviceType, browser, os])).toEqual([
      ['mobile', 'chrome', 'android'],
      ['desktop', 'chrome', 'windows'],
      ['tablet', 'safari', 'ios'],
      ['mobile', 'chrome', 'android'],
    ]);
    expect(visits.map((visit) => visit.channel)).toEqual(['paid', 'social', 'organic', 'referral']);
    expect(visits.map((visit) => visit.country)).toEqual(['BR', 'PT', 'US', 'AR']);
  });

  it('falls back to a direct desktop visit from Brazil when the catalog counts no shares', () => {
    const [visit] = demoCatalogVisits(
      catalog({
        pages: DEMO_STORE.pages.slice(0, 1),
        deviceTypes: [],
        countries: [],
        channels: NO_CHANNELS,
      }),
      SEED,
    );

    expect(visit).toMatchObject({
      deviceType: 'desktop',
      browser: 'chrome',
      os: 'windows',
      country: 'BR',
      channel: 'direct',
    });
  });

  it('starts every visit 15 to 27 days ago, early in the day', () => {
    const visits = demoCatalogVisits(catalog({ events: DEMO_STORE.events }), SEED);

    expect(Math.min(...visits.map((visit) => visit.daysAgo))).toBe(15);
    expect(Math.max(...visits.map((visit) => visit.daysAgo))).toBe(27);
    expect(Math.min(...visits.map((visit) => visit.startHour))).toBe(6);
    expect(Math.max(...visits.map((visit) => visit.startHour))).toBe(9);
  });

  it('gives every demo visit its own valid session id', () => {
    const ids = DEMO_PROJECTS.flatMap((project) => project.visits.map((visit) => visit.sessionId));

    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(z.uuid().safeParse(id).success, id).toBe(true);
    }
  });
});

describe('pick', () => {
  it('takes turns over the items', () => {
    expect([0, 1, 2, 3].map((index) => pick(['a', 'b', 'c'], index, 'z'))).toEqual([
      'a',
      'b',
      'c',
      'a',
    ]);
  });

  it('answers the fallback when there is nothing to pick', () => {
    expect(pick([], 3, 'z')).toBe('z');
  });
});
