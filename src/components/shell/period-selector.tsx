import Form from 'next/form';
import {
  formatShortDayRange,
  type Period,
  type PeriodPreset,
  periodQuery,
  presetPeriod,
} from '@/domain/period';
import {
  PENDING_HOST,
  SEGMENTED_IDLE,
  SEGMENTED_OPTION,
  SEGMENTED_SELECTED,
} from '@/components/ui/control-classes';
import { DismissableDetails } from '@/components/ui/dismissable-details';
import type { DayFormats } from '@/i18n/day-formats';
import type { ClientSourceMessages } from '@/i18n/messages';
import type { Translator } from '@/i18n/translate';
import { type KeptParameters, RANGE_NOTICE_ID, withKeptParameters } from './kept-parameters';
import { LazyRangeCalendar } from './lazy-range-calendar';
import { PeriodPresets } from './period-presets';

export interface PeriodSelectorProps {
  readonly basePath: string;
  readonly period: Period;
  readonly today: string;
  readonly keep?: KeptParameters;
  readonly format: DayFormats;
  readonly t: Translator<ClientSourceMessages>;
}

const NOTHING_KEPT: KeptParameters = {};
const CALENDAR_ICON = 'M4 6h16v14H4z M4 10h16 M8 3v4 M16 3v4';

const PRESET_LABELS = {
  today: 'periodSelector.presets.today',
  '7d': 'periodSelector.presets.7d',
  '30d': 'periodSelector.presets.30d',
} as const satisfies Readonly<Record<PeriodPreset, string>>;

const PRESETS = Object.keys(PRESET_LABELS) as PeriodPreset[];

const OPTION_CLASS = `min-h-11 px-2 sm:min-h-8.5 sm:px-3 ${PENDING_HOST} ${SEGMENTED_OPTION}`;

export function PeriodSelector({
  basePath,
  period,
  today,
  keep = NOTHING_KEPT,
  format,
  t,
}: PeriodSelectorProps) {
  const custom = period.preset === 'custom';
  const shown = period.rejected ?? period;
  const datesOf = (from: string, to: string) => formatShortDayRange(from, to, today, format);
  const presetDates = PRESETS.map((preset) => {
    const presetRange = presetPeriod(preset, today);
    return { preset, dates: datesOf(presetRange.from, presetRange.to) };
  });
  return (
    <div className="flex flex-wrap items-center gap-2">
      <PeriodPresets
        label={t('periodSelector.label')}
        current={period.preset}
        links={PRESETS.map((preset) => ({
          preset,
          label: t(PRESET_LABELS[preset]),
          href: `${basePath}?${withKeptParameters(periodQuery(presetPeriod(preset, today)), keep)}`,
        }))}
      />
      <DismissableDetails
        key={`${basePath}:${period.preset}:${shown.from}:${shown.to}`}
        defaultOpen={period.rejected !== undefined}
        className="group relative max-sm:open:basis-full"
      >
        <summary
          className={`${OPTION_CLASS} w-fit list-none border border-line [&::-webkit-details-marker]:hidden ${custom ? SEGMENTED_SELECTED : `bg-soft ${SEGMENTED_IDLE}`}`}
        >
          <span className="inline-flex items-center gap-1.5">
            <svg
              width={16}
              height={16}
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="shrink-0 max-sm:hidden"
            >
              <path
                d={CALENDAR_ICON}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="sr-only">{`${t('periodSelector.custom')}, `}</span>
            <span className="inline-grid">
              <span
                data-shown-dates=""
                className="col-start-1 row-start-1 tabular-nums"
                suppressHydrationWarning
              >
                {datesOf(period.from, period.to)}
              </span>
              {presetDates.map(({ preset, dates }) => (
                <span
                  key={preset}
                  aria-hidden="true"
                  className="invisible col-start-1 row-start-1 tabular-nums max-sm:hidden"
                  suppressHydrationWarning
                >
                  {dates}
                </span>
              ))}
            </span>
          </span>
        </summary>
        <Form
          action={basePath}
          className="mt-1.5 rounded-input border border-line bg-card p-4 sm:absolute sm:right-0 sm:z-10 sm:shadow-lg"
        >
          {Object.entries(keep).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))}
          <LazyRangeCalendar
            from={period.from}
            to={period.to}
            today={today}
            problemId={period.rejected === undefined ? undefined : RANGE_NOTICE_ID}
            openAtFirst={period.rejected !== undefined}
          />
        </Form>
      </DismissableDetails>
    </div>
  );
}
