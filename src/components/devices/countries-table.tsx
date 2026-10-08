import { countryCode, countsConversions, type ShareRow } from '@/domain/devices';
import type { I18n } from '@/i18n/i18n';
import {
  BODY_CELL,
  HEADER_CELL,
  PANEL,
  PANEL_TITLE,
  TABLE_SCROLL,
} from '@/components/ui/panel-classes';
import { VisitsLink } from '@/components/ui/visits-link';

export interface CountriesTableProps {
  readonly rows: readonly ShareRow[];
  readonly withConversionRate?: boolean;
  readonly visitsHref?: (country: string) => string | null;
  readonly i18n: I18n;
}

const NO_VISITS_LINK = () => null;

interface CountryNameProps {
  readonly label: string;
  readonly href: string | null;
  readonly purpose: string;
}

function CountryName({ label, href, purpose }: CountryNameProps) {
  return href === null ? label : <VisitsLink href={href} label={label} purpose={purpose} />;
}

export function CountriesTable({
  rows,
  withConversionRate = false,
  visitsHref = NO_VISITS_LINK,
  i18n,
}: CountriesTableProps) {
  const showsConversionRate = withConversionRate && countsConversions(rows);
  return (
    <section aria-labelledby="countries-heading" className={PANEL}>
      <h2 id="countries-heading" className={PANEL_TITLE}>
        {i18n.t('devices.countries')}
      </h2>
      <div className={TABLE_SCROLL}>
        <table
          aria-labelledby="countries-heading"
          className="w-full border-collapse text-caption tabular-nums"
        >
          <thead>
            <tr>
              <th scope="col" className={`${HEADER_CELL} pl-0 text-left`}>
                {i18n.t('devices.columns.country')}
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
              <tr key={row.value}>
                <th scope="row" className={`${BODY_CELL} pl-0 text-left font-medium`}>
                  <span className="flex items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      className="hidden min-w-7.5 rounded-chip bg-soft py-0.5 text-center font-mono text-micro font-semibold sm:inline-block"
                    >
                      {countryCode(row.value)}
                    </span>
                    <CountryName
                      label={row.label}
                      href={visitsHref(row.value)}
                      purpose={i18n.t('visitsLink.purpose')}
                    />
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
