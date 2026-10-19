import { describe, expect, it } from 'vitest';
import {
  DEFAULT_LANDING_PAGE,
  internalPathOf,
  isInternalLandingPath,
  LANDING_PAGES,
  landingPageAt,
  landingPageOfInternalPath,
  landingPageOfLocale,
  landingPageOfSlug,
  landingUrlOf,
  languageAlternatesOf,
} from './landing-pages';

describe('landing pages', () => {
  it('serves the home page in English at the root, then one address per other language', () => {
    expect(LANDING_PAGES.map((page) => [page.path, page.locale])).toEqual([
      ['/', 'en'],
      ['/pt-br', 'pt-BR'],
      ['/es', 'es'],
      ['/de', 'de'],
      ['/fr', 'fr'],
      ['/it', 'it'],
      ['/nl', 'nl'],
    ]);
    expect(DEFAULT_LANDING_PAGE.locale).toBe('en');
  });

  it('finds a page by its public address, and nothing at any other address', () => {
    expect(landingPageAt('/')?.locale).toBe('en');
    expect(landingPageAt('/pt-br')?.locale).toBe('pt-BR');
    expect(landingPageAt('/es')?.locale).toBe('es');
    expect(landingPageAt('/pt-BR')).toBeUndefined();
    expect(landingPageAt('/es-mx')).toBeUndefined();
    expect(landingPageAt('/en')).toBeUndefined();
  });

  it('finds a page by the slug of its internal route', () => {
    expect(landingPageOfSlug('en')?.path).toBe('/');
    expect(landingPageOfSlug('pt-br')?.path).toBe('/pt-br');
    expect(landingPageOfSlug('es')?.path).toBe('/es');
    expect(landingPageOfSlug('nl')?.path).toBe('/nl');
    expect(landingPageOfSlug('ja')).toBeUndefined();
  });

  it('finds the page of each language the dashboard ships', () => {
    expect(landingPageOfLocale('en').path).toBe('/');
    expect(landingPageOfLocale('pt-BR').path).toBe('/pt-br');
    expect(landingPageOfLocale('es').path).toBe('/es');
    expect(landingPageOfLocale('de').path).toBe('/de');
    expect(landingPageOfLocale('fr').path).toBe('/fr');
    expect(landingPageOfLocale('it').path).toBe('/it');
    expect(landingPageOfLocale('nl').path).toBe('/nl');
  });

  it('maps each page to the internal route the proxy rewrites to', () => {
    expect(LANDING_PAGES.map(internalPathOf)).toEqual([
      '/landing/en',
      '/landing/pt-br',
      '/landing/es',
      '/landing/de',
      '/landing/fr',
      '/landing/it',
      '/landing/nl',
    ]);
  });

  it('recognizes the internal route and nothing that only starts like it', () => {
    expect(isInternalLandingPath('/landing')).toBe(true);
    expect(isInternalLandingPath('/landing/pt-br')).toBe(true);
    expect(isInternalLandingPath('/landing/pt-br/opengraph-image.png')).toBe(true);
    expect(isInternalLandingPath('/landings')).toBe(false);
    expect(isInternalLandingPath('/p1/overview')).toBe(false);
  });

  it('turns an internal address back into its page, English when it names none', () => {
    expect(landingPageOfInternalPath('/landing/pt-br').path).toBe('/pt-br');
    expect(landingPageOfInternalPath('/landing/pt-br/anything').path).toBe('/pt-br');
    expect(landingPageOfInternalPath('/landing/en').path).toBe('/');
    expect(landingPageOfInternalPath('/landing').path).toBe('/');
    expect(landingPageOfInternalPath('/landing/ja').path).toBe('/');
  });

  it('lists each language and the default for search engines, as paths or full addresses', () => {
    expect(languageAlternatesOf((page) => page.path)).toEqual({
      en: '/',
      'pt-BR': '/pt-br',
      es: '/es',
      de: '/de',
      fr: '/fr',
      it: '/it',
      nl: '/nl',
      'x-default': '/',
    });
    expect(languageAlternatesOf(landingUrlOf)).toEqual({
      en: 'https://pyxis-analytics.dev/',
      'pt-BR': 'https://pyxis-analytics.dev/pt-br',
      es: 'https://pyxis-analytics.dev/es',
      de: 'https://pyxis-analytics.dev/de',
      fr: 'https://pyxis-analytics.dev/fr',
      it: 'https://pyxis-analytics.dev/it',
      nl: 'https://pyxis-analytics.dev/nl',
      'x-default': 'https://pyxis-analytics.dev/',
    });
  });

  it('gives the public address of each page on the main domain', () => {
    expect(LANDING_PAGES.map(landingUrlOf)).toEqual([
      'https://pyxis-analytics.dev/',
      'https://pyxis-analytics.dev/pt-br',
      'https://pyxis-analytics.dev/es',
      'https://pyxis-analytics.dev/de',
      'https://pyxis-analytics.dev/fr',
      'https://pyxis-analytics.dev/it',
      'https://pyxis-analytics.dev/nl',
    ]);
  });
});
