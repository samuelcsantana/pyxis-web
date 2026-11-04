import { screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { MonthUsage } from '@/lib/accounts-in-view';
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { AccountPanelMenu } from './account-panel-menu';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }),
}));

vi.mock('@/components/settings-dialog/settings-content-cache', () => ({
  settingsContentOf: () => new Promise(() => undefined),
  forgetSettingsContent: () => undefined,
}));

const USAGE: MonthUsage = {
  events: 41_230,
  limit: 100_000,
  share: 0.4123,
  pausedUntil: null,
  resetsOn: '2026-12-01T00:00:00.000Z',
};

function chooseNothing(): Promise<void> {
  return Promise.resolve();
}

function renderMenu(usage: MonthUsage | null = USAGE, plan: 'pro' | 'free' | null = 'pro') {
  return renderWithMessages(
    <AccountPanelMenu
      projectId="p1"
      email="samuel@example.com"
      plan={plan}
      i18n={english}
      chooseLocale={chooseNothing}
      usage={usage}
    />,
  );
}

function bar(): HTMLElement {
  const fill = document.querySelector<HTMLElement>('span[aria-hidden="true"] > span');
  if (fill === null) {
    throw new Error('no usage bar');
  }
  return fill;
}

describe('AccountPanelMenu', () => {
  it('names the person by the start of the email, with the plan beside it', () => {
    renderMenu();
    const summary = screen.getByText('Account menu').closest('summary');
    if (summary === null) {
      throw new Error('no summary');
    }

    expect(within(summary).getByText('S')).toHaveAttribute('aria-hidden', 'true');
    expect(within(summary).getByText('samuel')).toBeInTheDocument();
    expect(within(summary).getByText('· Pro')).toHaveClass('text-nav-text');
    expect(summary).toHaveClass('min-h-11');
  });

  it('leaves the plan out when it is not known', () => {
    renderMenu(USAGE, null);

    expect(screen.queryByText(/^· /)).toBeNull();
  });

  it('opens the settings from a gear beside the account, as big as a finger', () => {
    renderMenu();

    const gears = screen.getAllByRole('link', { name: 'Settings', hidden: true });
    const gear = gears.find((link) => link.closest('details') === null);
    expect(gear).toHaveAttribute('href', '#settings/general');
    expect(gear).toHaveClass('size-11');
  });

  it('holds the email, the settings, the language, the help, the usage and the sign-out', () => {
    renderMenu();
    const menu = screen.getByText('samuel@example.com');
    const panel = menu.parentElement;
    if (panel === null) {
      throw new Error('no panel');
    }

    expect(menu).toHaveClass('wrap-anywhere');
    expect(within(panel).getByRole('link', { name: 'Settings', hidden: true })).toHaveAttribute(
      'href',
      '#settings/general',
    );
    expect(within(panel).getByRole('button', { name: 'Language', hidden: true })).toHaveAttribute(
      'aria-haspopup',
      'dialog',
    );
    expect(
      within(panel).getByRole('link', { name: 'Help and support', hidden: true }),
    ).toHaveAttribute('href', '#settings/help');
    expect(
      within(panel).getByRole('button', { name: 'Sign out', hidden: true }),
    ).toBeInTheDocument();
  });

  it('links the month’s usage to the plan and billing, saying where it leads', () => {
    renderMenu();

    const usage = screen.getByRole('link', { name: /^Plan and billing:/, hidden: true });
    expect(usage).toHaveAttribute('href', '#settings/billing');
    expect(usage).toHaveTextContent('41,230 of 100,000 events this month');
    expect(usage).toHaveTextContent('41%');
    expect(usage).toHaveTextContent('Count resets on Dec 1');
    expect(bar()).toHaveClass('bg-accent');
    expect(bar()).toHaveStyle({ width: '41.23%' });
  });

  it('warns near the limit and fills the bar no further than full', () => {
    renderMenu({ ...USAGE, events: 120_000, share: 1.2 });

    expect(bar()).toHaveClass('bg-nav-warn');
    expect(bar()).toHaveStyle({ width: '100%' });
  });

  it('says until when the counting is paused, in the colour of a problem', () => {
    renderMenu({ ...USAGE, pausedUntil: '2026-12-01T00:00:00.000Z' });

    const usage = screen.getByRole('link', { name: /^Plan and billing:/, hidden: true });
    expect(usage).toHaveTextContent(/paused until Dec 1/i);
    expect(bar()).toHaveClass('bg-nav-bad');
  });

  it('shows no usage when there is none to show', () => {
    renderMenu(null);

    expect(screen.queryByRole('link', { name: /^Plan and billing:/, hidden: true })).toBeNull();
  });

  it('speaks Portuguese', () => {
    renderWithMessages(
      <AccountPanelMenu
        projectId="p1"
        email="samuel@example.com"
        plan="free"
        i18n={portuguese}
        chooseLocale={chooseNothing}
        usage={null}
      />,
      'pt-BR',
    );

    expect(screen.getByText('Menu da conta')).toBeInTheDocument();
    expect(screen.getByText('· Hobby')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Idioma', hidden: true })).toBeInTheDocument();
  });
});
