import { describe, expect, it } from 'vitest';
import { APP_DESCRIPTION } from '@/lib/site';
import { createFormats } from './formats';
import { createI18n } from './i18n';
import { en } from './messages/en';

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
});
