import { countryCode, type ShareRow } from '@/domain/devices';
import { BODY_CELL, HEADER_CELL, PANEL, PANEL_TITLE } from '@/components/ui/panel-classes';

export interface CountriesTableProps {
  readonly rows: readonly ShareRow[];
}

export function CountriesTable({ rows }: CountriesTableProps) {
  return (
    <section aria-labelledby="countries-heading" className={PANEL}>
      <h2 id="countries-heading" className={PANEL_TITLE}>
        Countries
      </h2>
      <table
        aria-labelledby="countries-heading"
        className="w-full border-collapse text-[13px] tabular-nums"
      >
        <thead>
          <tr>
            <th scope="col" className={`${HEADER_CELL} pl-0 text-left`}>
              Country
            </th>
            <th scope="col" className={`${HEADER_CELL} text-right`}>
              Visits
            </th>
            <th scope="col" className={`${HEADER_CELL} pr-0 text-right`}>
              Share
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.value}>
              <th scope="row" className={`${BODY_CELL} pl-0 text-left font-medium`}>
                <span className="flex items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className="inline-block min-w-7.5 rounded-chip bg-soft py-0.5 text-center font-mono text-[11px] font-semibold"
                  >
                    {countryCode(row.value)}
                  </span>
                  {row.label}
                </span>
              </th>
              <td className={`${BODY_CELL} text-right`}>{row.visits}</td>
              <td className={`${BODY_CELL} pr-0 text-right text-muted`}>{row.share}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
