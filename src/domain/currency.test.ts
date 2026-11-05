import { describe, expect, it } from 'vitest';
import {
  currencyChoices,
  currencyLabel,
  currencyOptions,
  DEFAULT_CURRENCY,
  PROJECT_CURRENCIES,
  projectCurrency,
} from './currency';

const NAMES: Readonly<Record<string, string>> = {
  BRL: 'Brazilian real',
  NZD: 'New Zealand dollar',
};

function nameOf(code: string): string {
  return NAMES[code] ?? code;
}

describe('currencyChoices', () => {
  it('offers the common currencies, the real first', () => {
    expect(currencyChoices('BRL')).toBe(PROJECT_CURRENCIES);
    expect(PROJECT_CURRENCIES[0]).toBe('BRL');
  });

  it('keeps a currency set elsewhere at the end of the list', () => {
    expect(currencyChoices('NZD').at(-1)).toBe('NZD');
    expect(currencyChoices('NZD')).toHaveLength(PROJECT_CURRENCIES.length + 1);
  });
});

describe('currencyOptions and currencyLabel', () => {
  it('names each currency after its code', () => {
    expect(currencyLabel('BRL', nameOf)).toBe('BRL · Brazilian real');
    expect(currencyOptions('NZD', nameOf).at(-1)).toEqual({
      code: 'NZD',
      label: 'NZD · New Zealand dollar',
    });
  });
});

describe('projectCurrency', () => {
  it('reads the project currency, the real when the project does not say', () => {
    expect(projectCurrency({ currency: 'USD' })).toBe('USD');
    expect(projectCurrency({})).toBe(DEFAULT_CURRENCY);
  });
});
