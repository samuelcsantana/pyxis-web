import { describe, expect, it } from 'vitest';
import { APP_DESCRIPTION } from '@/lib/site';
import { clientMessages, getI18n, getTranslator, loadMessages } from './get-messages';
import { en } from './messages/en';

describe('get-messages', () => {
  it('loads the dictionary of a language', async () => {
    await expect(loadMessages('en')).resolves.toBe(en);
  });

  it('translates in the language of the request', async () => {
    const t = await getTranslator();

    expect(t('meta.description')).toBe(APP_DESCRIPTION);
  });

  it('gives the domain the translator and formats of the request language', async () => {
    const i18n = await getI18n();

    expect(i18n.locale).toBe('en');
    expect(i18n.t('meta.description')).toBe(APP_DESCRIPTION);
    expect(i18n.format.count(2697)).toBe('2,697');
  });

  it('keeps the server-only namespaces out of the client messages', async () => {
    const messages = await clientMessages('en');

    expect(Object.keys(messages)).toEqual([
      'funnelEditor',
      'screens',
      'nav',
      'theme',
      'periodSelector',
      'notFound',
      'errorPanel',
    ]);
    expect(messages.funnelEditor.problems.pathStart).toBe('A page path starts with "/".');
  });
});
