import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it } from 'vitest';
import { MessagesProvider } from '@/i18n/messages-provider';
import { CLIENT_NAMESPACES, pickNamespaces } from '@/i18n/messages';
import { en } from '@/i18n/messages/en';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { ThemeTiles } from './theme-tiles';

function themeCookie(): string | undefined {
  return document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('pyxis_theme='));
}

describe('ThemeTiles', () => {
  afterEach(() => {
    delete document.documentElement.dataset.theme;
    document.cookie = 'pyxis_theme=; Path=/; Max-Age=0';
  });

  it('follows the system until a theme is chosen', () => {
    renderWithMessages(<ThemeTiles />);

    const group = screen.getByRole('group', { name: 'Theme' });
    expect(group).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'System' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Light' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('applies a chosen theme to the page at once and remembers it for a year', async () => {
    renderWithMessages(<ThemeTiles />);

    fireEvent.click(screen.getByRole('button', { name: 'Dark' }));

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(themeCookie()).toBe('pyxis_theme=dark');
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Dark' })).toHaveAttribute('aria-pressed', 'true');
    });
  });

  it('goes back to the system theme, forgetting the choice', async () => {
    document.documentElement.dataset.theme = 'light';
    document.cookie = 'pyxis_theme=light; Path=/';
    renderWithMessages(<ThemeTiles initialTheme="light" />);
    expect(screen.getByRole('button', { name: 'Light' })).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(screen.getByRole('button', { name: 'System' }));

    expect(document.documentElement.dataset.theme).toBeUndefined();
    expect(themeCookie()).toBeUndefined();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'System' })).toHaveAttribute(
        'aria-pressed',
        'true',
      );
    });
  });

  it('renders the theme it was given on the server', () => {
    const html = renderToString(
      <MessagesProvider locale="en" messages={pickNamespaces(en, CLIENT_NAMESPACES)}>
        <ThemeTiles initialTheme="dark" />
      </MessagesProvider>,
    );

    expect(html).toMatch(/aria-pressed="true"(?:(?!<button).)*>Dark</);
  });

  it('renders the system theme on the server when none was chosen', () => {
    const html = renderToString(
      <MessagesProvider locale="en" messages={pickNamespaces(en, CLIENT_NAMESPACES)}>
        <ThemeTiles />
      </MessagesProvider>,
    );

    expect(html).toMatch(/aria-pressed="true"(?:(?!<button).)*>System</);
  });

  it('shows each theme as a picture the screen reader skips, named by its label', () => {
    document.documentElement.dataset.theme = 'dark';
    const { container } = renderWithMessages(<ThemeTiles />);

    expect(container.querySelectorAll('svg[aria-hidden="true"]')).toHaveLength(3);
    expect(screen.getByRole('button', { name: 'Dark' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('speaks Portuguese', () => {
    renderWithMessages(<ThemeTiles />, 'pt-BR');

    expect(screen.getByRole('group', { name: 'Tema' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Do sistema' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
});
