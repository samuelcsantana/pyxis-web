import { countsConversions, OTHER_VALUE, type ShareRow } from '@/domain/devices';
import { withDonutSegments } from '@/domain/donut';
import { PANEL, PANEL_TITLE } from '@/components/ui/panel-classes';
import { VisitsLink } from '@/components/ui/visits-link';

const SEGMENT_COLORS = [
  { stroke: 'stroke-sky', swatch: 'bg-sky' },
  { stroke: 'stroke-violet', swatch: 'bg-violet' },
  { stroke: 'stroke-accent', swatch: 'bg-accent' },
  { stroke: 'stroke-teal', swatch: 'bg-teal' },
  { stroke: 'stroke-ok', swatch: 'bg-ok' },
] as const;
const OTHER_COLOR = { stroke: 'stroke-slate', swatch: 'bg-slate' } as const;

const DONUT_SIZE = 132;
const DONUT_VIEW_BOX = '0 0 100 100';
const CENTER = 50;
const RADIUS = 40;
const RING_WIDTH = 14;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const START_AT_TOP = 'rotate(-90 50 50)';

export function segmentColor(row: ShareRow, index: number) {
  return row.value === OTHER_VALUE ? OTHER_COLOR : (SEGMENT_COLORS[index] ?? OTHER_COLOR);
}

export interface ShareDonutProps {
  readonly id: string;
  readonly title: string;
  readonly rows: readonly ShareRow[];
  readonly withConversionRate?: boolean;
  readonly visitsHref?: (value: string) => string | null;
}

const NO_VISITS_LINK = () => null;

function RowName({ label, href }: { readonly label: string; readonly href: string | null }) {
  return href === null ? label : <VisitsLink href={href} label={label} />;
}

export function ShareDonut({
  id,
  title,
  rows,
  withConversionRate = false,
  visitsHref = NO_VISITS_LINK,
}: ShareDonutProps) {
  const headingId = `${id}-heading`;
  const showsConversionRate = withConversionRate && countsConversions(rows);
  const drawn = withDonutSegments(
    rows.map((row, index) => ({ ...row, color: segmentColor(row, index) })),
    CIRCUMFERENCE,
  );
  return (
    <section aria-labelledby={headingId} className={`${PANEL} gap-4`}>
      <h2 id={headingId} className={PANEL_TITLE}>
        {title}
      </h2>
      <div className="flex flex-wrap items-center gap-5">
        <svg
          width={DONUT_SIZE}
          height={DONUT_SIZE}
          viewBox={DONUT_VIEW_BOX}
          aria-hidden="true"
          className="shrink-0"
        >
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            className="stroke-soft"
            strokeWidth={RING_WIDTH}
          />
          {drawn.map((segment) => (
            <circle
              key={segment.value}
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="none"
              className={segment.color.stroke}
              strokeWidth={RING_WIDTH}
              strokeDasharray={segment.dashArray}
              strokeDashoffset={segment.dashOffset}
              transform={START_AT_TOP}
            />
          ))}
        </svg>
        <table
          aria-labelledby={headingId}
          className={`min-w-0 flex-1 border-collapse text-caption tabular-nums ${showsConversionRate ? 'basis-60' : 'basis-40'}`}
        >
          <thead>
            <tr>
              <th scope="col" className="pb-1.5 text-left text-xs font-medium text-muted">
                {title}
              </th>
              <th scope="col" className="pb-1.5 text-right text-xs font-medium text-muted">
                Visits
              </th>
              <th scope="col" className="pb-1.5 pl-3 text-right text-xs font-medium text-muted">
                Share
              </th>
              {showsConversionRate ? (
                <th scope="col" className="pb-1.5 pl-3 text-right text-xs font-medium text-muted">
                  Conversion rate
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {drawn.map((row) => (
              <tr key={row.value}>
                <th scope="row" className="py-1 text-left font-normal">
                  <span className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className={`size-2.5 shrink-0 rounded-[3px] ${row.color.swatch}`}
                    />
                    <RowName label={row.label} href={visitsHref(row.value)} />
                  </span>
                </th>
                <td className="py-1 text-right text-muted">{row.visits}</td>
                <td className="py-1 pl-3 text-right font-semibold">{row.share}</td>
                {showsConversionRate ? (
                  <td className="py-1 pl-3 text-right">{row.conversionRate}</td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
