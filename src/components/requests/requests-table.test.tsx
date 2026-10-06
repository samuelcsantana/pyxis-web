import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { routeRows } from '@/domain/requests';
import { demoRequestsReport } from '@/services/requests/demo-requests';
import { RequestsTable } from './requests-table';
import { methodClass } from './status-styles';

const ROWS = routeRows(
  demoRequestsReport({ from: '2026-09-22', to: '2026-10-05' }, null).routes,
  'UTC',
);

function renderTable() {
  return render(
    <RequestsTable rows={ROWS} basePath="/p1/requests" query="range=7d" emptyMessage="Nothing" />,
  );
}

function dialog(): HTMLDialogElement {
  const element = document.querySelector('dialog');
  if (element === null) {
    throw new Error('no dialog');
  }
  return element;
}

describe('RequestsTable', () => {
  it('lists every route with its total, shares, status chips and median', () => {
    renderTable();

    const rows = within(screen.getByRole('table', { name: 'Routes' })).getAllByRole('row');
    expect(rows).toHaveLength(7);
    expect(rows[1]).toHaveTextContent('POST /orders602');
    expect(rows[1]).toHaveTextContent('98% ok · 2% errors');
    expect(rows[1]).toHaveTextContent('201 × 590409 × 8400 × 4');
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

  it('says so when a route never failed', async () => {
    renderTable();

    await userEvent.click(screen.getByRole('button', { name: 'PATCH /users/me, show details' }));

    expect(within(dialog()).getAllByText('No failures in this period.')).toHaveLength(2);
  });

  it('shows the empty message without routes', () => {
    render(<RequestsTable rows={[]} basePath="/p1/requests" query="" emptyMessage="No writes." />);

    expect(screen.getByText('No writes.')).toBeInTheDocument();
  });
});

describe('methodClass', () => {
  it('colors the write methods and leaves any other neutral', () => {
    expect(methodClass('DELETE')).toBe('bg-bad-soft text-bad');
    expect(methodClass('PUT')).toBe('bg-soft text-sky-ink');
    expect(methodClass('OPTIONS')).toBe('bg-soft text-ink');
  });
});
