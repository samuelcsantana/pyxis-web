import { type AccountNotice, firstNotice } from '@/domain/accounts';
import { createAccountsService } from '@/services/accounts/accounts-service.factory';

export async function bestEffortAccountNotice(now: Date): Promise<AccountNotice | null> {
  try {
    return firstNotice(await createAccountsService().list(), now)?.notice ?? null;
  } catch (error) {
    console.warn('account notice: could not read the accounts, showing none', error);
    return null;
  }
}
