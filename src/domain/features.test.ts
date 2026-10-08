import { describe, expect, it } from 'vitest';
import { featureKindOf, featureLabel, featureRows, searchQueryOf } from './features';
import { featuresResponseSchema } from './features.schema';
import { english } from '@/test-utils/english';

const ITEMS = featuresResponseSchema.parse({
  items: [
    { name: 'calculator_result_shown', count: 300, visits: 200, daily: [100, 200] },
    { name: 'cta_clicked', count: 100, visits: 90, daily: [40, 60] },
  ],
}).items;

describe('featureKindOf and searchQueryOf', () => {
  it('read the kind from the URL, events unless screens is asked for', () => {
    expect(featureKindOf({ kind: 'screens' })).toBe('screens');
    expect(featureKindOf({ kind: 'events' })).toBe('events');
    expect(featureKindOf({ kind: 'nonsense' })).toBe('events');
    expect(featureKindOf({ kind: ['screens', 'events'] })).toBe('events');
    expect(featureKindOf({})).toBe('events');
  });

  it('read the search trimmed and capped, empty when absent', () => {
    expect(searchQueryOf({ q: '  cta  ' })).toBe('cta');
    expect(searchQueryOf({ q: 'x'.repeat(150) })).toHaveLength(100);
    expect(searchQueryOf({ q: ['a', 'b'] })).toBe('');
    expect(searchQueryOf({})).toBe('');
  });
});

describe('featureLabel', () => {
  it('turns an event name into words and keeps a screen path as it is', () => {
    expect(featureLabel('events', 'cta_clicked')).toBe('CTA clicked');
    expect(featureLabel('screens', '/orders/:id')).toBe('/orders/:id');
  });
});

describe('featureRows', () => {
  it('gives every feature its count, visits, share of all counts and trend', () => {
    expect(featureRows(ITEMS, 'events', '', english)).toEqual([
      {
        name: 'calculator_result_shown',
        label: 'Calculator result shown',
        count: '300',
        visits: '200',
        share: '75.0%',
        barWidth: '100.0%',
        daily: [100, 200],
      },
      {
        name: 'cta_clicked',
        label: 'CTA clicked',
        count: '100',
        visits: '90',
        share: '25.0%',
        barWidth: '33.3%',
        daily: [40, 60],
      },
    ]);
  });

  it('keeps the features whose name or label holds the search, in any case', () => {
    expect(featureRows(ITEMS, 'events', 'CTA', english).map((row) => row.name)).toEqual([
      'cta_clicked',
    ]);
    expect(featureRows(ITEMS, 'events', 'result shown', english).map((row) => row.name)).toEqual([
      'calculator_result_shown',
    ]);
    expect(featureRows(ITEMS, 'events', 'nothing like it', english)).toEqual([]);
  });

  it('keeps the share of the whole ranking while searching', () => {
    expect(featureRows(ITEMS, 'events', 'cta', english)[0]?.share).toBe('25.0%');
  });

  it('shows dashes, not NaN, for a ranking of zeros', () => {
    const [row] = featureRows(
      [{ name: '/', count: 0, visits: 0, daily: [0] }],
      'screens',
      '',
      english,
    );

    expect(row?.share).toBe('—');
    expect(row?.barWidth).toBe('0.0%');
  });
});
