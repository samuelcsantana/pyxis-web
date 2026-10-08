import { describe, expect, it } from 'vitest';
import { APP_DESCRIPTION } from '@/lib/site';
import { clientMessages, getTranslator, loadMessages } from './get-messages';
import { en } from './messages/en';

describe('get-messages', () => {
  it('loads the dictionary of a language', async () => {
    await expect(loadMessages('en')).resolves.toBe(en);
  });

  it('translates in the language of the request', async () => {
    const t = await getTranslator();

    expect(t('meta.description')).toBe(APP_DESCRIPTION);
  });

  it('keeps the server-only namespaces out of the client messages', async () => {
    await expect(clientMessages('en')).resolves.toEqual({});
  });
});
