import type { FeatureKind, FeatureRow } from '@/domain/features';
import { Sparkline } from '@/components/ui/sparkline';
import {
  BAR_FILL,
  BAR_TRACK,
  BODY_CELL,
  HEADER_CELL,
  PANEL,
  PANEL_TITLE,
} from '@/components/ui/panel-classes';

const TREND_BOX = { width: 96, height: 28, inset: 3 } as const;

const TITLES: Readonly<Record<FeatureKind, string>> = {
  events: 'Most used events',
  screens: 'Most visited screens',
};

const NAME_HEADERS: Readonly<Record<FeatureKind, string>> = {
  events: 'Event',
  screens: 'Screen',
};

const NOTHING_YET: Readonly<Record<FeatureKind, string>> = {
  events: 'No named events in this period. Events sent with track() show up here.',
  screens: 'No page views in this period.',
};

export interface FeatureTableProps {
  readonly kind: FeatureKind;
  readonly rows: readonly FeatureRow[];
  readonly query: string;
}

function emptyMessage(kind: FeatureKind, query: string): string {
  return query === '' ? NOTHING_YET[kind] : `Nothing matches “${query}”.`;
}

export function FeatureTable({ kind, rows, query }: FeatureTableProps) {
  return (
    <section aria-labelledby="features-heading" className={PANEL}>
      <h2 id="features-heading" className={PANEL_TITLE}>
        {TITLES[kind]}
      </h2>
      {rows.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted">{emptyMessage(kind, query)}</p>
      ) : (
        <table
          aria-labelledby="features-heading"
          className="w-full border-collapse text-[13px] tabular-nums"
        >
          <thead>
            <tr>
              <th scope="col" className={`${HEADER_CELL} pl-0 text-left`}>
                {NAME_HEADERS[kind]}
              </th>
              <th scope="col" className={`${HEADER_CELL} text-right`}>
                Count
              </th>
              <th scope="col" className={`${HEADER_CELL} hidden text-right sm:table-cell`}>
                Visits
              </th>
              <th scope="col" className={`${HEADER_CELL} hidden text-left md:table-cell`}>
                Trend
              </th>
              <th scope="col" className={`${HEADER_CELL} pr-0 text-right sm:w-52 sm:text-left`}>
                Share
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name}>
                <th scope="row" className={`${BODY_CELL} pl-0 text-left font-medium`}>
                  <span className="flex min-w-0 flex-col">
                    <span className={kind === 'screens' ? 'font-mono text-xs wrap-anywhere' : ''}>
                      {row.label}
                    </span>
                    {kind === 'events' ? (
                      <span className="font-mono text-xs font-normal text-muted wrap-anywhere">
                        {row.name}
                      </span>
                    ) : null}
                  </span>
                </th>
                <td className={`${BODY_CELL} text-right font-semibold`}>{row.count}</td>
                <td className={`${BODY_CELL} hidden text-right text-muted sm:table-cell`}>
                  {row.visits}
                </td>
                <td className={`${BODY_CELL} hidden md:table-cell`}>
                  <Sparkline
                    values={row.daily}
                    box={TREND_BOX}
                    width={TREND_BOX.width}
                    strokeClass="stroke-violet"
                    strokeWidth={1.8}
                  />
                </td>
                <td className={`${BODY_CELL} pr-0`}>
                  <span className="flex items-center justify-end gap-2.5">
                    <span aria-hidden="true" className={`${BAR_TRACK} hidden grow sm:block`}>
                      <span className={`${BAR_FILL} bg-violet`} style={{ width: row.barWidth }} />
                    </span>
                    <span className="w-11 text-right text-xs text-muted">{row.share}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
