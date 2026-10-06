'use client';

import { type KeyboardEvent, type MouseEvent, useRef, useState } from 'react';
import type { RouteRow } from '@/domain/requests';
import { withKeptParameters } from '@/components/shell/period-selector';
import { BODY_CELL, HEADER_CELL, PANEL, PANEL_TITLE } from '@/components/ui/panel-classes';
import { FOCUSABLE_SELECTOR, wrappedFocus } from './focus-trap';
import { ROUTE_HEADING_ID, RouteDetails } from './route-details';
import { MethodChip, TONE_CLASSES } from './status-styles';

export interface RequestsTableProps {
  readonly rows: readonly RouteRow[];
  readonly basePath: string;
  readonly query: string;
  readonly timelinePath: string;
  readonly emptyMessage: string;
}

const CHIP = 'rounded-pill px-2 py-0.5 text-xs font-semibold whitespace-nowrap tabular-nums';

export function RequestsTable({
  rows,
  basePath,
  query,
  timelinePath,
  emptyMessage,
}: RequestsTableProps) {
  const dialogRef = useRef<HTMLDialogElement>(null as unknown as HTMLDialogElement);
  const openerRef = useRef<HTMLButtonElement>(null as unknown as HTMLButtonElement);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const selected = rows.find((row) => row.key === selectedKey);

  const open = (key: string, opener: HTMLButtonElement) => {
    openerRef.current = opener;
    setSelectedKey(key);
    dialogRef.current.showModal();
  };

  const closed = () => {
    setSelectedKey(null);
    openerRef.current.focus();
  };

  const closeOnBackdrop = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) {
      event.currentTarget.close();
    }
  };

  const keepFocusInside = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.currentTarget.close();
      return;
    }
    if (event.key !== 'Tab') {
      return;
    }
    const target = wrappedFocus(
      [...event.currentTarget.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)],
      event.currentTarget.ownerDocument.activeElement,
      event.shiftKey,
    );
    if (target !== undefined) {
      event.preventDefault();
      target.focus();
    }
  };

  const screenHref = (path: string) => `${basePath}?${withKeptParameters(query, { screen: path })}`;

  return (
    <section aria-labelledby="routes-heading" className={PANEL}>
      <h2 id="routes-heading" className={PANEL_TITLE}>
        Routes
      </h2>
      {rows.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted">{emptyMessage}</p>
      ) : (
        <table
          aria-labelledby="routes-heading"
          className="w-full border-collapse text-[13px] tabular-nums"
        >
          <thead>
            <tr>
              <th scope="col" className={`${HEADER_CELL} pl-0 text-left`}>
                Route
              </th>
              <th scope="col" className={`${HEADER_CELL} text-right`}>
                Total
              </th>
              <th scope="col" className={`${HEADER_CELL} text-left sm:w-48`}>
                Success · errors
              </th>
              <th scope="col" className={`${HEADER_CELL} hidden text-left lg:table-cell`}>
                Status codes
              </th>
              <th scope="col" className={`${HEADER_CELL} hidden pr-0 text-right sm:table-cell`}>
                Median
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className={row.key === selectedKey ? 'bg-soft' : undefined}>
                <th scope="row" className={`${BODY_CELL} pl-0 text-left font-medium`}>
                  <button
                    type="button"
                    aria-label={`${row.key}, show details`}
                    onClick={(event) => {
                      open(row.key, event.currentTarget);
                    }}
                    className="flex min-h-9 flex-col items-start gap-1 text-left text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:flex-row sm:items-center sm:gap-2.5"
                  >
                    <MethodChip method={row.method} />{' '}
                    <span className="font-mono text-xs underline decoration-line underline-offset-4 wrap-anywhere">
                      {row.route}
                    </span>
                  </button>
                </th>
                <td className={`${BODY_CELL} text-right font-semibold`}>{row.total}</td>
                <td className={BODY_CELL}>
                  <span className="flex flex-col gap-1.5">
                    <span
                      aria-hidden="true"
                      className="flex h-2 overflow-hidden rounded-pill bg-bad"
                    >
                      <span className="block bg-ok" style={{ width: row.successWidth }} />
                    </span>
                    <span className="text-xs">
                      <span className="font-semibold text-ok">{row.successShare} ok</span>
                      <span className="text-muted"> · </span>
                      <span className={row.hasFailures ? 'font-semibold text-bad' : 'text-muted'}>
                        {row.errorShare} errors
                      </span>
                    </span>
                  </span>
                </td>
                <td className={`${BODY_CELL} hidden lg:table-cell`}>
                  <span className="flex flex-wrap gap-1.5">
                    {row.statuses.map((status) => (
                      <span key={status.label} className={`${CHIP} ${TONE_CLASSES[status.tone]}`}>
                        {status.label}
                      </span>
                    ))}
                  </span>
                </td>
                <td className={`${BODY_CELL} hidden pr-0 text-right sm:table-cell`}>
                  {row.median}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <dialog
        ref={dialogRef}
        aria-labelledby={ROUTE_HEADING_ID}
        onClose={closed}
        onClick={closeOnBackdrop}
        onKeyDown={keepFocusInside}
        className="fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-dvh w-[min(100%,28.75rem)] max-w-full overflow-y-auto border-0 border-l border-line bg-card p-0 text-ink backdrop:bg-nav/60"
      >
        {selected === undefined ? null : (
          <RouteDetails
            row={selected}
            screenHref={screenHref}
            visitHref={(sessionId) =>
              `${timelinePath}?${new URLSearchParams({ visit: sessionId }).toString()}`
            }
            onClose={() => {
              dialogRef.current.close();
            }}
          />
        )}
      </dialog>
    </section>
  );
}
