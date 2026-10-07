import { addDays, daysBetween } from '@/domain/period';
import type { DateRange } from '../date-range';

const WEEKEND_FACTOR = 0.7;
const SATURDAY = 6;
const SUNDAY = 0;
const FNV_OFFSET_BASIS = 0x811c9dc5;
const FNV_PRIME = 0x01000193;
const MIX_SHIFT_HIGH = 16;
const MIX_SHIFT_MIDDLE = 13;
const MIX_MULTIPLIER_FIRST = 0x85ebca6b;
const MIX_MULTIPLIER_SECOND = 0xc2b2ae35;
const UINT32_RANGE = 2 ** 32;
const LOWEST_DAY_FACTOR = 0.8;
const DAY_FACTOR_SPREAD = 0.4;

export interface Apportioned<Item> {
  readonly item: Item;
  readonly count: number;
}

export function demoDays(range: DateRange): readonly string[] {
  return Array.from({ length: daysBetween(range.from, range.to) }, (_, index) =>
    addDays(range.from, index),
  );
}

export function previousRange(range: DateRange): DateRange {
  const length = daysBetween(range.from, range.to);
  return { from: addDays(range.from, -length), to: addDays(range.from, -1) };
}

function mixed(hash: number): number {
  let mixing = hash ^ (hash >>> MIX_SHIFT_HIGH);
  mixing = Math.imul(mixing, MIX_MULTIPLIER_FIRST);
  mixing ^= mixing >>> MIX_SHIFT_MIDDLE;
  mixing = Math.imul(mixing, MIX_MULTIPLIER_SECOND);
  return mixing ^ (mixing >>> MIX_SHIFT_HIGH);
}

function fnv(text: string, basis: number): number {
  let hash = basis;
  for (const character of text) {
    hash = Math.imul(hash ^ character.charCodeAt(0), FNV_PRIME);
  }
  return hash;
}

export function textSalt(text: string): number {
  return fnv(text, FNV_OFFSET_BASIS) >>> 0;
}

export function noise(date: string, salt: number): number {
  return (mixed(fnv(date, FNV_OFFSET_BASIS ^ salt)) >>> 0) / UINT32_RANGE;
}

export function weekdayFactor(date: string): number {
  const day = new Date(`${date}T00:00:00.000Z`).getUTCDay();
  return day === SATURDAY || day === SUNDAY ? WEEKEND_FACTOR : 1;
}

export function demoCount(date: string, base: number, salt: number): number {
  return Math.round(
    base * weekdayFactor(date) * (LOWEST_DAY_FACTOR + DAY_FACTOR_SPREAD * noise(date, salt)),
  );
}

export function apportion<Item>(
  total: number,
  items: readonly Item[],
  weightOf: (item: Item) => number,
): readonly Apportioned<Item>[] {
  const weights = items.map((item) => ({ item, weight: weightOf(item) }));
  const weightSum = weights.reduce((sum, entry) => sum + entry.weight, 0);
  const exact = weights.map(({ item, weight }) => ({
    item,
    exact: weightSum > 0 ? (weight / weightSum) * total : total / items.length,
  }));
  const left = total - exact.reduce((sum, entry) => sum + Math.floor(entry.exact), 0);
  const roundedUp = new Set(
    exact
      .map((entry, index) => ({ index, remainder: entry.exact - Math.floor(entry.exact) }))
      .toSorted((first, second) => second.remainder - first.remainder || first.index - second.index)
      .slice(0, left)
      .map(({ index }) => index),
  );
  return exact.map((entry, index) => ({
    item: entry.item,
    count: Math.floor(entry.exact) + (roundedUp.has(index) ? 1 : 0),
  }));
}

const REPEATED_CONVERSION_SHARE = 0.06;

export function demoConvertingVisits(conversions: number): number {
  return Math.round(conversions * (1 - REPEATED_CONVERSION_SHARE));
}

export function demoConvertingVisitsOrNull(conversions: number | null): number | null {
  return conversions === null ? null : demoConvertingVisits(conversions);
}
