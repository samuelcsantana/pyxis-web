import { beforeEach, describe, expect, it, vi } from 'vitest';
import { currentLocale } from './current-locale';

vi.unmock('@/i18n/current-locale');

const request = vi.hoisted(() => ({
  cookie: undefined as string | undefined,
  acceptLanguage: null as string | null,
  readHeaders: { count: 0 },
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
    request.readHeaders.count += 1;
    return Promise.resolve(
      new Headers(
        request.acceptLanguage === null ? {} : { 'accept-language': request.acceptLanguage },
      ),
    );
  },
}));

describe('currentLocale', () => {
  beforeEach(() => {
    request.cookie = undefined;
    request.acceptLanguage = null;
    request.readHeaders.count = 0;
  });

  it('follows the language the admin chose, without reading the browser languages', async () => {
    request.cookie = 'en';
    request.acceptLanguage = 'fr';

    await expect(currentLocale()).resolves.toBe('en');
    expect(request.readHeaders.count).toBe(0);
  });

  it('asks the browser when the cookie holds a language the dashboard does not ship', async () => {
    request.cookie = 'pt-BR';
    request.acceptLanguage = 'en-GB,en;q=0.9';

    await expect(currentLocale()).resolves.toBe('en');
    expect(request.readHeaders.count).toBe(1);
  });

  it('falls back to English without a cookie or a header', async () => {
    await expect(currentLocale()).resolves.toBe('en');
    expect(request.readHeaders.count).toBe(1);
  });
});
