import type { AccountStatus } from './accounts';

export const PRO_FEATURES = [
  'public_share_link',
  'slack_alerts',
  'annotations_by_token',
  'ga4_import',
  'search_console',
] as const;

export type ProFeature = (typeof PRO_FEATURES)[number];

const STATUSES_ON_PRO: ReadonlySet<AccountStatus> = new Set([
  'trialing',
  'active',
  'past_due',
  'ending',
  'comped',
]);

export function isOnProPlan(status: AccountStatus): boolean {
  return STATUSES_ON_PRO.has(status);
}
