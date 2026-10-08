import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { requestsTableText, routeRows } from '@/domain/requests';
import { routeDaysText, type RouteDaysView } from '@/domain/route-days';
import { demoFailedReadsReport, demoRequestsReport } from '@/services/requests/demo-requests';
import { RequestsTable } from './requests-table';
import type { LoadRouteDays } from './use-route-days';
import { methodClass } from './status-styles';
import { english } from '@/test-utils/english';

const NOW = new Date('2026-10-06T02:30:00.000Z');

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(window.location.search),
}));

const ROWS = routeRows(
  demoRequestsReport(
    'demo',
    { from: '2026-09-22', to: '2026-10-05' },
    null,
    new Date('2026-10-06T02:30:00.000Z'),
    null,
  ).routes,
  'UTC',
  'writes',
  english,
);

const DAYS: RouteDaysView = {
  rows: [
    {
      date: '2026-10-04',
      day: 'Oct 4',
      total: '40',
      failed: '2',
      hasFailures: true,
      median: '150 ms',
      p95: '390 ms',
    },
  ],
  note: null,
};

const ROUTE_DAYS = {
  loadRouteDays: (() => Promise.resolve(DAYS)) satisfies LoadRouteDays,
  routeDaysText: routeDaysText('writes', english),
  text: requestsTableText(english),
};

function renderTable(loadRouteDays: LoadRouteDays = ROUTE_DAYS.loadRouteDays, rows = ROWS) {
  return render(
    <RequestsTable
      kind="writes"
      rows={rows}
      basePath="/p1/requests"
      query="range=7d"
      timelinePath="/p1/timeline?range=7d"
      visitsPath="/p1/visits?range=7d"
      emptyMessage="Nothing"
      {...ROUTE_DAYS}
      loadRouteDays={loadRouteDays}
    />,
  );
}

function dialog(): HTMLDialogElement {
  const element = document.querySelector('dialog');
  if (element === null) {
    throw new Error('no dialog');
  }
  return element;
}

function address(): string {
  return `${window.location.pathname}${window.location.search}`;
}

