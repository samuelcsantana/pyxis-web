import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { overviewKpis } from '@/domain/overview';
import { overviewResponseSchema } from '@/domain/overview.schema';
import { demoOverviewWire } from '@/services/overview/demo-overview';
import { DailyActivityChart } from './daily-activity-chart';
import { DayActivityFigures } from './day-activity-figures';
import { KpiGrid } from './kpi-grid';
import { TopEventsList } from './top-events-list';
import { TopPagesTable } from './top-pages-table';

const WEEK = { from: '2026-09-29', to: '2026-10-05' };
const AFTER_THE_WEEK = new Date('2026-10-06T15:00:00.000Z');
const LAST_WEEK = { days: 7, endsToday: false };
const REPORT = overviewResponseSchema.parse(demoOverviewWire('demo', WEEK, AFTER_THE_WEEK));

function visitsHref(path: string): string {
  return `/p-store/visits?${new URLSearchParams({ range: '7d', path }).toString()}`;
}

function eventVisitsHref(event: string): string {
  return `/p-store/visits?${new URLSearchParams({ range: '7d', event }).toString()}`;
}

describe('KpiGrid', () => {
  it('shows each figure with its change, what it compares with, its note and sparkline', () => {
    const { container } = render(<KpiGrid kpis={overviewKpis(REPORT, LAST_WEEK)} />);

    const visits = screen.getByRole('region', { name: 'Visits' });
    expect(visits).toHaveTextContent(`${kpi('visits').change} change vs. previous 7 days`);
    for (const region of screen.getAllByRole('region')) {
      expect(within(region).getByText('vs. previous 7 days')).toBeInTheDocument();
    }
    expect(
      within(screen.getByRole('region', { name: 'Identified users' })).getByText(
        'signed in at least once',
      ),
    ).toBeInTheDocument();
    expect(visits.querySelectorAll('p')).toHaveLength(2);
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

  it('leaves a gap in the error rate line on a day without writes', () => {
    render(<KpiGrid kpis={[{ ...kpi('write-errors'), series: [0.02, null, 0.04, 0.01] }]} />);

    const lines = screen
      .getByRole('region', { name: 'Write error rate' })
      .querySelectorAll('polyline');
    expect(lines).toHaveLength(2);
  });

  it('draws no sparkline for a single day', () => {
    const { container } = render(<KpiGrid kpis={[{ ...kpi('visits'), series: [12] }]} />);

    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });

  it('says in words, not only in colour, whether a change is good news', () => {
    render(
      <KpiGrid
        kpis={[
          { ...kpi('visits'), change: '+10% (+40)', tone: 'good' },
          { ...kpi('write-errors'), change: '+2 pt', tone: 'bad' },
          { ...kpi('identified-users'), change: 'no change', tone: 'neutral' },
        ]}
      />,
    );

    expect(screen.getByRole('region', { name: 'Visits' })).toHaveTextContent(
      '+10% (+40) change vs. previous 7 days, better',
    );
    expect(screen.getByRole('region', { name: 'Write error rate' })).toHaveTextContent(
      '+2 pt change vs. previous 7 days, worse',
    );
    const users = screen.getByRole('region', { name: 'Identified users' });
    expect(users).toHaveTextContent('no change vs. previous 7 days');
    expect(users).not.toHaveTextContent('no change change');
  });
});

function kpi(id: 'visits' | 'identified-users' | 'write-errors') {
  const found = overviewKpis(REPORT, LAST_WEEK).find((candidate) => candidate.id === id);
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
    const views = within(screen.getByRole('group', { name: 'Show as' }));
    const chartOption = views.getByRole('button', { name: 'Chart' });
    const tableOption = views.getByRole('button', { name: 'Table' });
    expect(chartOption).toHaveAttribute('aria-pressed', 'true');
    expect(tableOption).toHaveAttribute('aria-pressed', 'false');

    await userEvent.click(tableOption);

    expect(tableOption).toHaveAttribute('aria-pressed', 'true');
    expect(chartOption).toHaveAttribute('aria-pressed', 'false');
    const table = screen.getByRole('table', {
      name: 'Page views and named events per day, last 7 days',
    });
    const rows = within(table).getAllByRole('row');
    expect(rows).toHaveLength(8);
    const [first] = REPORT.days;
    expect(rows[1]).toHaveTextContent(`Sep 29${String(first?.pageViews)}${String(first?.events)}`);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();

    await userEvent.click(chartOption);

    expect(chartOption).toHaveAttribute('aria-pressed', 'true');
    expect(tableOption).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('switches with the keyboard too', async () => {
    render(<DailyActivityChart days={REPORT.days} periodLabel="last 7 days" />);
    screen.getByRole('button', { name: 'Table' }).focus();

    await userEvent.keyboard('{Enter}');

    expect(screen.getByRole('table')).toBeInTheDocument();

    await userEvent.tab({ shift: true });
    await userEvent.keyboard(' ');

    expect(screen.getByRole('button', { name: 'Chart' })).toHaveFocus();
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

    const rows = within(screen.getByRole('table', { name: 'Top pages' })).getAllByRole('row');
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

describe('DayActivityFigures', () => {
  it('shows the totals of a single day as figures instead of a chart', () => {
    render(
      <DayActivityFigures
        days={[{ date: '2026-10-05', pageViews: 1234, events: 56 }]}
        periodLabel="today"
      />,
    );

    const panel = screen.getByRole('region', { name: 'Activity of the day' });
    expect(panel).toHaveTextContent('Page views and named events, today');
    expect(within(panel).getByText('1,234')).toBeInTheDocument();
    expect(within(panel).getByText('56')).toBeInTheDocument();
    expect(within(panel).queryByRole('img')).not.toBeInTheDocument();
  });
});
