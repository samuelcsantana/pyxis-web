import { addDays, daysBetween } from '@/domain/period';
import type { DateRange } from '../overview/overview-service.interface';

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

export function noise(date: string, salt: number): number {
  let hash = FNV_OFFSET_BASIS ^ salt;
  for (const character of date) {
    hash = Math.imul(hash ^ character.charCodeAt(0), FNV_PRIME);
  }
  return (mixed(hash) >>> 0) / UINT32_RANGE;
}

export function weekdayFactor(date: string): number {
  const day = new Date(`${date}T00:00:00.000Z`).getUTCDay();
  return day === SATURDAY || day === SUNDAY ? WEEKEND_FACTOR : 1;
}

export function demoCount(date: string, base: number, salt: number): number {
  return Math.round(base * weekdayFactor(date) * (0.8 + 0.4 * noise(date, salt)));
}
