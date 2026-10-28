import type { Account, AccountStatus } from './accounts';
import { FREE_PLAN_PEOPLE, FREE_PLAN_PROJECTS, type FreePlanState } from './sign-up';

export interface FreePlanRoom {
  readonly projects: number;
  readonly people: number;
}

export interface FreePlanExcess {
  readonly projects: number;
  readonly people: number;
}

export type AfterCancelling =
  | { readonly kind: 'backToFreePlan' }
  | {
      readonly kind: 'endsUnlessItFits';
      readonly excess: FreePlanExcess;
      readonly room: FreePlanRoom;
    };

export interface FreePlanFitDue {
  readonly dueAt: string;
  readonly excess: FreePlanExcess;
  readonly room: FreePlanRoom;
}

export const FREE_PLAN_ROOM: FreePlanRoom = {
  projects: FREE_PLAN_PROJECTS,
  people: FREE_PLAN_PEOPLE,
};

const WITHDRAWABLE: ReadonlySet<AccountStatus> = new Set(['active', 'past_due', 'ending']);
const CANCELLABLE: ReadonlySet<AccountStatus> = new Set([
  'trialing',
  'active',
  'past_due',
  'ending',
]);

export function isFreePlanOn(freePlan: FreePlanState): boolean {
  return freePlan !== 'closed';
}

export function excessOver(account: Account, room: FreePlanRoom): FreePlanExcess | null {
  if (account.projectCount === null || account.peopleCount === null) {
    return null;
  }
  return {
    projects: Math.max(account.projectCount - room.projects, 0),
    people: Math.max(account.peopleCount - room.people, 0),
  };
}

export function fitsTheRoom(excess: FreePlanExcess): boolean {
  return excess.projects === 0 && excess.people === 0;
}

export function canWithdraw(account: Account, freePlan: FreePlanState): boolean {
  return account.role === 'owner' && WITHDRAWABLE.has(account.status) && isFreePlanOn(freePlan);
}

export function afterCancelling(
  account: Account,
  freePlan: FreePlanState,
  ownsAnotherFreeAccount: boolean,
): AfterCancelling | null {
  if (
    account.role !== 'owner' ||
    !CANCELLABLE.has(account.status) ||
    !isFreePlanOn(freePlan) ||
    account.boundByFreePlanTerms !== true ||
    ownsAnotherFreeAccount
  ) {
    return null;
  }
  const excess = excessOver(account, FREE_PLAN_ROOM);
  if (excess === null) {
    return null;
  }
  return fitsTheRoom(excess)
    ? { kind: 'backToFreePlan' }
    : { kind: 'endsUnlessItFits', excess, room: FREE_PLAN_ROOM };
}

export function freePlanFitDue(account: Account): FreePlanFitDue | null {
  if (account.status !== 'free' || account.freePlanFitDueAt === null) {
    return null;
  }
  const room = { projects: account.limits.projects, people: account.limits.people };
  const excess = excessOver(account, room);
  return excess === null || fitsTheRoom(excess)
    ? null
    : { dueAt: account.freePlanFitDueAt, excess, room };
}

export function ownsAnotherFreeAccount(account: Account, owned: readonly Account[]): boolean {
  return owned.some((other) => other.id !== account.id && other.status === 'free');
}
