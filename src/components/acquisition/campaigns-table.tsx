import type { CampaignRow } from '@/domain/acquisition';
import { NO_VALUE } from '@/domain/metrics';
import type { I18n } from '@/i18n/i18n';
import {
  BODY_CELL,
  HEADER_CELL,
  PANEL,
  PANEL_TITLE,
  TABLE_SCROLL,
} from '@/components/ui/panel-classes';
import { VisitsLink } from '@/components/ui/visits-link';
import { CHANNEL_COLORS } from './channel-colors';
import { ConversionCells, ConversionColumns } from './conversion-columns';

export interface CampaignsTableProps {
  readonly rows: readonly CampaignRow[];
  readonly campaignVisitsHref: (row: CampaignRow) => string;
  readonly i18n: I18n;
}

function CampaignCell({
  row,
  href,
  i18n,
}: {
  readonly row: CampaignRow;
  readonly href: string;
  readonly i18n: I18n;
}) {
  return (
    <span className="flex items-start gap-2.5">
      <span
        aria-hidden="true"
        className={`mt-1 size-2.5 shrink-0 rounded-[3px] ${CHANNEL_COLORS[row.channel].swatch}`}
      />
      <span className="flex min-w-0 flex-col gap-1">
        <VisitsLink
          href={href}
          label={row.campaign}
          purpose={i18n.t('acquisition.campaigns.visitsLinkPurpose', { source: row.sourceLabel })}
        />
        <span className="flex flex-wrap items-center gap-1.5 text-xs font-normal text-muted">
          <span className="wrap-anywhere sm:hidden">{row.sourceLabel}</span>
          {row.medium === null ? null : <span className="font-mono sm:hidden">{row.medium}</span>}
          {row.fromAdClicks === null ? null : (
            <span className="rounded-pill bg-warn-soft px-2 py-0.5 text-micro font-semibold text-warn">
              {row.fromAdClicks}
            </span>
          )}
        </span>
      </span>
    </span>
  );
}

export function CampaignsTable({ rows, campaignVisitsHref, i18n }: CampaignsTableProps) {
  const countsConversions = rows.some((row) => row.conversionRate !== null);
  return (
    <section aria-labelledby="campaigns-heading" className={PANEL}>
      <div className="flex flex-col gap-1">
        <h2 id="campaigns-heading" className={PANEL_TITLE}>
          {i18n.t('acquisition.campaigns.title')}
        </h2>
        <p className="text-caption text-muted">{i18n.t('acquisition.campaigns.description')}</p>
      </div>
      {rows.length === 0 ? (
        <p className="text-caption text-muted">{i18n.t('acquisition.campaigns.empty')}</p>
      ) : (
        <div className={TABLE_SCROLL}>
          <table
            aria-labelledby="campaigns-heading"
            className="w-full border-collapse text-caption tabular-nums"
          >
            <thead>
              <tr>
                <th scope="col" className={`${HEADER_CELL} pl-0 text-left`}>
                  {i18n.t('acquisition.campaigns.campaign')}
                </th>
                <th scope="col" className={`${HEADER_CELL} hidden text-left sm:table-cell`}>
                  {i18n.t('acquisition.campaigns.source')}
                </th>
                <th scope="col" className={`${HEADER_CELL} text-right`}>
                  {i18n.t('acquisition.campaigns.visits')}
                </th>
                {countsConversions ? <ConversionColumns i18n={i18n} /> : null}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.key}>
                  <th scope="row" className={`${BODY_CELL} pl-0 text-left font-medium`}>
                    <CampaignCell row={row} href={campaignVisitsHref(row)} i18n={i18n} />
                  </th>
                  <td className={`${BODY_CELL} hidden sm:table-cell`}>
                    <span className="flex flex-col gap-0.5">
                      <span className="wrap-anywhere">{row.sourceLabel}</span>
                      <span className="font-mono text-xs text-muted">{row.medium ?? NO_VALUE}</span>
                    </span>
                  </td>
                  <td className={`${BODY_CELL} text-right font-semibold`}>{row.visits}</td>
                  {countsConversions ? <ConversionCells row={row} i18n={i18n} /> : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
