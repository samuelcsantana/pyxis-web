import { beforeEach, describe, expect, it, vi } from 'vitest';
import { currentLocale } from './current-locale';
import { PATH_LOCALE_HEADER } from './path-locale';

vi.unmock('@/i18n/current-locale');

const request = vi.hoisted(() => ({
  cookie: undefined as string | undefined,
  acceptLanguage: null as string | null,
  pathLocale: null as string | null,
}));

vi.mock('next/headers', () => ({
  cookies: () =>
    Promise.resolve({
      get: (name: string) =>
        name === 'pyxis_locale' && request.cookie !== undefined
          ? { name, value: request.cookie }
          : undefined,
    }),
  headers: () => {
    const entries: Record<string, string> = {};
    if (request.acceptLanguage !== null) {
      entries['accept-language'] = request.acceptLanguage;
    }
    if (request.pathLocale !== null) {
      entries['x-pyxis-path-locale'] = request.pathLocale;
    }
    return Promise.resolve(new Headers(entries));
  },
}));

describe('currentLocale', () => {
  beforeEach(() => {
    request.cookie = undefined;
    request.acceptLanguage = null;
    request.pathLocale = null;
  });

  it('follows the language the admin chose over the browser languages', async () => {
    request.cookie = 'en';
    request.acceptLanguage = 'fr';

    await expect(currentLocale()).resolves.toBe('en');
  });

  it('keeps the chosen Brazilian Portuguese even when the browser asks for English', async () => {
    request.cookie = 'pt-BR';
    request.acceptLanguage = 'en-GB,en;q=0.9';

    await expect(currentLocale()).resolves.toBe('pt-BR');
  });

  it('asks the browser when the cookie holds a language the dashboard does not ship', async () => {
    request.cookie = 'fr';
    request.acceptLanguage = 'en-GB,en;q=0.9';

    await expect(currentLocale()).resolves.toBe('en');
  });

  it('serves Brazilian Portuguese to a browser that asks for any Portuguese', async () => {
    request.acceptLanguage = 'pt-PT,pt;q=0.9,en;q=0.5';

    await expect(currentLocale()).resolves.toBe('pt-BR');
  });

  it('falls back to English without a cookie or a header', async () => {
    await expect(currentLocale()).resolves.toBe('en');
  });

  describe('on a page whose address names its language', () => {
    it('uses the language of the address over the cookie and the browser', async () => {
      request.pathLocale = 'pt-BR';
      request.cookie = 'en';
      request.acceptLanguage = 'en-US,en;q=0.9';

      await expect(currentLocale()).resolves.toBe('pt-BR');
    });

    it('serves English at the English address to a browser that asks for Portuguese', async () => {
      request.pathLocale = 'en';
      request.acceptLanguage = 'pt-BR,pt;q=0.9';

      await expect(currentLocale()).resolves.toBe('en');
    });

    it('ignores a value that is not a language the dashboard ships', async () => {
      request.pathLocale = 'fr';
      request.cookie = 'pt-BR';

      await expect(currentLocale()).resolves.toBe('pt-BR');
    });
  });

  it('names the header the proxy sets', () => {
    expect(PATH_LOCALE_HEADER).toBe('x-pyxis-path-locale');
  });
});
