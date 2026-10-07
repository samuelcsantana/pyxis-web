import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { overviewKpis, overviewResponseSchema } from '@/domain/overview';
import { demoOverviewWire } from '@/services/overview/demo-overview';
import { DailyActivityChart } from './daily-activity-chart';
import { KpiGrid } from './kpi-grid';
import { TopEventsList } from './top-events-list';
import { TopPagesTable } from './top-pages-table';

const WEEK = { from: '2026-09-29', to: '2026-10-05' };
const REPORT = overviewResponseSchema.parse(
  demoOverviewWire('demo', WEEK, new Date('2026-10-06T02:30:00.000Z')),
);

function visitsHref(path: string): string {
  return `/p-store/visits?${new URLSearchParams({ range: '7d', path }).toString()}`;
}

function eventVisitsHref(event: string): string {
  return `/p-store/visits?${new URLSearchParams({ range: '7d', event }).toString()}`;
}

describe('KpiGrid', () => {
  it('shows each figure with its change, note and sparkline', () => {
    const { container } = render(<KpiGrid kpis={overviewKpis(REPORT, 7)} />);

    const visits = screen.getByRole('region', { name: 'Visits' });
    expect(visits).toHaveTextContent(`${kpi('visits').change} change`);
    expect(within(visits).getByText('vs. previous 7 days')).toBeInTheDocument();
    expect(screen.getAllByRole('region')).toHaveLength(4);
    expect(container.querySelectorAll('polyline')).toHaveLength(4);
    expect(container.querySelector('polyline')?.getAttribute('points')?.split(' ')).toHaveLength(7);
  });

  it('colors the change by whether it is good news', () => {
    render(
      <KpiGrid
        kpis={[
          { ...kpi('visits'), change: '+10%', tone: 'good' },
          { ...kpi('identified-users'), change: '−10%', tone: 'bad' },
          { ...kpi('write-errors'), change: '0 pt', tone: 'neutral' },
        ]}
      />,
    );

    expect(screen.getByText('+10%')).toHaveClass('text-ok');
    expect(screen.getByText('−10%')).toHaveClass('text-bad');
    expect(screen.getByText('0 pt')).toHaveClass('text-muted');
  });
});

function kpi(id: 'visits' | 'identified-users' | 'write-errors') {
  const found = overviewKpis(REPORT, 7).find((candidate) => candidate.id === id);
  if (found === undefined) {
    throw new Error(`No ${id} figure in the demo report`);
  }
  return found;
}

describe('DailyActivityChart', () => {
  it('draws the chart with a summary in words and the totals beside the legend', () => {
    render(<DailyActivityChart days={REPORT.days} periodLabel="last 7 days" />);

    expect(screen.getByRole('img')).toHaveAccessibleName(/^Area chart of 7 days\. Page views: /);
    expect(screen.getByText('Page views and named events, last 7 days')).toBeInTheDocument();
    const pageViews = REPORT.days.reduce((sum, day) => sum + day.pageViews, 0);
    expect(screen.getByText(new Intl.NumberFormat('en-US').format(pageViews))).toBeInTheDocument();
  });

  it('switches to a table of the same days and back', async () => {
    render(<DailyActivityChart days={REPORT.days} periodLabel="last 7 days" />);
    const toggle = screen.getByRole('button', { name: 'View as table' });

    await userEvent.click(toggle);

    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    const table = screen.getByRole('table', {
      name: 'Page views and named events per day, last 7 days',
    });
    const rows = within(table).getAllByRole('row');
    expect(rows).toHaveLength(8);
    const [first] = REPORT.days;
    expect(rows[1]).toHaveTextContent(`Sep 29${String(first?.pageViews)}${String(first?.events)}`);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();

    await userEvent.click(toggle);

    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
});

describe('TopPagesTable', () => {
  it('lists the pages with their views, visits and share of all views', () => {
    render(
      <TopPagesTable
        pages={[
          { path: '/', views: 300, visits: 200 },
          { path: '/pricing', views: 100, visits: 90 },
        ]}
        totalPageViews={1000}
        visitsHref={visitsHref}
      />,
    );

    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('/30020030%');
    expect(rows[2]).toHaveTextContent('/pricing1009010%');
  });

  it('links each page to the visits that opened it', () => {
    render(
      <TopPagesTable
        pages={[{ path: '/calculator-shipping', views: 300, visits: 200 }]}
        totalPageViews={1000}
        visitsHref={visitsHref}
      />,
    );

    expect(
      screen.getByRole('link', { name: 'See the visits that opened /calculator-shipping' }),
    ).toHaveAttribute('href', '/p-store/visits?range=7d&path=%2Fcalculator-shipping');
  });

  it('says so when no page was viewed', () => {
    render(<TopPagesTable pages={[]} totalPageViews={0} visitsHref={visitsHref} />);

    expect(screen.getByText('No page views in this period.')).toBeInTheDocument();
  });
});

describe('TopEventsList', () => {
  it('lists the events by label and name with their count', () => {
    render(
      <TopEventsList
        events={[{ name: 'cta_clicked', count: 1200, visits: 900 }]}
        visitsHref={eventVisitsHref}
      />,
    );

    const item = screen.getByRole('listitem');
    expect(item).toHaveTextContent('Cta clicked');
    expect(item).toHaveTextContent('cta_clicked');
    expect(item).toHaveTextContent('1,200');
    expect(
      screen.getByRole('link', { name: 'See the visits that had Cta clicked' }),
    ).toHaveAttribute('href', '/p-store/visits?range=7d&event=cta_clicked');
  });

  it('says so when no event was tracked', () => {
    render(<TopEventsList events={[]} visitsHref={eventVisitsHref} />);

    expect(screen.getByText(/No named events in this period/)).toBeInTheDocument();
  });
});
