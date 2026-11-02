import type { BatchEvent } from 'pyxis-analytics';

export const VISITOR_PERIOD_KEY = 'pyxis:period';

export type VisitorKind = NonNullable<BatchEvent['visitor']>;

export interface VisitorPeriod {
  readonly dayEndsAt: string;
  readonly monthEndsAt: string;
}

export type VisitorPeriodStore = Pick<Storage, 'getItem'>;

const browserSiteStore = (): VisitorPeriodStore => window.localStorage;

function isInstant(value: unknown): value is string {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
}

export function visitorPeriodOf(value: unknown): VisitorPeriod | null {
  if (
    typeof value !== 'object' ||
    value === null ||
    !('day_ends_at' in value) ||
    !('month_ends_at' in value)
  ) {
    return null;
  }
  const { day_ends_at: dayEndsAt, month_ends_at: monthEndsAt } = value;
  return isInstant(dayEndsAt) && isInstant(monthEndsAt) ? { dayEndsAt, monthEndsAt } : null;
}

export function bestEffortReadVisitorPeriod(
  store: () => VisitorPeriodStore = browserSiteStore,
): VisitorPeriod | null {
  try {
    const stored = store().getItem(VISITOR_PERIOD_KEY);
    return stored === null ? null : visitorPeriodOf(JSON.parse(stored));
  } catch (error) {
    console.warn('landing: could not read the unique visitors marker', error);
    return null;
  }
}
