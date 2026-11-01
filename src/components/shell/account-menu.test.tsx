import { fireEvent, screen, within } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { english } from '@/test-utils/english';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import type { MonthUsage } from '@/lib/accounts-in-view';
import { AccountMenu } from './account-menu';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams('range=7d'),
  usePathname: () => '/p-1/overview',
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

function renderMenu() {
  return renderWithMessages(<AccountMenu email={EMAIL} projectId="p-1" i18n={english} />);
}

function panelOf(container: HTMLElement): HTMLElement | null {
  return container.querySelector('details > div');
}

describe('AccountMenu', () => {
  it('shows the account as an avatar with its initial, named for screen readers, closed', () => {
    const { container } = renderMenu();

    const summary = container.querySelector('summary');
    expect(summary).toHaveTextContent('OAccount and preferences');
    expect(summary).toHaveClass('size-11', 'lg:size-10', 'rounded-pill', 'group/avatar');
    expect(within(summary ?? container).getByText('O')).toHaveAttribute('aria-hidden', 'true');
    expect(within(summary ?? container).getByText('O')).toHaveClass(
      'group-active/avatar:bg-accent',
      'group-active/avatar:text-accent-ink',
    );
    expect(within(summary ?? container).getByText('Account and preferences')).toHaveClass(
      'sr-only',
    );
    expect(container.querySelector('details')).not.toHaveAttribute('open');
  });

  it('opens downward, at the right end of the bar, on the e-mail, the choices and signing out', () => {
    const { container } = renderMenu();

    const panel = panelOf(container);
    expect(panel).toHaveClass('absolute', 'top-full', 'right-0', 'bg-card');
    expect(panel?.firstElementChild).toHaveTextContent(EMAIL);
    expect(screen.getByRole('link', { name: 'Account and billing', hidden: true })).toHaveAttribute(
      'href',
      '/account',
    );
    expect(screen.getByRole('link', { name: 'Theme and language', hidden: true })).toHaveAttribute(
      'href',
      '/account/preferences',
    );
    expect(screen.getByRole('link', { name: 'Help and support', hidden: true })).toHaveAttribute(
      'href',
      '/p-1/help?range=7d',
    );
    expect(
      screen.getByRole('button', { name: 'Sign out', hidden: true }).querySelector('svg'),
    ).toBeNull();
  });

  it('lists the e-mail, billing, theme and language, help, signing out, then the privacy line', () => {
    const { container } = renderMenu();

    const rows = [...(panelOf(container)?.children ?? [])].map((row) => row.textContent);

    expect(rows).toEqual([
      EMAIL,
      'Account and billing',
      'Theme and language',
      'Help and support',
      'Sign out',
      'No cookies, no personal data',
    ]);
  });

  it('opens Account and billing, Theme and language and Help without scrolling the page', () => {
    renderMenu();

    for (const name of ['Account and billing', 'Theme and language', 'Help and support']) {
      expect(screen.getByRole('link', { name, hidden: true })).toHaveAttribute(
        'data-scroll',
        'false',
      );
    }
  });

  it('closes on Escape, with the focus back on the avatar', () => {
    const { container } = renderMenu();
    const details = container.querySelector('details');
    const summary = container.querySelector('summary');
    if (details !== null) {
      details.open = true;
    }

    fireEvent.keyDown(screen.getByRole('link', { name: 'Theme and language' }), {
      key: 'Escape',
    });

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
    <AccountMenu email={EMAIL} projectId="p-1" i18n={english} usage={usage} />,
  );
}

function ringOf(container: HTMLElement): SVGCircleElement | null {
  return container.querySelector('[data-usage-ring] circle[stroke-dasharray]');
}

describe("AccountMenu with the month's usage", () => {
  it('rings the avatar with the share of the month, read as the whole sentence', () => {
    const { container } = renderMenuWith(USAGE);

    const summary = container.querySelector('summary');
    expect(container.querySelector('[data-usage-ring]')).toHaveAttribute('aria-hidden', 'true');
    expect(ringOf(container)).toHaveAttribute('stroke-dasharray', '31.2 100');
    expect(ringOf(container)).toHaveClass('stroke-usage-ok');
    expect(within(summary ?? container).getByText('3,120 of 10,000 events this month')).toHaveClass(
      'sr-only',
    );
  });

  it('shows the events of the month and the day the count resets under Account and billing', () => {
    renderMenuWith(USAGE);

    const billing = screen.getByRole('link', { name: /^Account and billing/, hidden: true });
    expect(billing).toHaveAttribute('href', '/account');
    expect(billing).toHaveTextContent(
      'Account and billing3,120 of 10,000 events this monthCount resets on Nov 1',
    );
    expect(within(billing).getByText('Count resets on Nov 1')).toHaveClass(
      'text-muted',
      'group-hover/row:text-ink',
      'group-active/row:text-ink',
    );
  });

  it('warns from 80% of the month, and never draws more than the whole ring', () => {
    const near = renderMenuWith({ ...USAGE, events: 8_000, share: 0.8 });
    expect(ringOf(near.container)).toHaveClass('stroke-usage-warn');
    near.unmount();

    const justBelow = renderMenuWith({ ...USAGE, events: 7_999, share: 0.7999 });
    expect(ringOf(justBelow.container)).toHaveClass('stroke-usage-ok');
    justBelow.unmount();

    const over = renderMenuWith({ ...USAGE, events: 12_000, share: 1.2 });
    expect(ringOf(over.container)).toHaveAttribute('stroke-dasharray', '100 100');
    expect(ringOf(over.container)).toHaveAttribute('stroke-linecap', 'round');
  });

  it('draws only the empty track before the first event of the month', () => {
    const { container } = renderMenuWith({ ...USAGE, events: 0, share: 0 });

    expect(container.querySelectorAll('[data-usage-ring] circle')).toHaveLength(1);
    expect(ringOf(container)).toBeNull();
    expect(
      screen.getByText('0 of 10,000 events this month', { selector: 'summary span' }),
    ).toHaveClass('sr-only');
  });

  it('says in words, read and spoken, that the reception is paused, and breaks the ring', () => {
    const { container } = renderMenuWith({
      ...USAGE,
      events: 15_000,
      share: 1.5,
      pausedUntil: '2026-11-01T00:00:00.000Z',
    });

    const summary = container.querySelector('summary');
    expect(ringOf(container)).toHaveClass('stroke-usage-paused');
    expect(ringOf(container)).toHaveAttribute('stroke-dasharray', '7 3');
    expect(ringOf(container)).not.toHaveAttribute('stroke-linecap');
    expect(
      within(summary ?? container).getByText(
        'Measuring is paused until Nov 1: the account reached 15,000 events this month.',
      ),
    ).toHaveClass('sr-only');
    expect(
      screen.getByRole('link', { name: /^Account and billing/, hidden: true }),
    ).toHaveTextContent(
      'Account and billing15,000 of 10,000 events this monthMeasuring is paused until Nov 1: the account passed its monthly events.',
    );
  });

  it('shows no ring and no usage without it', () => {
    const { container } = renderMenu();

    expect(container.querySelector('[data-usage-ring]')).toBeNull();
    expect(screen.queryByText(/events this month/)).not.toBeInTheDocument();
  });
});
