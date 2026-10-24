import {
  type ArrivalKind,
  type ArrivalsReport,
  countNewerThan,
  shownArrivalCount,
} from '@/domain/arrivals';
import type { SeenMarks } from '@/lib/seen-store';
import type { ArrivalNews } from './arrival-news';
import { SCREENS, type ScreenSlug } from './screens';

export const SCREEN_ARRIVAL_KINDS: Readonly<Record<ScreenSlug, ArrivalKind | null>> = {
  overview: 'visits',
  funnel: 'conversions',
  features: 'namedEvents',
  requests: 'failedRequests',
  timeline: null,
  visits: 'visits',
  devices: 'visits',
  acquisition: 'visits',
};

const COUNTED_KINDS: readonly (readonly [ScreenSlug, ArrivalKind])[] = SCREENS.flatMap(
  ({ slug }) => {
    const kind = SCREEN_ARRIVAL_KINDS[slug];
    return kind === null ? [] : [[slug, kind] as const];
  },
);

export const COUNTED_SCREENS: readonly ScreenSlug[] = COUNTED_KINDS.map(([screen]) => screen);

export type ArrivalLabel = (kind: ArrivalKind, count: number) => string;

export interface ArrivalNewsInput {
  readonly report: ArrivalsReport;
  readonly marks: SeenMarks;
  readonly current: ScreenSlug | undefined;
  readonly label: ArrivalLabel;
}

export function oldestMark(marks: SeenMarks): number | undefined {
  const moments = COUNTED_SCREENS.flatMap((screen) => {
    const mark = marks[screen];
    return mark === undefined ? [] : [mark];
  });
  return moments.length === 0 ? undefined : Math.min(...moments);
}

export function arrivalNewsOf({ report, marks, current, label }: ArrivalNewsInput): ArrivalNews {
  const news = COUNTED_KINDS.flatMap(([screen, kind]) => {
    const arrivals = report[kind];
    const mark = marks[screen];
    if (screen === current || arrivals === null || mark === undefined) {
      return [];
    }
    const count = countNewerThan(arrivals, mark);
    return count === 0
      ? []
      : [[screen, { shown: shownArrivalCount(count), label: label(kind, count) }] as const];
  });
  return Object.fromEntries(news);
}
