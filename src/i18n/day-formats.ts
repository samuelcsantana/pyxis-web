export interface DayFormats {
  readonly day: (date: Date) => string;
  readonly dayWithYear: (date: Date) => string;
}

const DAY: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', timeZone: 'UTC' };
const DAY_WITH_YEAR: Intl.DateTimeFormatOptions = { ...DAY, year: 'numeric' };

export function createDayFormats(tag: string): DayFormats {
  const day = new Intl.DateTimeFormat(tag, DAY);
  const dayWithYear = new Intl.DateTimeFormat(tag, DAY_WITH_YEAR);
  return {
    day: (date) => day.format(date),
    dayWithYear: (date) => dayWithYear.format(date),
  };
}
