import { describe, expect, it } from 'vitest';
import {
  canShowMonth,
  chooseDay,
  firstDayOf,
  isCalendarKey,
  isChoosable,
  monthOf,
  monthWeeks,
  movedDay,
  type RangeSelection,
  shiftMonth,
  shownRange,
  weekdayOf,
} from './range-calendar';

const TODAY = '2026-10-09';
const COMPLETE: RangeSelection = { kind: 'complete', from: '2026-09-10', to: '2026-10-09' };
const STARTED: RangeSelection = { kind: 'started', from: '2026-09-10' };

describe('months', () => {
  it('names the month of a day and moves across years', () => {
    expect(monthOf('2026-10-09')).toBe('2026-10');
    expect(shiftMonth('2026-12', 1)).toBe('2027-01');
    expect(shiftMonth('2026-01', -1)).toBe('2025-12');
    expect(shiftMonth('2026-10', -12)).toBe('2025-10');
    expect(firstDayOf('2026-02')).toBe('2026-02-01');
  });

  it('numbers the weekdays from Sunday 0', () => {
    expect(weekdayOf('2026-10-04')).toBe(0);
    expect(weekdayOf('2026-10-09')).toBe(5);
  });

  it('lays a month in Sunday-first weeks, with blanks before the 1st and after the last day', () => {
    const weeks = monthWeeks('2026-10');

    expect(weeks).toHaveLength(5);
    expect(weeks[0]).toEqual([null, null, null, null, '2026-10-01', '2026-10-02', '2026-10-03']);
    expect(weeks[4]).toEqual([
      '2026-10-25',
      '2026-10-26',
      '2026-10-27',
      '2026-10-28',
      '2026-10-29',
      '2026-10-30',
      '2026-10-31',
    ]);
    expect(weeks.every((week) => week.length === 7)).toBe(true);
  });

  it('fills the last week of a month that ends mid-week, and a February', () => {
    expect(monthWeeks('2026-09').at(-1)).toEqual([
      '2026-09-27',
      '2026-09-28',
      '2026-09-29',
      '2026-09-30',
      null,
      null,
      null,
    ]);
    expect(
      monthWeeks('2026-02')
        .flat()
        .filter((day) => day !== null),
    ).toHaveLength(28);
    expect(
      monthWeeks('2028-02')
        .flat()
        .filter((day) => day !== null),
    ).toHaveLength(29);
  });

  it('never shows a month after the one of today', () => {
    expect(canShowMonth('2026-10', TODAY)).toBe(true);
    expect(canShowMonth('2026-09', TODAY)).toBe(true);
    expect(canShowMonth('2026-11', TODAY)).toBe(false);
  });
});

describe('choosing a range', () => {
  it('starts a new range on a click over a complete one', () => {
    expect(chooseDay(COMPLETE, '2026-08-01')).toEqual({ kind: 'started', from: '2026-08-01' });
  });

  it('ends the range on the second click, in either order', () => {
    expect(chooseDay(STARTED, '2026-09-20')).toEqual({
      kind: 'complete',
      from: '2026-09-10',
      to: '2026-09-20',
    });
    expect(chooseDay(STARTED, '2026-09-01')).toEqual({
      kind: 'complete',
      from: '2026-09-01',
      to: '2026-09-10',
    });
    expect(chooseDay(STARTED, '2026-09-10')).toEqual({
      kind: 'complete',
      from: '2026-09-10',
      to: '2026-09-10',
    });
  });

  it('refuses days after today', () => {
    expect(isChoosable('2026-10-09', COMPLETE, TODAY)).toBe(true);
    expect(isChoosable('2026-10-10', COMPLETE, TODAY)).toBe(false);
    expect(isChoosable('2026-10-10', STARTED, TODAY)).toBe(false);
  });

  it('refuses, once a range is started, the days that would make it longer than 400 days', () => {
    const started: RangeSelection = { kind: 'started', from: '2026-01-01' };

    expect(isChoosable('2027-02-04', started, '2027-12-31')).toBe(true);
    expect(isChoosable('2027-02-05', started, '2027-12-31')).toBe(false);
    expect(isChoosable('2024-11-28', started, TODAY)).toBe(true);
    expect(isChoosable('2024-11-27', started, TODAY)).toBe(false);
    expect(isChoosable('2020-01-01', COMPLETE, TODAY)).toBe(true);
  });

  it('shows the complete range, or the started one stretched to the day under the pointer', () => {
    expect(shownRange(COMPLETE, '2026-01-01', TODAY)).toEqual({
      from: '2026-09-10',
      to: '2026-10-09',
    });
    expect(shownRange(STARTED, '2026-09-15', TODAY)).toEqual({
      from: '2026-09-10',
      to: '2026-09-15',
    });
    expect(shownRange(STARTED, '2026-09-01', TODAY)).toEqual({
      from: '2026-09-01',
      to: '2026-09-10',
    });
    expect(shownRange(STARTED, null, TODAY)).toEqual({ from: '2026-09-10', to: '2026-09-10' });
    expect(shownRange(STARTED, '2026-12-01', TODAY)).toEqual({
      from: '2026-09-10',
      to: '2026-09-10',
    });
  });
});

describe('moving with the keyboard', () => {
  it('knows the keys of a calendar grid', () => {
    expect(isCalendarKey('ArrowUp')).toBe(true);
    expect(isCalendarKey('PageDown')).toBe(true);
    expect(isCalendarKey('Enter')).toBe(false);
    expect(isCalendarKey('a')).toBe(false);
  });

  it.each([
    ['ArrowLeft', false, '2026-10-08'],
    ['ArrowRight', false, '2026-10-10'],
    ['ArrowUp', false, '2026-10-02'],
    ['ArrowDown', false, '2026-10-16'],
    ['Home', false, '2026-10-04'],
    ['End', false, '2026-10-10'],
    ['PageUp', false, '2026-09-09'],
    ['PageDown', false, '2026-11-09'],
    ['PageUp', true, '2025-10-09'],
    ['PageDown', true, '2027-10-09'],
  ] as const)('moves from Oct 9, 2026 with %s (year: %s) to %s', (key, byYear, expected) => {
    expect(movedDay('2026-10-09', key, byYear)).toBe(expected);
  });

  it('keeps the last day of the month when the next month is shorter', () => {
    expect(movedDay('2026-03-31', 'PageUp', false)).toBe('2026-02-28');
    expect(movedDay('2028-02-29', 'PageDown', true)).toBe('2029-02-28');
  });
});
