'use client';

import { type ReactNode, useId, useState } from 'react';
import { PANEL, PANEL_TITLE } from '@/components/ui/panel-classes';
import { FOCUS_RING } from '@/components/ui/control-classes';

export interface ChartPanelProps {
  readonly title: string;
  readonly description: string;
  readonly legend: ReactNode;
  readonly chart: ReactNode;
  readonly table: ReactNode;
}

export function ChartPanel({ title, description, legend, chart, table }: ChartPanelProps) {
  const [asTable, setAsTable] = useState(false);
  const headingId = useId();
  return (
    <section aria-labelledby={headingId} className={`${PANEL} gap-4`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 id={headingId} className={PANEL_TITLE}>
            {title}
          </h2>
          <p className="text-[13px] text-muted">{description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {legend}
          <button
            type="button"
            aria-pressed={asTable}
            onClick={() => {
              setAsTable((shown) => !shown);
            }}
            className={`min-h-11 rounded-control border border-line bg-card px-3 text-[13px] text-ink hover:bg-soft ${FOCUS_RING} aria-pressed:bg-soft sm:min-h-9`}
          >
            View as table
          </button>
        </div>
      </div>
      {asTable ? table : chart}
    </section>
  );
}

export interface LegendItemProps {
  readonly swatch: string;
  readonly label: string;
  readonly total: string;
}

export function LegendItem({ swatch, label, total }: LegendItemProps) {
  return (
    <p className="flex items-center gap-2 text-[13px]">
      <span aria-hidden="true" className={`size-2.5 rounded-[3px] ${swatch}`} />
      {label}
      <strong className="tabular-nums">{total}</strong>
    </p>
  );
}
