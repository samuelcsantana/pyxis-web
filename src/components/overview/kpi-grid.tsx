import type { ReactNode } from 'react';
import type { KpiDrillDown, KpiId, KpiView } from '@/domain/overview';
import { KPI_COLORS } from '@/domain/overview-chart';
import type { I18n } from '@/i18n/i18n';
import { KpiCard } from './kpi-card';

export const KPI_TOGGLE_HINT_ID = 'kpi-toggle-hint';

const FOUR_ACROSS = 'grid grid-cols-2 gap-2.5 sm:gap-4 xl:grid-cols-4';
const FIVE_ACROSS =
  'grid grid-cols-2 gap-2.5 sm:gap-4 xl:grid-cols-5 max-xl:[&>:last-child]:col-span-full';
const FIVE_CARDS = 5;

export interface KpiGridProps {
  readonly kpis: readonly KpiView[];
  readonly drillDownHref: (drillDown: KpiDrillDown) => string;
  readonly selectable?: boolean;
  readonly controls?: Partial<Readonly<Record<KpiId, ReactNode>>>;
  readonly i18n: I18n;
}

export function KpiGrid({
  kpis,
  drillDownHref,
  selectable = false,
  controls = {},
  i18n,
}: KpiGridProps) {
  return (
    <div className={kpis.length === FIVE_CARDS ? FIVE_ACROSS : FOUR_ACROSS}>
      {selectable ? (
        <p id={KPI_TOGGLE_HINT_ID} hidden>
          {i18n.t('overview.kpiToggleHint')}
        </p>
      ) : null}
      {kpis.map((kpi) => (
        <KpiCard
          key={kpi.id}
          kpi={kpi}
          color={KPI_COLORS[kpi.id]}
          drillDown={
            kpi.drillDown === null
              ? null
              : { label: kpi.drillDown.label, href: drillDownHref(kpi.drillDown) }
          }
          toggleHint={selectable && kpi.plottable ? KPI_TOGGLE_HINT_ID : null}
          control={controls[kpi.id]}
          i18n={i18n}
        />
      ))}
    </div>
  );
}
