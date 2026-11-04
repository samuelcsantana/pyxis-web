import {
  type Account,
  type AccountNotice,
  type AccountStatus,
  canCreateProjects,
  firstNotice,
  needsCheckout,
  ownedAccounts,
  pausedUntilOf,
} from '@/domain/accounts';
import type { Project } from '@/domain/admin';
import { createAccountsService } from '@/services/accounts/accounts-service.factory';

export interface MonthUsage {
  readonly events: number;
  readonly limit: number;
  readonly share: number;
  readonly pausedUntil: string | null;
  readonly resetsOn: string;
}

export type PlanBadge = 'free' | 'pro' | 'trial' | 'comped' | 'incomplete' | 'member';

export interface AccountsInView {
  readonly notice: AccountNotice | null;
  readonly canCreateProject: boolean;
  readonly hasUnfinishedSignUp: boolean;
  readonly usage: MonthUsage | null;
  readonly plan: PlanBadge | null;
}

const BADGE_OF_STATUS: Readonly<Record<AccountStatus, PlanBadge>> = {
  incomplete: 'incomplete',
  trialing: 'trial',
  active: 'pro',
  past_due: 'pro',
  ending: 'pro',
  ended: 'pro',
  comped: 'comped',
  free: 'free',
};

function planBadgeOf(accounts: readonly Account[], project: Project): PlanBadge {
  const account = ownedAccounts(accounts).find((owned) => owned.id === project.accountId);
  return account === undefined ? 'member' : BADGE_OF_STATUS[account.status];
}

const NOTHING_TO_SHOW: AccountsInView = {
  notice: null,
  canCreateProject: false,
  hasUnfinishedSignUp: false,
  usage: null,
  plan: null,
};

function firstDayOfNextMonth(now: Date): string {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1)).toISOString();
}

function monthUsageOf(
  accounts: readonly Account[],
  project: Project,
  now: Date,
): MonthUsage | null {
  const account = ownedAccounts(accounts).find((owned) => owned.id === project.accountId);
  if (account === undefined || account.eventsThisMonth === null) {
    return null;
  }
  const limit = account.limits.eventsPerMonth;
  return {
    events: account.eventsThisMonth,
    limit,
    share: account.eventsThisMonth / limit,
    pausedUntil: pausedUntilOf(account, now),
    resetsOn: firstDayOfNextMonth(now),
  };
}

export function accountsInView(
  accounts: readonly Account[],
  now: Date,
  project?: Project,
): AccountsInView {
  return {
    notice: firstNotice(accounts, now)?.notice ?? null,
    canCreateProject: accounts.some(canCreateProjects),
    hasUnfinishedSignUp: ownedAccounts(accounts).some(needsCheckout),
    usage: project === undefined ? null : monthUsageOf(accounts, project, now),
    plan: project === undefined ? null : planBadgeOf(accounts, project),
  };
}

export async function bestEffortAccountsInView(
  now: Date,
  project?: Project,
): Promise<AccountsInView> {
  try {
    return accountsInView(await createAccountsService().list(), now, project);
  } catch (error) {
    console.warn('accounts in view: could not read the accounts, showing none', error);
    return NOTHING_TO_SHOW;
  }
}
