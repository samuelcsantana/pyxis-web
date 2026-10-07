import Link from 'next/link';
import { type Period, type PeriodPreset, periodQuery, presetPeriod } from '@/domain/period';
import {
  BUTTON_PRIMARY,
  FIELD,
  SEGMENTED_GROUP,
  SEGMENTED_IDLE,
  SEGMENTED_OPTION,
  SEGMENTED_SELECTED,
} from '@/components/ui/control-classes';

export type KeptParameters = Readonly<Record<string, string>>;

export interface PeriodSelectorProps {
  readonly basePath: string;
  readonly period: Period;
  readonly today: string;
  readonly keep?: KeptParameters;
}

const NOTHING_KEPT: KeptParameters = {};

export function withKeptParameters(query: string, keep: KeptParameters): string {
  const parameters = new URLSearchParams(query);
  for (const [name, value] of Object.entries(keep)) {
    parameters.set(name, value);
  }
  return parameters.toString();
}

const PRESET_LABELS: Readonly<Record<PeriodPreset, string>> = {
  today: 'Today',
  '7d': '7 days',
  '30d': '30 days',
};

const PRESETS = Object.keys(PRESET_LABELS) as PeriodPreset[];

const OPTION_CLASS = `min-h-8.5 px-3 ${SEGMENTED_OPTION}`;
const DATE_INPUT_CLASS = `min-h-9 rounded-control px-2 text-base sm:text-[13px] ${FIELD}`;

export function PeriodSelector({
  basePath,
  period,
  today,
  keep = NOTHING_KEPT,
}: PeriodSelectorProps) {
  const custom = period.preset === 'custom';
  return (
    <div className="flex flex-wrap items-center gap-2">
      <nav aria-label="Period" className={SEGMENTED_GROUP}>
        {PRESETS.map((preset) => {
          const selected = period.preset === preset;
          return (
            <Link
              key={preset}
              href={`${basePath}?${withKeptParameters(periodQuery(presetPeriod(preset, today)), keep)}`}
              aria-current={selected ? 'true' : undefined}
              className={`${OPTION_CLASS} ${selected ? SEGMENTED_SELECTED : SEGMENTED_IDLE}`}
            >
              {PRESET_LABELS[preset]}
            </Link>
          );
        })}
      </nav>
      <details className="group relative max-sm:open:basis-full">
        <summary
          className={`${OPTION_CLASS} w-fit list-none border border-line [&::-webkit-details-marker]:hidden ${custom ? SEGMENTED_SELECTED : `bg-soft ${SEGMENTED_IDLE}`}`}
        >
          Custom
        </summary>
        <form
          action={basePath}
          method="get"
          className="mt-1.5 flex flex-wrap items-end gap-2 rounded-input border border-line bg-card p-3 sm:absolute sm:right-0 sm:z-10 sm:w-max sm:shadow-lg"
        >
          {Object.entries(keep).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))}
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
            className={`min-h-9 rounded-control px-3 text-[13px] ${BUTTON_PRIMARY}`}
          >
            Apply
          </button>
        </form>
      </details>
    </div>
  );
}
