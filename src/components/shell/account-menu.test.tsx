import { fireEvent, screen, within } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { english } from '@/test-utils/english';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import type { MonthUsage } from '@/lib/accounts-in-view';
import { AccountMenu } from './account-menu';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }),
}));

vi.mock('next/link', () => ({
  default: ({
    href,
    scroll,
    className,
    children,
  }: {
    readonly href: string;
    readonly scroll?: boolean;
    readonly className?: string;
    readonly children: ReactNode;
  }) => (
    <a href={href} className={className} data-scroll={String(scroll)}>
      {children}
    </a>
  ),
}));

const EMAIL = 'owner@example.com';
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
    expect(summary).toHaveTextContent('OAccount and preferencesowner@example.com');
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
    expect(screen.getByRole('link', { name: 'Account and billing' })).toHaveAttribute(
      'href',
      '/account',
    );
    expect(screen.queryByRole('link', { name: 'Help and support' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Sign out everywhere' })).not.toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Theme' }).closest('div.absolute')).toHaveClass(
      'bottom-full',
    );
    delete document.documentElement.dataset.theme;
  });

  it('lists billing, the themes on one row, the language behind one row, then signing out', () => {
    const { container } = renderMenu();

    const panel = container.querySelector('details > div');
    const billing = screen.getByRole('link', { name: 'Account and billing', hidden: true });
    const themes = screen.getByRole('group', { name: 'Theme', hidden: true });
    const language = screen.getByText('Language: English').closest('summary');
    const signOut = screen.getByRole('button', { name: 'Sign out', hidden: true });

    expect(panel?.firstElementChild).toBe(billing);
    expect(themes).toHaveClass('flex-row');
    expect(language?.parentElement).not.toHaveAttribute('open');
    expect(language?.parentElement).toContainElement(
      screen.getByRole('group', { name: 'Language', hidden: true }),
    );
    expect(panel?.lastElementChild).toContainElement(signOut);
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

const USAGE: MonthUsage = {
  events: 3_120,
  limit: 10_000,
  share: 0.312,
  pausedUntil: null,
  resetsOn: '2026-11-01T00:00:00.000Z',
};

function renderMenuWith(usage: MonthUsage) {
  return renderWithMessages(
    <AccountMenu
      email={EMAIL}
      theme="dark"
      i18n={english}
      chooseLocale={chooseNothing}
      usage={usage}
    />,
  );
}

function barOf(container: HTMLElement): HTMLElement | null {
  return container.querySelector('summary [style]');
}

describe("AccountMenu with the month's usage", () => {
  it('shows the share of the month under the e-mail, read as the whole sentence', () => {
    const { container } = renderMenuWith(USAGE);

    const summary = container.querySelector('summary');
    expect(summary).toHaveTextContent('31% of the month');
    expect(within(summary ?? container).getByText('3,120 of 10,000 events this month')).toHaveClass(
      'sr-only',
    );
    expect(within(summary ?? container).getByText('31% of the month')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(barOf(container)).toHaveStyle({ width: '31.2%' });
    expect(barOf(container)).toHaveClass('bg-accent');
  });

  it('opens on the events of the month and the day the count resets, linking to billing', () => {
    const { container } = renderMenuWith(USAGE);

    const panel = container.querySelector('details > div');
    const usage = panel?.firstElementChild;
    expect(usage).toHaveAttribute('href', '/account');
    expect(usage).toHaveTextContent('3,120 of 10,000 events this monthCount resets on Nov 1');
  });

  it('warns from 80% of the month, and never shows a share past the one the tone stands for', () => {
    const near = renderMenuWith({ ...USAGE, events: 8_000, share: 0.8 });
    expect(barOf(near.container)).toHaveClass('bg-nav-warn');
    near.unmount();

    const justBelow = renderMenuWith({ ...USAGE, events: 7_999, share: 0.7999 });
    expect(barOf(justBelow.container)).toHaveClass('bg-accent');
    expect(justBelow.container.querySelector('summary')).toHaveTextContent('79% of the month');
  });

  it('says in words, read and spoken, that the reception is paused and until when', () => {
    const { container } = renderMenuWith({
      ...USAGE,
      events: 15_000,
      share: 1.5,
      pausedUntil: '2026-11-01T00:00:00.000Z',
    });

    const summary = container.querySelector('summary');
    expect(barOf(container)).toHaveClass('bg-nav-bad');
    expect(barOf(container)).toHaveStyle({ width: '100%' });
    expect(summary).toHaveTextContent('150% of the month');
    expect(
      within(summary ?? container).getByText(
        'Measuring is paused until Nov 1: the account reached 15,000 events this month.',
      ),
    ).toHaveClass('sr-only');
    expect(container.querySelector('details > div')?.firstElementChild).toHaveTextContent(
      '15,000 of 10,000 events this monthMeasuring is paused until Nov 1: the account passed its monthly events.',
    );
  });

  it('opens Account and billing from both rows without scrolling the page under the window', () => {
    const { container } = renderMenuWith(USAGE);

    const panel = container.querySelector('details > div');
    const usage = panel?.firstElementChild;
    const billing = screen.getByRole('link', { name: 'Account and billing', hidden: true });
    expect(usage).not.toBe(billing);
    expect(usage).toHaveAttribute('href', '/account');
    expect(usage).toHaveAttribute('data-scroll', 'false');
    expect(billing).toHaveAttribute('href', '/account');
    expect(billing).toHaveAttribute('data-scroll', 'false');
  });

  it('shows no usage without it', () => {
    const { container } = renderMenu();

    expect(barOf(container)).toBeNull();
    expect(screen.queryByText(/events this month/)).not.toBeInTheDocument();
  });
});
