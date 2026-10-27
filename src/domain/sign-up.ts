import type { AccountStatus, BillingInterval } from './accounts';

export const TRIAL_DAYS = 14;
export const FREE_PLAN_STATES = ['open', 'full', 'closed'] as const;
export const FREE_PLAN_EVENTS_PER_MONTH = 10_000;
export const FREE_PLACE_WAIT_DAYS = 60;

export type FreePlanState = (typeof FREE_PLAN_STATES)[number];
export type StepAfterSignUp = 'welcome' | 'checkout' | 'waitForAFreePlace' | 'dashboard';

export interface SignUpStatus {
  readonly open: boolean;
  readonly termsVersion: string | null;
  readonly termsUrl: string | null;
  readonly freePlan: FreePlanState;
}

export interface OpenSignUp {
  readonly termsVersion: string;
  readonly termsUrl: string;
  readonly freePlan: FreePlanState;
}

export type VerifySignUpOutcome =
  | {
      readonly kind: 'verified';
      readonly accountId: string;
      readonly accountStatus: AccountStatus;
    }
  | { readonly kind: 'invalidCode' }
  | { readonly kind: 'termsOutdated' }
  | { readonly kind: 'closed' };

export function openSignUpOf(status: SignUpStatus): OpenSignUp | null {
  return status.open && status.termsVersion !== null && status.termsUrl !== null
    ? { termsVersion: status.termsVersion, termsUrl: status.termsUrl, freePlan: status.freePlan }
    : null;
}

export function stepAfterSignUp(
  accountStatus: AccountStatus,
  freePlan: FreePlanState,
): StepAfterSignUp {
  if (accountStatus === 'free') {
    return 'welcome';
  }
  if (accountStatus !== 'incomplete') {
    return 'dashboard';
  }
  return freePlan === 'closed' ? 'checkout' : 'waitForAFreePlace';
}

const YEARLY: BillingInterval = 'year';

export function requestedIntervalOf(
  value: string | readonly string[] | undefined,
): BillingInterval {
  return value === YEARLY ? YEARLY : 'month';
}
