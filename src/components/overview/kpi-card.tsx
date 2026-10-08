import Link from 'next/link';
import type { Tone } from '@/domain/metrics';
import { type KpiView, spokenChange, spokenTone } from '@/domain/overview';
import type { SeriesColor } from '@/domain/overview-chart';
import { TEXT_LINK } from '@/components/ui/control-classes';
import { Sparkline } from '@/components/ui/sparkline';
import { MetricToggle } from './metric-selection';

export type KpiColor = SeriesColor;

const TONE_CLASSES: Readonly<Record<Tone, string>> = {
  good: 'bg-ok-soft text-ok',
  bad: 'bg-bad-soft text-bad',
  neutral: 'bg-soft text-muted',
};

const STROKE_CLASSES: Readonly<Record<KpiColor, string>> = {
  sky: 'stroke-sky',
  violet: 'stroke-violet',
  accent: 'stroke-accent',
  bad: 'stroke-bad',
};

const SPARKLINE_BOX = { width: 120, height: 36, inset: 3 } as const;

export interface KpiDrillDownLink {
  readonly label: string;
  readonly href: string;
}

export interface KpiCardProps {
  readonly kpi: KpiView;
  readonly color: KpiColor;
  readonly drillDown: KpiDrillDownLink | null;
  readonly toggleHint: string | null;
}

const CARD =
  'relative flex flex-col gap-1.5 rounded-card border border-line bg-card p-3.5 text-ink sm:gap-2.5 sm:px-4.5 sm:pt-4.5 sm:pb-3.5';

const TOGGLE_CARD = [
  'cursor-pointer transition-colors duration-150 motion-reduce:transition-none',
  'has-[[aria-pressed]:hover]:border-muted has-[[aria-pressed]:active]:bg-soft',
  'has-[[aria-pressed=true]]:border-ink has-[[aria-pressed=true]]:ring-1 has-[[aria-pressed=true]]:ring-ink',
  'has-[[aria-pressed]:focus-visible]:outline-2 has-[[aria-pressed]:focus-visible]:outline-offset-2 has-[[aria-pressed]:focus-visible]:outline-focus',
].join(' ');

export function KpiCard({ kpi, color, drillDown, toggleHint }: KpiCardProps) {
  const labelId = `kpi-${kpi.id}`;
  return (
    <div
      role="group"
      aria-labelledby={labelId}
      className={toggleHint === null ? CARD : `${CARD} ${TOGGLE_CARD}`}
    >
      <h2 id={labelId} className="text-xs font-medium text-muted sm:text-[13px]">
        {toggleHint === null ? (
          kpi.label
        ) : (
          <MetricToggle metric={kpi.id} label={kpi.label} describedBy={toggleHint} />
        )}
      </h2>
      <p className="text-[22px] leading-7 font-semibold tracking-tight tabular-nums sm:text-[30px] sm:leading-9">
        {kpi.value}
      </p>
      <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-muted">
        <span
          className={`rounded-pill px-2 py-0.5 text-[11px] font-semibold tabular-nums sm:text-xs ${TONE_CLASSES[kpi.tone]}`}
        >
          {kpi.change}
          <span className="sr-only">{spokenChange(kpi.change)}</span>
        </span>{' '}
        <span>
          {kpi.comparison}
          <span className="sr-only">{spokenTone(kpi.tone)}</span>
        </span>
      </p>
      {kpi.series.length > 1 ? (
        <Sparkline
          values={kpi.series}
          box={SPARKLINE_BOX}
          width="100%"
          strokeClass={STROKE_CLASSES[color]}
          strokeWidth={2}
          className="hidden sm:block"
        />
      ) : null}
      {kpi.note === null ? null : <p className="text-xs text-muted">{kpi.note}</p>}
      {drillDown === null ? null : (
        <Link
          href={drillDown.href}
          className={`relative inline-flex min-h-6 w-fit items-center text-xs ${TEXT_LINK}`}
        >
          {drillDown.label}
        </Link>
      )}
    </div>
  );
}
