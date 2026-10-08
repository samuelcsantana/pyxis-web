import { beforeEach, describe, expect, it, vi } from 'vitest';
import { chooseLocale } from './choose-locale';

const jar = vi.hoisted(() => ({ set: vi.fn() }));

vi.mock('next/headers', () => ({
  cookies: () => Promise.resolve(jar),
}));

function formWith(locale?: string | Blob): FormData {
  const form = new FormData();
  if (locale !== undefined) {
    form.set('locale', locale);
  }
  return form;
}

describe('chooseLocale', () => {
  beforeEach(() => {
    jar.set.mockClear();
  });

  it('keeps the chosen language for a year in a cookie only the server reads', async () => {
    await chooseLocale(formWith('pt-BR'));

    expect(jar.set).toHaveBeenCalledWith('pyxis_locale', 'pt-BR', {
      path: '/',
      maxAge: 31_536_000,
      sameSite: 'lax',
      httpOnly: true,
    });
  });

  it.each([
    ['a language the dashboard does not ship', formWith('fr')],
    ['no language at all', formWith()],
    ['a file instead of a language', formWith(new Blob(['pt-BR']))],
  ])('leaves the cookie alone for %s', async (_case, form) => {
    await chooseLocale(form);

    expect(jar.set).not.toHaveBeenCalled();
  });
});
