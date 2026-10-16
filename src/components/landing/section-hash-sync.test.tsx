import { act, fireEvent, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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
    window.innerHeight = VIEWPORT;
    window.history.replaceState(null, '', '/pt-br?theme=dark');
  });

  afterEach(() => {
    vi.useRealTimers();
    document.querySelector('main')?.remove();
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
});
