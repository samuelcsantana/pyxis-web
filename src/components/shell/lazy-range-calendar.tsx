'use client';

import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import type { RangeCalendarProps } from './range-calendar';

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
  const anchor = useRef<HTMLDivElement>(null);
  const [wanted, setWanted] = useState(openAtFirst);

  useEffect(() => {
    const details = anchor.current?.closest('details');
    if (details === null || details === undefined) {
      return undefined;
    }
    const loadWhenOpen = () => {
      if (details.open) {
        setWanted(true);
      }
    };
    details.addEventListener('toggle', loadWhenOpen);
    return () => {
      details.removeEventListener('toggle', loadWhenOpen);
    };
  }, []);

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
