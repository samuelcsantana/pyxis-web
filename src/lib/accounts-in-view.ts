import {
  type Account,
  type AccountNotice,
  canCreateProjects,
  firstNotice,
  needsCheckout,
  ownedAccounts,
} from '@/domain/accounts';
import { createAccountsService } from '@/services/accounts/accounts-service.factory';

export interface AccountsInView {
  readonly notice: AccountNotice | null;
  readonly canCreateProject: boolean;
  readonly hasUnfinishedSignUp: boolean;
}

const NOTHING_TO_SHOW: AccountsInView = {
  notice: null,
  canCreateProject: false,
  hasUnfinishedSignUp: false,
};

export function accountsInView(accounts: readonly Account[], now: Date): AccountsInView {
  return {
    notice: firstNotice(accounts, now)?.notice ?? null,
    canCreateProject: accounts.some(canCreateProjects),
    hasUnfinishedSignUp: ownedAccounts(accounts).some(needsCheckout),
  };
}

export async function bestEffortAccountsInView(now: Date): Promise<AccountsInView> {
  try {
    return accountsInView(await createAccountsService().list(), now);
  } catch (error) {
    console.warn('accounts in view: could not read the accounts, showing none', error);
    return NOTHING_TO_SHOW;
  }
}
