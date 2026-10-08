import { describe, expect, it } from 'vitest';
import {
  cssPercent,
  gridLines,
  offsetFromTop,
  PLOT_SIZE,
  plotY,
  roundCoordinate,
  valueAxis,
} from './chart-scale';

describe('valueAxis', () => {
  it.each([
    { highest: 191, top: 200, ticks: [0, 50, 100, 150, 200] },
    { highest: 100, top: 100, ticks: [0, 50, 100] },
    { highest: 101, top: 150, ticks: [0, 50, 100, 150] },
    { highest: 41, top: 60, ticks: [0, 20, 40, 60] },
    { highest: 40, top: 40, ticks: [0, 10, 20, 30, 40] },
    { highest: 7, top: 8, ticks: [0, 2, 4, 6, 8] },
    { highest: 9, top: 10, ticks: [0, 5, 10] },
    { highest: 23, top: 30, ticks: [0, 10, 20, 30] },
    { highest: 7000, top: 8000, ticks: [0, 2000, 4000, 6000, 8000] },
  ])('rounds a highest value of $highest up to $top in round steps', ({ highest, top, ticks }) => {
    expect(valueAxis([0, highest, highest / 2])).toEqual({ top, ticks });
  });

  it('counts in steps of one below five, never in fractions', () => {
    expect(valueAxis([3])).toEqual({ top: 3, ticks: [0, 1, 2, 3] });
    expect(valueAxis([4])).toEqual({ top: 4, ticks: [0, 1, 2, 3, 4] });
  });

  it('keeps a scale from zero to one when nothing happened', () => {
    expect(valueAxis([0, 0, 0])).toEqual({ top: 1, ticks: [0, 1] });
    expect(valueAxis([])).toEqual({ top: 1, ticks: [0, 1] });
  });

  it('reaches the highest value with at most five whole ticks, whatever the count', () => {
    const highestValues = Array.from({ length: 3000 }, (_, index) => index * 7);
    for (const highest of highestValues) {
      const { top, ticks } = valueAxis([highest]);
      expect(top).toBeGreaterThanOrEqual(highest);
      expect(ticks.length).toBeGreaterThanOrEqual(2);
      expect(ticks.length).toBeLessThanOrEqual(5);
      expect(ticks.every(Number.isInteger)).toBe(true);
      expect(ticks.at(-1)).toBe(top);
    }
  });
});

describe('plotY', () => {
  it('puts zero at the bottom of the plot and the top value at its top', () => {
    expect(plotY(0, 200)).toBe(PLOT_SIZE);
    expect(plotY(200, 200)).toBe(0);
    expect(plotY(50, 200)).toBe(750);
  });

  it('rounds to a tenth of a plot unit', () => {
    expect(plotY(1, 3)).toBe(666.7);
  });
});

describe('roundCoordinate', () => {
  it('keeps one decimal', () => {
    expect(roundCoordinate(33.333)).toBe(33.3);
    expect(roundCoordinate(66.66)).toBe(66.7);
  });
});

describe('cssPercent', () => {
  it('writes a fraction as a CSS percentage with at most two decimals', () => {
    expect(cssPercent(0.25)).toBe('25%');
    expect(cssPercent(1 / 3)).toBe('33.33%');
    expect(cssPercent(0)).toBe('0%');
    expect(cssPercent(1)).toBe('100%');
  });
});

describe('offsetFromTop', () => {
  it('places a tick label as far down as its value is below the top', () => {
    expect(offsetFromTop(200, 200)).toBe('0%');
    expect(offsetFromTop(150, 200)).toBe('25%');
    expect(offsetFromTop(0, 200)).toBe('100%');
  });
});

describe('gridLines', () => {
  it('draws one line across the plot at each tick', () => {
    expect(gridLines(valueAxis([100]))).toBe('M0,1000H1000M0,500H1000M0,0H1000');
  });
});
