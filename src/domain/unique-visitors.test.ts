import { describe, expect, it } from 'vitest';
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';
import {
  hasCountedVisits,
  headlineLabel,
  headlineNote,
  isWarmingUp,
  NO_UNIQUE_VISITORS,
  type UniqueVisitors,
  type VisitorDay,
  visitorDayRows,
  visitorDaysSummary,
  visitorKindLabel,
  visitorsHeadline,
} from './unique-visitors';

function day(date: string, counts: Partial<Omit<VisitorDay, 'date'>> = {}): VisitorDay {
  return { date, firstVisit: 0, firstThisMonth: 0, firstToday: 0, againToday: 0, ...counts };
}

const THREE_DAYS: UniqueVisitors = {
  enabled: true,
  daily: [
    day('2026-10-30', { firstVisit: 5, firstThisMonth: 1, firstToday: 3, againToday: 4 }),
    day('2026-10-31', { firstVisit: 1, firstToday: 1, againToday: 2 }),
    day('2026-11-01', { firstVisit: 4, firstThisMonth: 3, againToday: 1 }),
  ],
  months: [
    { month: '2026-10', firstVisit: 6, firstThisMonth: 1, exact: false },
    { month: '2026-11', firstVisit: 4, firstThisMonth: 3, exact: true },
  ],
};

const NOVEMBER: UniqueVisitors = {
  enabled: true,
  daily: [
    day('2026-11-01', { firstVisit: 4, firstThisMonth: 3, againToday: 1 }),
    day('2026-11-02', { firstVisit: 2, firstThisMonth: 1, firstToday: 5, againToday: 3 }),
  ],
  months: [{ month: '2026-11', firstVisit: 6, firstThisMonth: 4, exact: true }],
};

describe('visitorDayRows', () => {
  it('counts a day as its first visits, first this month and first today, never again today', () => {
    expect(visitorDayRows(THREE_DAYS)).toEqual([
      { date: '2026-10-30', unique: 9, newVisitors: 5, returning: 4 },
      { date: '2026-10-31', unique: 2, newVisitors: 1, returning: 1 },
      { date: '2026-11-01', unique: 7, newVisitors: 4, returning: 3 },
    ]);
  });
});

describe('hasCountedVisits', () => {
  it('is false while no visit of the period carries a kind, and true once one does', () => {
    expect(hasCountedVisits(NO_UNIQUE_VISITORS)).toBe(false);
    expect(hasCountedVisits({ ...THREE_DAYS, daily: [day('2026-10-30')] })).toBe(false);
    expect(hasCountedVisits({ ...THREE_DAYS, daily: [day('2026-10-30', { againToday: 1 })] })).toBe(
      true,
    );
  });
});

describe('visitorsHeadline', () => {
  it('gives the exact figures of a single day', () => {
    expect(visitorsHeadline({ ...THREE_DAYS, daily: THREE_DAYS.daily.slice(0, 1) }, true)).toEqual({
      span: 'day',
      unique: 9,
      newVisitors: 5,
      returning: 4,
    });
  });

  it('gives the exact figures of the one month the period holds, so far when it ends today', () => {
    expect(visitorsHeadline(NOVEMBER, false)).toEqual({
      span: 'month',
      month: '2026-11',
      unique: 10,
      newVisitors: 6,
      returning: 4,
    });
    expect(visitorsHeadline(NOVEMBER, true)).toMatchObject({ span: 'monthSoFar', unique: 10 });
  });

  it('adds the days up when the month is cut or the period spans months, even exact ones', () => {
    const cut: UniqueVisitors = {
      ...NOVEMBER,
      months: [{ month: '2026-11', firstVisit: 6, firstThisMonth: 4, exact: false }],
    };
    const twoWholeMonths: UniqueVisitors = {
      ...THREE_DAYS,
      months: THREE_DAYS.months.map((month) => ({ ...month, exact: true })),
    };

    expect(visitorsHeadline(cut, false)).toEqual({
      span: 'sumOfDays',
      unique: 15,
      newVisitors: 6,
      returning: 9,
    });
    expect(visitorsHeadline(twoWholeMonths, false)).toEqual({
      span: 'sumOfDays',
      unique: 18,
      newVisitors: 10,
      returning: 8,
    });
  });
});

describe('isWarmingUp', () => {
  it('is true only when nine in ten unique visitors or more are new', () => {
    expect(isWarmingUp({ unique: 0, newVisitors: 0, returning: 0 })).toBe(false);
    expect(isWarmingUp({ unique: 100, newVisitors: 90, returning: 10 })).toBe(true);
    expect(isWarmingUp({ unique: 100, newVisitors: 89, returning: 11 })).toBe(false);
  });
});

describe('headline texts', () => {
  it('names what the headline counts, with the month in the reader’s language', () => {
    expect(headlineLabel(visitorsHeadline(NOVEMBER, false), english)).toBe(
      'Unique visitors in November 2026',
    );
    expect(headlineLabel(visitorsHeadline(NOVEMBER, true), portuguese)).toBe(
      'Visitantes únicos em novembro de 2026 até agora',
    );
    expect(
      headlineLabel(
        visitorsHeadline({ ...NOVEMBER, daily: NOVEMBER.daily.slice(1) }, true),
        english,
      ),
    ).toBe('Unique visitors');
    expect(headlineLabel(visitorsHeadline(THREE_DAYS, false), english)).toBe(
      'Sum of daily unique visitors',
    );
  });

  it('warns that days do not add up, and says nothing for a single day', () => {
    expect(headlineNote(visitorsHeadline(THREE_DAYS, false), english)).toBe(
      'Sum of days: a visitor who came on two days counts twice.',
    );
    expect(headlineNote(visitorsHeadline(NOVEMBER, false), english)).toBe(
      headlineNote(visitorsHeadline(NOVEMBER, true), english),
    );
    expect(headlineNote(visitorsHeadline(NOVEMBER, true), english)).toBe(
      'The days do not add up to the month: a visitor who came on two days counts on both.',
    );
    expect(
      headlineNote(
        visitorsHeadline({ ...NOVEMBER, daily: NOVEMBER.daily.slice(1) }, true),
        english,
      ),
    ).toBeNull();
  });

  it('names the two kinds the bars stack', () => {
    expect(visitorKindLabel('newVisitors', english)).toBe('New');
    expect(visitorKindLabel('returning', portuguese)).toBe('Recorrentes');
  });

  it('sums the chart up in words for a screen reader', () => {
    expect(visitorDaysSummary(visitorDayRows(THREE_DAYS), english)).toBe(
      'Stacked bar chart of 3 days, new and returning, between 2 and 9 unique visitors a day.',
    );
  });
});
