import type { ReactNode } from 'react';
import { act, cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { type OpenScreenNews, publishOpenScreenNews } from './arrival-news';
import { CONTENT_ID } from './content-id';
import { NavigationPendingProvider, NavigationRegion } from './navigation-pending';
import { NewsBar } from './news-bar';

const navigation = vi.hoisted<{
  pathname: string;
  segmentUnderWindow: string | undefined;
  router: { refresh: Mock<() => void> };
}>(() => ({
  pathname: '/p-store/overview',
  segmentUnderWindow: undefined,
  router: { refresh: vi.fn() },
}));

vi.mock('next/navigation', () => ({
  usePathname: () => navigation.pathname,
  useSelectedLayoutSegments: () => [
    navigation.segmentUnderWindow ?? navigation.pathname.split('/')[2] ?? '',
  ],
  useRouter: () => navigation.router,
}));

const THREE_VISITS: OpenScreenNews = { screen: 'overview', shown: '3', label: '3 new visits' };
const OFFER = /^3 new visits\s*,\s*Refresh$/;

function publish(news: OpenScreenNews | undefined) {
  act(() => {
    publishOpenScreenNews(news);
  });
}

function showBar(after?: ReactNode) {
  return renderWithMessages(
    <NavigationPendingProvider>
      <NavigationRegion className="flex">
        <NewsBar />
        {after}
      </NavigationRegion>
    </NavigationPendingProvider>,
  );
}

describe('NewsBar', () => {
  beforeEach(() => {
    navigation.pathname = '/p-store/overview';
    navigation.segmentUnderWindow = undefined;
    navigation.router.refresh.mockClear();
  });

  afterEach(() => {
    cleanup();
    publishOpenScreenNews(undefined);
  });

  it('offers to refresh the screen being shown with what arrived for it', () => {
    showBar();
    expect(screen.queryByRole('button')).toBeNull();

    publish(THREE_VISITS);

    expect(screen.getByRole('button', { name: OFFER })).not.toHaveAttribute('aria-busy');
  });

  it('draws nothing for news counted while another screen was shown', () => {
    navigation.pathname = '/p-store/funnel';
    showBar();

    publish(THREE_VISITS);

    expect(screen.queryByRole('button')).toBeNull();
  });

  it('keeps offering the news of the screen under the settings window, whose address is the settings', () => {
    navigation.pathname = '/p-store/settings';
    navigation.segmentUnderWindow = 'overview';
    showBar();

    publish(THREE_VISITS);

    expect(screen.getByRole('button', { name: OFFER })).toBeInTheDocument();
  });

  it('draws nothing on a page of its own that is not a screen', () => {
    navigation.pathname = '/p-store/settings';
    showBar();

    publish(THREE_VISITS);

    expect(screen.queryByRole('button')).toBeNull();
  });

  it('refreshes the screen once, and says so until the news changes', async () => {
    const user = userEvent.setup();
    showBar();
    publish(THREE_VISITS);

    await user.click(screen.getByRole('button', { name: OFFER }));
    await user.click(screen.getByRole('button', { name: 'Refreshing…' }));

    expect(navigation.router.refresh).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Refreshing…' })).toHaveAttribute(
      'aria-busy',
      'true',
    );
    expect(document.querySelector('[data-navigating]')).not.toBeNull();

    publish({ ...THREE_VISITS, shown: '1', label: '1 new visit' });

    expect(screen.getByRole('button', { name: /^1 new visit\s*,\s*Refresh$/ })).toBeInTheDocument();
    expect(document.querySelector('[data-navigating]')).toBeNull();
  });

  it('hands the focus to the content when it goes away while focused', async () => {
    const user = userEvent.setup();
    showBar(<main id={CONTENT_ID} tabIndex={-1} />);
    publish(THREE_VISITS);
    await user.click(screen.getByRole('button', { name: OFFER }));

    publish(undefined);

    expect(screen.queryByRole('button')).toBeNull();
    expect(document.activeElement).toBe(screen.getByRole('main'));
  });

  it('leaves the focus where it is when it goes away without it', () => {
    showBar(
      <>
        <button type="button">Elsewhere</button>
        <main id={CONTENT_ID} tabIndex={-1} />
      </>,
    );
    publish(THREE_VISITS);
    const elsewhere = screen.getByRole('button', { name: 'Elsewhere' });
    elsewhere.focus();

    publish(undefined);

    expect(document.activeElement).toBe(elsewhere);
  });

  it('lets the focus go when there is no content to hand it to', async () => {
    const user = userEvent.setup();
    showBar();
    publish(THREE_VISITS);
    await user.click(screen.getByRole('button', { name: OFFER }));

    publish(undefined);

    expect(document.activeElement).toBe(document.body);
  });

  it('draws nothing on the server', () => {
    publishOpenScreenNews(THREE_VISITS);

    expect(renderToString(<NewsBar />)).toBe('');
  });
});
