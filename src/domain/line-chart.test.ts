import { describe, expect, it } from 'vitest';
import { linePath } from './line-chart';

describe('linePath', () => {
  it('draws the line from the first day at the left edge to the last at the right edge', () => {
    expect(linePath([0, 100, 50], 200)).toBe('M0,1000L500,500L1000,750');
  });

  it('rounds every coordinate to a tenth of a plot unit', () => {
    expect(linePath([1, 2, 3, 3], 3)).toBe('M0,666.7L333.3,333.3L666.7,0L1000,0');
  });

  it('stretches a single day across the whole width', () => {
    expect(linePath([4], 8)).toBe('M0,500L1000,500');
  });

  it('draws nothing for a single day without a value', () => {
    expect(linePath([null], 8)).toBe('');
    expect(linePath([], 8, 1)).toBe('');
  });

  it('lies flat on the bottom edge when nothing happened', () => {
    expect(linePath([0, 0], 1)).toBe('M0,1000L1000,1000');
  });

  it('breaks the line on a day without a value and starts again after it', () => {
    expect(linePath([1, 2, null, 3, 4], 4)).toBe('M0,750L250,500M750,250L1000,0');
  });

  it('marks a day between two gaps as a dot', () => {
    expect(linePath([null, 2, null], 4)).toBe('M500,500L500,500');
  });

  it('places the days on the grid of another series when told how many days it has', () => {
    expect(linePath([1, 1], 1, 5)).toBe('M0,0L250,0');
    expect(linePath([1, 1, 1, 1], 1, 2)).toBe('M0,0L1000,0');
  });

  it('draws nothing without days', () => {
    expect(linePath([], 1)).toBe('');
  });
});
