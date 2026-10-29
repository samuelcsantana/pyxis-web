import { type CityFilterValue, type CityRow, countsConversions } from '@/domain/devices';
import { FRESH_HIGHLIGHT, FreshCount } from '@/components/ui/fresh-slots';
import type { I18n } from '@/i18n/i18n';
import {
  BODY_CELL,
  HEADER_CELL,
  PANEL,
  PANEL_TITLE,
  TABLE_SCROLL,
} from '@/components/ui/panel-classes';
import { VisitsLink } from '@/components/ui/visits-link';
import type { RowFilter } from '@/components/ui/row-filter-link';

export interface CitiesTableProps {
  readonly rows: readonly CityRow[];
  readonly withConversionRate?: boolean;
  readonly visitsHref?: (city: CityFilterValue) => string | null;
  readonly filterOf?: (city: CityFilterValue) => RowFilter | null;
  readonly i18n: I18n;
}

const NO_VISITS_LINK = () => null;
const NO_ROW_FILTER = () => null;

interface CityNameProps {
  readonly row: CityRow;
  readonly visitsHref: (city: CityFilterValue) => string | null;
  readonly filterOf: (city: CityFilterValue) => RowFilter | null;
  readonly purpose: string;
}

function CityName({ row, visitsHref, filterOf, purpose }: CityNameProps) {
  const href = row.filterValue === null ? null : visitsHref(row.filterValue);
  if (href === null || row.filterValue === null) {
    return row.label;
  }
  return (
    <VisitsLink
      href={href}
      label={row.label}
      purpose={purpose}
      filter={filterOf(row.filterValue)}
    />
  );
}

export function CitiesTable({
  rows,
  withConversionRate = false,
  visitsHref = NO_VISITS_LINK,
  filterOf = NO_ROW_FILTER,
  i18n,
}: CitiesTableProps) {
  const showsConversionRate = withConversionRate && countsConversions(rows);
  return (
    <section aria-labelledby="cities-heading" className={PANEL}>
      <h2 id="cities-heading" className={PANEL_TITLE}>
        {i18n.t('devices.cities')}
      </h2>
      <div className={TABLE_SCROLL}>
        <table
          aria-labelledby="cities-heading"
          className="w-full border-collapse text-caption tabular-nums"
        >
          <thead>
            <tr>
              <th scope="col" className={`${HEADER_CELL} pl-0 text-left`}>
                {i18n.t('devices.columns.city')}
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
              <tr key={row.key} className={FRESH_HIGHLIGHT}>
                <th scope="row" className={`${BODY_CELL} pl-0 text-left font-medium`}>
                  <span className="flex min-w-0 flex-wrap items-baseline gap-x-1.5">
                    <CityName
                      row={row}
                      visitsHref={visitsHref}
                      filterOf={filterOf}
                      purpose={i18n.t('visitsLink.purpose')}
                    />
                    {row.place === null ? null : (
                      <span className="font-normal text-muted">{row.place}</span>
                    )}
                  </span>
                </th>
                <td className={`${BODY_CELL} text-right`}>
                  <FreshCount item={`city:${row.key}`} value={row.counted} className="mr-1.5" />
                  {row.visits}
                </td>
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
