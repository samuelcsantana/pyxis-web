import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { linePath } from '@/domain/line-chart';
import { valueAxis } from '@/domain/chart-scale';
import { type KpiDrillDown, overviewKpis } from '@/domain/overview';
import {
  ACTIVITY,
  chartDays,
  chartRows,
  chartValues,
  overviewChart,
} from '@/domain/overview-chart';
import { overviewResponseSchema } from '@/domain/overview.schema';
import { demoOverviewWire } from '@/services/overview/demo-overview';
import { DayActivityFigures } from './day-activity-figures';
import { KpiGrid } from './kpi-grid';
import { MetricSelection } from './metric-selection';
import { OverviewChartPanel } from './overview-chart-panel';
import { TopEventsList } from './top-events-list';
import { TopPagesTable } from './top-pages-table';
import { english } from '@/test-utils/english';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn() }),
  usePathname: () => '/p-store/overview',
  useSearchParams: () => new URLSearchParams('range=7d'),
}));

const WEEK = { from: '2026-09-29', to: '2026-10-05' };
const AFTER_THE_WEEK = new Date('2026-10-06T15:00:00.000Z');
const LAST_WEEK = { days: 7, endsToday: false };
const REPORT = overviewResponseSchema.parse(demoOverviewWire('demo', WEEK, AFTER_THE_WEEK));

function visitsHref(path: string): string {
  return `/p-store/visits?${new URLSearchParams({ range: '7d', path }).toString()}`;
}

function drillDownHref({ screen, filter }: KpiDrillDown): string {
  return `/p-store/${screen}?${new URLSearchParams({ range: '7d', ...filter }).toString()}`;
}

function eventVisitsHref(event: string): string {
  return `/p-store/visits?${new URLSearchParams({ range: '7d', event }).toString()}`;
}

