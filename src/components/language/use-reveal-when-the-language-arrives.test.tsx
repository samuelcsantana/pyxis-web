import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CONTENT_ID } from '@/components/shell/content-id';
import type { Locale } from '@/i18n/locales';
import { useRevealWhenTheLanguageArrives } from './use-reveal-when-the-language-arrives';

const animate = vi.fn();
let running: Animation[] = [];
let reducedMotion = false;

beforeEach(() => {
  animate.mockClear();
  running = [];
  reducedMotion = false;
  Object.defineProperty(HTMLElement.prototype, 'animate', { configurable: true, value: animate });
  Object.defineProperty(HTMLElement.prototype, 'getAnimations', {
    configurable: true,
    value: () => running,
  });
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({ matches: reducedMotion && query.includes('reduce') })),
  );
});

afterEach(() => {
  Reflect.deleteProperty(HTMLElement.prototype, 'animate');
  Reflect.deleteProperty(HTMLElement.prototype, 'getAnimations');
  vi.unstubAllGlobals();
});

function LanguageOnPage({ locale }: { readonly locale: Locale }) {
  useRevealWhenTheLanguageArrives(locale);
  return null;
}

function pageWithContent(locale: Locale) {
  return (
    <>
      <LanguageOnPage locale={locale} />
      <main id={CONTENT_ID}>Sign in to Pyxis</main>
    </>
  );
}

describe('useRevealWhenTheLanguageArrives', () => {
  it('brings the page content in when the language it asked for arrives', () => {
    const { rerender } = render(pageWithContent('en'));
    expect(animate).not.toHaveBeenCalled();

    rerender(pageWithContent('pt-BR'));

    expect(animate).toHaveBeenCalledOnce();
    expect(animate.mock.contexts[0]).toBe(document.getElementById(CONTENT_ID));
    expect(animate.mock.calls[0]?.[1]).toEqual({ duration: 180, easing: 'ease-out' });
  });

  it('leaves the content still while the language stays the same', () => {
    const { rerender } = render(pageWithContent('en'));

    rerender(pageWithContent('en'));

    expect(animate).not.toHaveBeenCalled();
  });

  it('leaves the content still when the system asks for reduced motion', () => {
    reducedMotion = true;
    const { rerender } = render(pageWithContent('en'));

    rerender(pageWithContent('pt-BR'));

    expect(animate).not.toHaveBeenCalled();
  });

  it('does not start the reveal twice when another language control already started it', () => {
    running = [{} as Animation];
    const { rerender } = render(pageWithContent('en'));

    rerender(pageWithContent('pt-BR'));

    expect(animate).not.toHaveBeenCalled();
  });

  it('reveals nothing on a page without its main content', () => {
    const { rerender } = render(<LanguageOnPage locale="en" />);

    rerender(<LanguageOnPage locale="pt-BR" />);

    expect(animate).not.toHaveBeenCalled();
  });
});
