import { describe, expect, it } from 'vitest';
import { areaShape } from './area-chart';

describe('areaShape', () => {
  it('draws the line from the first day at the left edge to the last at the right edge', () => {
    expect(areaShape([0, 100, 50], 200)).toEqual({
      line: 'M0,1000L500,500L1000,750',
      area: 'M0,1000L500,500L1000,750L1000,1000L0,1000Z',
    });
  });

  it('rounds every coordinate to a tenth of a plot unit', () => {
    expect(areaShape([1, 2, 3, 3], 3).line).toBe('M0,666.7L333.3,333.3L666.7,0L1000,0');
  });

  it('stretches a single day across the whole width', () => {
    expect(areaShape([4], 8)).toEqual({
      line: 'M0,500L1000,500',
      area: 'M0,500L1000,500L1000,1000L0,1000Z',
    });
  });

  it('lies flat on the bottom edge when nothing happened', () => {
    expect(areaShape([0, 0], 1).line).toBe('M0,1000L1000,1000');
  });

  it('draws nothing without days', () => {
    expect(areaShape([], 1)).toEqual({ line: '', area: '' });
  });
});
