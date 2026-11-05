import { type GoalRow, goalsEarned } from '@/domain/goals';
import { barWidth, NO_VALUE } from '@/domain/metrics';
import type { I18n } from '@/i18n/i18n';
import { FRESH_HIGHLIGHT } from '@/components/ui/fresh-slots';
import {
  BAR_FILL,
  BAR_TRACK,
  BODY_CELL,
  HEADER_CELL,
  PANEL,
  PANEL_TITLE,
  TABLE_SCROLL,
} from '@/components/ui/panel-classes';
import type { RowFilter } from '@/components/ui/row-filter-link';
import { VisitsLink } from '@/components/ui/visits-link';

export interface GoalsTableProps {
  readonly rows: readonly GoalRow[];
  readonly visits: string;
  readonly periodLabel: string;
  readonly visitsHref: (goalId: string) => string;
  readonly filterOf: (row: GoalRow) => RowFilter | null;
  readonly i18n: I18n;
}

const HEADING_ID = 'goals-heading';
const FULL_BAR = 1;

export function GoalsTable({
  rows,
  visits,
  periodLabel,
  visitsHref,
  filterOf,
  i18n,
}: GoalsTableProps) {
  const withRevenue = goalsEarned(rows);
  return (
    <section aria-labelledby={HEADING_ID} className={PANEL}>
      <div className="flex flex-col gap-1">
        <h2 id={HEADING_ID} className={PANEL_TITLE}>
          {i18n.t('goals.table.title')}
        </h2>
        <p className="text-xs leading-[18px] text-muted">
          {i18n.t('goals.table.description', { period: periodLabel, visits })}
        </p>
      </div>
      <div className={TABLE_SCROLL}>
        <table
          aria-labelledby={HEADING_ID}
          className="w-full border-collapse text-caption tabular-nums"
        >
          <thead>
            <tr>
              <th scope="col" className={`${HEADER_CELL} pl-0 text-left`}>
                {i18n.t('goals.table.goal')}
              </th>
              <th scope="col" className={`${HEADER_CELL} text-right`}>
                {i18n.t('goals.table.convertingVisits')}
              </th>
              <th scope="col" className={`${HEADER_CELL} hidden text-right sm:table-cell`}>
                {i18n.t('goals.table.conversions')}
              </th>
              {withRevenue ? (
                <th scope="col" className={`${HEADER_CELL} text-right`}>
                  {i18n.t('goals.table.revenue')}
                </th>
              ) : null}
              <th scope="col" className={`${HEADER_CELL} w-40 pr-0 text-left`}>
                {i18n.t('goals.table.rate')}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className={FRESH_HIGHLIGHT}>
                <th scope="row" className={`${BODY_CELL} pl-0 text-left font-normal`}>
                  <span className="flex min-w-0 flex-col gap-0.5">
                    {row.reached ? (
                      <VisitsLink
                        href={visitsHref(row.id)}
                        label={row.name}
                        purpose={i18n.t('visitsLink.purpose')}
                        className="w-fit"
                        filter={filterOf(row)}
                      />
                    ) : (
                      <span className="font-medium wrap-anywhere">{row.name}</span>
                    )}
                    <span className="text-xs text-muted">
                      {i18n.t(row.kind === 'event' ? 'goals.kinds.event' : 'goals.kinds.page')}{' '}
                      <code className="font-mono wrap-anywhere">{row.target}</code>
                    </span>
                  </span>
                </th>
                <td className={`${BODY_CELL} text-right`}>{row.convertingVisits}</td>
                <td className={`${BODY_CELL} hidden text-right text-muted sm:table-cell`}>
                  {row.conversions}
                </td>
                {withRevenue ? (
                  <td className={`${BODY_CELL} text-right whitespace-nowrap`}>
                    {row.revenue ?? NO_VALUE}
                  </td>
                ) : null}
                <td className={`${BODY_CELL} pr-0`}>
                  <span className="flex items-center gap-2">
                    <span aria-hidden="true" className={`${BAR_TRACK} grow`}>
                      <span
                        className={`${BAR_FILL} bg-accent`}
                        style={{ width: barWidth(row.share, FULL_BAR) }}
                      />
                    </span>
                    <span className="w-12 text-right text-xs font-semibold">{row.rate}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
