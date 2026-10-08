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
});
