import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { EngagementReport } from '@/domain/engagement';
import { english } from '@/test-utils/english';
import { EngagementPanels } from './engagement-panels';

const REPORT: EngagementReport = {
  visits: 40,
  singlePageVisits: 10,
  medianVisitSeconds: 95,
  visitLengths: [10, 30, 60, 180, 600, 1800, null].map((upToSeconds, index) => ({
    upToSeconds,
    visits: [10, 0, 5, 20, 3, 1, 1][index] ?? 0,
  })),
  entryPages: [
    { path: '/', visits: 30, singlePageVisits: 8 },
    { path: '/pricing', visits: 10, singlePageVisits: 2 },
  ],
  exitPages: [{ path: '/checkout/:id', visits: 12 }],
};

function renderPanels(report: EngagementReport = REPORT) {
  return render(<EngagementPanels report={report} periodLabel="last 30 days" i18n={english} />);
}

describe('EngagementPanels', () => {
  it('lists the entry pages with the visits that left after them, and the exit pages', () => {
    renderPanels();

    const entries = screen.getByRole('table', { name: 'Where visits start' });
    expect(
      within(entries)
        .getAllByRole('columnheader')
        .map((cell) => cell.textContent),
    ).toEqual(['Page', 'Visits', 'Left after it']);
    expect(within(entries).getByRole('rowheader', { name: '/' }).closest('tr')).toHaveTextContent(
      '/308',
    );
    const exits = screen.getByRole('table', { name: 'Where visits end' });
    expect(within(exits).getAllByRole('columnheader')).toHaveLength(2);
    expect(exits).toHaveTextContent('/checkout/:id12');
  });

  it('shows the median, the single-page share and every length bucket', () => {
    renderPanels();

    const length = screen.getByRole('region', { name: 'How long visits last' });
    expect(length).toHaveTextContent('Median visit1 min 35 s');
    expect(length).toHaveTextContent('Viewed one page25.0%');
    const table = within(length).getByRole('table', {
      name: 'Median visit 1 min 35 s; 25.0% of the visits viewed one page.',
    });
    expect(within(table).getAllByRole('row')).toHaveLength(8);
    expect(
      within(table).getByRole('rowheader', { name: '1 min to 3 min' }).closest('tr'),
    ).toHaveTextContent('2050.0%');
  });

  it('says there was no page view when no visit started', () => {
    renderPanels({ ...REPORT, visits: 0, medianVisitSeconds: null, entryPages: [], exitPages: [] });

    expect(screen.getAllByText('No page view in this period.')).toHaveLength(2);
    expect(screen.getByRole('region', { name: 'How long visits last' })).toHaveTextContent(
      'Median visitno visits',
    );
  });
});
