import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { NO_VISIT_FILTERS, type VisitRowsPage, visitRows } from '@/domain/visits';
import { demoVisitsReport } from '@/services/visits/demo-visit-list';
import { VisitFiltersForm } from './visit-filters-form';
import { VisitsTable } from './visits-table';
import { english } from '@/test-utils/english';

const NOW = new Date('2026-10-06T02:30:00.000Z');
const RANGE = { from: '2026-09-22', to: '2026-10-05' };
const FIRST = demoVisitsReport('demo', RANGE, NO_VISIT_FILTERS, null, NOW);
const SECOND = demoVisitsReport('demo', RANGE, NO_VISIT_FILTERS, FIRST.nextCursor, NOW);
const FIRST_ROWS = visitRows(FIRST.visits, 'America/Sao_Paulo', english);
const SECOND_ROWS = visitRows(SECOND.visits, 'America/Sao_Paulo', english);
const CURSOR = '2026-10-03T12:12:04.000Z~2a81c3d4-5e6f-4a70-8b91-0c1d2e3f4a02';

function renderTable(loadOlder: (cursor: string) => Promise<VisitRowsPage>, nextCursor = CURSOR) {
  return render(
    <VisitsTable
      rows={FIRST_ROWS}
      nextCursor={nextCursor}
      timelinePath="/p-store/timeline"
      emptyMessage="No visits in this period."
      loadOlder={loadOlder}
    />,
  );
}

function bodyRow(index: number): HTMLElement {
  const row = bodyRows()[index];
  if (row === undefined) {
    throw new Error(`The table has no row ${String(index)}.`);
  }
  return row;
}

function bodyRows() {
  return within(screen.getByRole('table', { name: 'Visits' }))
    .getAllByRole('row')
    .slice(1);
}

function cards(): HTMLElement[] {
  return [...screen.getByRole('list', { name: 'Visits' }).children].filter(
    (child): child is HTMLElement => child instanceof HTMLElement,
  );
}

function card(index: number): HTMLElement {
  const item = cards()[index];
  if (item === undefined) {
    throw new Error(`The list has no card ${String(index)}.`);
  }
  return item;
}

function laidOutOnlyInside(selector: string) {
  vi.spyOn(Element.prototype, 'getClientRects').mockImplementation(function (this: Element) {
    const rects = this.closest(selector) === null ? [] : [new DOMRect(0, 0, 10, 10)];
    return Object.assign(rects, { item: (index: number) => rects[index] ?? null });
  });
}

