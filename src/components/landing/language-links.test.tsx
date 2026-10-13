import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DEFAULT_LANDING_PAGE, landingPageOfLocale } from '@/lib/landing-pages';
import { LanguageLinks } from './language-links';

describe('LanguageLinks', () => {
  it('links to each language at its own address, in its own language', () => {
    render(<LanguageLinks current={DEFAULT_LANDING_PAGE} label="Language" />);

    const nav = screen.getByRole('navigation', { name: 'Language' });
    const english = within(nav).getByRole('link', { name: 'English' });
    const portuguese = within(nav).getByRole('link', { name: 'Português (Brasil)' });
    expect(english).toHaveAttribute('href', '/');
    expect(english).toHaveAttribute('hreflang', 'en');
    expect(portuguese).toHaveAttribute('href', '/pt-br');
    expect(portuguese).toHaveAttribute('lang', 'pt-BR');
  });

  it('marks the language of the page as the current one', () => {
    render(<LanguageLinks current={landingPageOfLocale('pt-BR')} label="Idioma" />);

    expect(screen.getByRole('link', { current: 'page' })).toHaveAccessibleName(
      'Português (Brasil)',
    );
    expect(screen.getByRole('link', { name: 'English' })).not.toHaveAttribute('aria-current');
  });

  it('draws the dark pill only under the current language, named for the page transition', () => {
    render(<LanguageLinks current={landingPageOfLocale('pt-BR')} label="Idioma" />);

    const thumbs = screen.getAllByTestId('language-thumb');
    expect(thumbs).toHaveLength(1);
    expect(thumbs[0]).toHaveClass('landing-language-thumb', 'bg-ink');
    expect(screen.getByRole('link', { current: 'page' })).toContainElement(thumbs[0] ?? null);
  });

  it('shows a two-letter code on phones, hidden from screen readers', () => {
    render(<LanguageLinks current={DEFAULT_LANDING_PAGE} label="Language" />);

    const codes = screen.getAllByText(/^(EN|PT)$/);
    expect(codes.map((code) => code.textContent)).toEqual(['EN', 'PT']);
    expect(codes.every((code) => code.getAttribute('aria-hidden') === 'true')).toBe(true);
  });
});
