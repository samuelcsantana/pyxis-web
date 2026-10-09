'use client';

import { type KeyboardEvent, useId, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { BUTTON_PRIMARY, CONTROL_DISABLED, FOCUS_RING } from '@/components/ui/control-classes';
import { PendingSubmitButton } from '@/components/ui/pending-submit-button';
import { daysBetween, formatDayRange, MAX_PERIOD_DAYS } from '@/domain/period';
import {
  canShowMonth,
  chooseDay,
  DAYS_PER_WEEK,
  isCalendarKey,
  isChoosable,
  monthOf,
  monthWeeks,
  movedDay,
  type RangeSelection,
  shiftMonth,
  shownRange,
} from '@/domain/range-calendar';
import { createFormats } from '@/i18n/formats';
import { displayTag } from '@/i18n/i18n';
import { useLocale, useT } from '@/i18n/messages-provider';

export interface RangeCalendarProps {
  readonly from: string;
  readonly to: string;
  readonly today: string;
  readonly problemId?: string;
}

const SUNDAY_FIRST_ISO_WEEKDAYS = [7, 1, 2, 3, 4, 5, 6] as const;

const NAV_BUTTON = `flex size-9 items-center justify-center rounded-pill text-ink hover:bg-soft active:bg-line ${FOCUS_RING} ${CONTROL_DISABLED}`;
const DAY_BUTTON = `relative z-[1] flex size-11 items-center justify-center rounded-pill text-sm tabular-nums sm:size-9 ${FOCUS_RING}`;

function utcDay(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00.000Z`);
}

function Chevron({ path }: { readonly path: string }) {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface DayLook {
  readonly isEnd: boolean;
  readonly inside: boolean;
  readonly bandStart: boolean;
  readonly bandEnd: boolean;
  readonly choosable: boolean;
  readonly isToday: boolean;
}

function cellClass({ inside, bandStart, bandEnd }: DayLook): string {
  if (!inside) {
    return 'p-0';
  }
  const left = bandStart ? 'rounded-l-pill' : '';
  const right = bandEnd ? 'rounded-r-pill' : '';
  return `bg-accent/25 p-0 ${left} ${right}`;
}

function dayClass({ isEnd, choosable, isToday }: DayLook): string {
  if (isEnd) {
    return `${DAY_BUTTON} bg-ink font-semibold text-card`;
  }
  if (!choosable) {
    return `${DAY_BUTTON} cursor-not-allowed text-muted/45`;
  }
  const today = isToday ? 'font-semibold ring-1 ring-field ring-inset' : '';
  return `${DAY_BUTTON} cursor-pointer text-ink hover:bg-soft active:bg-line ${today}`;
}

export function RangeCalendar({ from, to, today, problemId }: RangeCalendarProps) {
  const t = useT();
  const locale = useLocale();
  const format = createFormats(displayTag(locale));
  const headingId = useId();
  const grid = useRef<HTMLTableElement>(null);
  const [selection, setSelection] = useState<RangeSelection>({ kind: 'complete', from, to });
  const [month, setMonth] = useState(monthOf(to));
  const [focused, setFocused] = useState(to);
  const [preview, setPreview] = useState<string | null>(null);

  const range = shownRange(selection, preview, today);
  const weeks = monthWeeks(month);
  const nextMonth = shiftMonth(month, 1);

  const focusDay = (day: string) => {
    const kept = day > today ? today : day;
    flushSync(() => {
      setFocused(kept);
      setMonth(monthOf(kept));
      setPreview(kept);
    });
    grid.current?.querySelector<HTMLButtonElement>(`[data-day="${kept}"]`)?.focus();
  };

  const choose = (day: string) => {
    if (!isChoosable(day, selection, today)) {
      return;
    }
    setSelection(chooseDay(selection, day));
    setFocused(day);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, day: string) => {
    if (!isCalendarKey(event.key)) {
      return;
    }
    event.preventDefault();
    focusDay(movedDay(day, event.key, event.shiftKey));
  };

  const summary =
    selection.kind === 'started'
      ? t('periodSelector.pickLastDay', { day: format.dayWithYear(utcDay(selection.from)) })
      : t('periodSelector.chosenRange', {
          range: formatDayRange(selection.from, selection.to, format),
          days: t('periodSelector.dayCount', { count: daysBetween(selection.from, selection.to) }),
        });

  return (
    <div className="flex w-full flex-col gap-3 sm:w-72">
      <p
        aria-live="polite"
        aria-describedby={problemId}
        className="min-h-5 text-sm font-semibold text-ink"
      >
        {summary}
      </p>
      <div className="flex items-center justify-between">
        <button
          type="button"
          className={NAV_BUTTON}
          aria-label={t('periodSelector.previousMonth')}
          onClick={() => {
            setMonth(shiftMonth(month, -1));
          }}
        >
          <Chevron path="M15 6l-6 6 6 6" />
        </button>
        <h2 id={headingId} className="text-sm font-semibold text-ink first-letter:uppercase">
          {format.monthWithYear(utcDay(`${month}-01`))}
        </h2>
        <button
          type="button"
          className={NAV_BUTTON}
          aria-label={t('periodSelector.nextMonth')}
          disabled={!canShowMonth(nextMonth, today)}
          onClick={() => {
            setMonth(nextMonth);
          }}
        >
          <Chevron path="M9 6l6 6-6 6" />
        </button>
      </div>
      <table
        ref={grid}
        role="grid"
        aria-labelledby={headingId}
        className="w-full border-separate border-spacing-y-0.5"
        onMouseLeave={() => {
          setPreview(null);
        }}
      >
        <thead>
          <tr>
            {SUNDAY_FIRST_ISO_WEEKDAYS.map((weekday) => (
              <th
                key={weekday}
                scope="col"
                abbr={format.weekday(weekday, 'long')}
                className="pb-1 text-center text-xs font-medium text-muted"
              >
                {format.weekday(weekday, 'narrow')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={week.find((day) => day !== null)}>
              {week.map((day, column) => {
                if (day === null) {
                  return <td key={`blank-${String(column)}`} className="p-0" />;
                }
                const inside = day >= range.from && day <= range.to;
                const selected = selection.kind === 'complete' ? inside : day === selection.from;
                const look: DayLook = {
                  isEnd: day === range.from || (day === range.to && selection.kind === 'complete'),
                  inside,
                  bandStart: day === range.from || column === 0,
                  bandEnd: day === range.to || column === DAYS_PER_WEEK - 1,
                  choosable: isChoosable(day, selection, today),
                  isToday: day === today,
                };
                return (
                  <td
                    key={day}
                    role="gridcell"
                    aria-selected={selected}
                    className={cellClass(look)}
                  >
                    <button
                      type="button"
                      data-day={day}
                      tabIndex={day === focused ? 0 : -1}
                      aria-label={format.fullDay(utcDay(day))}
                      aria-disabled={look.choosable ? undefined : true}
                      aria-current={look.isToday ? 'date' : undefined}
                      className={`mx-auto ${dayClass(look)}`}
                      onClick={() => {
                        choose(day);
                      }}
                      onKeyDown={(event) => {
                        onKeyDown(event, day);
                      }}
                      onMouseEnter={() => {
                        setPreview(day);
                      }}
                      onFocus={() => {
                        setPreview(day);
                      }}
                    >
                      {Number(day.slice(8, 10))}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between gap-3 border-t border-line pt-3">
        <p className="text-xs text-muted">
          {t('periodSelector.limit', { days: String(MAX_PERIOD_DAYS) })}
        </p>
        <PendingSubmitButton
          label={t('periodSelector.apply')}
          pendingLabel={t('periodSelector.applying')}
          disabled={selection.kind === 'started'}
          className={`min-h-11 shrink-0 rounded-control px-4 text-caption sm:min-h-9 ${BUTTON_PRIMARY} ${CONTROL_DISABLED}`}
        />
      </div>
      <input type="hidden" name="from" value={selection.from} />
      <input
        type="hidden"
        name="to"
        value={selection.kind === 'complete' ? selection.to : selection.from}
      />
    </div>
  );
}
