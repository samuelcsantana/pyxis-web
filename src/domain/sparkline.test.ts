import { describe, expect, it } from 'vitest';
import { sparklineSegments } from './sparkline';

const BOX = { width: 120, height: 36, inset: 3 };

describe('sparklineSegments', () => {
  it('spreads the values over the width, the highest at the top inset', () => {
    expect(sparklineSegments([0, 10, 5], BOX)).toEqual(['0,33 60,3 120,18']);
  });

  it('draws a flat line through the middle when nothing changes', () => {
    expect(sparklineSegments([4, 4], BOX)).toEqual(['0,18 120,18']);
  });

  it('stretches a single day across the whole width', () => {
    expect(sparklineSegments([7], BOX)).toEqual(['0,18 120,18']);
  });

  it('draws nothing without values', () => {
    expect(sparklineSegments([], BOX)).toEqual([]);
    expect(sparklineSegments([null, null], BOX)).toEqual([]);
  });

  it('breaks the line where a day has no value, keeping every day in its place', () => {
    expect(sparklineSegments([0, 10, null, null, 5], BOX)).toEqual(['0,33 30,3', '120,18 120,18']);
  });

  it('leaves a gap before the first and after the last value', () => {
    expect(sparklineSegments([null, 0, 10, null], BOX)).toEqual(['40,33 80,3']);
  });

  it('draws a lone value between gaps as a dot', () => {
    expect(sparklineSegments([0, null, 10, null, 5], BOX)).toEqual([
      '0,33 0,33',
      '60,3 60,3',
      '120,18 120,18',
    ]);
  });
});
