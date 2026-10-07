'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { catchToState, withSmoothLoading } from 'rx-state-bridge';
import { defer, type Subscription, tap } from 'rxjs';
import { NO_VALUE } from '@/domain/metrics';
import type { VisitAccount, VisitRow, VisitRowsPage } from '@/domain/visits';
import { BODY_CELL, HEADER_CELL, PANEL, PANEL_TITLE } from '@/components/ui/panel-classes';
import { FOCUS_RING } from '@/components/ui/control-classes';
import { linkWith } from '@/components/shell/screens';

const SMOOTH_LOADING_MS = 400;
const LINK = `text-sky-ink underline underline-offset-2 hover:text-ink ${FOCUS_RING}`;
const CHIP = 'rounded-pill px-2 py-0.5 text-xs font-medium whitespace-nowrap';
const WIDE = 'hidden sm:table-cell';
const WIDEST = 'hidden lg:table-cell';

export interface VisitsTableProps {
  readonly rows: readonly VisitRow[];
  readonly nextCursor: string | null;
  readonly timelinePath: string;
  readonly emptyMessage: string;
  readonly loadOlder: (cursor: string) => Promise<VisitRowsPage>;
}

function timelineHref(timelinePath: string, lookup: Record<string, string>): string {
  return linkWith(timelinePath, lookup);
}

function AccountCell({
  account,
  timelinePath,
}: {
  account: VisitAccount | null;
  timelinePath: string;
}) {
  if (account === null) {
    return <span className="text-muted">anonymous</span>;
  }
  return (
    <Link
      href={timelineHref(timelinePath, { user: account.userId })}
      aria-label={`${account.userId}, open the timeline of this user`}
      className={`${LINK} font-mono text-xs`}
    >
      {account.shown}
    </Link>
  );
}

function Highlights({ labels }: { labels: readonly string[] }) {
  if (labels.length === 0) {
    return <span className="text-muted">{NO_VALUE}</span>;
  }
  return (
    <ul className="flex flex-wrap gap-1">
      {labels.map((label) => (
        <li key={label} className={`${CHIP} bg-soft text-ink`}>
          {label}
        </li>
      ))}
    </ul>
  );
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
        <Link
          href={timelineHref(timelinePath, { visit: row.key })}
          aria-label={`${row.started}, open visit ${row.visit}`}
          className={LINK}
        >
          <time dateTime={row.startedAt}>{row.started}</time>
        </Link>
      </th>
      <td className={`${BODY_CELL} ${WIDE} whitespace-nowrap text-muted`}>{row.duration}</td>
      <td className={`${BODY_CELL} font-mono text-xs wrap-anywhere`}>
        {row.entryPath ?? <span className="font-sans text-muted">{NO_VALUE}</span>}
      </td>
      <td className={`${BODY_CELL} ${WIDE} text-right`}>{row.pageViews}</td>
      <td className={`${BODY_CELL} ${WIDEST}`}>
        <Highlights labels={row.highlights} />
      </td>
      <td className={`${BODY_CELL} ${WIDE} text-right`}>
        {row.failedRequests === 0 ? (
          <span className="text-muted">0</span>
        ) : (
          <span className={`${CHIP} bg-bad-soft font-semibold text-bad`}>{row.failedRequests}</span>
        )}
      </td>
      <td className={`${BODY_CELL} ${WIDEST}`}>{row.device}</td>
      <td className={`${BODY_CELL} ${WIDEST}`}>
        {row.channel ?? <span className="text-muted">{NO_VALUE}</span>}
      </td>
      <td className={`${BODY_CELL} pr-0`}>
        <AccountCell account={row.account} timelinePath={timelinePath} />
      </td>
    </tr>
  );
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
  const table = useRef<HTMLTableElement>(null as unknown as HTMLTableElement);

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
    [...table.current.querySelectorAll<HTMLElement>(`[data-first-of-page="${String(page)}"] a`)]
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

  return (
    <section aria-labelledby="visits-heading" className={PANEL}>
      <h2 id="visits-heading" className={PANEL_TITLE}>
        Visits
      </h2>
      {rows.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted">{emptyMessage}</p>
      ) : (
        <div className="overflow-x-auto">
          <table
            ref={table}
            aria-labelledby="visits-heading"
            className="w-full border-collapse text-[13px] tabular-nums"
          >
            <thead>
              <tr>
                <th scope="col" className={`${HEADER_CELL} pl-0 text-left`}>
                  Started
                </th>
                <th scope="col" className={`${HEADER_CELL} ${WIDE} text-left`}>
                  Duration
                </th>
                <th scope="col" className={`${HEADER_CELL} text-left`}>
                  Entry page
                </th>
                <th scope="col" className={`${HEADER_CELL} ${WIDE} text-right`}>
                  Pages
                </th>
                <th scope="col" className={`${HEADER_CELL} ${WIDEST} text-left`}>
                  Highlights
                </th>
                <th scope="col" className={`${HEADER_CELL} ${WIDE} text-right`}>
                  Failed requests
                </th>
                <th scope="col" className={`${HEADER_CELL} ${WIDEST} text-left`}>
                  Device
                </th>
                <th scope="col" className={`${HEADER_CELL} ${WIDEST} text-left`}>
                  Channel
                </th>
                <th scope="col" className={`${HEADER_CELL} pr-0 text-left`}>
                  Account
                </th>
              </tr>
            </thead>
            <tbody>
              {[rows, ...pages].flatMap((page, index) =>
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
            className={`min-h-11 rounded-input border border-line bg-card px-4 text-sm font-medium text-ink hover:bg-soft ${FOCUS_RING} disabled:opacity-60`}
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
