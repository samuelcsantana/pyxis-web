import { describe, expect, it } from 'vitest';
import {
  between,
  itemAt,
  seededRandom,
  shuffled,
  standardNormal,
  weightedIndex,
  weightedPick,
  weightedSample,
} from './demo-random';

const SAMPLES = 2000;

function constant(value: number) {
  return () => value;
}

function draws(seed: number, count: number): readonly number[] {
  const random = seededRandom(seed);
  return Array.from({ length: count }, () => random());
}

describe('seededRandom', () => {
  it('repeats the same numbers for the same seed, all between 0 and 1', () => {
    const numbers = draws(42, SAMPLES);

    expect(draws(42, SAMPLES)).toEqual(numbers);
    expect(draws(43, SAMPLES)).not.toEqual(numbers);
    expect(numbers.every((number) => number >= 0 && number < 1)).toBe(true);
    expect(new Set(numbers).size).toBe(SAMPLES);
  });
});

describe('between', () => {
  it('draws a whole number inside both bounds', () => {
    expect(between(constant(0), 3, 7)).toBe(3);
    expect(between(constant(0.999), 3, 7)).toBe(7);
    expect(between(constant(0.5), 3, 7)).toBe(5);
  });
});

describe('standardNormal', () => {
  it('draws numbers centred on zero with a spread of one', () => {
    const random = seededRandom(7);
    const numbers = Array.from({ length: SAMPLES }, () => standardNormal(random));
    const mean = numbers.reduce((sum, number) => sum + number, 0) / SAMPLES;
    const variance = numbers.reduce((sum, number) => sum + (number - mean) ** 2, 0) / (SAMPLES - 1);

    expect(Math.abs(mean)).toBeLessThan(0.1);
    expect(Math.abs(Math.sqrt(variance) - 1)).toBeLessThan(0.1);
  });

  it('stays finite when the uniform draw is zero', () => {
    expect(Number.isFinite(standardNormal(constant(0)))).toBe(true);
  });
});

describe('shuffled', () => {
  it('returns the same items in a new order without touching the input', () => {
    const items = Array.from({ length: 20 }, (_, index) => index);

    const result = shuffled(items, seededRandom(1));

    expect(result.toSorted((first, second) => first - second)).toEqual(items);
    expect(result).not.toEqual(items);
    expect(items).toEqual(Array.from({ length: 20 }, (_, index) => index));
    expect(shuffled(items, seededRandom(1))).toEqual(result);
  });
});

describe('itemAt', () => {
  it('reads the item at a position', () => {
    expect(itemAt(['a', 'b'], 1)).toBe('b');
  });
});

describe('weightedIndex', () => {
  it('picks a position in proportion to its weight', () => {
    expect(weightedIndex([1, 3], constant(0.2))).toBe(0);
    expect(weightedIndex([1, 3], constant(0.3))).toBe(1);
    expect(weightedIndex([0, 2], constant(0))).toBe(1);
  });

  it('falls back to the last position when no weight counts, and to none without positions', () => {
    expect(weightedIndex([0, 0, 0], constant(0.5))).toBe(2);
    expect(weightedIndex([], constant(0.5))).toBe(-1);
  });
});

describe('weightedPick', () => {
  it('picks an item by its weight, and nothing from no items', () => {
    const items = [
      { name: 'light', weight: 1 },
      { name: 'heavy', weight: 9 },
    ];

    expect(weightedPick(items, (item) => item.weight, constant(0.05))?.name).toBe('light');
    expect(weightedPick(items, (item) => item.weight, constant(0.5))?.name).toBe('heavy');
    expect(weightedPick<string>([], () => 1, constant(0.5))).toBeUndefined();
  });
});

describe('weightedSample', () => {
  it('takes distinct items, the heavier ones far more often', () => {
    const random = seededRandom(3);
    const picks = Array.from({ length: SAMPLES }, () =>
      weightedSample(
        ['light', 'heavy', 'middle'],
        2,
        (item) => (item === 'heavy' ? 20 : 1),
        random,
      ),
    );

    expect(picks.every((pick) => pick.length === 2 && new Set(pick).size === 2)).toBe(true);
    expect(picks.filter((pick) => pick.includes('heavy')).length).toBeGreaterThan(SAMPLES * 0.95);
  });
});
