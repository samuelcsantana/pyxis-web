export const PERIOD_PRESETS = ['today', '7d', '30d'] as const;
export type PeriodPreset = (typeof PERIOD_PRESETS)[number];

export const DEFAULT_PERIOD_PRESET: PeriodPreset = '30d';
export const MAX_PERIOD_DAYS = 400;

const PRESET_DAYS: Readonly<Record<PeriodPreset, number>> = { today: 1, '7d': 7, '30d': 30 };
const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const MILLISECONDS_PER_DAY = 86_400_000;

export interface Period {
  readonly preset: PeriodPreset | 'custom';
  readonly from: string;
  readonly to: string;
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

function customPeriod(from: string | undefined, to: string | undefined, today: string) {
  if (from === undefined || to === undefined) {
    return undefined;
  }
  if (utcDate(from) === undefined || utcDate(to) === undefined) {
    return undefined;
  }
  if (from > to || to > today || daysBetween(from, to) > MAX_PERIOD_DAYS) {
    return undefined;
  }
  return { preset: 'custom', from, to } satisfies Period;
}

export function resolvePeriod(search: PeriodSearch, timeZone: string, now: Date): Period {
  const today = todayIn(timeZone, now);
  const range = single(search.range);
  if (isPreset(range)) {
    return presetPeriod(range, today);
  }
  return (
    customPeriod(single(search.from), single(search.to), today) ??
    presetPeriod(DEFAULT_PERIOD_PRESET, today)
  );
}

export function periodQuery(period: Period): string {
  const params =
    period.preset === 'custom'
      ? new URLSearchParams({ from: period.from, to: period.to })
      : new URLSearchParams({ range: period.preset });
  return params.toString();
}

const MONTH_DAY = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});
const MONTH_DAY_YEAR = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

export function formatDay(isoDate: string): string {
  return MONTH_DAY.format(calendarDate(isoDate));
}

const PRESET_DESCRIPTIONS: Readonly<Record<PeriodPreset, string>> = {
  today: 'today',
  '7d': 'last 7 days',
  '30d': 'last 30 days',
};

export function describePeriod(period: Period): string {
  return period.preset === 'custom' ? formatPeriod(period) : PRESET_DESCRIPTIONS[period.preset];
}

export function formatPeriod(period: Period): string {
  const from = calendarDate(period.from);
  const to = calendarDate(period.to);
  if (period.from === period.to) {
    return MONTH_DAY_YEAR.format(to);
  }
  const sameYear = from.getUTCFullYear() === to.getUTCFullYear();
  const start = sameYear ? MONTH_DAY.format(from) : MONTH_DAY_YEAR.format(from);
  return `${start} – ${MONTH_DAY_YEAR.format(to)}`;
}
