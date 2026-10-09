import { fireEvent, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { english } from '@/test-utils/english';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { AccountMenu } from './account-menu';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }),
}));

const EMAIL = 'owner@demo-store.example';
const chooseNothing = () => Promise.resolve();

function renderMenu() {
  return renderWithMessages(
    <AccountMenu email={EMAIL} theme="dark" i18n={english} chooseLocale={chooseNothing} />,
  );
}

describe('AccountMenu', () => {
  it('shows the account by its initial and e-mail, named for screen readers, closed', () => {
    const { container } = renderMenu();

    const summary = container.querySelector('summary');
    expect(summary).toHaveTextContent('OAccount and preferencesowner@demo-store.example');
    expect(container.querySelector('details')).not.toHaveAttribute('open');
  });

  it('opens upwards on the languages, the themes and signing out', () => {
    document.documentElement.dataset.theme = 'dark';
    const { container } = renderMenu();
    const details = container.querySelector('details');
    if (details !== null) {
      details.open = true;
    }

    const languages = screen.getByRole('group', { name: 'Language' });
    expect(within(languages).getByRole('button', { name: 'English' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Dark' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Sign out' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Theme' }).closest('div.absolute')).toHaveClass(
      'bottom-full',
    );
    delete document.documentElement.dataset.theme;
  });

  it('closes on Escape, with the focus back on the account', () => {
    const { container } = renderMenu();
    const details = container.querySelector('details');
    const summary = container.querySelector('summary');
    if (details !== null) {
      details.open = true;
    }

    fireEvent.keyDown(screen.getByRole('button', { name: 'Light' }), { key: 'Escape' });

    expect(details).not.toHaveAttribute('open');
    expect(summary).toHaveFocus();
  });
});
