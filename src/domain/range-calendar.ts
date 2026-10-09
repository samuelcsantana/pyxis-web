import { addDays, daysBetween, MAX_PERIOD_DAYS } from './period';

export const DAYS_PER_WEEK = 7;
const MONTHS_PER_YEAR = 12;
const SATURDAY = 6;
const ISO_MONTH_LENGTH = 7;

export type CalendarMonth = string;

export type RangeSelection =
  | { readonly kind: 'complete'; readonly from: string; readonly to: string }
  | { readonly kind: 'started'; readonly from: string };

export interface DayRange {
  readonly from: string;
  readonly to: string;
}

export type CalendarKey =
  'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown' | 'Home' | 'End' | 'PageUp' | 'PageDown';

const CALENDAR_KEYS: readonly string[] = [
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  'Home',
  'End',
  'PageUp',
  'PageDown',
] satisfies readonly CalendarKey[];

export function isCalendarKey(key: string): key is CalendarKey {
  return CALENDAR_KEYS.includes(key);
}

function utcDay(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00.000Z`);
}

export function weekdayOf(isoDate: string): number {
  return utcDay(isoDate).getUTCDay();
}

export function monthOf(isoDate: string): CalendarMonth {
  return isoDate.slice(0, ISO_MONTH_LENGTH);
}

function monthParts(month: CalendarMonth): { readonly year: number; readonly index: number } {
  return { year: Number(month.slice(0, 4)), index: Number(month.slice(5, 7)) - 1 };
}

function isoMonth(year: number, index: number): CalendarMonth {
  const date = new Date(Date.UTC(year, index, 1));
  return date.toISOString().slice(0, ISO_MONTH_LENGTH);
}

export function shiftMonth(month: CalendarMonth, months: number): CalendarMonth {
  const { year, index } = monthParts(month);
  return isoMonth(year, index + months);
}

export function firstDayOf(month: CalendarMonth): string {
  return `${month}-01`;
}

function daysIn(month: CalendarMonth): number {
  const { year, index } = monthParts(month);
  return new Date(Date.UTC(year, index + 1, 0)).getUTCDate();
}

export function monthWeeks(month: CalendarMonth): readonly (readonly (string | null)[])[] {
  const first = firstDayOf(month);
  const leading = weekdayOf(first);
  const cells = [
    ...Array.from({ length: leading }, () => null),
    ...Array.from({ length: daysIn(month) }, (_, offset) => addDays(first, offset)),
  ];
  const trailing = (DAYS_PER_WEEK - (cells.length % DAYS_PER_WEEK)) % DAYS_PER_WEEK;
  const padded = [...cells, ...Array.from({ length: trailing }, () => null)];
  return Array.from({ length: padded.length / DAYS_PER_WEEK }, (_, week) =>
    padded.slice(week * DAYS_PER_WEEK, (week + 1) * DAYS_PER_WEEK),
  );
}

function sameDayIn(isoDate: string, months: number): string {
  const target = shiftMonth(monthOf(isoDate), months);
  const day = Math.min(Number(isoDate.slice(8, 10)), daysIn(target));
  return `${target}-${String(day).padStart(2, '0')}`;
}

export function movedDay(isoDate: string, key: CalendarKey, byYear: boolean): string {
  switch (key) {
    case 'ArrowLeft':
      return addDays(isoDate, -1);
    case 'ArrowRight':
      return addDays(isoDate, 1);
    case 'ArrowUp':
      return addDays(isoDate, -DAYS_PER_WEEK);
    case 'ArrowDown':
      return addDays(isoDate, DAYS_PER_WEEK);
    case 'Home':
      return addDays(isoDate, -weekdayOf(isoDate));
    case 'End':
      return addDays(isoDate, SATURDAY - weekdayOf(isoDate));
    case 'PageUp':
      return sameDayIn(isoDate, byYear ? -MONTHS_PER_YEAR : -1);
    case 'PageDown':
      return sameDayIn(isoDate, byYear ? MONTHS_PER_YEAR : 1);
  }
}

function ordered(first: string, second: string): DayRange {
  return first <= second ? { from: first, to: second } : { from: second, to: first };
}

export function isChoosable(day: string, selection: RangeSelection, today: string): boolean {
  if (day > today) {
    return false;
  }
  if (selection.kind === 'complete') {
    return true;
  }
  const { from, to } = ordered(selection.from, day);
  return daysBetween(from, to) <= MAX_PERIOD_DAYS;
}

export function chooseDay(selection: RangeSelection, day: string): RangeSelection {
  if (selection.kind === 'complete') {
    return { kind: 'started', from: day };
  }
  return { kind: 'complete', ...ordered(selection.from, day) };
}

export function shownRange(
  selection: RangeSelection,
  preview: string | null,
  today: string,
): DayRange {
  if (selection.kind === 'complete') {
    return { from: selection.from, to: selection.to };
  }
  if (preview === null || !isChoosable(preview, selection, today)) {
    return { from: selection.from, to: selection.from };
  }
  return ordered(selection.from, preview);
}

export function canShowMonth(month: CalendarMonth, today: string): boolean {
  return month <= monthOf(today);
}
