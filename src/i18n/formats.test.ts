import { describe, expect, it } from 'vitest';
import { createFormats } from './formats';

const SEPTEMBER_8 = new Date(Date.UTC(2026, 8, 8));
const EVENING_IN_SAO_PAULO = new Date('2026-10-06T21:40:05Z');
const SAO_PAULO = 'America/Sao_Paulo';

describe('createFormats', () => {
  const english = createFormats('en-US');
  const portuguese = createFormats('pt-BR');

  it('formats counts, percentages and one-decimal numbers', () => {
    expect(english.count(1_234_567)).toBe('1,234,567');
    expect(english.percent(0.623)).toBe('62.3%');
    expect(english.percent(0.5)).toBe('50.0%');
    expect(english.decimal(2)).toBe('2.0');
  });

  it('formats the same numbers with the separators of another language', () => {
    expect(portuguese.count(1_234_567)).toBe('1.234.567');
    expect(portuguese.percent(0.623)).toBe('62,3%');
    expect(portuguese.decimal(2)).toBe('2,0');
  });

  it('formats calendar days in UTC, with and without the year', () => {
    expect(english.day(SEPTEMBER_8)).toBe('Sep 8');
    expect(english.dayWithYear(SEPTEMBER_8)).toBe('Sep 8, 2026');
    expect(portuguese.day(SEPTEMBER_8)).toBe('8 de set.');
  });

  it('formats instants in the project time zone, in every style', () => {
    const at = (style: Parameters<typeof english.dateTime>[0]) =>
      english.dateTime(style, SAO_PAULO)(EVENING_IN_SAO_PAULO);

    expect(at('clock')).toBe('18:40:05');
    expect(at('visitStart')).toBe('Tue, Oct 6, 18:40');
    expect(at('failureTime')).toBe('Oct 6, 18:40');
    expect(at('eventTime')).toBe('Oct 6, 2026, 18:40');
    expect(portuguese.dateTime('visitStart', SAO_PAULO)(EVENING_IN_SAO_PAULO)).toBe(
      'ter., 6 de out., 18:40',
    );
  });

  it('names countries in the language, keeping a code it does not know', () => {
    expect(english.region('BR')).toBe('Brazil');
    expect(portuguese.region('US')).toBe('Estados Unidos');
    expect(english.region('XZ')).toBe('XZ');
  });

  it('joins a list with commas in English and with the conjunction of another language', () => {
    expect(english.list(['Paid 12', 'Direct 8', 'Email 3'])).toBe('Paid 12, Direct 8, Email 3');
    expect(english.list(['Paid 12'])).toBe('Paid 12');
    expect(portuguese.list(['a', 'b', 'c'])).toBe('a, b e c');
  });

  it('builds the formats of a language once', () => {
    expect(createFormats('en-US')).toBe(english);
  });
});
