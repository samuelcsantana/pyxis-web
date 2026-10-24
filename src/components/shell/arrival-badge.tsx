'use client';

import { useSyncExternalStore } from 'react';
import {
  type ArrivalNews,
  arrivalNews,
  noArrivalNews,
  subscribeToArrivalNews,
} from './arrival-news';
import type { ScreenSlug } from './screens';

const BADGE =
  'ml-auto min-w-5 rounded-full px-1.5 text-center text-micro leading-5 font-semibold tabular-nums';
const BADGE_TONE = 'bg-accent text-accent-ink';
const FAILURE_TONE = 'bg-bad text-white';
const SPOKEN_SEPARATOR = ', ';

export function useArrivalNews(): ArrivalNews {
  return useSyncExternalStore(subscribeToArrivalNews, arrivalNews, noArrivalNews);
}

export interface ArrivalBadgeProps {
  readonly screen: ScreenSlug;
  readonly active: boolean;
}

export function ArrivalBadge({ screen, active }: ArrivalBadgeProps) {
  const news = useArrivalNews()[screen];
  if (active || news === undefined) {
    return null;
  }
  return (
    <span className={`${BADGE} ${screen === 'requests' ? FAILURE_TONE : BADGE_TONE}`}>
      <span aria-hidden="true">{news.shown}</span>
      <span className="sr-only">{`${SPOKEN_SEPARATOR}${news.label}`}</span>
    </span>
  );
}
