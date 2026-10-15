import type {
  Account,
  BillingInterval,
  BillingRedirectOutcome,
  CloseAccountOutcome,
} from '@/domain/accounts';

export interface IAccountsService {
  list(): Promise<readonly Account[]>;
  checkout(
    accountId: string,
    interval: BillingInterval,
    locale: string,
  ): Promise<BillingRedirectOutcome>;
  portal(accountId: string, locale: string): Promise<BillingRedirectOutcome>;
  close(accountId: string, confirmEmail: string): Promise<CloseAccountOutcome>;
}
