import { act, fireEvent, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CARRIED_SECTION_KEY } from '@/lib/carried-section';
import { currentSectionId, SectionHashSync } from './section-hash-sync';

const VIEWPORT = 1_000;

function sectionAt(id: string, top: number): HTMLElement {
  const section = document.createElement('section');
  section.id = id;
  section.getBoundingClientRect = () => ({ top }) as DOMRect;
  return section;
}

function pageWith(tops: Readonly<Record<string, number>>): void {
  const main = document.createElement('main');
  main.append(...Object.entries(tops).map(([id, top]) => sectionAt(id, top)));
  document.body.append(main);
}

function stayOnThisDocument(event: Event): void {
  event.preventDefault();
}

function prefetchingOtherLanguages(supported: boolean): void {
  Object.defineProperty(HTMLScriptElement, 'supports', {
    configurable: true,
    value: (type: string) => supported && type === 'speculationrules',
  });
}

function languageLinks(...paths: readonly string[]): readonly HTMLAnchorElement[] {
  const nav = document.createElement('nav');
  const links = paths.map((path) => {
    const link = document.createElement('a');
    link.setAttribute('href', path);
    link.setAttribute('data-keeps-section', '');
    link.append(document.createElement('span'));
    link.addEventListener('click', stayOnThisDocument);
    return link;
  });
  nav.append(...links);
  document.body.append(nav);
  return links;
}

function scroll(): void {
  act(() => {
    fireEvent.scroll(window);
    vi.runAllTimers();
  });
}

describe('currentSectionId', () => {
  it('names the last section whose top has crossed the reading line', () => {
    const sections = [sectionAt('privacy', -900), sectionAt('pricing', 200), sectionAt('faq', 900)];

    expect(currentSectionId(sections, VIEWPORT)).toBe('pricing');
  });

  it('names nothing while the reader is still above every section', () => {
    expect(currentSectionId([sectionAt('privacy', 600)], VIEWPORT)).toBe('');
  });
});

describe('SectionHashSync', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    prefetchingOtherLanguages(true);
    window.innerHeight = VIEWPORT;
    window.history.replaceState(null, '', '/pt-br?theme=dark');
  });

  afterEach(() => {
    vi.useRealTimers();
    document.querySelector('main')?.remove();
    document.querySelector('nav')?.remove();
    window.sessionStorage.clear();
    Reflect.deleteProperty(HTMLScriptElement, 'supports');
    window.history.replaceState(null, '', '/');
  });

  it('follows the section on screen in the address, keeping the path and the query', () => {
    pageWith({ 'never-stored': -1_200, pricing: 100, faq: 1_400 });
    render(<SectionHashSync />);

    scroll();

    expect(`${window.location.pathname}${window.location.search}${window.location.hash}`).toBe(
      '/pt-br?theme=dark#pricing',
    );
  });

  it('clears the address back at the top, and leaves it alone when nothing changed', () => {
    window.history.replaceState(null, '', '/pt-br#faq');
    pageWith({ 'never-stored': 700 });
    render(<SectionHashSync />);
    const replace = vi.spyOn(window.history, 'replaceState');

    scroll();
    expect(window.location.hash).toBe('');
    expect(window.location.pathname).toBe('/pt-br');
    scroll();

    expect(replace).toHaveBeenCalledTimes(1);
  });

  it('reads the page once per frame, however many scroll events arrive, and stops when gone', () => {
    pageWith({ pricing: 0 });
    const { unmount } = render(<SectionHashSync />);
    const replace = vi.spyOn(window.history, 'replaceState');

    act(() => {
      fireEvent.scroll(window);
      fireEvent.scroll(window);
      vi.runAllTimers();
    });
    expect(replace).toHaveBeenCalledTimes(1);

    unmount();
    scroll();
    expect(replace).toHaveBeenCalledTimes(1);
  });

  it('carries the section being read into the language link that is followed', () => {
    window.history.replaceState(null, '', '/pt-br#pricing');
    const [english] = languageLinks('/');
    render(<SectionHashSync />);

    fireEvent.click(english?.querySelector('span') ?? document.body);

    expect(window.sessionStorage.getItem(CARRIED_SECTION_KEY)).toBe('/#pricing');
  });

  it('carries no section from the top, so an older one never comes back', () => {
    window.sessionStorage.setItem(CARRIED_SECTION_KEY, '/es#faq');
    window.history.replaceState(null, '', '/pt-br');
    const [spanish] = languageLinks('/es');
    render(<SectionHashSync />);

    fireEvent.click(spanish ?? document.body);

    expect(window.sessionStorage.getItem(CARRIED_SECTION_KEY)).toBe('/es');
  });

  it('follows the language link straight to the section where the browser fetches nothing ahead', () => {
    prefetchingOtherLanguages(false);
    window.history.replaceState(null, '', '/pt-br#faq');
    const [spanish] = languageLinks('/es');
    render(<SectionHashSync />);

    fireEvent.click(spanish ?? document.body);

    expect(spanish?.hash).toBe('#faq');
    expect(spanish?.pathname).toBe('/es');
    expect(window.sessionStorage.getItem(CARRIED_SECTION_KEY)).toBeNull();
  });

  it('carries nothing for any other click, nor once the page is gone', () => {
    window.history.replaceState(null, '', '/pt-br#pricing');
    const [english] = languageLinks('/');
    const elsewhere = document.createElement('a');
    elsewhere.setAttribute('href', '#faq');
    document.body.append(elsewhere);
    const { unmount } = render(<SectionHashSync />);

    fireEvent.click(elsewhere);
    fireEvent(document, new Event('click'));
    unmount();
    fireEvent.click(english ?? document.body);

    expect(window.sessionStorage.getItem(CARRIED_SECTION_KEY)).toBeNull();
    elsewhere.remove();
  });
});
