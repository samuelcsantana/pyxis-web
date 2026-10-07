import { describe, expect, it } from 'vitest';
import {
  OTHER_VALUES_LABEL,
  propertyBreakdownResponseSchema,
  type PropertyBreakdownWire,
  propertyKeyViews,
} from './property-breakdown';

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
    const [calculator] = propertyKeyViews(propertyBreakdownResponseSchema.parse(WIRE));

    expect(calculator).toEqual({
      key: 'calculator',
      carriedBy: '1,250 events',
      rows: [
        { value: 'shipping', count: '775', visits: '640', share: '62%', barWidth: '62.0%' },
        { value: 'margin', count: '475', visits: '410', share: '38%', barWidth: '38.0%' },
      ],
      other: null,
    });
  });

  it('adds the values left out as other, with no visits to show', () => {
    const [, plan] = propertyKeyViews(propertyBreakdownResponseSchema.parse(WIRE));

    expect(plan?.carriedBy).toBe('1 event');
    expect(plan?.other).toEqual({
      value: OTHER_VALUES_LABEL,
      count: '1',
      visits: '—',
      share: '100%',
      barWidth: '100.0%',
    });
  });
});
