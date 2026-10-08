import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { olderVisitsText, visitViews } from '@/domain/timeline';
import { DEMO_USER_ID, demoTimelineReport } from '@/services/timeline/demo-timeline';
import { OlderVisits, type OlderVisitsPage } from './older-visits';
import { english } from '@/test-utils/english';

const VISITS = visitViews(
  demoTimelineReport(
    'demo',
    { kind: 'user', id: DEMO_USER_ID },
    new Date('2026-10-06T02:30:00.000Z'),
  ).visits,
  'UTC',
  'all',
  english,
);
const [NEWEST, MIDDLE, OLDEST] = VISITS;

function page(visit: (typeof VISITS)[number] | undefined, nextBefore: string | null) {
  return { visits: visit === undefined ? [] : [visit], nextBefore } satisfies OlderVisitsPage;
}

describe('OlderVisits', () => {
  it('appends each older page, moves the focus to it, and says when every visit is shown', async () => {
    const loadOlder = vi
      .fn<(before: string) => Promise<OlderVisitsPage>>()
      .mockResolvedValueOnce(page(MIDDLE, '2026-10-03T12:12:04.000Z'))
      .mockResolvedValueOnce(page(OLDEST, null));
    render(
      <OlderVisits
        text={olderVisitsText(english)}
        initialBefore="2026-10-05T21:40:12.000Z"
        loadOlder={loadOlder}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Load older visits' }));

    expect(loadOlder).toHaveBeenLastCalledWith('2026-10-05T21:40:12.000Z');
    const middle = await screen.findByRole('heading', { name: MIDDLE?.heading });
    await waitFor(() => {
      expect(middle).toHaveFocus();
    });

    await userEvent.click(await screen.findByRole('button', { name: 'Load older visits' }));

    expect(loadOlder).toHaveBeenLastCalledWith('2026-10-03T12:12:04.000Z');
    expect(await screen.findByText('That is every visit.')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: OLDEST?.heading })).toHaveFocus();
    });
    expect(screen.queryByRole('heading', { name: NEWEST?.heading })).not.toBeInTheDocument();
  });

  it('keeps the button and says so when a page fails to load', async () => {
    const loadOlder = vi
      .fn<(before: string) => Promise<OlderVisitsPage>>()
      .mockRejectedValue(new Error('503'));
    render(
      <OlderVisits
        text={olderVisitsText(english)}
        initialBefore="2026-10-05T21:40:12.000Z"
        loadOlder={loadOlder}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Load older visits' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Could not load older visits.');
    expect(await screen.findByRole('button', { name: 'Load older visits' })).toBeEnabled();
  });

  it('shows the request is running, and drops it when the screen goes away', async () => {
    const loadOlder = vi
      .fn<(before: string) => Promise<OlderVisitsPage>>()
      .mockReturnValue(new Promise<OlderVisitsPage>(() => undefined));
    const { unmount } = render(
      <OlderVisits
        text={olderVisitsText(english)}
        initialBefore="2026-10-05T21:40:12.000Z"
        loadOlder={loadOlder}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Load older visits' }));

    expect(screen.getByRole('button', { name: 'Loading older visits…' })).toHaveAttribute(
      'aria-busy',
      'true',
    );
    unmount();
  });

  it('focuses nothing when an older page comes back empty', async () => {
    const loadOlder = vi
      .fn<(before: string) => Promise<OlderVisitsPage>>()
      .mockResolvedValue(page(undefined, null));
    render(
      <OlderVisits
        text={olderVisitsText(english)}
        initialBefore="2026-10-05T21:40:12.000Z"
        loadOlder={loadOlder}
      />,
    );
    const button = screen.getByRole('button', { name: 'Load older visits' });

    await userEvent.click(button);

    expect(await screen.findByText('That is every visit.')).toBeInTheDocument();
    expect(screen.queryAllByRole('heading')).toEqual([]);
  });
});
