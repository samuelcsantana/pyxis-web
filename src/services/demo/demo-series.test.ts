import { describe, expect, it } from 'vitest';
import { demoCount, demoDays, noise, previousRange, weekdayFactor } from './demo-series';

const MONTH = demoDays({ from: '2026-09-01', to: '2026-09-30' });

function meanNeighbourGap(values: readonly number[]): number {
  const gaps = values.slice(1).map((value, index) => Math.abs(value - (values[index] ?? value)));
  return gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;
}

describe('noise', () => {
  it('stays between zero and one and is the same for the same date and salt', () => {
    for (const date of MONTH) {
      expect(noise(date, 1)).toBeGreaterThanOrEqual(0);
      expect(noise(date, 1)).toBeLessThan(1);
      expect(noise(date, 1)).toBe(noise(date, 1));
    }
  });

  it('moves from one day to the next instead of drifting slowly', () => {
    expect(meanNeighbourGap(MONTH.map((date) => noise(date, 1)))).toBeGreaterThan(0.2);
  });

  it('gives a different series for a different salt', () => {
    expect(MONTH.map((date) => noise(date, 1))).not.toEqual(MONTH.map((date) => noise(date, 2)));
  });
});

describe('demoCount', () => {
  it('varies across the weekdays of a month', () => {
    const weekdays = MONTH.filter((date) => weekdayFactor(date) === 1);
    const counts = weekdays.map((date) => demoCount(date, 160, 1));

    expect(new Set(counts).size).toBeGreaterThan(weekdays.length / 2);
    expect(meanNeighbourGap(counts)).toBeGreaterThan(8);
  });

  it('is quieter on weekends', () => {
    expect(weekdayFactor('2026-10-03')).toBe(0.7);
    expect(weekdayFactor('2026-10-04')).toBe(0.7);
    expect(weekdayFactor('2026-10-05')).toBe(1);
  });
});

describe('demoDays and previousRange', () => {
  it('list every day of the range and the same number of days before it', () => {
    expect(MONTH).toHaveLength(30);
    expect(previousRange({ from: '2026-09-01', to: '2026-09-30' })).toEqual({
      from: '2026-08-02',
      to: '2026-08-31',
    });
  });
});
