'use client';

import { type ReactNode, useId, useState } from 'react';
import { PANEL, PANEL_TITLE } from '@/components/ui/panel-classes';
import {
  SEGMENTED_GROUP,
  SEGMENTED_IDLE,
  SEGMENTED_OPTION,
  SEGMENTED_SELECTED,
} from '@/components/ui/control-classes';

export interface ChartPanelProps {
  readonly title: string;
  readonly description: string;
  readonly legend: ReactNode;
  readonly chart: ReactNode;
  readonly table: ReactNode;
}

type ChartView = 'chart' | 'table';

const VIEWS: readonly { readonly view: ChartView; readonly label: string }[] = [
  { view: 'chart', label: 'Chart' },
  { view: 'table', label: 'Table' },
];

const VIEW_OPTION = `min-h-11 px-3 sm:min-h-8.5 ${SEGMENTED_OPTION}`;

export function ChartPanel({ title, description, legend, chart, table }: ChartPanelProps) {
  const [shown, setShown] = useState<ChartView>('chart');
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
          <div role="group" aria-label="Show as" className={SEGMENTED_GROUP}>
            {VIEWS.map(({ view, label }) => (
              <button
                key={view}
                type="button"
                aria-pressed={shown === view}
                onClick={() => {
                  setShown(view);
                }}
                className={`${VIEW_OPTION} ${shown === view ? SEGMENTED_SELECTED : SEGMENTED_IDLE}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
      {shown === 'table' ? table : chart}
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
