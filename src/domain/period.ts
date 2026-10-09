import type { Formats } from '@/i18n/formats';
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

function rangeProblemText(problem: RangeProblem, i18n: I18n): string {
  switch (problem) {
    case 'not-a-date':
      return i18n.t('period.rangeProblems.notADate');
    case 'inverted':
      return i18n.t('period.rangeProblems.inverted');
    case 'future':
      return i18n.t('period.rangeProblems.future');
    case 'too-long':
      return i18n.t('period.rangeProblems.tooLong', { days: String(MAX_PERIOD_DAYS) });
  }
}

export function rejectedRangeNotice(rejected: RejectedRange, i18n: I18n): string {
  return i18n.t('period.rejectedRange', {
    problem: rangeProblemText(rejected.problem, i18n),
    days: String(PRESET_DAYS[DEFAULT_PERIOD_PRESET]),
  });
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

export function describePeriod(period: Period, i18n: I18n): string {
  return period.preset === 'custom'
    ? formatPeriod(period, i18n)
    : i18n.t(`period.presets.${period.preset}`);
}

export function formatDayRange(from: string, to: string, format: Formats): string {
  const first = calendarDate(from);
  const last = calendarDate(to);
  if (from === to) {
    return format.dayWithYear(last);
  }
  const sameYear = first.getUTCFullYear() === last.getUTCFullYear();
  const start = sameYear ? format.day(first) : format.dayWithYear(first);
  return `${start} – ${format.dayWithYear(last)}`;
}

export function formatPeriod(period: Period, i18n: I18n): string {
  return formatDayRange(period.from, period.to, i18n.format);
}
