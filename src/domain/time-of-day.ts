import type { I18n } from '@/i18n/i18n';

export const WEEKDAYS = 7;
export const HOURS_IN_A_DAY = 24;
export type HeatLevel = 0 | 1 | 2 | 3 | 4;
export const HEAT_LEVELS: readonly HeatLevel[] = [0, 1, 2, 3, 4];

const QUARTER = 0.25;
const HALF = 0.5;
const THREE_QUARTERS = 0.75;

export interface WeekdayHours {
  readonly weekday: number;
  readonly hours: readonly number[];
}

export type TimeOfDayReport = readonly WeekdayHours[];

export interface HourCell {
  readonly weekday: number;
  readonly hour: number;
  readonly visits: number;
}

export function hourCells(report: TimeOfDayReport): readonly HourCell[] {
  return report.flatMap((day) =>
    day.hours.map((visits, hour) => ({ weekday: day.weekday, hour, visits })),
  );
}

export function busiestHour(report: TimeOfDayReport): HourCell | null {
  return hourCells(report).reduce<HourCell | null>(
    (busiest, cell) => (cell.visits > (busiest?.visits ?? 0) ? cell : busiest),
    null,
  );
}

export function heatLevel(visits: number, busiest: number): HeatLevel {
  if (visits === 0) {
    return 0;
  }
  const share = visits / busiest;
  if (share > THREE_QUARTERS) {
    return 4;
  }
  if (share > HALF) {
    return 3;
  }
  return share > QUARTER ? 2 : 1;
}

export function hourLabel(hour: number): string {
  return `${String(hour % HOURS_IN_A_DAY).padStart(2, '0')}:00`;
}

export function timeOfDaySummary(report: TimeOfDayReport, i18n: I18n): string {
  const busiest = busiestHour(report);
  if (busiest === null) {
    return i18n.t('timeOfDay.summaryEmpty');
  }
  return i18n.t('timeOfDay.summary', {
    weekday: i18n.format.weekday(busiest.weekday, 'long'),
    from: hourLabel(busiest.hour),
    to: hourLabel(busiest.hour + 1),
    visits: i18n.t('counts.visit', { count: busiest.visits }),
  });
}

export function cellLabel(cell: HourCell, i18n: I18n): string {
  return i18n.t('timeOfDay.cell', {
    weekday: i18n.format.weekday(cell.weekday, 'long'),
    from: hourLabel(cell.hour),
    visits: i18n.t('counts.visit', { count: cell.visits }),
  });
}
