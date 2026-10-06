import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { parseTheme, themeCookie } from '@/lib/theme';
import { ThemeToggle } from './theme-toggle';

function preferDark(dark: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({ matches: dark && query.includes('dark') })),
  );
}

describe('ThemeToggle', () => {
  afterEach(() => {
    delete document.documentElement.dataset.theme;
    document.cookie = 'pyxis_theme=; Max-Age=0; Path=/';
  });

  it('switches a chosen light theme to dark and remembers it in a cookie', async () => {
    render(<ThemeToggle initialTheme="light" />);

    await userEvent.click(screen.getByRole('button', { name: 'Switch to dark theme' }));

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(document.cookie).toContain('pyxis_theme=dark');
    expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument();
  });

  it('starts from the system preference when nothing was chosen', async () => {
    preferDark(true);
    render(<ThemeToggle />);

    await userEvent.click(screen.getByRole('button', { name: 'Switch theme' }));

    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('starts from a light system preference too', async () => {
    preferDark(false);
    render(<ThemeToggle />);

    await userEvent.click(screen.getByRole('button', { name: 'Switch theme' }));

    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('follows a theme set on the page when none was passed in', async () => {
    document.documentElement.dataset.theme = 'dark';
    render(<ThemeToggle />);

    await userEvent.click(screen.getByRole('button', { name: 'Switch theme' }));

    expect(document.documentElement.dataset.theme).toBe('light');
  });
});

describe('theme helpers', () => {
  it('accept only the two themes', () => {
    expect(parseTheme('dark')).toBe('dark');
    expect(parseTheme('sepia')).toBeUndefined();
    expect(parseTheme(undefined)).toBeUndefined();
  });

  it('write a year-long, site-wide cookie', () => {
    expect(themeCookie('light')).toBe('pyxis_theme=light; Path=/; Max-Age=31536000; SameSite=Lax');
  });
});