describe('VisitsTable', () => {
  it('shows each visit with a link to its timeline and to the timeline of its account', () => {
    renderTable(vi.fn());

    const newest = bodyRow(0);
    expect(bodyRows()).toHaveLength(8);
    expect(
      within(newest).getByRole('link', {
        name: 'Mon, Oct 5, 18:40, open visit 3c07a1b2',
      }),
    ).toHaveAttribute('href', '/p-store/timeline?visit=3c07a1b2-6d4e-4f10-9a2b-5c8d7e6f1a01');
    expect(newest).toHaveTextContent('/orders');
    expect(newest).toHaveTextContent('Order created');
    expect(newest).toHaveTextContent('Desktop · Chrome · Windows');
    expect(newest).toHaveTextContent('Direct');
    expect(
      within(newest).getByRole('link', { name: 'u_7f3a, open the timeline of this user' }),
    ).toHaveAttribute('href', '/p-store/timeline?user=u_7f3a');
    expect(bodyRow(2)).toHaveTextContent('Login completed');
    expect(within(bodyRow(1)).getByText('Anonymous')).toBeInTheDocument();
  });

  it('shortens a long user id on screen and names the link with what it shows first', () => {
    const [row] = visitRows(
      FIRST.visits.slice(0, 1).map((visit) => ({ ...visit, userId: 'u_check_visits' })),
      'UTC',
      english,
    );
    render(
      <VisitsTable
        rows={row === undefined ? [] : [row]}
        nextCursor={null}
        timelinePath="/p-store/timeline"
        emptyMessage="No visits in this period."
        loadOlder={vi.fn()}
      />,
    );

    const account = within(screen.getByRole('table', { name: 'Visits' })).getByRole('link', {
      name: 'u_check_…, open the timeline of user u_check_visits',
    });
    expect(account).toHaveTextContent('u_check_…');
    expect(screen.queryByText('That is every visit of this period.')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('marks a visit with failed requests and shows a dash where a value is missing', () => {
    const [row] = visitRows(
      FIRST.visits.slice(0, 1).map((visit) => ({
        ...visit,
        entryPath: null,
        highlights: [],
        channel: null,
        failedRequests: 2,
      })),
      'UTC',
      english,
    );
    render(
      <VisitsTable
        rows={row === undefined ? [] : [row]}
        nextCursor={null}
        timelinePath="/p-store/timeline"
        emptyMessage="No visits in this period."
        loadOlder={vi.fn()}
      />,
    );

    const visit = bodyRow(0);
    expect(within(visit).getByText('2')).toHaveClass('text-bad');
    expect(within(visit).getAllByText('—')).toHaveLength(3);
    const onCard = card(0);
    expect(within(onCard).getByText('2 failed requests')).toHaveClass('text-bad');
    expect(within(onCard).getByText('—')).toBeInTheDocument();
    expect(onCard).toHaveTextContent('Channel: —');
    expect(within(onCard).queryByRole('list')).not.toBeInTheDocument();
  });

  it('says on the card when a visit had no failed request', () => {
    const [row] = visitRows(
      FIRST.visits.slice(0, 1).map((visit) => ({ ...visit, failedRequests: 0 })),
      'UTC',
      english,
    );
    render(
      <VisitsTable
        rows={row === undefined ? [] : [row]}
        nextCursor={null}
        timelinePath="/p-store/timeline"
        emptyMessage="No visits in this period."
        loadOlder={vi.fn()}
      />,
    );

    expect(within(card(0)).getByText('No failed request')).toHaveClass('text-muted');
  });

  it('appends the older visits, moves the focus to the first of them and says when all are shown', async () => {
    laidOutOnlyInside('table');
    const loadOlder = vi
      .fn<(cursor: string) => Promise<VisitRowsPage>>()
      .mockResolvedValue({ rows: SECOND_ROWS, nextCursor: null });
    renderTable(loadOlder);

    await userEvent.click(screen.getByRole('button', { name: 'Load older visits' }));

    expect(loadOlder).toHaveBeenCalledWith(CURSOR);
    expect(await screen.findByText('That is every visit of this period.')).toBeInTheDocument();
    expect(bodyRows()).toHaveLength(13);
    expect(cards()).toHaveLength(13);
    await waitFor(() => {
      expect(
        within(screen.getByRole('table', { name: 'Visits' })).getByRole('link', {
          name: /, open visit 19c2e5f6$/,
        }),
      ).toHaveFocus();
    });
    expect(screen.queryByRole('button', { name: 'Load older visits' })).not.toBeInTheDocument();
  });

  it('moves the focus to the first older visit card when the cards are the list on screen', async () => {
    laidOutOnlyInside('ul');
    renderTable(() => Promise.resolve({ rows: SECOND_ROWS, nextCursor: null }));

    await userEvent.click(screen.getByRole('button', { name: 'Load older visits' }));

    await waitFor(() => {
      expect(within(card(8)).getByRole('link', { name: /, open visit 19c2e5f6$/ })).toHaveFocus();
    });
  });

  it('shows every column of a visit on its card', () => {
    renderTable(vi.fn());

    const newest = card(0);
    expect(cards()).toHaveLength(8);
    expect(
      within(newest).getByRole('link', { name: 'Mon, Oct 5, 18:40, open visit 3c07a1b2' }),
    ).toHaveAttribute('href', '/p-store/timeline?visit=3c07a1b2-6d4e-4f10-9a2b-5c8d7e6f1a01');
    expect(newest).toHaveTextContent(FIRST_ROWS[0]?.duration ?? '');
    expect(newest).toHaveTextContent('/orders');
    expect(newest).toHaveTextContent(FIRST_ROWS[0]?.pagesLabel ?? '');
    expect(newest).toHaveTextContent('Order created');
    expect(newest).toHaveTextContent('Desktop · Chrome · Windows');
    expect(newest).toHaveTextContent('Channel: Direct');
    expect(
      within(newest).getByRole('link', { name: 'u_7f3a, open the timeline of this user' }),
    ).toHaveAttribute('href', '/p-store/timeline?user=u_7f3a');
    expect(within(card(1)).getByText('Anonymous')).toBeInTheDocument();
  });

  it('focuses nothing when an older page comes back empty', async () => {
    const loadOlder = vi
      .fn<(cursor: string) => Promise<VisitRowsPage>>()
      .mockResolvedValue({ rows: [], nextCursor: null });
    renderTable(loadOlder);
    const button = screen.getByRole('button', { name: 'Load older visits' });

    await userEvent.click(button);

    expect(await screen.findByText('That is every visit of this period.')).toBeInTheDocument();
    expect(document.body).toHaveFocus();
  });

  it('keeps the button and says so when a page fails to load', async () => {
    const loadOlder = vi
      .fn<(cursor: string) => Promise<VisitRowsPage>>()
      .mockRejectedValue(new Error('503'));
    renderTable(loadOlder);

    await userEvent.click(screen.getByRole('button', { name: 'Load older visits' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Could not load older visits.');
    expect(await screen.findByRole('button', { name: 'Load older visits' })).toBeEnabled();
  });

  it('shows the request is running, and drops it when the screen goes away', async () => {
    const loadOlder = vi
      .fn<(cursor: string) => Promise<VisitRowsPage>>()
      .mockReturnValue(new Promise<VisitRowsPage>(() => undefined));
    const { unmount } = renderTable(loadOlder);

    await userEvent.click(screen.getByRole('button', { name: 'Load older visits' }));

    expect(screen.getByRole('button', { name: 'Loading older visits…' })).toHaveAttribute(
      'aria-busy',
      'true',
    );
    unmount();
  });

  it('says why the list is empty', () => {
    render(
      <VisitsTable
        rows={[]}
        nextCursor={null}
        timelinePath="/p-store/timeline"
        emptyMessage="No visit matches these filters in this period."
        loadOlder={vi.fn()}
      />,
    );

    expect(screen.getByText('No visit matches these filters in this period.')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });
});

describe('VisitFiltersForm', () => {
  it('fills every field from the filters and keeps the period in hidden fields', () => {
    const { container } = render(
      <VisitFiltersForm
        action="/p-store/visits"
        period={{ preset: 'custom', from: '2026-09-01', to: '2026-09-30' }}
        filters={{
          paths: ['/calculator-shipping', '/calculator-*'],
          event: 'calculator_result_shown',
          property: 'calculator=margin',
          channel: 'paid',
          device: 'mobile',
          identity: 'anonymous',
        }}
        problems={[]}
        clearHref="/p-store/visits?from=2026-09-01&to=2026-09-30"
        i18n={english}
      />,
    );

    const form = screen.getByRole('search', { name: 'Filter the visits' });
    expect(form).toHaveAttribute('action', '/p-store/visits');
    expect(form).toHaveProperty('method', 'get');
    expect(screen.getByRole('textbox', { name: 'Viewed page' })).toHaveValue(
      '/calculator-shipping',
    );
    expect(screen.getByRole('textbox', { name: 'And page' })).toHaveValue('/calculator-*');
    expect(screen.getByRole('textbox', { name: 'And also page' })).toHaveValue('');
    expect(screen.getByRole('textbox', { name: 'Had event' })).toHaveValue(
      'calculator_result_shown',
    );
    expect(screen.getByRole('textbox', { name: /^With property/ })).toHaveValue(
      'calculator=margin',
    );
    expect(screen.getByRole('combobox', { name: 'Channel' })).toHaveValue('paid');
    expect(screen.getByRole('combobox', { name: 'Device' })).toHaveValue('mobile');
    expect(screen.getByRole('combobox', { name: 'Account' })).toHaveValue('anonymous');
    expect(
      [...container.querySelectorAll<HTMLInputElement>('input[type="hidden"]')].map(
        (input) => `${input.name}=${input.value}`,
      ),
    ).toEqual(['from=2026-09-01', 'to=2026-09-30']);
    expect(screen.getByRole('link', { name: 'Clear filters' })).toHaveAttribute(
      'href',
      '/p-store/visits?from=2026-09-01&to=2026-09-30',
    );
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Filters · 7 active' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('starts empty, without a clear link, and names the filters it left out', () => {
    const { container } = render(
      <VisitFiltersForm
        action="/p-store/visits"
        period={{ preset: '7d', from: '2026-09-29', to: '2026-10-05' }}
        filters={NO_VISIT_FILTERS}
        problems={['A property filter needs an event.']}
        clearHref={null}
        i18n={english}
      />,
    );

    expect(screen.getByRole('textbox', { name: 'Viewed page' })).toHaveValue('');
    expect(screen.getByRole('combobox', { name: 'Channel' })).toHaveValue('');
    expect(screen.getByRole('alert')).toHaveTextContent('A property filter needs an event.');
    expect(screen.queryByRole('link', { name: 'Clear filters' })).not.toBeInTheDocument();
    expect(
      container.querySelector<HTMLInputElement>('input[type="hidden"][name="range"]')?.value,
    ).toBe('7d');
    expect(screen.getByRole('button', { name: 'Filters' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('keeps the fields behind a "Filters" button on a phone until it is pressed', async () => {
    const user = userEvent.setup();
    render(
      <VisitFiltersForm
        action="/p-store/visits"
        period={{ preset: '30d', from: '2026-09-06', to: '2026-10-05' }}
        filters={NO_VISIT_FILTERS}
        problems={[]}
        clearHref={null}
        i18n={english}
      />,
    );
    const toggle = screen.getByRole('button', { name: 'Filters' });
    const fields = document.getElementById(toggle.getAttribute('aria-controls') ?? '');

    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveClass('sm:hidden');
    expect(fields).toHaveClass('hidden', 'sm:flex');
    expect(fields).toContainElement(screen.getByRole('button', { name: 'Apply filters' }));

    await user.click(toggle);

    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(fields).toHaveClass('flex');
    expect(fields).not.toHaveClass('hidden');

    await user.click(toggle);

    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(fields).toHaveClass('hidden');
  });
});
