import { fireEvent, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { english } from '@/test-utils/english';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { AccountMenu } from './account-menu';

const navigation = vi.hoisted(() => ({ pathname: '/p-1/overview', search: '' }));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }),
  usePathname: () => navigation.pathname,
  useSearchParams: () => new URLSearchParams(navigation.search),
}));

const EMAIL = 'owner@example.com';
const chooseNothing = () => Promise.resolve();

function renderMenu() {
  return renderWithMessages(
    <AccountMenu
      email={EMAIL}
      helpHref="/p-1/help"
      theme="dark"
      i18n={english}
      chooseLocale={chooseNothing}
    />,
  );
}

describe('AccountMenu', () => {
  it('shows the account by its initial and e-mail, named for screen readers, closed', () => {
    const { container } = renderMenu();

    const summary = container.querySelector('summary');
    expect(summary).toHaveTextContent('OAccount and preferencesowner@example.com');
    expect(summary).not.toHaveAttribute('data-current');
    expect(summary).toHaveClass('hover:bg-nav-hover');
    expect(container.querySelector('details')).not.toHaveAttribute('open');
  });

  it('marks the account as where you are on the help page, whose link it holds', () => {
    navigation.pathname = '/p-1/help';
    const { container } = renderMenu();
    navigation.pathname = '/p-1/overview';

    const summary = container.querySelector('summary');
    expect(summary).toHaveAttribute('data-current');
    expect(summary).toHaveClass('bg-nav-active');
    expect(summary).not.toHaveClass('hover:bg-nav-hover');
    expect(summary).not.toHaveAttribute('aria-current');
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
    expect(screen.getByRole('link', { name: 'Account and billing' })).toHaveAttribute(
      'href',
      '/account',
    );
    expect(screen.getByRole('link', { name: 'Help and support' })).toHaveAttribute(
      'href',
      '/p-1/help',
    );
    expect(screen.queryByRole('button', { name: 'Sign out everywhere' })).not.toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Theme' }).closest('div.absolute')).toHaveClass(
      'bottom-full',
    );
    delete document.documentElement.dataset.theme;
  });

  it('keeps the period and the filters of the screen on the way to Help', () => {
    navigation.search = 'range=7d&country=BR&metric=visitors';
    renderMenu();
    navigation.search = '';

    expect(screen.getByRole('link', { name: 'Help and support', hidden: true })).toHaveAttribute(
      'href',
      '/p-1/help?range=7d&country=BR',
    );
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
