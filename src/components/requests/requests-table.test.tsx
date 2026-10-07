import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { routeRows } from '@/domain/requests';
import { demoFailedReadsReport, demoRequestsReport } from '@/services/requests/demo-requests';
import { RequestsTable } from './requests-table';
import { methodClass } from './status-styles';

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(window.location.search),
}));

const ROWS = routeRows(
  demoRequestsReport(
    'demo',
    { from: '2026-09-22', to: '2026-10-05' },
    null,
    new Date('2026-10-06T02:30:00.000Z'),
  ).routes,
  'UTC',
  'writes',
);

function renderTable() {
  return render(
    <RequestsTable
      kind="writes"
      rows={ROWS}
      basePath="/p1/requests"
      query="range=7d"
      timelinePath="/p1/timeline?range=7d"
      emptyMessage="Nothing"
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
    expect(rows[1]).toHaveTextContent('POST /orders339');
    expect(rows[1]).toHaveTextContent('98.5% ok · 1.5% errors');
    expect(rows[1]).toHaveTextContent('201 × 334400 × 3409 × 2');
  });

  it('opens the details of a route, and gives the focus back when they close', async () => {
    renderTable();
    const opener = screen.getByRole('button', { name: 'POST /orders, show details' });

    await userEvent.click(opener);

    expect(dialog().open).toBe(true);
    const details = within(dialog());
    expect(details.getByRole('button', { name: 'Close' })).toHaveFocus();
    expect(details.getByRole('heading', { level: 2 })).toHaveTextContent('POST /orders');
    expect(details.getByText('order_number_in_use')).toBeInTheDocument();
    expect(details.getByText('No error code')).toBeInTheDocument();
    expect(details.getAllByRole('link', { name: /^Open visit / })[0]).toHaveAttribute(
      'href',
      expect.stringMatching(/^\/p1\/timeline\?range=7d&visit=[0-9a-f-]{36}$/),
    );
    expect(details.getByRole('link', { name: /\/orders\/new/ })).toHaveAttribute(
      'href',
      '/p1/requests?range=7d&screen=%2Forders%2Fnew',
    );

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
        emptyMessage="Nothing"
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
  });

  it('shows the empty message without routes', () => {
    render(
      <RequestsTable
        kind="writes"
        rows={[]}
        basePath="/p1/requests"
        query=""
        timelinePath="/p1/timeline"
        emptyMessage="No writes."
      />,
    );

    expect(screen.getByText('No writes.')).toBeInTheDocument();
  });

  it('lists failed reads by count only, without a success share', async () => {
    const report = demoFailedReadsReport('demo', { from: '2026-09-22', to: '2026-10-05' }, null);
    const orders = report.routes.find((route) => route.route === '/orders/:id');
    render(
      <RequestsTable
        kind="reads"
        rows={routeRows(report.routes, 'UTC', 'reads')}
        basePath="/p1/requests"
        query="range=7d&kind=reads"
        timelinePath="/p1/timeline"
        emptyMessage="Nothing"
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
      within(dialog()).getByText(`${String(orders?.failed)} failed reads · median 310 ms`),
    ).toBeInTheDocument();
    expect(within(dialog()).getByRole('link', { name: /\/orders\/:id/ })).toHaveAttribute(
      'href',
      '/p1/requests?range=7d&kind=reads&screen=%2Forders%2F%3Aid',
    );
  });
});

describe('methodClass', () => {
  it('colors the write methods and leaves any other neutral', () => {
    expect(methodClass('DELETE')).toBe('bg-bad-soft text-bad');
    expect(methodClass('PUT')).toBe('bg-soft text-sky-ink');
    expect(methodClass('OPTIONS')).toBe('bg-soft text-ink');
  });
});
