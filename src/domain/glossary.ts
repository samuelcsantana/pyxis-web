import type { I18n } from '@/i18n/i18n';
import {
  formatCount,
  formatPercent,
  MIN_COMPARABLE_BASE,
  MIN_MEANINGFUL_CHANGE,
  MIN_MEANINGFUL_POINTS,
} from './metrics';

export const VISIT_DEFINITION =
  'A visit is one browser tab, from its first event to its last; two tabs are never linked.';

export const IDENTIFIED_USER_DEFINITION =
  'An identified user is a distinct user id the site passed to identify(), usually when someone signs in; a visit without one is anonymous.';

export const CONVERSION_DEFINITION =
  "A conversion is a visit that sent the project's conversion event at least once; the conversion events count every time it was sent.";

export const WRITE_DEFINITION = 'A write is a POST, PUT, PATCH or DELETE sent with trackRequest().';

export const FAILURE_DEFINITION = 'A failure is a status of 400 or above, or no response at all.';

export function changeToneRule(i18n: I18n): string {
  return `A change is green or red only when the previous period counted at least ${formatCount(MIN_COMPARABLE_BASE, i18n)} and it moved by ${formatPercent(MIN_MEANINGFUL_CHANGE, i18n)} or more (${formatCount(MIN_MEANINGFUL_POINTS, i18n)} points for the write error rate).`;
}
