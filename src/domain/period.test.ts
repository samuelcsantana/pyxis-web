import { describe, expect, it } from 'vitest';
import {
  formatShortDayRange,
  addDays,
  daysBetween,
  describePeriod,
  formatDay,
  formatPeriod,
  MAX_PERIOD_DAYS,
  periodQuery,
  periodSearchParameters,
  presetPeriod,
  rangeProblemNotice,
  resolvePeriod,
  resolvePeriodOn,
  todayIn,
} from './period';
import { english } from '@/test-utils/english';
import { italian } from '@/test-utils/italian';
import { portuguese } from '@/test-utils/portuguese';

const SAO_PAULO = 'America/Sao_Paulo';
const LATE_EVENING_IN_SAO_PAULO = new Date('2026-10-06T02:30:00.000Z');
const JUST_AFTER_MIDNIGHT_IN_SAO_PAULO = new Date('2026-10-06T03:30:00.000Z');

describe('todayIn', () => {
  it('reads the calendar day in the project time zone, not in UTC', () => {
    expect(todayIn(SAO_PAULO, LATE_EVENING_IN_SAO_PAULO)).toBe('2026-10-05');
    expect(todayIn('UTC', LATE_EVENING_IN_SAO_PAULO)).toBe('2026-10-06');
  });

  it('moves to the next day at local midnight', () => {
    expect(todayIn(SAO_PAULO, JUST_AFTER_MIDNIGHT_IN_SAO_PAULO)).toBe('2026-10-06');
  });
});

describe('addDays and daysBetween', () => {
  it('walk across months and leap days', () => {
    expect(addDays('2028-02-28', 1)).toBe('2028-02-29');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
    expect(daysBetween('2026-09-06', '2026-10-05')).toBe(30);
    expect(daysBetween('2026-10-05', '2026-10-05')).toBe(1);
  });

  it.each(['2026-02-30', '2026-13-01', 'yesterday'])('refuse %s', (date) => {
    expect(() => addDays(date, 1)).toThrow(RangeError);
    expect(() => daysBetween(date, '2026-10-05')).toThrow(RangeError);
  });
});

describe('presetPeriod', () => {
  it.each([
    ['today', '2026-10-05'],
    ['7d', '2026-09-29'],
    ['30d', '2026-09-06'],
  ] as const)('%s ends today and starts on %s', (preset, from) => {
    expect(presetPeriod(preset, '2026-10-05')).toEqual({ preset, from, to: '2026-10-05' });
  });
});

describe('resolvePeriodOn', () => {
  it('resolves the period from the calendar day it is given, with no clock', () => {
    expect(resolvePeriodOn({ range: '7d' }, '2026-10-05')).toEqual(
      presetPeriod('7d', '2026-10-05'),
    );
    expect(resolvePeriodOn({ from: '2026-10-01', to: '2026-10-06' }, '2026-10-05')).toEqual({
      ...presetPeriod('30d', '2026-10-05'),
      rejected: { from: '2026-10-01', to: '2026-10-06', problem: 'future' },
    });
  });
});

describe('resolvePeriod', () => {
  it('defaults to the last 30 days of the project calendar', () => {
    expect(resolvePeriod({}, SAO_PAULO, LATE_EVENING_IN_SAO_PAULO)).toEqual({
      preset: '30d',
      from: '2026-09-06',
      to: '2026-10-05',
    });
  });

  it('reads a preset from the range parameter', () => {
    expect(resolvePeriod({ range: 'today' }, SAO_PAULO, JUST_AFTER_MIDNIGHT_IN_SAO_PAULO)).toEqual({
      preset: 'today',
      from: '2026-10-06',
      to: '2026-10-06',
    });
  });

  it('reads a custom period from from and to', () => {
    expect(
      resolvePeriod({ from: '2026-08-01', to: '2026-08-31' }, SAO_PAULO, LATE_EVENING_IN_SAO_PAULO),
    ).toEqual({ preset: 'custom', from: '2026-08-01', to: '2026-08-31' });
  });

  it.each([
    ['an unknown range and no dates', { range: 'year' }],
    ['repeated parameters', { range: ['7d', '30d'] }],
    ['only a start', { from: '2026-08-01' }],
    ['a date that does not exist', { from: '2026-02-30', to: '2026-03-01' }],
    ['a start after the end', { from: '2026-09-02', to: '2026-09-01' }],
    ['an end after today in the project zone', { from: '2026-10-01', to: '2026-10-06' }],
    ['more than the longest period', { from: '2025-08-31', to: '2026-10-05' }],
  ])('falls back to the default for %s', (_case, search) => {
    expect(resolvePeriod(search, SAO_PAULO, LATE_EVENING_IN_SAO_PAULO).preset).toBe('30d');
  });

  it.each([
    ['a date that does not exist', '2026-02-30', '2026-03-01', 'not-a-date'],
    ['a start after the end', '2026-09-02', '2026-09-01', 'inverted'],
    ['an end after today in the project zone', '2026-10-01', '2026-10-06', 'future'],
    ['more than the longest period', '2025-08-31', '2026-10-05', 'too-long'],
  ] as const)('keeps a range with %s that it did not use, and why', (_case, from, to, problem) => {
    expect(resolvePeriod({ from, to }, SAO_PAULO, LATE_EVENING_IN_SAO_PAULO).rejected).toEqual({
      from,
      to,
      problem,
    });
  });

  it('rejects nothing when no custom period was asked', () => {
    expect(resolvePeriod({ from: '2026-08-01' }, SAO_PAULO, LATE_EVENING_IN_SAO_PAULO)).toEqual(
      presetPeriod('30d', '2026-10-05'),
    );
  });

  it(`accepts exactly ${String(MAX_PERIOD_DAYS)} days`, () => {
    const to = '2026-10-05';
    const from = addDays(to, 1 - MAX_PERIOD_DAYS);

    expect(resolvePeriod({ from, to }, SAO_PAULO, LATE_EVENING_IN_SAO_PAULO).preset).toBe('custom');
  });
});

