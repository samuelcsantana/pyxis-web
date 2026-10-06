import Link from 'next/link';
import { type Period, type PeriodPreset, periodQuery, presetPeriod } from '@/domain/period';

export interface PeriodSelectorProps {
  readonly basePath: string;
  readonly period: Period;
  readonly today: string;
}

const PRESET_LABELS: Readonly<Record<PeriodPreset, string>> = {
  today: 'Today',
  '7d': '7 days',
  '30d': '30 days',
};

const PRESETS = Object.keys(PRESET_LABELS) as PeriodPreset[];

const OPTION_CLASS =
  'flex min-h-8.5 items-center rounded-control px-3 text-[13px] font-medium focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent';
const SELECTED_CLASS = 'bg-ink text-card';
const IDLE_CLASS = 'text-muted hover:text-ink';
const DATE_INPUT_CLASS =
  'min-h-9 rounded-control border border-line bg-card px-2 text-[13px] text-ink focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent';

export function PeriodSelector({ basePath, period, today }: PeriodSelectorProps) {
  const custom = period.preset === 'custom';
  return (
    <div className="flex flex-wrap items-center gap-2">
      <nav
        aria-label="Period"
        className="flex gap-0.5 rounded-input border border-line bg-soft p-[3px]"
      >
        {PRESETS.map((preset) => {
          const selected = period.preset === preset;
          return (
            <Link
              key={preset}
              href={`${basePath}?${periodQuery(presetPeriod(preset, today))}`}
              aria-current={selected ? 'true' : undefined}
              className={`${OPTION_CLASS} ${selected ? SELECTED_CLASS : IDLE_CLASS}`}
            >
              {PRESET_LABELS[preset]}
            </Link>
          );
        })}
      </nav>
      <details className="group relative" open={custom}>
        <summary
          className={`${OPTION_CLASS} cursor-pointer list-none border border-line [&::-webkit-details-marker]:hidden ${custom ? SELECTED_CLASS : `bg-soft ${IDLE_CLASS}`}`}
        >
          Custom
        </summary>
        <form
          action={basePath}
          method="get"
          className="absolute right-0 z-10 mt-1.5 flex w-max max-w-[calc(100vw-2rem)] flex-wrap items-end gap-2 rounded-input border border-line bg-card p-3 shadow-lg"
        >
          <label className="flex flex-col gap-1 text-xs font-medium text-muted">
            From
            <input
              type="date"
              name="from"
              required
              max={today}
              defaultValue={period.from}
              className={DATE_INPUT_CLASS}
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-muted">
            To
            <input
              type="date"
              name="to"
              required
              max={today}
              defaultValue={period.to}
              className={DATE_INPUT_CLASS}
            />
          </label>
          <button
            type="submit"
            className="min-h-9 rounded-control bg-accent px-3 text-[13px] font-semibold text-accent-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            Apply
          </button>
        </form>
      </details>
    </div>
  );
}
