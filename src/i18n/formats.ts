import { type DateTimeStyle, dateTimeFormat } from './date-time-formats';
import { createDayFormats, type DayFormats } from './day-formats';

export type { DateTimeStyle } from './date-time-formats';
export type WeekdayWidth = 'narrow' | 'short' | 'long';

export interface Formats extends DayFormats {
  readonly count: (value: number) => string;
  readonly percent: (value: number) => string;
  readonly wholePercent: (value: number) => string;
  readonly decimal: (value: number) => string;
  readonly money: (value: number, currency: string) => string;
  readonly roundMoney: (value: number, currency: string) => string;
  readonly monthWithYear: (date: Date) => string;
  readonly fullDay: (date: Date) => string;
  readonly dateTime: (style: DateTimeStyle, timeZone: string) => (date: Date) => string;
  readonly country: (code: string) => string;
  readonly currencyName: (code: string) => string;
  readonly list: (items: readonly string[]) => string;
  readonly weekday: (isoWeekday: number, width: WeekdayWidth) => string;
}

type MoneyStyle = 'exact' | 'whole' | 'compact';

const COMPACT_FROM = 100_000;

const MONEY_STYLES: Readonly<Record<MoneyStyle, Intl.NumberFormatOptions>> = {
  exact: {},
  whole: { maximumFractionDigits: 0 },
  compact: { notation: 'compact', maximumFractionDigits: 1 },
};

const A_MONDAY_IN_UTC = Date.UTC(2024, 0, 1);
const MILLISECONDS_PER_DAY = 86_400_000;

const ONE_DECIMAL: Intl.NumberFormatOptions = {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
};

function buildFormats(tag: string): Formats {
  const count = new Intl.NumberFormat(tag);
  const percent = new Intl.NumberFormat(tag, { style: 'percent', ...ONE_DECIMAL });
  const wholePercent = new Intl.NumberFormat(tag, {
    style: 'percent',
    maximumFractionDigits: 0,
    roundingMode: 'trunc',
  });
  const decimal = new Intl.NumberFormat(tag, ONE_DECIMAL);
  const { day, dayWithYear } = createDayFormats(tag);
  const monthWithYear = new Intl.DateTimeFormat(tag, {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
  const fullDay = new Intl.DateTimeFormat(tag, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
  const moneyFormats = new Map<string, Intl.NumberFormat>();
  const moneyIn = (currency: string, style: MoneyStyle): Intl.NumberFormat => {
    const key = `${currency}:${style}`;
    const known = moneyFormats.get(key);
    if (known !== undefined) {
      return known;
    }
    const built = new Intl.NumberFormat(tag, {
      style: 'currency',
      currency,
      ...MONEY_STYLES[style],
    });
    moneyFormats.set(key, built);
    return built;
  };
  const countries = new Intl.DisplayNames([tag], { type: 'region', fallback: 'code' });
  const currencies = new Intl.DisplayNames([tag], { type: 'currency', fallback: 'code' });
  const lists = new Intl.ListFormat(tag, { type: 'unit', style: 'long' });
  const weekdays: Readonly<Record<WeekdayWidth, Intl.DateTimeFormat>> = {
    narrow: new Intl.DateTimeFormat(tag, { weekday: 'narrow', timeZone: 'UTC' }),
    short: new Intl.DateTimeFormat(tag, { weekday: 'short', timeZone: 'UTC' }),
    long: new Intl.DateTimeFormat(tag, { weekday: 'long', timeZone: 'UTC' }),
  };
  return {
    count: (value) => count.format(value),
    percent: (value) => percent.format(value),
    wholePercent: (value) => wholePercent.format(value),
    decimal: (value) => decimal.format(value),
    money: (value, currency) => moneyIn(currency, 'exact').format(value),
    roundMoney: (value, currency) =>
      moneyIn(currency, Math.abs(value) < COMPACT_FROM ? 'whole' : 'compact').format(value),
    day,
    dayWithYear,
    monthWithYear: (date) => monthWithYear.format(date),
    fullDay: (date) => fullDay.format(date),
    dateTime: (style, timeZone) => dateTimeFormat(tag, style, timeZone),
    country: (code) => String(countries.of(code)),
    currencyName: (code) => String(currencies.of(code)),
    list: (items) => lists.format(items),
    weekday: (isoWeekday, width) =>
      weekdays[width].format(new Date(A_MONDAY_IN_UTC + (isoWeekday - 1) * MILLISECONDS_PER_DAY)),
  };
}

const BUILT = new Map<string, Formats>();

export function createFormats(tag: string): Formats {
  const known = BUILT.get(tag);
  if (known !== undefined) {
    return known;
  }
  const formats = buildFormats(tag);
  BUILT.set(tag, formats);
  return formats;
}