describe('rangeProblemNotice', () => {
  it.each([
    ['not-a-date', 'one of its dates is not a calendar date'],
    ['inverted', 'it ends before it starts'],
    ['future', 'it ends after today'],
    ['too-long', 'it is longer than 400 days'],
  ] as const)('says why a %s range was not used', (problem, reason) => {
    expect(rangeProblemNotice(problem, english)).toBe(
      `That range was not used: ${reason}. Showing the last 30 days instead.`,
    );
  });
});

describe('periodQuery', () => {
  it('writes a preset as range and a custom period as from and to', () => {
    expect(periodQuery(presetPeriod('7d', '2026-10-05'))).toBe('range=7d');
    expect(periodQuery({ preset: 'custom', from: '2026-08-01', to: '2026-08-31' })).toBe(
      'from=2026-08-01&to=2026-08-31',
    );
  });
});

describe('periodSearchParameters', () => {
  it('keeps the period parameters of a URL as they are, and nothing else', () => {
    expect(periodSearchParameters({ range: '7d', from: ['a', 'b'], to: '2026-08-31' })).toEqual({
      range: '7d',
      to: '2026-08-31',
    });
    expect(periodSearchParameters({})).toEqual({});
  });
});

describe('formatPeriod', () => {
  it('shows a single day once', () => {
    expect(formatPeriod(presetPeriod('today', '2026-10-05'), english)).toBe('Oct 5, 2026');
  });

  it('names the year once when both ends share it', () => {
    expect(formatPeriod(presetPeriod('30d', '2026-10-05'), english)).toBe('Sep 6 – Oct 5, 2026');
  });

  it('names both years across new year', () => {
    expect(formatPeriod(presetPeriod('7d', '2027-01-02'), english)).toBe(
      'Dec 27, 2026 – Jan 2, 2027',
    );
  });
});

describe('formatShortDayRange', () => {
  const today = '2026-10-31';
  const spaced = (text: string) => text.replace(/\s/g, ' ');

  it('writes one day once, without the year of today', () => {
    expect(formatShortDayRange('2026-10-31', '2026-10-31', today, english.format)).toBe('Oct 31');
  });

  it('writes a range inside one month with its month once', () => {
    expect(spaced(formatShortDayRange('2026-10-02', '2026-10-31', today, english.format))).toBe(
      'Oct 2 – 31',
    );
  });

  it('writes a range across months with both months', () => {
    expect(spaced(formatShortDayRange('2026-09-25', '2026-10-01', today, english.format))).toBe(
      'Sep 25 – Oct 1',
    );
  });

  it('writes the years of a range that leaves the year of today', () => {
    expect(spaced(formatShortDayRange('2025-12-20', '2026-01-05', today, english.format))).toBe(
      'Dec 20, 2025 – Jan 5, 2026',
    );
    expect(spaced(formatShortDayRange('2025-03-01', '2025-03-09', today, english.format))).toBe(
      'Mar 1 – 9, 2025',
    );
  });

  it('writes the range the way of the language', () => {
    expect(spaced(formatShortDayRange('2026-10-02', '2026-10-31', today, portuguese.format))).toBe(
      '2 – 31 de out.',
    );
  });

  it('writes each day without a padding zero, like every other date of the language', () => {
    expect(
      spaced(formatShortDayRange('2026-11-01', '2026-11-07', '2026-11-07', italian.format)),
    ).toBe('1–7 nov');
    expect(spaced(formatShortDayRange('2026-09-25', '2026-10-01', today, italian.format))).toBe(
      '25 set – 1 ott',
    );
    expect(spaced(formatShortDayRange('2025-12-20', '2026-01-05', today, italian.format))).toBe(
      '20 dic 2025 – 5 gen 2026',
    );
    expect(spaced(formatShortDayRange('2025-10-02', '2025-10-31', today, italian.format))).toBe(
      '2–31 ott 2025',
    );
  });
});

describe('formatDay and describePeriod', () => {
  it('shows a day as month and day', () => {
    expect(formatDay('2026-09-06', english)).toBe('Sep 6');
  });

  it('names a preset in words and a custom period by its dates', () => {
    expect(describePeriod(presetPeriod('today', '2026-10-05'), english)).toBe('today');
    expect(describePeriod(presetPeriod('7d', '2026-10-05'), english)).toBe('last 7 days');
    expect(describePeriod(presetPeriod('30d', '2026-10-05'), english)).toBe('last 30 days');
    expect(
      describePeriod({ preset: 'custom', from: '2026-09-01', to: '2026-09-10' }, english),
    ).toBe('Sep 1 – Sep 10, 2026');
  });

  it('names periods in Brazilian Portuguese, day before month', () => {
    expect(describePeriod(presetPeriod('7d', '2026-10-05'), portuguese)).toBe('últimos 7 dias');
    expect(formatPeriod(presetPeriod('30d', '2026-10-05'), portuguese)).toBe(
      '6 de set. – 5 de out. de 2026',
    );
  });
});
