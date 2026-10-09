import { Breakable } from '@/components/ui/breakable';
import {
  BAR_FILL,
  BAR_TRACK,
  BODY_CELL,
  HEADER_CELL,
  PANEL,
  PANEL_TITLE,
} from '@/components/ui/panel-classes';
import {
  type EngagementReport,
  engagementSummary,
  medianVisitLabel,
  singlePageShare,
  visitLengthRows,
} from '@/domain/engagement';
import { formatCount } from '@/domain/metrics';
import type { I18n } from '@/i18n/i18n';

export interface EngagementPanelsProps {
  readonly report: EngagementReport;
  readonly periodLabel: string;
  readonly i18n: I18n;
}

interface PageRow {
  readonly path: string;
  readonly visits: number;
  readonly singlePageVisits?: number;
}

interface PagesTableProps {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly rows: readonly PageRow[];
  readonly withSinglePage: boolean;
  readonly i18n: I18n;
}

const NUMBER_CELL = `${BODY_CELL} text-right tabular-nums`;

function PagesTable({ id, title, description, rows, withSinglePage, i18n }: PagesTableProps) {
  return (
    <section aria-labelledby={`${id}-heading`} className={PANEL}>
      <div className="flex flex-col gap-1">
        <h2 id={`${id}-heading`} className={PANEL_TITLE}>
          {title}
        </h2>
        <p className="text-caption text-muted">{description}</p>
      </div>
      {rows.length === 0 ? (
        <p className="text-sm">{i18n.t('engagement.noPages')}</p>
      ) : (
        <table aria-labelledby={`${id}-heading`} className="w-full text-sm">
          <thead>
            <tr>
              <th scope="col" className={`${HEADER_CELL} text-left`}>
                {i18n.t('engagement.page')}
              </th>
              <th scope="col" className={`${HEADER_CELL} text-right`}>
                {i18n.t('engagement.visits')}
              </th>
              {withSinglePage ? (
                <th scope="col" className={`${HEADER_CELL} text-right`}>
                  {i18n.t('engagement.singlePage')}
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.path}>
                <th scope="row" className={`${BODY_CELL} text-left font-mono font-normal`}>
                  <Breakable text={row.path} />
                </th>
                <td className={NUMBER_CELL}>{formatCount(row.visits, i18n)}</td>
                {row.singlePageVisits === undefined ? null : (
                  <td className={NUMBER_CELL}>{formatCount(row.singlePageVisits, i18n)}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

function VisitLengthPanel({ report, periodLabel, i18n }: EngagementPanelsProps) {
  const rows = visitLengthRows(report, i18n);
  return (
    <section aria-labelledby="visit-length-heading" className={PANEL}>
      <div className="flex flex-col gap-1">
        <h2 id="visit-length-heading" className={PANEL_TITLE}>
          {i18n.t('engagement.lengthTitle')}
        </h2>
        <p className="text-caption text-muted">
          {i18n.t('engagement.lengthDescription', { period: periodLabel })}
        </p>
      </div>
      <dl className="flex flex-wrap gap-x-8 gap-y-2">
        <div className="flex flex-col gap-0.5">
          <dt className="text-xs text-muted">{i18n.t('engagement.medianLabel')}</dt>
          <dd className="text-title font-semibold tabular-nums">
            {medianVisitLabel(report, i18n)}
          </dd>
        </div>
        <div className="flex flex-col gap-0.5">
          <dt className="text-xs text-muted">{i18n.t('engagement.singlePageLabel')}</dt>
          <dd className="text-title font-semibold tabular-nums">
            {i18n.format.percent(singlePageShare(report))}
          </dd>
        </div>
      </dl>
      <table aria-label={engagementSummary(report, i18n)} className="w-full text-sm">
        <thead>
          <tr>
            <th scope="col" className={`${HEADER_CELL} text-left`}>
              {i18n.t('engagement.length')}
            </th>
            <th scope="col" className={`${HEADER_CELL} hidden sm:table-cell`}>
              <span className="sr-only">{i18n.t('engagement.share')}</span>
            </th>
            <th scope="col" className={`${HEADER_CELL} text-right`}>
              {i18n.t('engagement.visits')}
            </th>
            <th scope="col" className={`${HEADER_CELL} text-right`}>
              {i18n.t('engagement.share')}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row" className={`${BODY_CELL} text-left font-normal`}>
                {row.label}
              </th>
              <td className={`${BODY_CELL} hidden w-1/2 sm:table-cell`}>
                <span aria-hidden="true" className={`${BAR_TRACK} flex`}>
                  <span className={`${BAR_FILL} bg-sky`} style={{ width: row.barWidth }} />
                </span>
              </td>
              <td className={NUMBER_CELL}>{formatCount(row.visits, i18n)}</td>
              <td className={NUMBER_CELL}>{i18n.format.percent(row.share)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export function EngagementPanels({ report, periodLabel, i18n }: EngagementPanelsProps) {
  return (
    <div className="grid gap-3.5 sm:gap-4 xl:grid-cols-2">
      <PagesTable
        id="entry-pages"
        title={i18n.t('engagement.entryTitle')}
        description={i18n.t('engagement.entryDescription', { period: periodLabel })}
        rows={report.entryPages}
        withSinglePage
        i18n={i18n}
      />
      <PagesTable
        id="exit-pages"
        title={i18n.t('engagement.exitTitle')}
        description={i18n.t('engagement.exitDescription', { period: periodLabel })}
        rows={report.exitPages}
        withSinglePage={false}
        i18n={i18n}
      />
      <div className="xl:col-span-2">
        <VisitLengthPanel report={report} periodLabel={periodLabel} i18n={i18n} />
      </div>
    </div>
  );
}
