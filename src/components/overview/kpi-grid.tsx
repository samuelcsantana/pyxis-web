import type { KpiDrillDown, KpiView } from '@/domain/overview';
import { KPI_COLORS } from '@/domain/overview-chart';
import { KpiCard } from './kpi-card';

export const KPI_TOGGLE_HINT_ID = 'kpi-toggle-hint';

export interface KpiGridProps {
  readonly kpis: readonly KpiView[];
  readonly drillDownHref: (drillDown: KpiDrillDown) => string;
  readonly selectable?: boolean;
}

export function KpiGrid({ kpis, drillDownHref, selectable = false }: KpiGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-4 xl:grid-cols-4">
      {selectable ? (
        <p id={KPI_TOGGLE_HINT_ID} hidden>
          Plots this figure per day on the chart below.
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
          toggleHint={selectable ? KPI_TOGGLE_HINT_ID : null}
        />
      ))}
    </div>
  );
}
