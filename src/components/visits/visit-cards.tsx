import { NO_VALUE } from '@/domain/metrics';
import type { VisitRow } from '@/domain/visits';
import { AccountCell, EntryPath, FAILED_CHIP, Highlights, VisitStartLink } from './visit-cells';

export interface VisitCardsProps {
  readonly pages: readonly (readonly VisitRow[])[];
  readonly timelinePath: string;
  readonly labelledBy: string;
}

function FailedRequests({ row }: { row: VisitRow }) {
  return row.failedRequests === 0 ? (
    <span className="text-muted">{row.failedRequestsLabel}</span>
  ) : (
    <span className={FAILED_CHIP}>{row.failedRequestsLabel}</span>
  );
}

function VisitCard({
  row,
  timelinePath,
  firstOfPage,
}: {
  row: VisitRow;
  timelinePath: string;
  firstOfPage: number | undefined;
}) {
  return (
    <li
      data-first-of-page={firstOfPage}
      className="flex flex-col gap-2 border-b border-line py-3 first:pt-0 last:border-b-0"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <VisitStartLink row={row} timelinePath={timelinePath} />
        <span className="text-muted">{row.duration}</span>
      </div>
      <p className="font-mono text-xs wrap-anywhere">
        <EntryPath path={row.entryPath} />
      </p>
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span>{row.pagesLabel}</span>
        <FailedRequests row={row} />
      </p>
      {row.highlights.length === 0 ? null : <Highlights labels={row.highlights} />}
      <p className="text-muted">{row.device}</p>
      <p className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <span className="text-muted">Channel: {row.channel ?? NO_VALUE}</span>
        <AccountCell account={row.account} timelinePath={timelinePath} />
      </p>
    </li>
  );
}

export function VisitCards({ pages, timelinePath, labelledBy }: VisitCardsProps) {
  return (
    <ul aria-labelledby={labelledBy} className="flex flex-col text-[13px] sm:hidden">
      {pages.flatMap((page, index) =>
        page.map((row, position) => (
          <VisitCard
            key={row.key}
            row={row}
            timelinePath={timelinePath}
            firstOfPage={position === 0 ? index : undefined}
          />
        )),
      )}
    </ul>
  );
}
