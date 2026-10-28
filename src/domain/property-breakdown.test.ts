import { describe, expect, it } from 'vitest';
import { type PropertyBreakdownWire, propertyKeyViews } from './property-breakdown';
import { propertyBreakdownResponseSchema } from './property-breakdown.schema';
import { english } from '@/test-utils/english';

const WIRE: PropertyBreakdownWire = {
  name: 'calculator_result_shown',
  events: 1250,
  keys: [
    {
      key: 'calculator',
      events: 1250,
      values: [
        { value: 'shipping', count: 775, visits: 640 },
        { value: 'margin', count: 475, visits: 410 },
      ],
      other_count: 0,
    },
    {
      key: 'plan',
      events: 1,
      values: [],
      other_count: 1,
    },
  ],
};

describe('propertyBreakdownResponseSchema', () => {
  it('reads the wire in camel case', () => {
    const report = propertyBreakdownResponseSchema.parse(WIRE);

    expect(report.name).toBe('calculator_result_shown');
    expect(report.keys[0]?.otherCount).toBe(0);
    expect(report.keys[0]?.values[1]).toEqual({ value: 'margin', count: 475, visits: 410 });
  });
});

describe('propertyKeyViews', () => {
  it('shares each value out of the events that carry the key', () => {
    const [calculator] = propertyKeyViews(propertyBreakdownResponseSchema.parse(WIRE), english);

    expect(calculator).toEqual({
      key: 'calculator',
      carriedBy: '1,250 events',
      rows: [
        { value: 'shipping', count: '775', visits: '640', share: '62.0%', barWidth: '62.0%' },
        { value: 'margin', count: '475', visits: '410', share: '38.0%', barWidth: '38.0%' },
      ],
      other: null,
      numeric: false,
    });
  });

  it('adds the values left out as other, with no visits to show', () => {
    const [, plan] = propertyKeyViews(propertyBreakdownResponseSchema.parse(WIRE), english);

    expect(plan?.carriedBy).toBe('1 event');
    expect(plan?.other).toEqual({
      value: 'Other values',
      count: '1',
      visits: '—',
      share: '100.0%',
      barWidth: '100.0%',
    });
  });

  it('calls a key numeric when every value it shows reads as a number', () => {
    const [view] = propertyKeyViews(
      propertyBreakdownResponseSchema.parse({
        name: 'article_read_100',
        events: 3,
        keys: [
          {
            key: 'seconds',
            events: 3,
            values: [
              { value: '12.5', count: 2, visits: 2 },
              { value: '-3', count: 1, visits: 1 },
            ],
            other_count: 0,
          },
        ],
      }),
      english,
    );

    expect(view?.numeric).toBe(true);
  });
});
