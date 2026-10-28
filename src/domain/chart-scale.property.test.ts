import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { PROPERTY_RUN } from '@/test-utils/property-run';
import { PLOT_SIZE, plotY, valueAxis } from './chart-scale';

const MAX_TICKS = 5;
const SMALLEST_TOP = 1;
const MAX_SMALL_COUNT = 100;

const chartValue = fc.oneof(
  fc.nat({ max: MAX_SMALL_COUNT }),
  fc.maxSafeNat(),
  fc.double({ min: 0, max: Number.MAX_SAFE_INTEGER, noNaN: true }),
);
const chartValues = fc.array(chartValue);
const fraction = fc.double({ min: 0, max: 1, noNaN: true });

function stepOf(ticks: readonly number[]): number {
  return (ticks[1] ?? 0) - (ticks[0] ?? 0);
}

describe('valueAxis over generated non-negative values', () => {
  it('climbs from zero to the top in at most five equal whole steps', () => {
    fc.assert(
      fc.property(chartValues, (values) => {
        const { top, ticks } = valueAxis(values);
        const step = stepOf(ticks);

        expect(ticks[0]).toBe(0);
        expect(ticks.at(-1)).toBe(top);
        expect(ticks.length).toBeGreaterThanOrEqual(2);
        expect(ticks.length).toBeLessThanOrEqual(MAX_TICKS);
        expect(Number.isInteger(step) && step > 0).toBe(true);
        expect(ticks.every((tick, index) => tick === index * step)).toBe(true);
      }),
      PROPERTY_RUN,
    );
  });

  it('tops out at the first step at or above the highest value, never below it', () => {
    fc.assert(
      fc.property(chartValues, (values) => {
        const { top, ticks } = valueAxis(values);
        const highest = Math.max(SMALLEST_TOP, ...values);

        expect(top).toBeGreaterThanOrEqual(highest);
        expect(top - stepOf(ticks)).toBeLessThan(highest);
      }),
      PROPERTY_RUN,
    );
  });
});

describe('plotY over generated values within the axis', () => {
  it('stays inside the plot and never draws a higher value lower', () => {
    fc.assert(
      fc.property(chartValues, fraction, fraction, (values, low, high) => {
        const { top } = valueAxis(values);
        const [lower, higher] = low <= high ? [low, high] : [high, low];
        const lowerY = plotY(lower * top, top);
        const higherY = plotY(higher * top, top);

        expect(lowerY).toBeGreaterThanOrEqual(0);
        expect(lowerY).toBeLessThanOrEqual(PLOT_SIZE);
        expect(higherY).toBeGreaterThanOrEqual(0);
        expect(higherY).toBeLessThanOrEqual(lowerY);
      }),
      PROPERTY_RUN,
    );
  });
});
