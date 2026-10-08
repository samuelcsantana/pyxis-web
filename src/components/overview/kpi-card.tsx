import type { Tone } from '@/domain/metrics';
import { type KpiView, spokenChange, spokenTone } from '@/domain/overview';
import { Sparkline } from '@/components/ui/sparkline';

export type KpiColor = 'sky' | 'violet' | 'accent' | 'bad';

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

export interface KpiCardProps {
  readonly kpi: KpiView;
  readonly color: KpiColor;
}

export function KpiCard({ kpi, color }: KpiCardProps) {
  const labelId = `kpi-${kpi.id}`;
  return (
    <section
      aria-labelledby={labelId}
      className="flex flex-col gap-1.5 rounded-card border border-line bg-card p-3.5 text-ink sm:gap-2.5 sm:px-4.5 sm:pt-4.5 sm:pb-3.5"
    >
      <h2 id={labelId} className="text-xs font-medium text-muted sm:text-[13px]">
        {kpi.label}
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
    </section>
  );
}
