'use client';

import { useEffect, useRef, useState } from 'react';
import { catchToState, withSmoothLoading } from 'rx-state-bridge';
import { defer, type Subscription, tap } from 'rxjs';
import { NO_VALUE } from '@/domain/metrics';
import type { VisitRow, VisitRowsPage } from '@/domain/visits';
import { BODY_CELL, HEADER_CELL, PANEL, PANEL_TITLE } from '@/components/ui/panel-classes';
import { BUTTON_SECONDARY, CONTROL_BUSY } from '@/components/ui/control-classes';
import { VisitCards } from './visit-cards';
import { AccountCell, EntryPath, FAILED_CHIP, Highlights, VisitStartLink } from './visit-cells';

const SMOOTH_LOADING_MS = 400;
const WIDE = 'hidden sm:table-cell';
const WIDER = 'hidden lg:table-cell';
const WIDEST = 'hidden xl:table-cell';
const TIGHT_AT_LG = 'lg:px-2 xl:px-2.5';
const HEADING_ID = 'visits-heading';

export interface VisitsTableProps {
  readonly rows: readonly VisitRow[];
  readonly nextCursor: string | null;
  readonly timelinePath: string;
  readonly emptyMessage: string;
  readonly loadOlder: (cursor: string) => Promise<VisitRowsPage>;
}

function VisitTableRow({
  row,
  timelinePath,
  firstOfPage,
}: {
  row: VisitRow;
  timelinePath: string;
  firstOfPage: number | undefined;
}) {
  return (
    <tr data-first-of-page={firstOfPage}>
      <th scope="row" className={`${BODY_CELL} pl-0 text-left font-normal whitespace-nowrap`}>
        <VisitStartLink row={row} timelinePath={timelinePath} />
      </th>
      <td className={`${BODY_CELL} ${TIGHT_AT_LG} ${WIDE} whitespace-nowrap text-muted`}>
        {row.duration}
      </td>
      <td className={`${BODY_CELL} ${TIGHT_AT_LG} min-w-28 font-mono text-xs wrap-anywhere`}>
        <EntryPath path={row.entryPath} />
      </td>
      <td className={`${BODY_CELL} ${TIGHT_AT_LG} ${WIDE} text-right`}>{row.pageViews}</td>
      <td className={`${BODY_CELL} ${WIDEST}`}>
        <Highlights labels={row.highlights} />
      </td>
      <td className={`${BODY_CELL} ${TIGHT_AT_LG} ${WIDE} text-right`}>
        {row.failedRequests === 0 ? (
          <span className="text-muted">0</span>
        ) : (
          <span className={FAILED_CHIP}>{row.failedRequests}</span>
        )}
      </td>
      <td className={`${BODY_CELL} ${TIGHT_AT_LG} ${WIDER}`}>{row.device}</td>
      <td className={`${BODY_CELL} ${TIGHT_AT_LG} ${WIDER}`}>
        {row.channel ?? <span className="text-muted">{NO_VALUE}</span>}
      </td>
      <td className={`${BODY_CELL} pr-0`}>
        <AccountCell account={row.account} timelinePath={timelinePath} />
      </td>
    </tr>
  );
}

function isShown(element: HTMLElement): boolean {
  return element.getClientRects().length > 0;
}

export function VisitsTable({
  rows,
  nextCursor,
  timelinePath,
  emptyMessage,
  loadOlder,
}: VisitsTableProps) {
  const [pages, setPages] = useState<readonly (readonly VisitRow[])[]>([]);
  const [cursor, setCursor] = useState<string | null>(nextCursor);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const request = useRef<Subscription | undefined>(undefined);
  const loaded = useRef(0);
  const pageToFocus = useRef<number | null>(null);
  const section = useRef<HTMLElement>(null as unknown as HTMLElement);

  useEffect(
    () => () => {
      request.current?.unsubscribe();
    },
    [],
  );

  useEffect(() => {
    const page = pageToFocus.current;
    pageToFocus.current = null;
    if (page === null) {
      return;
    }
    [...section.current.querySelectorAll<HTMLElement>(`[data-first-of-page="${String(page)}"] a`)]
      .filter(isShown)
      .slice(0, 1)
      .forEach((link) => {
        link.focus();
      });
  });

  const load = (from: string) => {
    request.current?.unsubscribe();
    setError(null);
    request.current = defer(() => loadOlder(from))
      .pipe(
        tap((page) => {
          loaded.current += 1;
          pageToFocus.current = loaded.current;
          setPages((shown) => [...shown, page.rows]);
          setCursor(page.nextCursor);
        }),
        catchToState(setError),
        withSmoothLoading(setBusy, SMOOTH_LOADING_MS),
      )
      .subscribe();
  };

  const allPages = [rows, ...pages];

  return (
    <section ref={section} aria-labelledby={HEADING_ID} className={PANEL}>
      <h2 id={HEADING_ID} className={PANEL_TITLE}>
        Visits
      </h2>
      {rows.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted">{emptyMessage}</p>
      ) : (
        <>
          <VisitCards pages={allPages} timelinePath={timelinePath} labelledBy={HEADING_ID} />
          <div className="hidden overflow-x-auto sm:block">
            <table
              aria-labelledby={HEADING_ID}
              className="w-full border-collapse text-[13px] tabular-nums"
            >
              <thead>
                <tr>
                  <th scope="col" className={`${HEADER_CELL} pl-0 text-left`}>
                    Started
                  </th>
                  <th scope="col" className={`${HEADER_CELL} ${TIGHT_AT_LG} ${WIDE} text-left`}>
                    Duration
                  </th>
                  <th scope="col" className={`${HEADER_CELL} ${TIGHT_AT_LG} text-left`}>
                    Entry page
                  </th>
                  <th scope="col" className={`${HEADER_CELL} ${TIGHT_AT_LG} ${WIDE} text-right`}>
                    Pages
                  </th>
                  <th scope="col" className={`${HEADER_CELL} ${WIDEST} text-left`}>
                    Highlights
                  </th>
                  <th scope="col" className={`${HEADER_CELL} ${TIGHT_AT_LG} ${WIDE} text-right`}>
                    Failed<span className="sr-only"> requests</span>
                  </th>
                  <th scope="col" className={`${HEADER_CELL} ${TIGHT_AT_LG} ${WIDER} text-left`}>
                    Device
                  </th>
                  <th scope="col" className={`${HEADER_CELL} ${TIGHT_AT_LG} ${WIDER} text-left`}>
                    Channel
                  </th>
                  <th scope="col" className={`${HEADER_CELL} pr-0 text-left`}>
                    Account
                  </th>
                </tr>
              </thead>
              <tbody>
                {allPages.flatMap((page, index) =>
                  page.map((row, position) => (
                    <VisitTableRow
                      key={row.key}
                      row={row}
                      timelinePath={timelinePath}
                      firstOfPage={position === 0 ? index : undefined}
                    />
                  )),
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
      {cursor === null && pages.length > 0 ? (
        <p className="text-[13px] text-muted">That is every visit of this period.</p>
      ) : null}
      {cursor === null ? null : (
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={busy}
            aria-busy={busy}
            onClick={() => {
              load(cursor);
            }}
            className={`min-h-11 rounded-input px-4 text-sm font-medium ${BUTTON_SECONDARY} ${CONTROL_BUSY}`}
          >
            {busy ? 'Loading older visits…' : 'Load older visits'}
          </button>
          {error === null ? null : (
            <p role="alert" className="text-[13px] text-bad">
              Could not load older visits. Try again.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
