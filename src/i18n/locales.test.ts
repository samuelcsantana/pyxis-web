import { describe, expect, it } from 'vitest';
import { DEFAULT_LOCALE, LOCALES, parseLocale } from './locales';

describe('locales', () => {
  it('ships English as the default and only language for now', () => {
    expect(LOCALES).toEqual(['en']);
    expect(DEFAULT_LOCALE).toBe('en');
  });

  it('accepts only a language the dashboard ships', () => {
    expect(parseLocale('en')).toBe('en');
    expect(parseLocale('pt-BR')).toBeUndefined();
    expect(parseLocale(undefined)).toBeUndefined();
  });
});
