import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { FunnelSegmentsReport } from '@/domain/funnel-segments';
import { english } from '@/test-utils/english';
import { FunnelSegmentsPanel, type FunnelSegmentsPanelProps } from './funnel-segments-panel';

const BY_CHANNEL: FunnelSegmentsReport = {
  by: 'channel',
  segments: [
    { segment: 'paid', steps: [40, 10] },
    { segment: 'unknown', steps: [5, 0] },
  ],
};

function renderPanel(props: Partial<FunnelSegmentsPanelProps> = {}) {
  return render(
    <FunnelSegmentsPanel
      by="channel"
      report={BY_CHANNEL}
      stepCount={2}
      periodLabel="last 30 days"
      hrefOf={(by) => `/p/funnel?by=${by}`}
      i18n={english}
      {...props}
    />,
  );
}

describe('FunnelSegmentsPanel', () => {
  it('splits the funnel per segment with each step and the overall conversion', () => {
    renderPanel();

    expect(screen.getByRole('heading', { name: 'The funnel by channel' })).toBeInTheDocument();
    const table = screen.getByRole('table', { name: 'The funnel by channel' });
    expect(
      within(table)
        .getAllByRole('columnheader')
        .map((cell) => cell.textContent),
    ).toEqual(['Segment', 'Step 1', 'Step 2', 'Overall']);
    expect(within(table).getByRole('rowheader', { name: 'Paid' }).closest('tr')).toHaveTextContent(
      'Paid401025.0%',
    );
    expect(within(table).getByRole('rowheader', { name: 'Unknown' })).toBeInTheDocument();
  });

  it('switches between device and channel through links, the current one marked', () => {
    renderPanel();

    const tabs = screen.getByRole('navigation', { name: 'Split the funnel' });
    expect(within(tabs).getByRole('link', { name: 'By device' })).toHaveAttribute(
      'href',
      '/p/funnel?by=device',
    );
    expect(within(tabs).getByRole('link', { name: 'By channel' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('says nobody reached the first step, and why per person there is no split', () => {
    const { unmount } = renderPanel({ report: { by: 'device', segments: [] }, by: 'device' });

    expect(screen.getByText('No visit reached the first step in this period.')).toBeVisible();
    unmount();

    renderPanel({ report: null, by: 'device' });

    expect(screen.getByText(/Per person, a device or a channel is not defined/)).toBeVisible();
    expect(screen.queryByRole('table')).toBeNull();
  });
});
