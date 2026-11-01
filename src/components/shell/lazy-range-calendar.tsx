'use client';

import { lazy, Suspense } from 'react';
import type { RangeCalendarProps } from './range-calendar';
import { useWantedWhenOpen } from './use-wanted-when-open';

function CalendarPlaceholder() {
  return (
    <div
      aria-hidden="true"
      data-testid="calendar-placeholder"
      className="h-[26rem] w-full rounded-input bg-grid motion-safe:animate-pulse sm:h-[23.5rem] sm:w-72"
    />
  );
}

const RangeCalendar = lazy(() =>
  import('./range-calendar').then((calendar) => ({ default: calendar.RangeCalendar })),
);

export interface LazyRangeCalendarProps extends RangeCalendarProps {
  readonly openAtFirst: boolean;
}

export function LazyRangeCalendar({ openAtFirst, ...calendar }: LazyRangeCalendarProps) {
  const { anchor, wanted } = useWantedWhenOpen(openAtFirst);
  return (
    <div ref={anchor}>
      {wanted ? (
        <Suspense fallback={<CalendarPlaceholder />}>
          <RangeCalendar {...calendar} />
        </Suspense>
      ) : (
        <CalendarPlaceholder />
      )}
    </div>
  );
}
