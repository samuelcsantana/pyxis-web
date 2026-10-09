import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CLIENT_NAMESPACES, pickNamespaces } from '@/i18n/messages';
import { en } from '@/i18n/messages/en';
import { MessagesProvider } from '@/i18n/messages-provider';
import { parseTheme, themeCookie } from '@/lib/theme';
import { renderWithMessages } from '@/test-utils/render-with-messages';
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
    document.documentElement.dataset.theme = 'light';
    renderWithMessages(<ThemeToggle initialTheme="light" />);

    await userEvent.click(screen.getByRole('button', { name: 'Switch to dark theme' }));

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(document.cookie).toContain('pyxis_theme=dark');
    expect(
      await screen.findByRole('button', { name: 'Switch to light theme' }),
    ).toBeInTheDocument();
  });

  it('starts from the system preference when nothing was chosen', async () => {
    preferDark(true);
    renderWithMessages(<ThemeToggle />);

    await userEvent.click(screen.getByRole('button', { name: 'Switch theme' }));

    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('starts from a light system preference too', async () => {
    preferDark(false);
    renderWithMessages(<ThemeToggle />);

    await userEvent.click(screen.getByRole('button', { name: 'Switch theme' }));

    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('follows a theme set on the page', async () => {
    document.documentElement.dataset.theme = 'dark';
    renderWithMessages(<ThemeToggle />);

    await userEvent.click(screen.getByRole('button', { name: 'Switch to light theme' }));

    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('keeps every toggle on the page in step, whichever one was pressed', async () => {
    document.documentElement.dataset.theme = 'light';
    renderWithMessages(
      <>
        <ThemeToggle initialTheme="light" />
        <ThemeToggle initialTheme="light" />
      </>,
    );
    const [first, second] = screen.getAllByRole('button', {
      name: 'Switch to dark theme',
    });

    await userEvent.click(first ?? document.body);

    await waitFor(() => {
      expect(second).toHaveAccessibleName('Switch to light theme');
    });
    expect(first).toHaveAccessibleName('Switch to light theme');
  });

  it('renders the theme it was given on the server, before the page can be read', () => {
    const html = renderToString(
      <MessagesProvider locale="en" messages={pickNamespaces(en, CLIENT_NAMESPACES)}>
        <ThemeToggle initialTheme="dark" />
      </MessagesProvider>,
    );

    expect(html).toContain('aria-label="Switch to light theme"');
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
