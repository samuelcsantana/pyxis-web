import { describe, expect, it } from 'vitest';
import { negotiateLocale } from './negotiate';

const SUPPORTED = ['en', 'pt-BR'] as const;

function negotiate(acceptLanguage: string | null): string {
  return negotiateLocale(acceptLanguage, SUPPORTED, 'en');
}

describe('negotiateLocale', () => {
  it('picks the first language a real browser asks for', () => {
    expect(negotiate('pt-BR,pt;q=0.9,en;q=0.8')).toBe('pt-BR');
  });

  it('accepts a bare tag, whatever its case', () => {
    expect(negotiate('pt-BR')).toBe('pt-BR');
    expect(negotiate('PT-br')).toBe('pt-BR');
  });

  it('matches another region of a supported language by its primary subtag', () => {
    expect(negotiate('pt-PT')).toBe('pt-BR');
    expect(negotiate('pt')).toBe('pt-BR');
    expect(negotiate('en-GB')).toBe('en');
  });

  it('orders the ranges by weight, not by position', () => {
    expect(negotiate('en;q=0.5, pt-BR;q=0.8')).toBe('pt-BR');
  });

  it('skips a language the dashboard does not have', () => {
    expect(negotiate('es-419, pt;q=0.4')).toBe('pt-BR');
    expect(negotiate('es-419')).toBe('en');
  });

  it('never picks a language refused with a zero weight', () => {
    expect(negotiate('pt-BR;q=0, fr')).toBe('en');
  });

  it('answers the wildcard with the fallback', () => {
    expect(negotiate('*')).toBe('en');
    expect(negotiate('*;q=0.9, pt;q=0.5')).toBe('en');
  });

  it('ignores ranges with a malformed weight or tag', () => {
    expect(negotiate('pt-BR;q=abc, en;q=0.1')).toBe('en');
    expect(negotiate('pt-BR;q=1.5')).toBe('en');
    expect(negotiate('not a tag!, pt ; q=0.7')).toBe('pt-BR');
  });

  it('falls back when the header is empty or missing', () => {
    expect(negotiate('')).toBe('en');
    expect(negotiate(null)).toBe('en');
  });

  it('only answers with a supported language', () => {
    expect(negotiateLocale('pt-BR,pt;q=0.9', ['en'], 'en')).toBe('en');
  });
});