describe('KpiGrid', () => {
  it('shows each figure with its change, what it compares with, its note and sparkline', () => {
    const { container } = render(
      <KpiGrid
        drillDownHref={drillDownHref}
        kpis={overviewKpis(REPORT, LAST_WEEK, 'signup_completed', english)}
      />,
    );

    const visits = screen.getByRole('group', { name: 'Visits' });
    expect(visits).toHaveTextContent(`${kpi('visits').change} change vs. previous 7 days`);
    for (const card of screen.getAllByRole('group')) {
      expect(within(card).getByText('vs. previous 7 days')).toBeInTheDocument();
    }
    expect(
      within(screen.getByRole('group', { name: 'Identified users' })).getByText(
        'signed in at least once',
      ),
    ).toBeInTheDocument();
    expect(visits.querySelectorAll('p')).toHaveLength(2);
    expect(screen.getAllByRole('group')).toHaveLength(4);
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
    expect(container.querySelectorAll('polyline')).toHaveLength(4);
    expect(container.querySelector('polyline')?.getAttribute('points')?.split(' ')).toHaveLength(7);
  });

  it('colors the change by whether it is good news', () => {
    render(
      <KpiGrid
        drillDownHref={drillDownHref}
        kpis={[
          { ...kpi('visits'), change: '+10.0%', tone: 'good' },
          { ...kpi('identified-users'), change: '−10.0%', tone: 'bad' },
          { ...kpi('write-errors'), change: '0.0 pt', tone: 'neutral' },
        ]}
      />,
    );

    expect(screen.getByText('+10.0%')).toHaveClass('text-ok');
    expect(screen.getByText('−10.0%')).toHaveClass('text-bad');
    expect(screen.getByText('0.0 pt')).toHaveClass('text-muted');
  });

  it('leaves a gap in the error rate line on a day without writes', () => {
    render(
      <KpiGrid
        drillDownHref={drillDownHref}
        kpis={[{ ...kpi('write-errors'), series: [0.02, null, 0.04, 0.01] }]}
      />,
    );

    const lines = screen
      .getByRole('group', { name: 'Write error rate' })
      .querySelectorAll('polyline');
    expect(lines).toHaveLength(2);
  });

  it('draws no sparkline for a single day', () => {
    const { container } = render(
      <KpiGrid drillDownHref={drillDownHref} kpis={[{ ...kpi('visits'), series: [12] }]} />,
    );

    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });

  it('links each figure to the screen that lists what it counts, in the same period', () => {
    render(
      <KpiGrid
        drillDownHref={drillDownHref}
        kpis={overviewKpis(REPORT, LAST_WEEK, 'signup_completed', english)}
      />,
    );

    const linkIn = (card: string) =>
      within(screen.getByRole('group', { name: card })).getByRole('link');
    expect(linkIn('Visits')).toHaveAccessibleName('See the visits');
    expect(linkIn('Visits')).toHaveAttribute('href', '/p-store/visits?range=7d');
    expect(linkIn('Identified users')).toHaveAttribute(
      'href',
      '/p-store/visits?range=7d&identity=identified',
    );
    expect(linkIn('Conversions')).toHaveAccessibleName('See converting visits');
    expect(linkIn('Conversions')).toHaveAttribute(
      'href',
      '/p-store/visits?range=7d&event=signup_completed',
    );
    expect(linkIn('Write error rate')).toHaveAccessibleName('See failing routes');
    expect(linkIn('Write error rate')).toHaveAttribute(
      'href',
      '/p-store/requests?range=7d&show=failing',
    );
  });

  it('keeps the cards plain when there is no chart to plot them on', () => {
    render(
      <KpiGrid
        drillDownHref={drillDownHref}
        kpis={overviewKpis(REPORT, LAST_WEEK, 'signup_completed', english)}
      />,
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Visits' })).not.toHaveClass('cursor-pointer');
  });

  it('turns each card into a toggle that plots its figure, its link kept outside the toggle', () => {
    const kpis = overviewKpis(REPORT, LAST_WEEK, 'signup_completed', english);
    render(
      <MetricSelection available={kpis.map((figure) => figure.id)}>
        <KpiGrid drillDownHref={drillDownHref} kpis={kpis} selectable />
      </MetricSelection>,
    );

    const toggles = screen.getAllByRole('button', {
      description: 'Plots this figure per day on the chart below.',
    });
    expect(toggles.map((toggle) => toggle.textContent)).toEqual([
      'Visits',
      'Identified users',
      'Conversions',
      'Write error rate',
    ]);
    expect(toggles.every((toggle) => toggle.getAttribute('aria-pressed') === 'false')).toBe(true);
    const visits = screen.getByRole('group', { name: 'Visits' });
    expect(visits).toHaveClass('cursor-pointer');
    const visitsToggle = within(visits).getByRole('button', { name: 'Visits' });
    expect(within(visits).getByRole('heading', { name: 'Visits' })).toContainElement(visitsToggle);
    expect(visitsToggle).not.toContainElement(within(visits).getByRole('link'));
    expect(screen.getByText('Plots this figure per day on the chart below.')).not.toBeVisible();
  });

  it('offers no link to a list that would be empty', () => {
    render(
      <KpiGrid drillDownHref={drillDownHref} kpis={[{ ...kpi('visits'), drillDown: null }]} />,
    );

    expect(
      within(screen.getByRole('group', { name: 'Visits' })).queryByRole('link'),
    ).not.toBeInTheDocument();
  });

  it('says in words, not only in colour, whether a change is good news', () => {
    render(
      <KpiGrid
        drillDownHref={drillDownHref}
        kpis={[
          { ...kpi('visits'), change: '+10.0% (+40)', tone: 'good' },
          { ...kpi('write-errors'), change: '+2.0 pt', tone: 'bad' },
          { ...kpi('identified-users'), change: 'no change', tone: 'neutral' },
        ]}
      />,
    );

    expect(screen.getByRole('group', { name: 'Visits' })).toHaveTextContent(
      '+10.0% (+40) change vs. previous 7 days, better',
    );
    expect(screen.getByRole('group', { name: 'Write error rate' })).toHaveTextContent(
      '+2.0 pt change vs. previous 7 days, worse',
    );
    const users = screen.getByRole('group', { name: 'Identified users' });
    expect(users).toHaveTextContent('no change vs. previous 7 days');
    expect(users).not.toHaveTextContent('no change change');
  });
});

function kpi(id: 'visits' | 'identified-users' | 'write-errors') {
  const found = overviewKpis(REPORT, LAST_WEEK, 'signup_completed', english).find(
    (candidate) => candidate.id === id,
  );
  if (found === undefined) {
    throw new Error(`No ${id} figure in the demo report`);
  }
  return found;
}

const ACTIVITY_CHART = overviewChart(REPORT, ACTIVITY, english);
const WITHOUT_PREVIOUS = { ...REPORT, previousDays: null };

function lines(figure: HTMLElement, color: string, period: 'current' | 'previous') {
  return [...figure.querySelectorAll(`g[stroke="${color}"] path[data-period="${period}"]`)];
}

describe('OverviewChartPanel', () => {
  it('draws the chart with a summary in words and the totals beside the legend', () => {
    render(<OverviewChartPanel chart={ACTIVITY_CHART} periodLabel="last 7 days" i18n={english} />);

    expect(screen.getByRole('img')).toHaveAccessibleName(
      /^Line chart of 7 days\. Page views: .+ Dashed, the previous period\. Page views: /,
    );
    expect(screen.getByRole('heading', { name: 'Activity per day' })).toBeInTheDocument();
    expect(screen.getByText('Page views and named events, last 7 days')).toBeInTheDocument();
    const pageViews = REPORT.days.reduce((sum, day) => sum + day.pageViews, 0);
    expect(screen.getByText(new Intl.NumberFormat('en-US').format(pageViews))).toBeInTheDocument();
    expect(screen.getByText('Previous period').querySelector('strong')).toBeNull();
  });

  it('draws each series as an unfilled line over its dashed previous period, on one scale', () => {
    render(<OverviewChartPanel chart={ACTIVITY_CHART} periodLabel="last 7 days" i18n={english} />);

    const figure = screen.getByRole('img');
    const { top } = valueAxis(chartValues(ACTIVITY_CHART));
    const [pageViews, events] = ACTIVITY_CHART.series;
    expect(figure.querySelector('g[stroke="var(--color-sky)"]')).toHaveAttribute('fill', 'none');
    expect(
      lines(figure, 'var(--color-sky)', 'current').map((path) => path.getAttribute('d')),
    ).toEqual([linePath(pageViews?.values ?? [], top)]);
    const [previousPageViews] = lines(figure, 'var(--color-sky)', 'previous');
    expect(previousPageViews).toHaveAttribute('d', linePath(pageViews?.previous ?? [], top, 7));
    expect(previousPageViews).toHaveAttribute('stroke-dasharray', '6 5');
    expect(lines(figure, 'var(--color-violet)', 'current')[0]).toHaveAttribute(
      'd',
      linePath(events?.values ?? [], top),
    );
    expect(
      within(figure).getByText(new Intl.NumberFormat('en-US').format(top)),
    ).toBeInTheDocument();
  });

  it('draws no dashed line, and no legend for it, without a previous period', () => {
    render(
      <OverviewChartPanel
        chart={overviewChart(WITHOUT_PREVIOUS, ACTIVITY, english)}
        periodLabel="last 7 days"
        i18n={english}
      />,
    );

    expect(screen.getByRole('img').querySelector('[data-period="previous"]')).toBeNull();
    expect(screen.queryByText('Previous period')).not.toBeInTheDocument();
  });

  it('plots one figure in its card colour and format, with the total of the previous period', () => {
    const chart = overviewChart(REPORT, 'write-errors', english);
    render(<OverviewChartPanel chart={chart} periodLabel="last 7 days" i18n={english} />);

    expect(screen.getByRole('heading', { name: 'Write error rate per day' })).toBeInTheDocument();
    const figure = screen.getByRole('img');
    expect(lines(figure, 'var(--color-bad)', 'current')).toHaveLength(1);
    expect(within(figure).getByText('0.0%')).toBeInTheDocument();
    expect(screen.getByText('Previous period')).toHaveTextContent(
      `Previous period${String(chart.previousTotal)}`,
    );
  });

  it('shows the values of the day under the pointer, the previous period dashed', () => {
    render(<OverviewChartPanel chart={ACTIVITY_CHART} periodLabel="last 7 days" i18n={english} />);
    const layer = screen.getByRole('img').querySelector<HTMLElement>('[data-layer="hover"]');
    if (layer === null) {
      throw new Error('The hover layer was not drawn');
    }
    vi.spyOn(layer, 'getBoundingClientRect').mockReturnValue({ left: 0, width: 600 } as DOMRect);

    fireEvent.pointerMove(layer, { clientX: 0 });

    const [first] = chartDays(ACTIVITY_CHART, english);
    expect(layer).toHaveTextContent(
      [first?.day, ...(first?.points ?? []).map((point) => point.label + point.value)].join(''),
    );
    expect(layer.querySelectorAll('.bg-sky.rounded-\\[2px\\]')).toHaveLength(1);
    expect(layer.querySelectorAll('.border-dashed.border-violet')).toHaveLength(1);
  });

  it('switches to a table of the same days and back', async () => {
    render(<OverviewChartPanel chart={ACTIVITY_CHART} periodLabel="last 7 days" i18n={english} />);
    const views = within(screen.getByRole('group', { name: 'Show as' }));
    const chartOption = views.getByRole('button', { name: 'Chart' });
    const tableOption = views.getByRole('button', { name: 'Table' });
    expect(chartOption).toHaveAttribute('aria-pressed', 'true');
    expect(tableOption).toHaveAttribute('aria-pressed', 'false');

    await userEvent.click(tableOption);

    expect(tableOption).toHaveAttribute('aria-pressed', 'true');
    expect(chartOption).toHaveAttribute('aria-pressed', 'false');
    const table = screen.getByRole('table', {
      name: 'Page views and named events per day, last 7 days, with the previous period',
    });
    expect(
      within(table)
        .getAllByRole('columnheader')
        .map((cell) => cell.textContent),
    ).toEqual([
      'Day',
      'Page views',
      'Named events',
      'Compared with',
      'Page views then',
      'Named events then',
    ]);
    const rows = within(table).getAllByRole('row');
    expect(rows).toHaveLength(8);
    const [first] = chartRows(ACTIVITY_CHART, english);
    expect(rows[1]).toHaveTextContent(`Sep 29${first?.cells.join('') ?? ''}`);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();

    await userEvent.click(chartOption);

    expect(chartOption).toHaveAttribute('aria-pressed', 'true');
    expect(tableOption).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('switches with the keyboard too', async () => {
    render(<OverviewChartPanel chart={ACTIVITY_CHART} periodLabel="last 7 days" i18n={english} />);
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
        i18n={english}
      />,
    );

    const rows = within(screen.getByRole('table', { name: 'Top pages' })).getAllByRole('row');
    expect(rows[1]).toHaveTextContent('/30020030.0%');
    expect(rows[2]).toHaveTextContent('/pricing1009010.0%');
  });

  it('links each page to the visits that opened it', () => {
    render(
      <TopPagesTable
        pages={[{ path: '/calculator-shipping', views: 300, visits: 200 }]}
        totalPageViews={1000}
        visitsHref={visitsHref}
        i18n={english}
      />,
    );

    expect(
      screen.getByRole('link', { name: '/calculator-shipping: see its visits' }),
    ).toHaveAttribute('href', '/p-store/visits?range=7d&path=%2Fcalculator-shipping');
  });

  it('says so when no page was viewed', () => {
    render(<TopPagesTable pages={[]} totalPageViews={0} visitsHref={visitsHref} i18n={english} />);

    expect(screen.getByText('No page views in this period.')).toBeInTheDocument();
  });
});

describe('TopEventsList', () => {
  it('lists the events by label and name with their count and the visits that had them', () => {
    render(
      <TopEventsList
        events={[
          { name: 'cta_clicked', count: 1200, visits: 900 },
          { name: 'report_exported', count: 1, visits: 1 },
        ]}
        visitsHref={eventVisitsHref}
        i18n={english}
      />,
    );

    const [item, single] = screen.getAllByRole('listitem');
    expect(item).toHaveTextContent('CTA clicked');
    expect(item).toHaveTextContent('cta_clicked');
    expect(item).toHaveTextContent('1,200 in 900 visits');
    expect(single).toHaveTextContent('1 in 1 visit');
    expect(screen.getByRole('link', { name: 'CTA clicked: see its visits' })).toHaveAttribute(
      'href',
      '/p-store/visits?range=7d&event=cta_clicked',
    );
  });

  it('says so when no event was tracked', () => {
    render(<TopEventsList events={[]} visitsHref={eventVisitsHref} i18n={english} />);

    expect(screen.getByText(/No named events in this period/)).toBeInTheDocument();
  });
});

describe('DayActivityFigures', () => {
  it('shows the totals of a single day as figures instead of a chart', () => {
    render(
      <DayActivityFigures
        days={[{ date: '2026-10-05', pageViews: 1234, events: 56 }]}
        periodLabel="today"
        i18n={english}
      />,
    );

    const panel = screen.getByRole('region', { name: 'Activity of the day' });
    expect(panel).toHaveTextContent('Page views and named events, today');
    expect(within(panel).getByText('1,234')).toBeInTheDocument();
    expect(within(panel).getByText('56')).toBeInTheDocument();
    expect(within(panel).queryByRole('img')).not.toBeInTheDocument();
  });
});
