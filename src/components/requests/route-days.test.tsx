import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { routeDaysText, routeDaysView } from '@/domain/route-days';
import { RouteDays } from './route-days';
import { english } from '@/test-utils/english';

const WRITES_TEXT = routeDaysText('writes', english);
const READS_TEXT = routeDaysText('reads', english);

const VIEW = routeDaysView(
  [
    { date: '2026-10-03', total: 0, failed: 0, medianDurationMs: null, p95DurationMs: null },
    { date: '2026-10-04', total: 40, failed: 2, medianDurationMs: 150, p95DurationMs: 390 },
    { date: '2026-10-05', total: 12, failed: 0, medianDurationMs: 140, p95DurationMs: 364 },
  ],
  'writes',
  english,
);

describe('RouteDays', () => {
  it('lists each day with calls under its heading and says how many quiet days it left out', () => {
    render(
      <RouteDays state={{ status: 'ready', view: VIEW }} text={WRITES_TEXT} onRetry={vi.fn()} />,
    );

    const table = screen.getByRole('table', { name: 'Day by day' });
    expect(
      within(table)
        .getAllByRole('columnheader')
        .map((cell) => cell.textContent),
    ).toEqual(['Day', 'Total', 'Failed', 'Median', 'p95']);
    expect(
      within(table)
        .getAllByRole('row')
        .slice(1)
        .map((row) => row.textContent),
    ).toEqual(['Oct 4402150 ms390 ms', 'Oct 5120140 ms364 ms']);
    expect(within(table).getByText('2')).toHaveClass('text-bad');
    expect(within(table).getByText('0')).toHaveClass('text-muted');
    expect(screen.getByText('1 day without a call is not listed.')).toBeInTheDocument();
  });

  it('counts the failed reads without a total column', () => {
    render(
      <RouteDays state={{ status: 'ready', view: VIEW }} text={READS_TEXT} onRetry={vi.fn()} />,
    );

    expect(screen.queryByRole('columnheader', { name: 'Total' })).not.toBeInTheDocument();
    expect(screen.getAllByRole('columnheader')).toHaveLength(4);
  });

  it('says when the route had no call and leaves the table out', () => {
    render(
      <RouteDays
        state={{ status: 'ready', view: { rows: [], note: null } }}
        text={WRITES_TEXT}
        onRetry={vi.fn()}
      />,
    );

    expect(screen.getByText('No calls to this route in this period.')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('announces the loading, and says when the API cannot tell the days', () => {
    const { rerender } = render(
      <RouteDays state={{ status: 'loading' }} text={WRITES_TEXT} onRetry={vi.fn()} />,
    );
    expect(screen.getByRole('status')).toHaveTextContent('Loading the days of this route…');

    rerender(<RouteDays state={{ status: 'unavailable' }} text={WRITES_TEXT} onRetry={vi.fn()} />);
    expect(screen.getByText('Day-by-day figures need a newer Pyxis API.')).toBeInTheDocument();
  });

  it('alerts a failure and tries again on request', async () => {
    const onRetry = vi.fn();
    render(<RouteDays state={{ status: 'error' }} text={WRITES_TEXT} onRetry={onRetry} />);

    expect(screen.getByRole('alert')).toHaveTextContent('Could not load the days of this route.');
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });
});
