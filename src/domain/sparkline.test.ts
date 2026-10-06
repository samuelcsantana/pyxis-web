import { describe, expect, it } from 'vitest';
import { sparklinePoints } from './sparkline';

const BOX = { width: 120, height: 36, inset: 3 };

describe('sparklinePoints', () => {
  it('spreads the values over the width, the highest at the top inset', () => {
    expect(sparklinePoints([0, 10, 5], BOX)).toBe('0,33 60,3 120,18');
  });

  it('draws a flat line through the middle when nothing changes', () => {
    expect(sparklinePoints([4, 4], BOX)).toBe('0,18 120,18');
  });

  it('stretches a single day across the whole width', () => {
    expect(sparklinePoints([7], BOX)).toBe('0,18 120,18');
  });

  it('draws nothing without values', () => {
    expect(sparklinePoints([], BOX)).toBe('');
  });
});
