import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it } from 'vitest';
import { MessagesProvider } from '@/i18n/messages-provider';
import { CLIENT_NAMESPACES, pickNamespaces } from '@/i18n/messages';
import { en } from '@/i18n/messages/en';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { ThemeChoiceGroup, type ThemeChoiceProps } from './theme-choice';

const LABEL_ID = 'theme-label';

function Choices({
  initialTheme,
  label = 'Theme',
}: Partial<ThemeChoiceProps> & { label?: string }) {
  return (
    <>
      <span id={LABEL_ID}>{label}</span>
      <ThemeChoiceGroup initialTheme={initialTheme} labelledBy={LABEL_ID} />
    </>
  );
}

function themeCookie(): string | undefined {
  return document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('pyxis_theme='));
}

describe('ThemeChoiceGroup', () => {
  afterEach(() => {
    delete document.documentElement.dataset.theme;
    document.cookie = 'pyxis_theme=; Path=/; Max-Age=0';
  });

  it('follows the system until a theme is chosen', () => {
    renderWithMessages(<Choices />);

    const group = screen.getByRole('group', { name: 'Theme' });
    expect(group).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'System' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Light' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('is named by the label it is given and draws its choices as one segmented row', () => {
    renderWithMessages(<Choices />);

    const group = screen.getByRole('group', { name: 'Theme' });
    expect(group).toHaveAttribute('aria-labelledby', LABEL_ID);
    expect(group).toHaveClass('group/segmented', 'self-start');
    expect(screen.getByRole('button', { name: 'System' })).toHaveClass('min-h-11', 'lg:min-h-9');
  });

  it('applies a chosen theme to the page at once and remembers it for a year', async () => {
    renderWithMessages(<Choices />);

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
    renderWithMessages(<Choices initialTheme="light" />);
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
        <Choices initialTheme="dark" />
      </MessagesProvider>,
    );

    expect(html).toMatch(/aria-pressed="true"[^>]*>Dark</);
  });

  it('renders the system theme on the server when none was chosen', () => {
    const html = renderToString(
      <MessagesProvider locale="en" messages={pickNamespaces(en, CLIENT_NAMESPACES)}>
        <Choices />
      </MessagesProvider>,
    );

    expect(html).toMatch(/aria-pressed="true"[^>]*>System</);
  });

  it('speaks Portuguese', () => {
    renderWithMessages(<Choices label="Tema" />, 'pt-BR');

    expect(screen.getByRole('group', { name: 'Tema' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Do sistema' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
});
