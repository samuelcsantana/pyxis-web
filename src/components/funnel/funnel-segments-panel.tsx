import { FOCUS_RING } from '@/components/ui/control-classes';
import { LinkTabs } from '@/components/ui/link-tabs';
import {
  BAR_FILL,
  BAR_TRACK,
  BODY_CELL,
  HEADER_CELL,
  PANEL,
  PANEL_TITLE,
  TABLE_SCROLL,
} from '@/components/ui/panel-classes';
import {
  FUNNEL_SEGMENT_DIMENSIONS,
  type FunnelSegmentDimension,
  type FunnelSegmentsReport,
  segmentRows,
} from '@/domain/funnel-segments';
import { formatCount } from '@/domain/metrics';
import type { I18n } from '@/i18n/i18n';

export interface FunnelSegmentsPanelProps {
  readonly by: FunnelSegmentDimension;
  readonly report: FunnelSegmentsReport | null;
  readonly stepCount: number;
  readonly periodLabel: string;
  readonly hrefOf: (by: FunnelSegmentDimension) => string;
  readonly i18n: I18n;
}

const HEADING_ID = 'funnel-segments-heading';
const NUMBER_CELL = `${BODY_CELL} text-right tabular-nums`;

function SegmentsTable({
  report,
  stepCount,
  i18n,
}: {
  readonly report: FunnelSegmentsReport;
  readonly stepCount: number;
  readonly i18n: I18n;
}) {
  const rows = segmentRows(report, i18n);
  if (rows.length === 0) {
    return <p className="text-sm">{i18n.t('funnelSegments.empty')}</p>;
  }
  return (
    <div
      role="region"
      aria-label={i18n.t('funnelSegments.table')}
      tabIndex={0}
      className={`${TABLE_SCROLL} ${FOCUS_RING}`}
    >
      <table aria-labelledby={HEADING_ID} className="w-full text-sm">
        <thead>
          <tr>
            <th scope="col" className={`${HEADER_CELL} text-left`}>
              {i18n.t('funnelSegments.segment')}
            </th>
            {Array.from({ length: stepCount }, (_, index) => (
              <th key={index} scope="col" className={`${HEADER_CELL} text-right`}>
                {i18n.t('funnelSegments.step', { number: String(index + 1) })}
              </th>
            ))}
            <th scope="col" className={`${HEADER_CELL} text-right`}>
              {i18n.t('funnelSegments.conversion')}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key}>
              <th scope="row" className={`${BODY_CELL} text-left font-medium`}>
                {row.label}
              </th>
              {row.cells.map((cell, index) => (
                <td key={index} className={NUMBER_CELL}>
                  <span className="flex flex-col items-end gap-1">
                    {formatCount(cell.count, i18n)}
                    <span aria-hidden="true" className={`${BAR_TRACK} flex w-full min-w-12`}>
                      <span className={`${BAR_FILL} bg-sky`} style={{ width: cell.barWidth }} />
                    </span>
                  </span>
                </td>
              ))}
              <td className={NUMBER_CELL}>{i18n.format.percent(row.conversion)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function FunnelSegmentsPanel({
  by,
  report,
  stepCount,
  periodLabel,
  hrefOf,
  i18n,
}: FunnelSegmentsPanelProps) {
  const dimension = i18n.t(`funnelSegments.dimensions.${by}`);
  return (
    <section aria-labelledby={HEADING_ID} className={PANEL}>
      <div className="flex flex-col gap-1">
        <h2 id={HEADING_ID} className={PANEL_TITLE}>
          {i18n.t('funnelSegments.title', { by: dimension })}
        </h2>
        <p className="text-caption text-muted">
          {i18n.t('funnelSegments.description', { period: periodLabel, by: dimension })}
        </p>
      </div>
      <LinkTabs
        label={i18n.t('funnelSegments.label')}
        current={by}
        tabs={FUNNEL_SEGMENT_DIMENSIONS.map((dimensionKey) => ({
          key: dimensionKey,
          label: i18n.t(`funnelSegments.tabs.${dimensionKey}`),
          href: hrefOf(dimensionKey),
        }))}
      />
      {report === null ? (
        <p className="text-sm">{i18n.t('funnelSegments.userMode')}</p>
      ) : (
        <SegmentsTable report={report} stepCount={stepCount} i18n={i18n} />
      )}
    </section>
  );
}
