import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { LanguageMenu } from './language-menu';

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

  it('styles the current language like the current item of the navigation in the sidebar', () => {
    render(<LanguageMenu locale="en" label="Language" choose={chooser()} surface="nav" />);

    expect(screen.getByRole('button', { name: 'English' })).toHaveClass('bg-nav-active');
    expect(screen.getByRole('button', { name: 'Português (Brasil)' })).not.toHaveClass(
      'bg-nav-active',
    );
  });
});