describe('RequestsTable', () => {
  afterEach(() => {
    window.history.replaceState(null, '', '/');
  });

  it('lists every route with its total, shares, status chips and median', () => {
    renderTable();

    const rows = within(screen.getByRole('table', { name: 'Routes' })).getAllByRole('row');
    expect(rows).toHaveLength(9);
    expect(rows[1]).toHaveTextContent('POST /orders340');
    expect(rows[1]).toHaveTextContent('96.5% ok · 3.5% errors');
    expect(rows[1]).toHaveTextContent('201 × 328400 × 2409 × 10');
    expect(rows[1]).toHaveTextContent('147 ms367 ms');
  });

  it('shows a dash for the p95 of an API that does not report it', () => {
    const [first] = ROWS;
    render(
      <RequestsTable
        kind="writes"
        rows={first === undefined ? [] : [{ ...first, p95: null }]}
        basePath="/p1/requests"
        query="range=7d"
        timelinePath="/p1/timeline?range=7d"
        visitsPath="/p1/visits?range=7d"
        emptyMessage="Nothing"
        {...ROUTE_DAYS}
      />,
    );

    const [, row] = within(screen.getByRole('table', { name: 'Routes' })).getAllByRole('row');
    expect(row).toHaveTextContent('147 ms—');
  });

  it('opens the details of a route, and gives the focus back when they close', async () => {
    renderTable(
      ROUTE_DAYS.loadRouteDays,
      ROWS.map((row) =>
        row.key === 'POST /orders'
          ? {
              ...row,
              failures: row.failures.map((failure, index) =>
                index === 0 ? failure : { ...failure, errorCode: null },
              ),
            }
          : row,
      ),
    );
    const opener = screen.getByRole('button', { name: 'POST /orders, show details' });

    await userEvent.click(opener);

    expect(dialog().open).toBe(true);
    const details = within(dialog());
    expect(details.getByRole('button', { name: 'Close' })).toHaveFocus();
    expect(details.getByRole('heading', { level: 2 })).toHaveTextContent('POST /orders');
    expect(details.getAllByText(/^(order_number_in_use|invalid_quantity)$/)).toHaveLength(1);
    expect(details.getAllByText('No error code').length).toBeGreaterThan(0);
    expect(details.getAllByRole('link', { name: /^Open visit / })[0]).toHaveAttribute(
      'href',
      expect.stringMatching(/^\/p1\/timeline\?range=7d&visit=[0-9a-f-]{36}$/),
    );
    expect(details.getByRole('link', { name: /\/orders\/new/ })).toHaveAttribute(
      'href',
      '/p1/requests?range=7d&screen=%2Forders%2Fnew',
    );
    expect(
      details.getByRole('link', { name: 'See every visit with a failed POST /orders' }),
    ).toHaveAttribute('href', '/p1/visits?range=7d&route=POST+%2Forders&failed=true');

    await userEvent.click(details.getByRole('button', { name: 'Close' }));

    expect(dialog().open).toBe(false);
    expect(opener).toHaveFocus();
  });

  it('closes on a click on the backdrop, not on a click inside', async () => {
    renderTable();
    await userEvent.click(screen.getByRole('button', { name: 'PATCH /users/me, show details' }));

    fireEvent.click(within(dialog()).getByRole('heading', { level: 2 }));
    expect(dialog().open).toBe(true);

    fireEvent.click(dialog());
    expect(dialog().open).toBe(false);
  });

  it('keeps the focus inside the details and closes them with Escape', async () => {
    renderTable();
    const opener = screen.getByRole('button', { name: 'POST /orders, show details' });
    await userEvent.click(opener);
    const close = within(dialog()).getByRole('button', { name: 'Close' });
    const links = within(dialog()).getAllByRole('link');
    const last = links.at(-1);
    if (last === undefined) {
      throw new Error('no link in the details');
    }

    last.focus();
    fireEvent.keyDown(dialog(), { key: 'Tab' });
    expect(close).toHaveFocus();

    fireEvent.keyDown(dialog(), { key: 'Tab', shiftKey: true });
    expect(last).toHaveFocus();

    links[0]?.focus();
    fireEvent.keyDown(dialog(), { key: 'Tab' });
    expect(links[0]).toHaveFocus();

    fireEvent.keyDown(dialog(), { key: 'Enter' });
    expect(dialog().open).toBe(true);

    fireEvent.keyDown(dialog(), { key: 'Escape' });
    expect(dialog().open).toBe(false);
    expect(opener).toHaveFocus();
  });

  it('keeps the open route in the address, next to the other parameters', async () => {
    window.history.replaceState(null, '', '/p1/requests?range=7d');
    renderTable();

    await userEvent.click(screen.getByRole('button', { name: 'POST /orders, show details' }));
    expect(address()).toBe('/p1/requests?range=7d&route=POST+%2Forders');

    await userEvent.click(within(dialog()).getByRole('button', { name: 'Close' }));
    expect(address()).toBe('/p1/requests?range=7d');
  });

  it('opens the route named in the address at once, as after Back from a visit', async () => {
    window.history.replaceState(null, '', '/p1/requests?route=POST+%2Forders');
    renderTable();

    expect(dialog().open).toBe(true);
    expect(within(dialog()).getByRole('heading', { level: 2 })).toHaveTextContent('POST /orders');

    await userEvent.click(within(dialog()).getByRole('button', { name: 'Close' }));

    expect(screen.getByRole('button', { name: 'POST /orders, show details' })).toHaveFocus();
    expect(address()).toBe('/p1/requests');
  });

  it('opens nothing for a route of the address it does not list', () => {
    window.history.replaceState(null, '', '/p1/requests?route=GET+%2Fnowhere');
    renderTable();

    expect(dialog().open).toBe(false);
  });

  it('closes cleanly when its route left the list while it was open', async () => {
    const { rerender } = renderTable();
    await userEvent.click(screen.getByRole('button', { name: 'POST /orders, show details' }));

    rerender(
      <RequestsTable
        kind="writes"
        rows={ROWS.filter((row) => row.key !== 'POST /orders')}
        basePath="/p1/requests"
        query="range=7d"
        timelinePath="/p1/timeline?range=7d"
        visitsPath="/p1/visits?range=7d"
        emptyMessage="Nothing"
        {...ROUTE_DAYS}
      />,
    );
    fireEvent.keyDown(dialog(), { key: 'Escape' });

    expect(dialog().open).toBe(false);
    expect(address()).toBe('/');
  });

  it('says so when a route never failed', async () => {
    renderTable();

    await userEvent.click(screen.getByRole('button', { name: 'PATCH /users/me, show details' }));

    expect(within(dialog()).getAllByText('No failures in this period.')).toHaveLength(2);
    expect(
      within(dialog()).queryByRole('link', { name: /^See every visit with a failed/ }),
    ).not.toBeInTheDocument();
  });

  it('shows the empty message without routes', () => {
    render(
      <RequestsTable
        kind="writes"
        rows={[]}
        basePath="/p1/requests"
        query=""
        timelinePath="/p1/timeline"
        visitsPath="/p1/visits"
        emptyMessage="No writes."
        {...ROUTE_DAYS}
      />,
    );

    expect(screen.getByText('No writes.')).toBeInTheDocument();
  });

  it('lists failed reads by count only, without a success share', async () => {
    const report = demoFailedReadsReport(
      'demo',
      { from: '2026-09-22', to: '2026-10-05' },
      null,
      NOW,
      null,
    );
    const orders = report.routes.find((route) => route.route === '/orders/:id');
    render(
      <RequestsTable
        kind="reads"
        rows={routeRows(report.routes, 'UTC', 'reads', english)}
        basePath="/p1/requests"
        query="range=7d&kind=reads"
        timelinePath="/p1/timeline"
        visitsPath="/p1/visits"
        emptyMessage="Nothing"
        {...ROUTE_DAYS}
      />,
    );
    const table = screen.getByRole('table', { name: 'Routes' });

    expect(within(table).getByRole('columnheader', { name: 'Failed' })).toBeInTheDocument();
    expect(within(table).queryByRole('columnheader', { name: 'Total' })).not.toBeInTheDocument();
    expect(
      within(table).queryByRole('columnheader', { name: 'Success · errors' }),
    ).not.toBeInTheDocument();
    expect(table).not.toHaveTextContent('% ok');

    await userEvent.click(screen.getByRole('button', { name: 'GET /orders/:id, show details' }));

    expect(
      within(dialog()).getByText(
        `${String(orders?.failed)} failed reads · median ${String(orders?.medianDurationMs)} ms`,
      ),
    ).toBeInTheDocument();
    expect(within(dialog()).getByRole('link', { name: /^\/orders\/:id/ })).toHaveAttribute(
      'href',
      '/p1/requests?range=7d&kind=reads&screen=%2Forders%2F%3Aid',
    );
    expect(
      within(dialog()).getByRole('link', { name: 'See every visit with a failed GET /orders/:id' }),
    ).toHaveAttribute('href', '/p1/visits?route=GET+%2Forders%2F%3Aid&failed=true');
  });
});

