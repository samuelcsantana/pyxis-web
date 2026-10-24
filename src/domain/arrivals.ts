export const ARRIVAL_KINDS = ['visits', 'conversions', 'namedEvents', 'failedRequests'] as const;

export type ArrivalKind = (typeof ARRIVAL_KINDS)[number];

export const MAX_ARRIVAL_TIMES = 100;
export const ARRIVAL_COUNT_CAP = 100;
export const CAPPED_ARRIVAL_COUNT = '99+';

export interface Arrivals {
  readonly times: readonly number[];
  readonly more: boolean;
}

export interface ArrivalsReport {
  readonly asOf: number;
  readonly activeVisits: number;
  readonly visits: Arrivals;
  readonly conversions: Arrivals | null;
  readonly namedEvents: Arrivals;
  readonly failedRequests: Arrivals;
}

export function countNewerThan(arrivals: Arrivals, mark: number): number {
  const firstSeen = arrivals.times.findIndex((time) => time <= mark);
  if (firstSeen !== -1) {
    return firstSeen;
  }
  return arrivals.more ? arrivals.times.length + 1 : arrivals.times.length;
}

export function isCappedArrivalCount(count: number): boolean {
  return count >= ARRIVAL_COUNT_CAP;
}

export function shownArrivalCount(count: number): string {
  return isCappedArrivalCount(count) ? CAPPED_ARRIVAL_COUNT : String(count);
}
