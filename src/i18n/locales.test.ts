import { describe, expect, it } from 'vitest';
import { DEFAULT_LOCALE, LOCALES, parseLocale } from './locales';

describe('locales', () => {
  it('ships English as the default, and Brazilian Portuguese', () => {
    expect(LOCALES).toEqual(['en', 'pt-BR']);
    expect(DEFAULT_LOCALE).toBe('en');
  });

  it('accepts only a language the dashboard ships, spelled exactly', () => {
    expect(parseLocale('en')).toBe('en');
    expect(parseLocale('pt-BR')).toBe('pt-BR');
    expect(parseLocale('pt')).toBeUndefined();
    expect(parseLocale('fr')).toBeUndefined();
    expect(parseLocale(undefined)).toBeUndefined();
  });
});
