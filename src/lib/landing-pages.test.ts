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
} from './landing-pages';

describe('landing pages', () => {
  it('serves the home page in English at the root and in Brazilian Portuguese at /pt-br', () => {
    expect(LANDING_PAGES.map((page) => [page.path, page.locale])).toEqual([
      ['/', 'en'],
      ['/pt-br', 'pt-BR'],
    ]);
    expect(DEFAULT_LANDING_PAGE.locale).toBe('en');
  });

  it('finds a page by its public address, and nothing at any other address', () => {
    expect(landingPageAt('/')?.locale).toBe('en');
    expect(landingPageAt('/pt-br')?.locale).toBe('pt-BR');
    expect(landingPageAt('/pt-BR')).toBeUndefined();
    expect(landingPageAt('/en')).toBeUndefined();
  });

  it('finds a page by the slug of its internal route', () => {
    expect(landingPageOfSlug('en')?.path).toBe('/');
    expect(landingPageOfSlug('pt-br')?.path).toBe('/pt-br');
    expect(landingPageOfSlug('es')).toBeUndefined();
  });

  it('finds the page of each language the dashboard ships', () => {
    expect(landingPageOfLocale('en').path).toBe('/');
    expect(landingPageOfLocale('pt-BR').path).toBe('/pt-br');
  });

  it('maps each page to the internal route the proxy rewrites to', () => {
    expect(LANDING_PAGES.map(internalPathOf)).toEqual(['/landing/en', '/landing/pt-br']);
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
    expect(landingPageOfInternalPath('/landing/fr').path).toBe('/');
  });

  it('gives the public address of each page on the main domain', () => {
    expect(LANDING_PAGES.map(landingUrlOf)).toEqual([
      'https://pyxis-analytics.dev/',
      'https://pyxis-analytics.dev/pt-br',
    ]);
  });
});
