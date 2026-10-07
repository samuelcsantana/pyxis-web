import { describe, expect, it } from 'vitest';
import {
  apportion,
  demoCount,
  demoDays,
  noise,
  previousRange,
  textSalt,
  weekdayFactor,
} from './demo-series';

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

describe('textSalt', () => {
  it('turns the same text into the same salt and different texts into different ones', () => {
    expect(textSalt('/orders')).toBe(textSalt('/orders'));
    expect(textSalt('/orders')).not.toBe(textSalt('/orders/new'));
    expect(textSalt('/orders')).toBeGreaterThanOrEqual(0);
  });
});

describe('apportion', () => {
  const counts = (total: number, weights: readonly number[]) =>
    apportion(total, weights, (weight) => weight).map(({ count }) => count);

  it('splits a whole number by weight without losing or inventing any unit', () => {
    expect(counts(10, [0.62, 0.34, 0.04])).toEqual([6, 4, 0]);
    expect(counts(7, [1, 1, 1])).toEqual([3, 2, 2]);
    expect(counts(100, [0.5, 0.25, 0.25]).reduce((sum, count) => sum + count, 0)).toBe(100);
  });

  it('keeps each item next to its count', () => {
    expect(apportion(3, ['a', 'b'], (item) => (item === 'a' ? 2 : 1))).toEqual([
      { item: 'a', count: 2 },
      { item: 'b', count: 1 },
    ]);
  });

  it('splits evenly when no item has any weight', () => {
    expect(counts(4, [0, 0])).toEqual([2, 2]);
    expect(counts(0, [0, 0])).toEqual([0, 0]);
  });
});
