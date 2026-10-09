export type DateTimeStyle = 'clock' | 'visitStart' | 'failureTime' | 'eventTime';
export type WeekdayWidth = 'narrow' | 'short' | 'long';

export interface Formats {
  readonly count: (value: number) => string;
  readonly percent: (value: number) => string;
  readonly decimal: (value: number) => string;
  readonly day: (date: Date) => string;
  readonly dayWithYear: (date: Date) => string;
  readonly monthWithYear: (date: Date) => string;
  readonly fullDay: (date: Date) => string;
  readonly dateTime: (style: DateTimeStyle, timeZone: string) => (date: Date) => string;
  readonly region: (code: string) => string;
  readonly list: (items: readonly string[]) => string;
  readonly weekday: (isoWeekday: number, width: WeekdayWidth) => string;
}

const A_MONDAY_IN_UTC = Date.UTC(2024, 0, 1);
const MILLISECONDS_PER_DAY = 86_400_000;

const ONE_DECIMAL: Intl.NumberFormatOptions = {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
};

const HOURS_AND_MINUTES: Intl.DateTimeFormatOptions = {
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
};

const DATE_TIME_STYLES: Readonly<Record<DateTimeStyle, Intl.DateTimeFormatOptions>> = {
  clock: { ...HOURS_AND_MINUTES, second: '2-digit' },
  visitStart: { weekday: 'short', month: 'short', day: 'numeric', ...HOURS_AND_MINUTES },
  failureTime: { month: 'short', day: 'numeric', ...HOURS_AND_MINUTES },
  eventTime: { month: 'short', day: 'numeric', year: 'numeric', ...HOURS_AND_MINUTES },
};

function buildFormats(tag: string): Formats {
  const count = new Intl.NumberFormat(tag);
  const percent = new Intl.NumberFormat(tag, { style: 'percent', ...ONE_DECIMAL });
  const decimal = new Intl.NumberFormat(tag, ONE_DECIMAL);
  const day = new Intl.DateTimeFormat(tag, { month: 'short', day: 'numeric', timeZone: 'UTC' });
  const dayWithYear = new Intl.DateTimeFormat(tag, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
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
  const regions = new Intl.DisplayNames([tag], { type: 'region', fallback: 'code' });
  const lists = new Intl.ListFormat(tag, { type: 'unit', style: 'long' });
  const weekdays: Readonly<Record<WeekdayWidth, Intl.DateTimeFormat>> = {
    narrow: new Intl.DateTimeFormat(tag, { weekday: 'narrow', timeZone: 'UTC' }),
    short: new Intl.DateTimeFormat(tag, { weekday: 'short', timeZone: 'UTC' }),
    long: new Intl.DateTimeFormat(tag, { weekday: 'long', timeZone: 'UTC' }),
  };
  return {
    count: (value) => count.format(value),
    percent: (value) => percent.format(value),
    decimal: (value) => decimal.format(value),
    day: (date) => day.format(date),
    dayWithYear: (date) => dayWithYear.format(date),
    monthWithYear: (date) => monthWithYear.format(date),
    fullDay: (date) => fullDay.format(date),
    dateTime: (style, timeZone) => {
      const format = new Intl.DateTimeFormat(tag, { ...DATE_TIME_STYLES[style], timeZone });
      return (date) => format.format(date);
    },
    region: (code) => String(regions.of(code)),
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
