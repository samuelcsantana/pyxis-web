import { addDays, daysBetween } from '@/domain/period';
import type { DateRange } from '../overview/overview-service.interface';

const WEEKEND_FACTOR = 0.7;
const SATURDAY = 6;
const SUNDAY = 0;
const HASH_MODULUS = 9973;

export function demoDays(range: DateRange): readonly string[] {
  return Array.from({ length: daysBetween(range.from, range.to) }, (_, index) =>
    addDays(range.from, index),
  );
}

export function previousRange(range: DateRange): DateRange {
  const length = daysBetween(range.from, range.to);
  return { from: addDays(range.from, -length), to: addDays(range.from, -1) };
}

export function noise(date: string, salt: number): number {
  let hash = salt;
  for (const character of date) {
    hash = (hash * 31 + character.charCodeAt(0)) % HASH_MODULUS;
  }
  return hash / HASH_MODULUS;
}

export function weekdayFactor(date: string): number {
  const day = new Date(`${date}T00:00:00.000Z`).getUTCDay();
  return day === SATURDAY || day === SUNDAY ? WEEKEND_FACTOR : 1;
}

export function demoCount(date: string, base: number, salt: number): number {
  return Math.round(base * weekdayFactor(date) * (0.8 + 0.4 * noise(date, salt)));
}