describe('RequestsTable, day by day', () => {
  afterEach(() => {
    window.history.replaceState(null, '', '/');
  });

  it('loads the days of a route when its details open, once while they stay the same', async () => {
    const pending: ((view: RouteDaysView) => void)[] = [];
    const loadRouteDays = vi.fn<LoadRouteDays>(
      () =>
        new Promise<RouteDaysView>((resolve) => {
          pending.push(resolve);
        }),
    );
    renderTable(loadRouteDays);

    await userEvent.click(screen.getByRole('button', { name: 'POST /orders, show details' }));

    expect(within(dialog()).getByRole('status')).toHaveTextContent(
      'Loading the days of this route…',
    );
    act(() => {
      pending[0]?.(DAYS);
    });
    const days = await within(dialog()).findByRole('table', { name: 'Day by day' });
    expect(days).toHaveTextContent('Oct 4402150 ms390 ms');
    expect(loadRouteDays).toHaveBeenCalledExactlyOnceWith('POST /orders');

    await userEvent.click(within(dialog()).getByRole('button', { name: 'Close' }));
    await userEvent.click(screen.getByRole('button', { name: 'POST /orders, show details' }));
    expect(within(dialog()).getByRole('table', { name: 'Day by day' })).toBeInTheDocument();
    expect(loadRouteDays).toHaveBeenCalledOnce();

    await userEvent.click(within(dialog()).getByRole('button', { name: 'Close' }));
    await userEvent.click(screen.getByRole('button', { name: 'PATCH /users/me, show details' }));
    expect(loadRouteDays).toHaveBeenLastCalledWith('PATCH /users/me');
    expect(within(dialog()).getByRole('status')).toBeInTheDocument();
  });

  it('loads the days of the route named in the address', async () => {
    window.history.replaceState(null, '', '/p1/requests?route=POST+%2Forders');
    const loadRouteDays = vi.fn<LoadRouteDays>(() => Promise.resolve(DAYS));
    renderTable(loadRouteDays);

    expect(await within(dialog()).findByRole('table', { name: 'Day by day' })).toBeInTheDocument();
    expect(loadRouteDays).toHaveBeenCalledExactlyOnceWith('POST /orders');
  });

  it('says when the API cannot tell the days of a route', async () => {
    renderTable(() => Promise.resolve(null));

    await userEvent.click(screen.getByRole('button', { name: 'POST /orders, show details' }));

    expect(
      await within(dialog()).findByText('Day-by-day figures need a newer Pyxis API.'),
    ).toBeInTheDocument();
  });

  it('alerts a failed load and loads again, also on reopening the route', async () => {
    const loadRouteDays = vi
      .fn<LoadRouteDays>()
      .mockRejectedValueOnce(new Error('The API is unreachable.'))
      .mockRejectedValueOnce(new Error('The API is unreachable.'))
      .mockResolvedValue(DAYS);
    renderTable(loadRouteDays);

    await userEvent.click(screen.getByRole('button', { name: 'POST /orders, show details' }));
    expect(await within(dialog()).findByRole('alert')).toHaveTextContent(
      'Could not load the days of this route.',
    );

    await userEvent.click(within(dialog()).getByRole('button', { name: 'Try again' }));
    expect(await within(dialog()).findByRole('alert')).toBeInTheDocument();
    expect(loadRouteDays).toHaveBeenCalledTimes(2);

    await userEvent.click(within(dialog()).getByRole('button', { name: 'Close' }));
    await userEvent.click(screen.getByRole('button', { name: 'POST /orders, show details' }));

    expect(await within(dialog()).findByRole('table', { name: 'Day by day' })).toBeInTheDocument();
    expect(loadRouteDays).toHaveBeenCalledTimes(3);
  });

  it('drops a load still running when it goes away', async () => {
    let settle: (view: RouteDaysView) => void = () => undefined;
    const { unmount } = renderTable(
      () =>
        new Promise<RouteDaysView>((resolve) => {
          settle = resolve;
        }),
    );
    await userEvent.click(screen.getByRole('button', { name: 'POST /orders, show details' }));

    unmount();
    settle(DAYS);

    await Promise.resolve();
    expect(document.querySelector('dialog')).toBeNull();
  });
});

describe('methodClass', () => {
  it('colors the write methods and leaves any other neutral', () => {
    expect(methodClass('DELETE')).toBe('bg-bad-soft text-bad');
    expect(methodClass('PUT')).toBe('bg-soft text-sky-ink');
    expect(methodClass('OPTIONS')).toBe('bg-soft text-ink');
  });
});
