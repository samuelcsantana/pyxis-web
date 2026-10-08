import type { KpiDrillDown, KpiId, KpiView } from '@/domain/overview';
import { type KpiColor, KpiCard } from './kpi-card';

const KPI_COLORS: Readonly<Record<KpiId, KpiColor>> = {
  visits: 'sky',
  'identified-users': 'violet',
  conversions: 'accent',
  'write-errors': 'bad',
};

export interface KpiGridProps {
  readonly kpis: readonly KpiView[];
  readonly drillDownHref: (drillDown: KpiDrillDown) => string;
}

export function KpiGrid({ kpis, drillDownHref }: KpiGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-[repeat(auto-fit,minmax(13.75rem,1fr))] sm:gap-4">
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
        />
      ))}
    </div>
  );
}
