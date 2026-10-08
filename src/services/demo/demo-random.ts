export type Random = () => number;

const STATE_INCREMENT = 0x6d2b79f5;
const FIRST_SHIFT = 15;
const SECOND_SHIFT = 7;
const THIRD_SHIFT = 14;
const ODD_BIT = 1;
const MIX_BITS = 61;
const UINT32_RANGE = 2 ** 32;
const SMALLEST_UNIFORM = 1 / UINT32_RANGE;
const FULL_TURN = 2 * Math.PI;
const NATURAL_LOG_SCALE = -2;

export function seededRandom(seed: number): Random {
  let state = seed >>> 0;
  return () => {
    state = (state + STATE_INCREMENT) >>> 0;
    let value = Math.imul(state ^ (state >>> FIRST_SHIFT), state | ODD_BIT);
    value ^= value + Math.imul(value ^ (value >>> SECOND_SHIFT), value | MIX_BITS);
    return ((value ^ (value >>> THIRD_SHIFT)) >>> 0) / UINT32_RANGE;
  };
}

export function between(random: Random, lowest: number, highest: number): number {
  return lowest + Math.floor(random() * (highest - lowest + 1));
}

export function standardNormal(random: Random): number {
  const radius = Math.sqrt(NATURAL_LOG_SCALE * Math.log(Math.max(random(), SMALLEST_UNIFORM)));
  return radius * Math.cos(FULL_TURN * random());
}

export function shuffled<Item>(items: readonly Item[], random: Random): readonly Item[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1));
    const kept = result[index] as Item;
    result[index] = result[other] as Item;
    result[other] = kept;
  }
  return result;
}

export function itemAt<Item>(items: readonly Item[], index: number): Item {
  return items[index] as Item;
}

export function weightedIndex(weights: readonly number[], random: Random): number {
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let left = random() * total;
  for (const [index, weight] of weights.entries()) {
    left -= weight;
    if (left < 0) {
      return index;
    }
  }
  return weights.length - 1;
}

export function weightedPick<Item>(
  items: readonly Item[],
  weightOf: (item: Item) => number,
  random: Random,
): Item | undefined {
  return items[weightedIndex(items.map(weightOf), random)];
}

export function weightedSample<Item>(
  items: readonly Item[],
  count: number,
  weightOf: (item: Item) => number,
  random: Random,
): readonly Item[] {
  return items
    .map((item) => ({ item, key: Math.log(Math.max(random(), SMALLEST_UNIFORM)) / weightOf(item) }))
    .toSorted((first, second) => second.key - first.key)
    .slice(0, count)
    .map(({ item }) => item);
}
