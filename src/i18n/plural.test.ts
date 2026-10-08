import { describe, expect, it } from 'vitest';
import { plural } from './plural';

const VISITS = { one: 'visit', other: 'visits' };
const EVERY_PORTUGUESE_FORM = { one: 'one', many: 'many', other: 'other' };

describe('plural', () => {
  it('picks the English form from the CLDR rules', () => {
    expect(plural('en', 1, VISITS)).toBe('visit');
    expect(plural('en', 2, VISITS)).toBe('visits');
    expect(plural('en', 0, VISITS)).toBe('visits');
  });

  it('follows the Brazilian Portuguese rules, where zero takes the singular form', () => {
    expect(plural('pt-BR', 0, EVERY_PORTUGUESE_FORM)).toBe('one');
    expect(plural('pt-BR', 2, EVERY_PORTUGUESE_FORM)).toBe('other');
    expect(plural('pt-BR', 1_000_000, EVERY_PORTUGUESE_FORM)).toBe('many');
  });

  it('uses the exact-zero form before the rules when there is one', () => {
    expect(plural('en', 0, { ...VISITS, zero: 'no visits' })).toBe('no visits');
    expect(plural('en', 1, { ...VISITS, zero: 'no visits' })).toBe('visit');
  });

  it('falls back to the other form when the language has a category the message lacks', () => {
    expect(plural('pt-BR', 1_000_000, { one: 'one', other: 'other' })).toBe('other');
  });
});
