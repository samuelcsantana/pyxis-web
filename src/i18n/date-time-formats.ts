export type DateTimeStyle = 'clock' | 'visitStart' | 'failureTime' | 'eventTime';

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

export function dateTimeFormat(
  tag: string,
  style: DateTimeStyle,
  timeZone: string,
): (date: Date) => string {
  const format = new Intl.DateTimeFormat(tag, { ...DATE_TIME_STYLES[style], timeZone });
  return (date) => format.format(date);
}
