import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CONTENT_ID } from '@/components/shell/content-id';
import { LanguageMenu } from './language-menu';

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
});

function pageWithContent(locale: 'en' | 'pt-BR', choose = chooser()) {
  return (
    <>
      <LanguageMenu locale={locale} label="Language" choose={choose} />
      <main id={CONTENT_ID}>Sign in to Pyxis</main>
    </>
  );
}

function chooser() {
  return vi.fn<(form: FormData) => Promise<void>>(() => Promise.resolve());
}

describe('LanguageMenu', () => {
  it('names every language in itself and marks the one in use', () => {
    render(<LanguageMenu locale="pt-BR" label="Idioma" choose={chooser()} />);

    const group = screen.getByRole('group', { name: 'Idioma' });
    const english = screen.getByRole('button', { name: 'English' });
    const portuguese = screen.getByRole('button', { name: 'Português (Brasil)' });

    expect(group).toContainElement(english);
    expect(english).toHaveAttribute('aria-pressed', 'false');
    expect(english).toHaveAttribute('lang', 'en');
    expect(portuguese).toHaveAttribute('aria-pressed', 'true');
    expect(portuguese).toHaveAttribute('lang', 'pt-BR');
  });

  it('sends the language pressed to the server', async () => {
    const choose = chooser();
    render(<LanguageMenu locale="en" label="Language" choose={choose} />);

    await userEvent.click(screen.getByRole('button', { name: 'Português (Brasil)' }));

    await waitFor(() => {
      expect(choose).toHaveBeenCalledOnce();
    });
    expect(choose.mock.calls[0]?.[0].get('locale')).toBe('pt-BR');
  });

  it('marks the language pressed at once, before the page in that language arrives', async () => {
    const neverAnswers = vi.fn<(form: FormData) => Promise<void>>(
      () => new Promise(() => undefined),
    );
    render(<LanguageMenu locale="en" label="Language" choose={neverAnswers} />);

    await userEvent.click(screen.getByRole('button', { name: 'Português (Brasil)' }));

    expect(screen.getByRole('button', { name: 'Português (Brasil)' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: 'English' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('slides a fill under the language in use once the options are drawn', () => {
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(80);
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(32);

    render(<LanguageMenu locale="en" label="Language" choose={chooser()} />);

    expect(screen.getByTestId('sliding-indicator')).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Language' })).toHaveAttribute('data-sliding', '');
  });

  it('brings the page content in when the language it asked for arrives', () => {
    const { rerender } = render(pageWithContent('en'));
    expect(animate).not.toHaveBeenCalled();

    rerender(pageWithContent('pt-BR'));

    expect(animate).toHaveBeenCalledOnce();
    expect(animate.mock.contexts[0]).toBe(document.getElementById(CONTENT_ID));
    expect(animate.mock.calls[0]?.[1]).toEqual({ duration: 180, easing: 'ease-out' });
  });

  it('leaves the content still when the system asks for reduced motion', () => {
    reducedMotion = true;
    const { rerender } = render(pageWithContent('en'));

    rerender(pageWithContent('pt-BR'));

    expect(animate).not.toHaveBeenCalled();
  });

  it('does not start the reveal twice when another language menu already started it', () => {
    running = [{} as Animation];
    const { rerender } = render(pageWithContent('en'));

    rerender(pageWithContent('pt-BR'));

    expect(animate).not.toHaveBeenCalled();
  });

  it('reveals nothing on a page without its main content', () => {
    const { rerender } = render(<LanguageMenu locale="en" label="Language" choose={chooser()} />);

    rerender(<LanguageMenu locale="pt-BR" label="Language" choose={chooser()} />);

    expect(animate).not.toHaveBeenCalled();
  });

  it('styles the current language like the current item of the navigation in the sidebar', () => {
    render(<LanguageMenu locale="en" label="Language" choose={chooser()} surface="nav" />);

    expect(screen.getByRole('button', { name: 'English' })).toHaveClass('bg-nav-active');
    expect(screen.getByRole('button', { name: 'Português (Brasil)' })).not.toHaveClass(
      'bg-nav-active',
    );
  });

  it('stacks the languages in a column when asked, and lays them in a row otherwise', () => {
    const { rerender } = render(
      <LanguageMenu
        locale="en"
        label="Language"
        choose={chooser()}
        surface="nav"
        layout="column"
      />,
    );

    expect(screen.getByRole('group', { name: 'Language' })).toHaveClass('flex-col');

    rerender(<LanguageMenu locale="en" label="Language" choose={chooser()} surface="nav" />);

    expect(screen.getByRole('group', { name: 'Language' })).not.toHaveClass('flex-col');
  });
});

describe('LanguageMenu on a narrow header', () => {
  it('shows two-letter codes on phones while keeping each full name for screen readers', () => {
    render(<LanguageMenu locale="pt-BR" label="Idioma" choose={chooser()} compactOnPhones />);

    expect(screen.getByRole('button', { name: 'English' })).toHaveTextContent('EN');
    expect(screen.getByRole('button', { name: 'Português (Brasil)' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByText('PT')).toHaveAttribute('aria-hidden', 'true');
  });
});
