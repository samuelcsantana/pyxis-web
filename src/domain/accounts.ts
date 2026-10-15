export const ACCOUNT_STATUSES = [
  'incomplete',
  'trialing',
  'active',
  'past_due',
  'ending',
  'ended',
  'comped',
] as const;
export const ACCOUNT_ROLES = ['owner', 'member'] as const;
export const BILLING_INTERVALS = ['month', 'year'] as const;
export const DELETION_GRACE_DAYS = 30;
export const QUOTA_WARNING_RATIO = 0.8;
export const SUPPORT_EMAIL = 'hello@pyxis-analytics.dev';

const DAY_MS = 24 * 60 * 60 * 1000;
const STATUSES_WITH_A_SUBSCRIPTION: ReadonlySet<AccountStatus> = new Set([
  'trialing',
  'active',
  'past_due',
  'ending',
]);

export type AccountStatus = (typeof ACCOUNT_STATUSES)[number];
export type AccountRole = (typeof ACCOUNT_ROLES)[number];
export type BillingInterval = (typeof BILLING_INTERVALS)[number];

export interface AccountLimits {
  readonly eventsPerMonth: number;
  readonly projects: number;
  readonly people: number;
}

export interface Account {
  readonly id: string;
  readonly role: AccountRole;
  readonly status: AccountStatus;
  readonly billingInterval: BillingInterval | null;
  readonly trialEndsAt: string | null;
  readonly currentPeriodEndsAt: string | null;
  readonly accessEndsAt: string | null;
  readonly ingestionPausedUntil: string | null;
  readonly suspendedAt: string | null;
  readonly suspensionReason: string | null;
  readonly deletionHeldAt: string | null;
  readonly month: string;
  readonly eventsThisMonth: number | null;
  readonly measuredAt: string | null;
  readonly limits: AccountLimits;
}

export type AccountNotice =
  | { readonly kind: 'suspended' }
  | { readonly kind: 'paymentFailed' }
  | { readonly kind: 'ending'; readonly accessEndsAt: string }
  | { readonly kind: 'ended'; readonly deletionOn: string }
  | { readonly kind: 'endedHeld' }
  | { readonly kind: 'paused'; readonly until: string }
  | { readonly kind: 'nearQuota'; readonly share: number };

export type BillingRedirectOutcome =
  | { readonly kind: 'redirect'; readonly url: string }
  | { readonly kind: 'noBillingYet' }
  | { readonly kind: 'subscriptionExists' }
  | { readonly kind: 'unavailable' };

export type CloseAccountOutcome =
  | {
      readonly kind: 'closed';
      readonly accessEndsAt: string;
      readonly deletionOn: string;
      readonly refundedAmount: number;
    }
  | { readonly kind: 'confirmationMismatch' }
  | { readonly kind: 'alreadyEnded' }
  | { readonly kind: 'unavailable' };

const STATUSES_THAT_CREATE: ReadonlySet<AccountStatus> = new Set([
  'trialing',
  'active',
  'past_due',
  'ending',
  'comped',
]);

export function canCreateProjects(account: Account): boolean {
  return account.role === 'owner' && STATUSES_THAT_CREATE.has(account.status);
}

export function canClose(account: Account): boolean {
  return account.role === 'owner' && account.status !== 'ended';
}

export function ownedAccounts(accounts: readonly Account[]): readonly Account[] {
  return accounts.filter((account) => account.role === 'owner');
}

export function quotaShare(account: Account): number | null {
  return account.eventsThisMonth === null
    ? null
    : account.eventsThisMonth / account.limits.eventsPerMonth;
}

export function deletionDateOf(accessEndsAt: string): string {
  return new Date(new Date(accessEndsAt).getTime() + DELETION_GRACE_DAYS * DAY_MS).toISOString();
}

export function hasBillingPortal(account: Account): boolean {
  return STATUSES_WITH_A_SUBSCRIPTION.has(account.status);
}

export function needsCheckout(account: Account): boolean {
  return account.status === 'incomplete';
}

export function isSuspended(account: Account): boolean {
  return account.suspendedAt !== null;
}

export function isDeletionHeld(account: Account): boolean {
  return account.deletionHeldAt !== null;
}

export function accountNotice(account: Account, now: Date): AccountNotice | null {
  if (isSuspended(account)) {
    return { kind: 'suspended' };
  }
  if (account.status === 'past_due') {
    return { kind: 'paymentFailed' };
  }
  if (account.status === 'ending' && account.accessEndsAt !== null) {
    return { kind: 'ending', accessEndsAt: account.accessEndsAt };
  }
  if (account.status === 'ended' && isDeletionHeld(account)) {
    return { kind: 'endedHeld' };
  }
  if (account.status === 'ended' && account.accessEndsAt !== null) {
    return { kind: 'ended', deletionOn: deletionDateOf(account.accessEndsAt) };
  }
  if (
    account.ingestionPausedUntil !== null &&
    new Date(account.ingestionPausedUntil).getTime() > now.getTime()
  ) {
    return { kind: 'paused', until: account.ingestionPausedUntil };
  }
  const share = quotaShare(account);
  return share !== null && share >= QUOTA_WARNING_RATIO ? { kind: 'nearQuota', share } : null;
}

export function firstNotice(
  accounts: readonly Account[],
  now: Date,
): { readonly account: Account; readonly notice: AccountNotice } | null {
  for (const account of ownedAccounts(accounts)) {
    const notice = accountNotice(account, now);
    if (notice !== null) {
      return { account, notice };
    }
  }
  return null;
}
