import { fireEvent, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { failureDayRows } from '@/domain/request-days';
import { demoRequestsReport } from '@/services/requests/demo-requests';
import { FailureDaysChart } from './failure-days-chart';
import { english } from '@/test-utils/english';
import { renderWithMessages } from '@/test-utils/render-with-messages';

const NOW = new Date('2026-10-06T02:30:00.000Z');

const WEEK = { from: '2026-09-29', to: '2026-10-05' };
const DAYS = demoRequestsReport('demo', WEEK, null, NOW, null).days;
const QUIET = DAYS.map((day) => ({
  ...day,
  byStatusClass: { ...day.byStatusClass, clientError: 0, serverError: 0, noResponse: 0 },
}));

function renderChart(days = DAYS) {
  return renderWithMessages(
    <FailureDaysChart
      days={days}
      description="Every write that failed, by what went wrong, last 7 days"
      periodLabel="last 7 days"
      i18n={english}
    />,
  );
}

describe('FailureDaysChart', () => {
  it('stacks the failures of each day by what went wrong, with their totals', () => {
    renderChart();

    expect(screen.getByRole('heading', { name: 'Failures per day' })).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAccessibleName(/^Stacked bar chart of 7 days,/);
    expect(screen.getByText('Server errors (5xx)')).toBeInTheDocument();
    const rects = screen.getByRole('img').querySelectorAll('rect');
    expect(rects.length).toBeGreaterThan(0);
  });

  it('lists the kinds of the day under the pointer, and its total', () => {
    renderChart();
    const layer = screen.getByRole('img').querySelector<HTMLElement>('[data-layer="hover"]');
    if (layer === null) {
      throw new Error('The hover layer was not drawn');
    }
    vi.spyOn(layer, 'getBoundingClientRect').mockReturnValue({ left: 0, width: 700 } as DOMRect);

    fireEvent.pointerMove(layer, { clientX: 690 });

    const [last] = failureDayRows(DAYS).slice(-1);
    expect(layer).toHaveTextContent('Oct 5');
    expect(layer).toHaveTextContent(`Total${String(last?.total)}`);
  });

  it('switches to a table of every day whose total adds its kinds up', async () => {
    renderChart();

    await userEvent.click(screen.getByRole('button', { name: 'Table' }));

    const table = screen.getByRole('table', {
      name: 'Failures per day by what went wrong, last 7 days',
    });
    const [header, ...rows] = within(table).getAllByRole('row');
    expect(header).toHaveTextContent('DayClient errors (4xx)Server errors (5xx)No responseTotal');
    expect(rows).toHaveLength(7);
    for (const row of rows) {
      const cells = [...row.querySelectorAll('td')].map((cell) => Number(cell.textContent));
      expect(cells.at(-1)).toBe(cells.slice(0, -1).reduce((sum, value) => sum + value, 0));
    }
  });

  it('says so instead of drawing empty bars when nothing failed', () => {
    renderChart(QUIET);

    expect(screen.getByRole('region', { name: 'Failures per day' })).toHaveTextContent(
      'Nothing failed in this period.',
    );
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
