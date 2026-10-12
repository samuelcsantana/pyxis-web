import { countsConversions, type RegionRow } from '@/domain/devices';
import type { I18n } from '@/i18n/i18n';
import {
  BODY_CELL,
  HEADER_CELL,
  PANEL,
  PANEL_TITLE,
  TABLE_SCROLL,
} from '@/components/ui/panel-classes';
import { VisitsLink } from '@/components/ui/visits-link';

export interface RegionsTableProps {
  readonly rows: readonly RegionRow[];
  readonly withConversionRate?: boolean;
  readonly visitsHref?: (region: string) => string | null;
  readonly i18n: I18n;
}

const NO_VISITS_LINK = () => null;

interface RegionNameProps {
  readonly row: RegionRow;
  readonly visitsHref: (region: string) => string | null;
  readonly purpose: string;
}

function RegionName({ row, visitsHref, purpose }: RegionNameProps) {
  const href = row.filterValue === null ? null : visitsHref(row.filterValue);
  return href === null ? row.label : <VisitsLink href={href} label={row.label} purpose={purpose} />;
}

export function RegionsTable({
  rows,
  withConversionRate = false,
  visitsHref = NO_VISITS_LINK,
  i18n,
}: RegionsTableProps) {
  const showsConversionRate = withConversionRate && countsConversions(rows);
  return (
    <section aria-labelledby="regions-heading" className={PANEL}>
      <h2 id="regions-heading" className={PANEL_TITLE}>
        {i18n.t('devices.regions')}
      </h2>
      <div className={TABLE_SCROLL}>
        <table
          aria-labelledby="regions-heading"
          className="w-full border-collapse text-caption tabular-nums"
        >
          <thead>
            <tr>
              <th scope="col" className={`${HEADER_CELL} pl-0 text-left`}>
                {i18n.t('devices.columns.region')}
              </th>
              <th scope="col" className={`${HEADER_CELL} text-right`}>
                {i18n.t('devices.columns.visits')}
              </th>
              <th scope="col" className={`${HEADER_CELL} text-right last:pr-0`}>
                {i18n.t('devices.columns.share')}
              </th>
              {showsConversionRate ? (
                <th scope="col" className={`${HEADER_CELL} pr-0 text-right`}>
                  {i18n.t('devices.columns.conversionRate')}
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key}>
                <th scope="row" className={`${BODY_CELL} pl-0 text-left font-medium`}>
                  <span className="flex items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      className="hidden min-w-9 rounded-chip bg-soft px-1 py-0.5 text-center font-mono text-micro font-semibold sm:inline-block"
                    >
                      {row.code}
                    </span>
                    <span className="flex min-w-0 flex-wrap items-baseline gap-x-1.5">
                      <RegionName
                        row={row}
                        visitsHref={visitsHref}
                        purpose={i18n.t('visitsLink.purpose')}
                      />
                      {row.country === null ? null : (
                        <span className="font-normal text-muted">{row.country}</span>
                      )}
                    </span>
                  </span>
                </th>
                <td className={`${BODY_CELL} text-right`}>{row.visits}</td>
                <td className={`${BODY_CELL} text-right text-muted last:pr-0`}>{row.share}</td>
                {showsConversionRate ? (
                  <td className={`${BODY_CELL} pr-0 text-right`}>{row.conversionRate}</td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
