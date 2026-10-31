export interface DayFormats {
  readonly day: (date: Date) => string;
  readonly dayWithYear: (date: Date) => string;
  readonly dayRange: (from: Date, to: Date) => string;
  readonly dayRangeWithYear: (from: Date, to: Date) => string;
}

const DAY: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', timeZone: 'UTC' };
const DAY_WITH_YEAR: Intl.DateTimeFormatOptions = { ...DAY, year: 'numeric' };
const PADDING_ZERO = /^0(?=\d)/;

function withoutPaddedDays(parts: readonly Intl.DateTimeRangeFormatPart[]): string {
  return parts
    .map(({ type, value }) => (type === 'day' ? value.replace(PADDING_ZERO, '') : value))
    .join('');
}

export function createDayFormats(tag: string): DayFormats {
  const day = new Intl.DateTimeFormat(tag, DAY);
  const dayWithYear = new Intl.DateTimeFormat(tag, DAY_WITH_YEAR);
  return {
    day: (date) => day.format(date),
    dayWithYear: (date) => dayWithYear.format(date),
    dayRange: (from, to) => withoutPaddedDays(day.formatRangeToParts(from, to)),
    dayRangeWithYear: (from, to) => withoutPaddedDays(dayWithYear.formatRangeToParts(from, to)),
  };
}
