import { describe, expect, it } from 'vitest';
import type { Feature } from './features';
import { featuresCsvTable } from './features-export';

const EVENTS: readonly Feature[] = [
  { name: 'signup_completed', count: 40, visits: 31, daily: [20, 20] },
  { name: 'cta_clicked', count: 25, visits: 19, daily: [10, 15] },
];

const SCREENS: readonly Feature[] = [
  { name: '/orders/:id', count: 90, visits: 22, daily: [45, 45] },
  { name: '/pricing', count: 30, visits: 28, daily: [12, 18] },
];

describe('featuresCsvTable', () => {
  it('writes every event under the name the site sent, with its count and visits', () => {
    expect(featuresCsvTable(EVENTS, 'events', '')).toEqual({
      columns: ['event', 'count', 'visits'],
      rows: [
        ['signup_completed', 40, 31],
        ['cta_clicked', 25, 19],
      ],
    });
  });

  it('keeps only what the search finds, by name or by label', () => {
    expect(featuresCsvTable(EVENTS, 'events', 'Signup').rows).toEqual([
      ['signup_completed', 40, 31],
    ]);
  });

  it('writes screens as page views per path template', () => {
    expect(featuresCsvTable(SCREENS, 'screens', 'orders')).toEqual({
      columns: ['screen', 'page_views', 'visits'],
      rows: [['/orders/:id', 90, 22]],
    });
  });
});
