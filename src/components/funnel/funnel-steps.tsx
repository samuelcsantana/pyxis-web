import type { FunnelMode, FunnelRow, FunnelTone } from '@/domain/funnel';
import { PANEL, PANEL_TITLE } from '@/components/ui/panel-classes';

const TONE_CLASSES: Readonly<Record<FunnelTone, string>> = {
  start: 'text-muted',
  good: 'text-ok',
  bad: 'text-bad',
  neutral: 'text-muted',
};

const MODE_NOTES: Readonly<Record<FunnelMode, string>> = {
  visit: 'Per visit: a step counts only after the one before it, in the same visit',
  user: 'Per person: steps can span visits once the person is identified',
};

export interface FunnelStepsProps {
  readonly rows: readonly FunnelRow[];
  readonly mode: FunnelMode;
}

export function FunnelSteps({ rows, mode }: FunnelStepsProps) {
  return (
    <section aria-labelledby="funnel-heading" className={PANEL}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="funnel-heading" className={PANEL_TITLE}>
          Funnel
        </h2>
        <p className="text-caption text-muted">{MODE_NOTES[mode]}</p>
      </div>
      <ol aria-labelledby="funnel-heading" className="flex flex-col">
        {rows.map((row) => (
          <li
            key={row.key}
            className="grid grid-cols-[1.75rem_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 border-b border-line py-3 sm:grid-cols-[1.75rem_minmax(10rem,16rem)_minmax(0,1fr)_5rem_9rem] sm:gap-x-4"
          >
            <span
              aria-hidden="true"
              className="flex size-7 items-center justify-center rounded-pill bg-soft text-caption font-semibold"
            >
              {row.position}
            </span>
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="text-sm font-semibold">{row.label}</span>
              <span className="font-mono text-xs text-muted wrap-anywhere">{row.target}</span>
            </span>
            <span aria-hidden="true" className="hidden h-7 rounded-control bg-soft sm:block">
              <span className="block h-7 rounded-control bg-sky" style={{ width: row.barWidth }} />
            </span>
            <span className="text-right text-base font-semibold tabular-nums">{row.count}</span>
            <span className="col-start-2 flex flex-col text-xs tabular-nums sm:col-start-auto sm:text-right">
              <span className={`font-semibold ${TONE_CLASSES[row.tone]}`}>{row.continued}</span>
              <span className="text-muted">{row.dropped}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
