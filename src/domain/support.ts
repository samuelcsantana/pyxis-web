import type { Account, AccountStatus } from './accounts';

export const PAID_REPLY_BUSINESS_DAYS = 2;
export const FREE_REPLY_DAYS = 5;
export const QUESTION_FORM_URL =
  'https://github.com/samuelcsantana/pyxis-sdk/issues/new?template=question.yml';
export const SECURITY_REPORT_URL =
  'https://github.com/samuelcsantana/pyxis-api/security/advisories/new';
export const TRACKER_DOCS_URL = 'https://github.com/samuelcsantana/pyxis-sdk#readme';

export type SupportPlan = 'paid' | 'free';

const PAID_SUPPORT_STATUSES: ReadonlySet<AccountStatus> = new Set([
  'trialing',
  'active',
  'past_due',
  'ending',
  'comped',
]);

export function supportPlanOf(accounts: readonly Account[]): SupportPlan | null {
  if (accounts.some((account) => PAID_SUPPORT_STATUSES.has(account.status))) {
    return 'paid';
  }
  return accounts.some((account) => account.status === 'free') ? 'free' : null;
}
