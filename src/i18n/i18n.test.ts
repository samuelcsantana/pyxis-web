import { describe, expect, it } from 'vitest';
import { APP_DESCRIPTION } from '@/lib/site';
import { createFormats } from './formats';
import { createI18n } from './i18n';
import { en } from './messages/en';
import { es } from './messages/es';
import { ptBR } from './messages/pt-BR';
import { dutch } from '@/test-utils/dutch';
import { french } from '@/test-utils/french';
import { german } from '@/test-utils/german';
import { italian } from '@/test-utils/italian';

const NARROW_NO_BREAK_SPACE = '\u202f';

describe('createI18n', () => {
  it('translates and formats in the language it was made for', () => {
    const i18n = createI18n('en', en);

    expect(i18n.locale).toBe('en');
    expect(i18n.t('meta.description')).toBe(APP_DESCRIPTION);
    expect(i18n.format).toBe(createFormats('en-US'));
  });

  it('counts things in the singular for one and in the plural otherwise', () => {
    const { t } = createI18n('en', en);

    expect(t('counts.day', { count: 1 })).toBe('1 day');
    expect(t('counts.day', { count: 30 })).toBe('30 days');
    expect(t('counts.visit', { count: 1200 })).toBe('1,200 visits');
    expect(t('counts.person', { count: 0 })).toBe('0 people');
  });

  it('formats Brazilian Portuguese with its own separators', () => {
    const i18n = createI18n('pt-BR', ptBR);

    expect(i18n.locale).toBe('pt-BR');
    expect(i18n.format).toBe(createFormats('pt-BR'));
    expect(i18n.format.count(2697)).toBe('2.697');
  });

  it('counts zero in the plural in Brazilian Portuguese, where CLDR groups it with one', () => {
    const { t } = createI18n('pt-BR', ptBR);

    expect(new Intl.PluralRules('pt-BR').select(0)).toBe('one');
    expect(t('counts.visit', { count: 0 })).toBe('0 visitas');
    expect(t('counts.visit', { count: 1 })).toBe('1 visita');
    expect(t('counts.visit', { count: 2 })).toBe('2 visitas');
    expect(t('counts.visit', { count: 1_000_000 })).toBe('1.000.000 visitas');
  });

  it('formats Spanish as Spain does, with no separator in four-digit numbers', () => {
    const i18n = createI18n('es', es);

    expect(i18n.locale).toBe('es');
    expect(i18n.format).toBe(createFormats('es'));
    expect(i18n.format.count(2697)).toBe('2697');
    expect(i18n.format.count(12_345)).toBe('12.345');
  });

  it('counts in Spanish, with zero and a million in the plural', () => {
    const { t } = createI18n('es', es);

    expect(t('counts.visit', { count: 0 })).toBe('0 visitas');
    expect(t('counts.visit', { count: 1 })).toBe('1 visita');
    expect(t('counts.visit', { count: 2 })).toBe('2 visitas');
    expect(new Intl.PluralRules('es').select(1_000_000)).toBe('many');
    expect(t('counts.visit', { count: 1_000_000 })).toBe('1.000.000 visitas');
  });

  it.each([
    [german, 'de', '2.697', '12.345'],
    [french, 'fr', `2${NARROW_NO_BREAK_SPACE}697`, `12${NARROW_NO_BREAK_SPACE}345`],
    [italian, 'it', '2697', '12.345'],
    [dutch, 'nl', '2.697', '12.345'],
  ] as const)('formats numbers the %#th new language way (%s)', (i18n, tag, four, five) => {
    expect(i18n.locale).toBe(tag);
    expect(i18n.format).toBe(createFormats(tag));
    expect(i18n.format.count(2697)).toBe(four);
    expect(i18n.format.count(12_345)).toBe(five);
  });

  it.each([
    [german, '1 Besuch', '2 Besuche'],
    [french, '1 visite', '2 visites'],
    [italian, '1 visita', '2 visite'],
    [dutch, '1 bezoek', '2 bezoeken'],
  ] as const)('counts visits in the singular and the plural (%#)', (i18n, one, two) => {
    expect(i18n.t('counts.visit', { count: 1 })).toBe(one);
    expect(i18n.t('counts.visit', { count: 2 })).toBe(two);
  });
});
