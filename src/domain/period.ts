import type { I18n } from '@/i18n/i18n';

export const PERIOD_PRESETS = ['today', '7d', '30d'] as const;
export type PeriodPreset = (typeof PERIOD_PRESETS)[number];

export const DEFAULT_PERIOD_PRESET: PeriodPreset = '30d';
export const MAX_PERIOD_DAYS = 400;

const PRESET_DAYS: Readonly<Record<PeriodPreset, number>> = { today: 1, '7d': 7, '30d': 30 };
const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const MILLISECONDS_PER_DAY = 86_400_000;

export type RangeProblem = 'not-a-date' | 'inverted' | 'future' | 'too-long';

export interface RejectedRange {
  readonly from: string;
  readonly to: string;
  readonly problem: RangeProblem;
}

export interface Period {
  readonly preset: PeriodPreset | 'custom';
  readonly from: string;
  readonly to: string;
  readonly rejected?: RejectedRange;
}

export interface PeriodSearch {
  readonly range?: string | string[];
  readonly from?: string | string[];
  readonly to?: string | string[];
}

function single(value: string | string[] | undefined): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

const PERIOD_PARAMETERS = ['range', 'from', 'to'] as const;

export function periodSearchParameters(search: PeriodSearch): Readonly<Record<string, string>> {
  return Object.fromEntries(
    PERIOD_PARAMETERS.flatMap((name) => {
      const value = single(search[name]);
      return value === undefined ? [] : [[name, value]];
    }),
  );
}

function isPreset(value: string | undefined): value is PeriodPreset {
  return PERIOD_PRESETS.some((preset) => preset === value);
}

function utcDate(isoDate: string): Date | undefined {
  const match = ISO_DATE.exec(isoDate);
  if (match === null) {
    return undefined;
  }
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return date.toISOString().startsWith(isoDate) ? date : undefined;
}

function calendarDate(isoDate: string): Date {
  const date = utcDate(isoDate);
  if (date === undefined) {
    throw new RangeError(`Not a calendar date: ${isoDate}`);
  }
  return date;
}

export function todayIn(timeZone: string, now: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

export function addDays(isoDate: string, days: number): string {
  const shifted = calendarDate(isoDate).getTime() + days * MILLISECONDS_PER_DAY;
  return new Date(shifted).toISOString().slice(0, 10);
}

export function daysBetween(from: string, to: string): number {
  const span = calendarDate(to).getTime() - calendarDate(from).getTime();
  return Math.round(span / MILLISECONDS_PER_DAY) + 1;
}

export function presetPeriod(preset: PeriodPreset, today: string): Period {
  return { preset, from: addDays(today, 1 - PRESET_DAYS[preset]), to: today };
}

function rangeProblem(from: string, to: string, today: string): RangeProblem | undefined {
  if (utcDate(from) === undefined || utcDate(to) === undefined) {
    return 'not-a-date';
  }
  if (from > to) {
    return 'inverted';
  }
  if (to > today) {
    return 'future';
  }
  return daysBetween(from, to) > MAX_PERIOD_DAYS ? 'too-long' : undefined;
}

export function resolvePeriod(search: PeriodSearch, timeZone: string, now: Date): Period {
  const today = todayIn(timeZone, now);
  const range = single(search.range);
  if (isPreset(range)) {
    return presetPeriod(range, today);
  }
  const fallback = presetPeriod(DEFAULT_PERIOD_PRESET, today);
  const from = single(search.from);
  const to = single(search.to);
  if (from === undefined || to === undefined) {
    return fallback;
  }
  const problem = rangeProblem(from, to, today);
  return problem === undefined
    ? { preset: 'custom', from, to }
    : { ...fallback, rejected: { from, to, problem } };
}

const RANGE_PROBLEMS: Readonly<Record<RangeProblem, string>> = {
  'not-a-date': 'one of its dates is not a calendar date',
  inverted: 'it ends before it starts',
  future: 'it ends after today',
  'too-long': `it is longer than ${String(MAX_PERIOD_DAYS)} days`,
};

export function rejectedRangeNotice(rejected: RejectedRange): string {
  const shownDays = String(PRESET_DAYS[DEFAULT_PERIOD_PRESET]);
  return `That range was not used: ${RANGE_PROBLEMS[rejected.problem]}. Showing the last ${shownDays} days instead.`;
}

export function periodQuery(period: Period): string {
  const params =
    period.preset === 'custom'
      ? new URLSearchParams({ from: period.from, to: period.to })
      : new URLSearchParams({ range: period.preset });
  return params.toString();
}

export function formatDay(isoDate: string, i18n: I18n): string {
  return i18n.format.day(calendarDate(isoDate));
}

const PRESET_DESCRIPTIONS: Readonly<Record<PeriodPreset, string>> = {
  today: 'today',
  '7d': 'last 7 days',
  '30d': 'last 30 days',
};

export function describePeriod(period: Period, i18n: I18n): string {
  return period.preset === 'custom'
    ? formatPeriod(period, i18n)
    : PRESET_DESCRIPTIONS[period.preset];
}

export function formatPeriod(period: Period, i18n: I18n): string {
  const from = calendarDate(period.from);
  const to = calendarDate(period.to);
  if (period.from === period.to) {
    return i18n.format.dayWithYear(to);
  }
  const sameYear = from.getUTCFullYear() === to.getUTCFullYear();
  const start = sameYear ? i18n.format.day(from) : i18n.format.dayWithYear(from);
  return `${start} – ${i18n.format.dayWithYear(to)}`;
}
