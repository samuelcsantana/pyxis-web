import { act, cleanup, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { english } from '@/test-utils/english';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { publishActiveVisits } from './arrival-news';
import { ScreenTopbar } from './screen-topbar';
import { screenTopbarTexts } from './screen-topbar-texts';

const navigation = vi.hoisted<{ pathname: string; search: string; segment: string | null }>(() => ({
  pathname: '/p1/overview',
  search: '',
  segment: 'overview',
}));

vi.mock('next/navigation', () => ({
  usePathname: () => navigation.pathname,
  useSelectedLayoutSegments: () => (navigation.segment === null ? [] : [navigation.segment]),
  useSearchParams: () => new URLSearchParams(navigation.search),
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }),
}));

const MIDDAY_OF_OCTOBER_5_IN_SAO_PAULO = Date.parse('2026-10-05T15:00:00.000Z');
const TEXTS = screenTopbarTexts('Demo Store', english);

function segmentOf(pathname: string): string | null {
  return pathname.split('/')[2] ?? null;
}

function at(pathname: string, search = '', segment = segmentOf(pathname)) {
  navigation.pathname = pathname;
  navigation.search = search;
  navigation.segment = segment;
}

function topbar() {
  return (
    <ScreenTopbar
      projectId="p1"
      timeZone="America/Sao_Paulo"
      serverNow={MIDDAY_OF_OCTOBER_5_IN_SAO_PAULO}
      texts={TEXTS}
    />
  );
}

function periods() {
  return within(screen.getByRole('navigation', { name: 'Period' }));
}

beforeEach(() => {
  at('/p1/overview');
});

describe('ScreenTopbar visits on the site now', () => {
  afterEach(() => {
    cleanup();
    publishActiveVisits(undefined);
  });

  it('sits beside the Overview title while the period includes today', () => {
    renderWithMessages(topbar());

    act(() => {
      publishActiveVisits(4);
    });

    const heading = screen.getByRole('heading', { level: 1, name: 'Overview' });
    expect(heading.parentElement).toContainElement(screen.getByText('4 on the site now'));
  });

  it('is left out of the other screens and of a period that ends before today', () => {
    act(() => {
      publishActiveVisits(4);
    });
    at('/p1/funnel');
    renderWithMessages(topbar());
    expect(screen.queryByText('4 on the site now')).not.toBeInTheDocument();
    cleanup();

    at('/p1/overview', 'from=2026-09-01&to=2026-09-30');
    renderWithMessages(topbar());

    expect(screen.queryByText('4 on the site now')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Overview' }).parentElement).toBe(
      screen.getByRole('banner').firstElementChild,
    );
  });
});

describe('ScreenTopbar', () => {
  it('shows the title, the subtitle and the period of the screen in words', () => {
    at('/p1/overview', 'range=30d');
    renderWithMessages(topbar());

    expect(screen.getByRole('heading', { level: 1, name: 'Overview' })).toBeInTheDocument();
    const subtitle = screen.getByText('How Demo Store was used in the period');
    expect(subtitle).toHaveClass('hidden', 'sm:inline', 'truncate');
    const range = screen.getByText('Sep 6 – Oct 5, 2026');
    expect(range.closest('p')).toContainElement(subtitle);
    expect(range.parentElement).toHaveClass('shrink-0');
    expect(periods().getByRole('link', { name: '30 days' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('navigation', { name: 'Period' })).not.toContainElement(range);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('says which custom range it did not use, and what it shows instead', async () => {
    at('/p1/overview', 'from=2025-01-01&to=2026-10-01');
    renderWithMessages(topbar());

    expect(await screen.findByRole('grid', { name: 'October 2026' })).toBeInTheDocument();
    const notice = screen.getByRole('status');
    expect(notice).toHaveTextContent(
      'That range was not used: it is longer than 400 days. Showing the last 30 days instead.',
    );
    expect(notice).toHaveAttribute('id', 'period-range-notice');
    expect(screen.getByText('Sep 6 – Oct 5, 2026')).toBeInTheDocument();
  });

  it('shows a custom period from the address', () => {
    at('/p1/devices', 'from=2026-08-01&to=2026-08-31');
    renderWithMessages(topbar());

    expect(screen.getByRole('heading', { level: 1, name: 'Devices' })).toBeInTheDocument();
    expect(screen.getByText('Aug 1 – Aug 31, 2026')).toBeInTheDocument();
    expect(screen.getByText('What people use to reach Demo Store')).toBeInTheDocument();
  });

  it('carries the filters of the screen into every preset and into the custom form', () => {
    at('/p1/visits', 'range=7d&channel=paid&path=%2Fa&cursor=c1');
    const { container } = renderWithMessages(topbar());

    expect(periods().getByRole('link', { name: 'Today' })).toHaveAttribute(
      'href',
      '/p1/visits?range=today&path=%2Fa&channel=paid',
    );
    expect(container.querySelector('input[type="hidden"][name="channel"]')).toHaveValue('paid');
    expect(container.querySelector('input[type="hidden"][name="cursor"]')).toBeNull();
  });

  it('reads a repeated period parameter as no period, as the page does', () => {
    at('/p1/features', 'range=7d&range=today');
    renderWithMessages(topbar());

    expect(periods().getByRole('link', { name: '30 days' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('names the kind of request in the subtitle of Requests', () => {
    at('/p1/requests', 'kind=reads');
    const { unmount } = renderWithMessages(topbar());

    expect(screen.getByText('The reads Demo Store made that failed')).toBeInTheDocument();
    unmount();

    at('/p1/requests');
    renderWithMessages(topbar());

    expect(screen.getByText('Every write Demo Store made, and how it ended')).toBeInTheDocument();
  });

  it('shows the timeline with no period', () => {
    at('/p1/timeline');
    renderWithMessages(topbar());

    expect(screen.getByRole('heading', { level: 1, name: 'Timeline' })).toBeInTheDocument();
    expect(
      screen.getByText('Everything one person or one visit did in Demo Store, in order'),
    ).toBeInTheDocument();
    expect(screen.queryByRole('navigation', { name: 'Period' })).not.toBeInTheDocument();
  });

  it.each(['/p1/settings', '/p1/install', '/p1'])(
    'draws nothing at %s, which keeps its own header or none',
    (pathname) => {
      at(pathname);
      const { container } = renderWithMessages(topbar());

      expect(container).toBeEmptyDOMElement();
    },
  );

  it('keeps the screen under the settings window, whose address is the settings', () => {
    at('/p1/settings', 'range=30d', 'overview');
    renderWithMessages(topbar());

    expect(screen.getByRole('heading', { level: 1, name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByText('Sep 6 – Oct 5, 2026')).toBeInTheDocument();
    expect(periods().getByRole('link', { name: 'Today' })).toHaveAttribute(
      'href',
      '/p1/overview?range=today',
    );
  });

  it('closes the custom form when the screen changes', async () => {
    at('/p1/overview', 'from=2026-08-01&to=2026-08-31');
    const { container, rerender } = renderWithMessages(topbar());
    const details = container.querySelector('details');
    if (details === null) {
      throw new Error('The period selector has no custom form.');
    }
    details.open = true;
    expect(await screen.findByRole('grid', { name: 'August 2026' })).toBeInTheDocument();

    at('/p1/funnel', 'from=2026-08-01&to=2026-08-31');
    rerender(topbar());

    expect(screen.getByRole('heading', { level: 1, name: 'Funnel' })).toBeInTheDocument();
    expect(container.querySelector('details')).not.toHaveAttribute('open');
  });
});
