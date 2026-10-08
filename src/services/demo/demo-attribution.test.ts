import { describe, expect, it } from 'vitest';
import { demoAttributedVisits } from './demo-attribution';
import { DEMO_STORE } from './demo-projects';

const SOCIAL_VISIT = {
  sessionId: '1b2c3d4e-0000-4000-8000-000000000010',
  daysAgo: 2,
  startHour: 9,
  startMinute: 0,
  deviceType: 'mobile',
  browser: 'chrome',
  os: 'android',
  country: 'BR',
  channel: 'social',
  events: [{ second: 3, name: 'page_view', path: '/' }],
} as const;

const STORE_SHOWCASE = { sources: DEMO_STORE.sources, visits: DEMO_STORE.showcase };

describe('demoAttributedVisits', () => {
  it('gives the visits of a channel its sources and campaigns in turn', () => {
    const paid = demoAttributedVisits(STORE_SHOWCASE)
      .filter(({ visit }) => visit.channel === 'paid')
      .slice(0, 5)
      .map(({ attribution }) => `${attribution.source} ${attribution.campaign ?? '-'}`);

    expect(paid).toEqual([
      'google spring_sale',
      'google brand_search',
      'google -',
      'bing spring_sale',
    ]);
  });

  it('keeps the medium of the source', () => {
    const [first] = demoAttributedVisits(STORE_SHOWCASE).filter(
      ({ visit }) => visit.channel === 'paid',
    );

    expect(first?.attribution.medium).toBe('cpc');
  });

  it('counts a visit as direct when its channel has no source', () => {
    const [attributed] = demoAttributedVisits({ sources: [], visits: [SOCIAL_VISIT] });

    expect(attributed?.attribution).toEqual({ source: '(direct)', medium: null, campaign: null });
  });
});
