import { describe, expect, it } from 'vitest';
import { DEFAULT_LOCALE, LOCALES, localeName, parseLocale } from './locales';

describe('locales', () => {
  it('ships English as the default, then Brazilian Portuguese and Spanish', () => {
    expect(LOCALES).toEqual(['en', 'pt-BR', 'es']);
    expect(DEFAULT_LOCALE).toBe('en');
  });

  it('accepts only a language the dashboard ships, spelled exactly', () => {
    expect(parseLocale('en')).toBe('en');
    expect(parseLocale('pt-BR')).toBe('pt-BR');
    expect(parseLocale('es')).toBe('es');
    expect(parseLocale('es-MX')).toBeUndefined();
    expect(parseLocale('pt')).toBeUndefined();
    expect(parseLocale('fr')).toBeUndefined();
    expect(parseLocale(undefined)).toBeUndefined();
  });

  it('names each language in itself, capitalised the way the language does', () => {
    expect(localeName('en')).toBe('English');
    expect(localeName('pt-BR')).toBe('Português (Brasil)');
    expect(localeName('es')).toBe('Español');
  });
});
