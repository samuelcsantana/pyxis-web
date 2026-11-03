import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { NO_UNIQUE_VISITORS, type UniqueVisitors, type VisitorDay } from '@/domain/unique-visitors';
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { UniqueVisitorsPanel } from './unique-visitors-panel';

function day(date: string, counts: Partial<Omit<VisitorDay, 'date'>> = {}): VisitorDay {
  return { date, firstVisit: 0, firstThisMonth: 0, firstToday: 0, againToday: 0, ...counts };
}

const WEEK: UniqueVisitors = {
  enabled: true,
  daily: [
    day('2026-10-27', { firstVisit: 40, firstThisMonth: 3, firstToday: 9, againToday: 12 }),
    day('2026-10-28', { firstVisit: 35, firstThisMonth: 2, firstToday: 11, againToday: 10 }),
    day('2026-10-29', { firstVisit: 51, firstThisMonth: 4, firstToday: 8, againToday: 14 }),
  ],
  months: [{ month: '2026-10', firstVisit: 126, firstThisMonth: 9, exact: false }],
};

const NOVEMBER_SO_FAR: UniqueVisitors = {
  enabled: true,
  daily: [
    day('2026-11-01', { firstVisit: 30, firstThisMonth: 20, againToday: 5 }),
    day('2026-11-02', { firstVisit: 25, firstThisMonth: 6, firstToday: 12, againToday: 7 }),
  ],
  months: [{ month: '2026-11', firstVisit: 55, firstThisMonth: 26, exact: true }],
};

const ALL_NEW: UniqueVisitors = {
  enabled: true,
  daily: [
    day('2026-11-01', { firstVisit: 19, firstToday: 1 }),
    day('2026-11-02', { firstVisit: 30 }),
  ],
  months: [{ month: '2026-11', firstVisit: 49, firstThisMonth: 0, exact: false }],
};

function renderPanel(
  visitors: UniqueVisitors,
  { endsToday = false, locale = 'en' }: { endsToday?: boolean; locale?: 'en' | 'pt-BR' } = {},
) {
  return renderWithMessages(
    <UniqueVisitorsPanel
      visitors={visitors}
      endsToday={endsToday}
      periodLabel={locale === 'en' ? 'last 3 days' : 'últimos 3 dias'}
      visitsHref={(span) => `/p1/visits?range=3d&visitors=${span}`}
      i18n={locale === 'en' ? english : portuguese}
    />,
    locale,
  );
}

function figure(name: string) {
  const term = screen.getByText(name, { selector: 'dt' });
  return term.nextElementSibling?.textContent;
}

describe('UniqueVisitorsPanel', () => {
  it('shows nothing for a project that does not count unique visitors', () => {
    const { container } = renderPanel(NO_UNIQUE_VISITORS);

    expect(container).toBeEmptyDOMElement();
  });

  it('says the count starts with the next visits while no visit carries a kind', () => {
    renderPanel({ ...WEEK, daily: WEEK.daily.map((each) => day(each.date)) });

    const card = screen.getByRole('region', { name: 'Unique visitors' });
    expect(card).toHaveTextContent(
      'No unique visitor counted in this period yet: the count starts with the next visits.',
    );
    expect(within(card).queryByRole('img')).not.toBeInTheDocument();
  });

  it('adds the days up for a period that is not a day or a month, and says a visitor counts twice', () => {
    renderPanel(WEEK);

    expect(screen.getByRole('region', { name: 'Unique visitors' })).toHaveTextContent(
      'New and returning visitors per day, last 3 days',
    );
    expect(figure('Sum of daily unique visitors')).toBe('163');
    expect(figure('New')).toBe('126');
    expect(figure('Returning')).toBe('37');
    expect(
      screen.getByText('Sum of days: a visitor who came on two days counts twice.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'See these visits' })).toHaveAttribute(
      'href',
      '/p1/visits?range=3d&visitors=day',
    );
  });

  it('stacks new on returning visitors per day, summed up in words', () => {
    const { container } = renderPanel(WEEK);

    expect(screen.getByRole('img')).toHaveAccessibleName(
      'Stacked bar chart of 3 days, new and returning, between 48 and 63 unique visitors a day.',
    );
    expect(container.querySelectorAll('rect[fill="var(--color-sky)"]')).toHaveLength(3);
    expect(container.querySelectorAll('rect[fill="var(--color-violet)"]')).toHaveLength(3);
  });

  it('switches to a table of the same days', async () => {
    renderPanel(WEEK);

    await userEvent.click(screen.getByRole('button', { name: 'Table' }));

    const table = screen.getByRole('table', {
      name: 'Unique visitors per day, new and returning, last 3 days',
    });
    const rows = within(table).getAllByRole('row');
    expect(rows[0]).toHaveTextContent('DayUnique visitorsNewReturning');
    expect(rows[1]).toHaveTextContent('Oct 27524012');
    expect(rows).toHaveLength(4);
  });

  it('gives the exact count of the month so far, and warns that its days do not add up to it', () => {
    renderPanel(NOVEMBER_SO_FAR, { endsToday: true });

    expect(figure('Unique visitors in November 2026 so far')).toBe('81');
    expect(screen.getByRole('link', { name: 'See these visits' })).toHaveAttribute(
      'href',
      '/p1/visits?range=3d&visitors=month',
    );
    expect(figure('New')).toBe('55');
    expect(figure('Returning')).toBe('26');
    expect(
      screen.getByText(
        'The days do not add up to the month: a visitor who came on two days counts on both.',
      ),
    ).toBeInTheDocument();
  });

  it('shows the figures of a single day without a chart', () => {
    renderPanel({ ...NOVEMBER_SO_FAR, daily: NOVEMBER_SO_FAR.daily.slice(1) });

    const card = screen.getByRole('region', { name: 'Unique visitors' });
    expect(card).toHaveTextContent('New and returning visitors, last 3 days');
    expect(figure('Unique visitors')).toBe('43');
    expect(within(card).getByRole('link', { name: 'See these visits' })).toHaveAttribute(
      'href',
      '/p1/visits?range=3d&visitors=day',
    );
    expect(within(card).queryByRole('img')).not.toBeInTheDocument();
    expect(within(card).queryByRole('button')).not.toBeInTheDocument();
    expect(card).toHaveTextContent('Counted per browser, not per person');
  });

  it('says why almost everyone is new only when nine in ten are', () => {
    renderPanel(ALL_NEW);
    expect(screen.getByText(/Counted per browser/)).toHaveTextContent(
      'For the first weeks after the count is turned on, almost every visitor shows as new.',
    );
  });

  it('keeps the warming-up line out when visitors come back', () => {
    renderPanel(WEEK);
    expect(screen.getByText(/Counted per browser/)).not.toHaveTextContent('first weeks');
  });

  it('speaks Portuguese, never calling the visitors people', () => {
    renderPanel(NOVEMBER_SO_FAR, { endsToday: true, locale: 'pt-BR' });

    const card = screen.getByRole('region', { name: 'Visitantes únicos' });
    expect(figure('Visitantes únicos em novembro de 2026 até agora')).toBe('81');
    expect(figure('Recorrentes')).toBe('26');
    expect(card).toHaveTextContent('Contados por navegador, não por pessoa');
    expect(card).not.toHaveTextContent(/pessoas/);
  });
});
