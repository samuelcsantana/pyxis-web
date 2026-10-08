import type { ReactNode } from 'react';
import type { FeatureKind, FeatureRow } from '@/domain/features';
import { Sparkline } from '@/components/ui/sparkline';
import { BAR_FILL, BAR_TRACK, BODY_CELL } from '@/components/ui/panel-classes';
import { Breakable } from '@/components/ui/breakable';
import { VisitsLink } from '@/components/ui/visits-link';

const TREND_BOX = { width: 96, height: 28, inset: 3 } as const;

export const FEATURE_COLUMNS = 5;

export interface FeatureRowCellsProps {
  readonly kind: FeatureKind;
  readonly row: FeatureRow;
  readonly visitsHref: string;
  readonly visitsPurpose: string;
  readonly disclosure?: ReactNode;
}

export function FeatureRowCells({
  kind,
  row,
  visitsHref,
  visitsPurpose,
  disclosure,
}: FeatureRowCellsProps) {
  return (
    <>
      <th scope="row" className={`${BODY_CELL} pl-0 text-left font-medium`}>
        <span className="flex items-start gap-2">
          {disclosure}
          <span className="flex min-w-0 flex-col">
            <VisitsLink
              href={visitsHref}
              label={row.label}
              purpose={visitsPurpose}
              className={`w-fit ${kind === 'screens' ? 'font-mono text-xs wrap-anywhere' : ''}`}
            />
            {kind === 'events' ? (
              <span className="font-mono text-xs font-normal text-muted wrap-anywhere">
                <Breakable text={row.name} />
              </span>
            ) : null}
          </span>
        </span>
      </th>
      <td className={`${BODY_CELL} text-right font-semibold`}>{row.count}</td>
      <td className={`${BODY_CELL} hidden text-right text-muted sm:table-cell`}>{row.visits}</td>
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
    </>
  );
}
