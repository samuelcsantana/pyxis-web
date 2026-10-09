import { describe, expect, it } from 'vitest';
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';
import {
  busiestHour,
  cellLabel,
  HEAT_LEVELS,
  heatLevel,
  hourCells,
  hourLabel,
  HOURS_IN_A_DAY,
  type TimeOfDayReport,
  timeOfDaySummary,
  WEEKDAYS,
} from './time-of-day';
import { timeOfDayResponseSchema } from './time-of-day.schema';

function week(cells: readonly { weekday: number; hour: number; visits: number }[]) {
  return Array.from({ length: WEEKDAYS }, (_, index) => ({
    weekday: index + 1,
    hours: Array.from(
      { length: HOURS_IN_A_DAY },
      (_, hour) =>
        cells.find((cell) => cell.weekday === index + 1 && cell.hour === hour)?.visits ?? 0,
    ),
  }));
}

const REPORT: TimeOfDayReport = week([
  { weekday: 1, hour: 9, visits: 34 },
  { weekday: 3, hour: 14, visits: 34 },
  { weekday: 7, hour: 23, visits: 1 },
]);
const EMPTY: TimeOfDayReport = week([]);

describe('time of day', () => {
  it('reads the API answer as seven weekdays of hours', () => {
    expect(timeOfDayResponseSchema.parse({ weekdays: REPORT })).toEqual(REPORT);
  });

  it('lists every hour of the week, Monday first', () => {
    const cells = hourCells(REPORT);

    expect(cells).toHaveLength(WEEKDAYS * HOURS_IN_A_DAY);
    expect(cells[0]).toEqual({ weekday: 1, hour: 0, visits: 0 });
    expect(cells[9]).toEqual({ weekday: 1, hour: 9, visits: 34 });
  });

  it('finds the busiest hour, the earliest one on a tie, and none in an empty week', () => {
    expect(busiestHour(REPORT)).toEqual({ weekday: 1, hour: 9, visits: 34 });
    expect(busiestHour(EMPTY)).toBeNull();
  });

  it('puts an hour without visits at level zero and any visit at one level at least', () => {
    expect(heatLevel(0, 34)).toBe(0);
    expect(heatLevel(1, 34)).toBe(1);
    expect(heatLevel(17, 34)).toBe(2);
    expect(heatLevel(20, 34)).toBe(3);
    expect(heatLevel(34, 34)).toBe(4);
    expect(HEAT_LEVELS).toEqual([0, 1, 2, 3, 4]);
  });

  it('labels hours on a 24-hour clock, the hour after 23 being midnight', () => {
    expect(hourLabel(0)).toBe('00:00');
    expect(hourLabel(9)).toBe('09:00');
    expect(hourLabel(24)).toBe('00:00');
  });

  it('sums the week up with its busiest hour, in each language', () => {
    expect(timeOfDaySummary(REPORT, english)).toBe('Busiest: Monday, 09:00 to 10:00 (34 visits).');
    expect(timeOfDaySummary(week([{ weekday: 7, hour: 23, visits: 1 }]), english)).toBe(
      'Busiest: Sunday, 23:00 to 00:00 (1 visit).',
    );
    expect(timeOfDaySummary(REPORT, portuguese)).toBe(
      'Pico: segunda-feira, das 09:00 às 10:00 (34 visitas).',
    );
    expect(timeOfDaySummary(EMPTY, english)).toBe('No visit started in this period.');
  });

  it('names one hour of the week with its visits', () => {
    expect(cellLabel({ weekday: 3, hour: 14, visits: 34 }, english)).toBe(
      'Wednesday, 14:00: 34 visits',
    );
  });
});
