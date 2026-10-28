import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { PROPERTY_RUN } from '@/test-utils/property-run';
import { withDonutSegments, type DonutSegment } from './donut';

const HALF_A_HUNDREDTH = 0.005;
const WRITTEN_VALUES_AT_A_JOIN = 3;
const FLOAT_SLACK = 1e-9;
const ROUNDING_TOLERANCE = WRITTEN_VALUES_AT_A_JOIN * HALF_A_HUNDREDTH + FLOAT_SLACK;
const MAX_VISITS = 1_000_000;
const MAX_SHARES = 12;
const MIN_CIRCUMFERENCE = 1;
const MAX_CIRCUMFERENCE = 1000;
const FIRST_OFFSET = '0.00';

interface Arc {
  readonly start: number;
  readonly length: number;
  readonly gap: number;
}

function arcOf(segment: DonutSegment): Arc {
  const [length = Number.NaN, gap = Number.NaN] = segment.dashArray.split(' ').map(Number);
  return { start: -Number(segment.dashOffset), length, gap };
}

const visitShares = fc
  .array(fc.nat({ max: MAX_VISITS }), { minLength: 1, maxLength: MAX_SHARES })
  .filter((visits) => visits.some((count) => count > 0))
  .map((visits) => {
    const total = visits.reduce((sum, count) => sum + count, 0);
    return visits.map((count, index) => ({
      id: `share-${String(index)}`,
      fraction: count / total,
    }));
  });
const circumference = fc.double({
  min: MIN_CIRCUMFERENCE,
  max: MAX_CIRCUMFERENCE,
  noNaN: true,
});

describe('withDonutSegments over generated visit shares', () => {
  it('keeps every share in order, with a dash and a gap that add up to the circumference', () => {
    fc.assert(
      fc.property(visitShares, circumference, (shares, size) => {
        const drawn = withDonutSegments(shares, size);

        expect(drawn.map(({ id, fraction }) => ({ id, fraction }))).toEqual(shares);
        for (const arc of drawn.map(arcOf)) {
          expect(arc.length).toBeGreaterThanOrEqual(0);
          expect(Math.abs(arc.length + arc.gap - size)).toBeLessThanOrEqual(ROUNDING_TOLERANCE);
        }
      }),
      PROPERTY_RUN,
    );
  });

  it('goes round the circle once, each arc starting where the previous one ended', () => {
    fc.assert(
      fc.property(visitShares, circumference, (shares, size) => {
        const drawn = withDonutSegments(shares, size);
        const arcs = drawn.map(arcOf);
        const starts = [...arcs.map((arc) => arc.start), size];
        const ends = [0, ...arcs.map((arc) => arc.start + arc.length)];
        const joinErrors = starts.map((start, index) =>
          Math.abs(start - (ends[index] ?? Number.NaN)),
        );

        expect(drawn[0]?.dashOffset).toBe(FIRST_OFFSET);
        expect(Math.max(...joinErrors)).toBeLessThanOrEqual(ROUNDING_TOLERANCE);
      }),
      PROPERTY_RUN,
    );
  });
});
