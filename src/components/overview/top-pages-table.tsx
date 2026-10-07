import Link from 'next/link';
import { barWidth, formatCount, formatPercent, rate } from '@/domain/metrics';
import type { OverviewReport } from '@/domain/overview';
import {
  BAR_FILL,
  BAR_TRACK,
  BODY_CELL,
  HEADER_CELL,
  PANEL,
  PANEL_TITLE,
  ROW_LINK,
} from '@/components/ui/panel-classes';

export interface TopPagesTableProps {
  readonly pages: OverviewReport['topPages'];
  readonly totalPageViews: number;
  readonly visitsHref: (path: string) => string;
}

export function TopPagesTable({ pages, totalPageViews, visitsHref }: TopPagesTableProps) {
  const mostViews = Math.max(0, ...pages.map((page) => page.views));
  return (
    <section aria-labelledby="top-pages-heading" className={PANEL}>
      <h2 id="top-pages-heading" className={PANEL_TITLE}>
        Top pages
      </h2>
      {pages.length === 0 ? (
        <p className="text-[13px] text-muted">No page views in this period.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px] tabular-nums">
            <thead>
              <tr>
                <th scope="col" className={`${HEADER_CELL} pl-0 text-left`}>
                  Page
                </th>
                <th scope="col" className={`${HEADER_CELL} text-right`}>
                  Views
                </th>
                <th scope="col" className={`${HEADER_CELL} hidden text-right sm:table-cell`}>
                  Visits
                </th>
                <th
                  scope="col"
                  className={`${HEADER_CELL} hidden w-36 pr-0 text-left sm:table-cell`}
                >
                  Share of views
                </th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr key={page.path}>
                  <th
                    scope="row"
                    className={`${BODY_CELL} pl-0 text-left font-mono text-xs font-normal wrap-anywhere`}
                  >
                    <Link
                      href={visitsHref(page.path)}
                      aria-label={`See the visits that opened ${page.path}`}
                      className={ROW_LINK}
                    >
                      {page.path}
                    </Link>
                  </th>
                  <td className={`${BODY_CELL} text-right`}>{formatCount(page.views)}</td>
                  <td className={`${BODY_CELL} hidden text-right text-muted sm:table-cell`}>
                    {formatCount(page.visits)}
                  </td>
                  <td className={`${BODY_CELL} hidden pr-0 sm:table-cell`}>
                    <span className="flex items-center gap-2">
                      <span aria-hidden="true" className={`${BAR_TRACK} grow`}>
                        <span
                          className={`${BAR_FILL} bg-sky`}
                          style={{ width: barWidth(page.views, mostViews) }}
                        />
                      </span>
                      <span className="w-10 text-right text-xs text-muted">
                        {formatPercent(rate(page.views, totalPageViews))}
                      </span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
