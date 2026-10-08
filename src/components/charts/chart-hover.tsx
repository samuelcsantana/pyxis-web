'use client';

import { type PointerEvent, useState } from 'react';
import { dayAt, type DayLayout, daySpan } from '@/domain/chart-days';
import { cssPercent } from '@/domain/chart-scale';

export interface HoverRow {
  readonly label: string;
  readonly value: string;
  readonly marker: string;
}

export interface HoverDay {
  readonly label: string;
  readonly rows: readonly HoverRow[];
}

export interface ChartHoverProps {
  readonly days: readonly HoverDay[];
  readonly layout: DayLayout;
}

const MIDDLE = 0.5;

function Tooltip({ day, at }: { readonly day: HoverDay; readonly at: number }) {
  const onTheRight = at > MIDDLE;
  return (
    <div
      className={`absolute top-1 flex w-max max-w-56 flex-col gap-1 rounded-input border border-line bg-card px-2.5 py-2 text-xs leading-4 text-ink shadow-sm ${onTheRight ? '-translate-x-2' : 'translate-x-2'}`}
      style={onTheRight ? { right: cssPercent(1 - at) } : { left: cssPercent(at) }}
    >
      <p className="font-semibold">{day.label}</p>
      {day.rows.map((row) => (
        <p key={row.label} className="flex items-center gap-1.5">
          <span className={`shrink-0 ${row.marker}`} />
          <span className="text-muted">{row.label}</span>
          <strong className="ml-auto pl-2 tabular-nums">{row.value}</strong>
        </p>
      ))}
    </div>
  );
}

export function ChartHover({ days, layout }: ChartHoverProps) {
  const [index, setIndex] = useState<number | null>(null);
  const day = index === null ? undefined : days[index];

  const follow = (event: PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    setIndex(dayAt((event.clientX - box.left) / box.width, days.length, layout));
  };

  return (
    <div
      aria-hidden="true"
      data-layer="hover"
      className="absolute inset-0"
      onPointerMove={follow}
      onPointerDown={follow}
      onPointerLeave={() => {
        setIndex(null);
      }}
    >
      {index === null || day === undefined ? null : (
        <>
          <span
            className="absolute inset-y-0 w-px bg-muted"
            style={{ left: cssPercent(daySpan(index, days.length, layout).center) }}
          />
          <Tooltip day={day} at={daySpan(index, days.length, layout).center} />
        </>
      )}
    </div>
  );
}
