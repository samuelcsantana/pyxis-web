import { countryCode, countsConversions, type ShareRow } from '@/domain/devices';
import { BODY_CELL, HEADER_CELL, PANEL, PANEL_TITLE } from '@/components/ui/panel-classes';

export interface CountriesTableProps {
  readonly rows: readonly ShareRow[];
  readonly withConversionRate?: boolean;
}

export function CountriesTable({ rows, withConversionRate = false }: CountriesTableProps) {
  const showsConversionRate = withConversionRate && countsConversions(rows);
  return (
    <section aria-labelledby="countries-heading" className={PANEL}>
      <h2 id="countries-heading" className={PANEL_TITLE}>
        Countries
      </h2>
      <table
        aria-labelledby="countries-heading"
        className="w-full border-collapse text-caption tabular-nums"
      >
        <thead>
          <tr>
            <th scope="col" className={`${HEADER_CELL} pl-0 text-left`}>
              Country
            </th>
            <th scope="col" className={`${HEADER_CELL} text-right`}>
              Visits
            </th>
            <th scope="col" className={`${HEADER_CELL} text-right last:pr-0`}>
              Share
            </th>
            {showsConversionRate ? (
              <th scope="col" className={`${HEADER_CELL} pr-0 text-right`}>
                Conversion rate
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
                  {row.label}
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
    </section>
  );
}
