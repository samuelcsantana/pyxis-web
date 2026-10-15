import type { Account, BillingInterval, BillingRedirectOutcome } from '@/domain/accounts';

export interface IAccountsService {
  list(): Promise<readonly Account[]>;
  checkout(
    accountId: string,
    interval: BillingInterval,
    locale: string,
  ): Promise<BillingRedirectOutcome>;
  portal(accountId: string, locale: string): Promise<BillingRedirectOutcome>;
}
