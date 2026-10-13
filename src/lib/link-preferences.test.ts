import { describe, expect, it } from 'vitest';
import {
  carriedHref,
  carriesPreferences,
  preferencesIn,
  withoutPreferences,
} from './link-preferences';

describe('link preferences', () => {
  it('reads a language and a theme the dashboard knows from a link', () => {
    expect(preferencesIn(new URLSearchParams('lang=pt-BR&theme=dark'))).toEqual({
      locale: 'pt-BR',
      theme: 'dark',
    });
    expect(preferencesIn(new URLSearchParams('lang=fr&theme=neon'))).toEqual({
      locale: undefined,
      theme: undefined,
    });
    expect(preferencesIn(new URLSearchParams(''))).toEqual({
      locale: undefined,
      theme: undefined,
    });
  });

  it('knows when a link carries either preference, valid or not', () => {
    expect(carriesPreferences(new URLSearchParams('lang=fr'))).toBe(true);
    expect(carriesPreferences(new URLSearchParams('theme=dark'))).toBe(true);
    expect(carriesPreferences(new URLSearchParams('next=%2Fp1%2Foverview'))).toBe(false);
  });

  it('drops only the preferences from an address', () => {
    expect(
      withoutPreferences(
        new URL('https://app.pyxis-analytics.dev/sign-in?lang=pt-BR&next=%2Fp1&theme=dark#x'),
      ).toString(),
    ).toBe('https://app.pyxis-analytics.dev/sign-in?next=%2Fp1#x');
  });

  describe('carriedHref', () => {
    const fromHome = {
      locale: 'pt-BR',
      theme: 'dark',
      currentHost: 'pyxis-analytics.dev',
    } as const;

    it('carries the language and the chosen theme to the dashboard and the demo', () => {
      expect(carriedHref('https://app.pyxis-analytics.dev/sign-in', fromHome)).toBe(
        'https://app.pyxis-analytics.dev/sign-in?lang=pt-BR&theme=dark',
      );
      expect(carriedHref('https://demo.pyxis-analytics.dev/p1/funnel', fromHome)).toBe(
        'https://demo.pyxis-analytics.dev/p1/funnel?lang=pt-BR&theme=dark',
      );
    });

    it('carries only the theme to the home page, whose address already names its language', () => {
      expect(
        carriedHref('https://pyxis-analytics.dev/pt-br#never-stored', {
          locale: 'pt-BR',
          theme: 'light',
          currentHost: 'app.pyxis-analytics.dev',
        }),
      ).toBe('https://pyxis-analytics.dev/pt-br?theme=light#never-stored');
    });

    it('drops a theme it carried before when the visitor goes back to the system theme', () => {
      expect(
        carriedHref('https://demo.pyxis-analytics.dev/?lang=en&theme=dark', {
          ...fromHome,
          theme: undefined,
        }),
      ).toBe('https://demo.pyxis-analytics.dev/?lang=pt-BR');
    });

    it('leaves alone links to other sites and to the address being read', () => {
      expect(carriedHref('https://github.com/samuelcsantana/pyxis-api', fromHome)).toBeUndefined();
      expect(carriedHref('https://pyxis-analytics.dev/pt-br', fromHome)).toBeUndefined();
    });
  });
});
