import { describe, expect, it } from 'vitest';
import { APP_DESCRIPTION } from '@/lib/site';
import { createFormats } from './formats';
import { createI18n } from './i18n';
import { en } from './messages/en';
import { ptBR } from './messages/pt-BR';

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
});
