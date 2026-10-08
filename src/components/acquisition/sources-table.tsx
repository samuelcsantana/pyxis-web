import { type Channel, CHANNEL_LABELS, type SourceRow } from '@/domain/acquisition';
import { NO_VALUE } from '@/domain/metrics';
import { BODY_CELL, HEADER_CELL, PANEL, PANEL_TITLE } from '@/components/ui/panel-classes';
import { VisitsLink } from '@/components/ui/visits-link';
import { CHANNEL_COLORS } from './channel-colors';

export interface SourcesTableProps {
  readonly rows: readonly SourceRow[];
  readonly channelVisitsHref: (channel: Channel) => string;
}

function ConversionColumns() {
  return (
    <>
      <th scope="col" className={`${HEADER_CELL} hidden text-right sm:table-cell`}>
        Conversions
      </th>
      <th scope="col" className={`${HEADER_CELL} pr-0 text-right sm:w-52 sm:text-left`}>
        Conversion rate
      </th>
    </>
  );
}

function ConversionCells({ row }: { readonly row: SourceRow }) {
  return (
    <>
      <td className={`${BODY_CELL} hidden text-right sm:table-cell`}>{row.conversions}</td>
      <td className={`${BODY_CELL} pr-0`}>
        <span className="flex items-center justify-end gap-2.5">
          <span aria-hidden="true" className="hidden h-1.5 grow rounded-pill bg-soft sm:block">
            <span className="block h-1.5 rounded-pill bg-ok" style={{ width: row.barWidth }} />
          </span>
          <span className="flex flex-col items-end gap-0.5 text-right sm:w-12">
            <span className="font-semibold">{row.conversionRate}</span>
            {row.conversions === null ? null : (
              <span className="text-xs whitespace-nowrap text-muted sm:hidden">
                {row.conversions} converted
              </span>
            )}
          </span>
        </span>
      </td>
    </>
  );
}

export function SourcesTable({ rows, channelVisitsHref }: SourcesTableProps) {
  const countsConversions = rows.some((row) => row.conversionRate !== null);
  return (
    <section aria-labelledby="sources-heading" className={PANEL}>
      <div className="flex flex-col gap-1">
        <h2 id="sources-heading" className={PANEL_TITLE}>
          Sources
        </h2>
        <p className="text-caption text-muted">
          The campaign source, else the referring site, of the first page of each visit
        </p>
      </div>
      {rows.length === 0 ? (
        <p className="text-caption text-muted">No visits with a source in this period.</p>
      ) : (
        <table
          aria-labelledby="sources-heading"
          className="w-full border-collapse text-caption tabular-nums"
        >
          <thead>
            <tr>
              <th scope="col" className={`${HEADER_CELL} pl-0 text-left`}>
                Source
              </th>
              <th scope="col" className={`${HEADER_CELL} hidden text-left sm:table-cell`}>
                Medium
              </th>
              <th scope="col" className={`${HEADER_CELL} text-right`}>
                Visits
              </th>
              {countsConversions ? <ConversionColumns /> : null}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key}>
                <th scope="row" className={`${BODY_CELL} pl-0 text-left font-medium`}>
                  <span className="flex items-start gap-2.5">
                    <span
                      aria-hidden="true"
                      className={`mt-1 size-2.5 shrink-0 rounded-[3px] ${CHANNEL_COLORS[row.channel].swatch}`}
                    />
                    <span className="flex min-w-0 flex-col gap-1">
                      <span className="wrap-anywhere">{row.label}</span>
                      <span className="flex flex-wrap items-center gap-1.5 text-xs font-normal text-muted">
                        <VisitsLink
                          href={channelVisitsHref(row.channel)}
                          label={CHANNEL_LABELS[row.channel]}
                        />
                        {row.medium === null ? null : (
                          <span className="font-mono sm:hidden">{row.medium}</span>
                        )}
                        {row.fromAdClicks === null ? null : (
                          <span className="rounded-pill bg-warn-soft px-2 py-0.5 text-micro font-semibold text-warn">
                            {row.fromAdClicks}
                          </span>
                        )}
                      </span>
                    </span>
                  </span>
                </th>
                <td className={`${BODY_CELL} hidden font-mono text-xs text-muted sm:table-cell`}>
                  {row.medium ?? NO_VALUE}
                </td>
                <td className={`${BODY_CELL} text-right font-semibold`}>{row.visits}</td>
                {countsConversions ? <ConversionCells row={row} /> : null}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
