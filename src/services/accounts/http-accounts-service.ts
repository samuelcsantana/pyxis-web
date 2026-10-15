import type {
  Account,
  BillingInterval,
  BillingRedirectOutcome,
  CloseAccountOutcome,
} from '@/domain/accounts';
import {
  billingRedirectResponseSchema,
  checkoutWire,
  closeAccountWire,
  closedAccountResponseSchema,
  myAccountsResponseSchema,
  portalWire,
} from '@/domain/accounts.schema';
import { ApiNotFoundError, ApiRequestError } from '@/domain/errors';
import type { ApiReader } from '../api-reader';
import type { ApiWriter } from '../api-writer';
import type { IAccountsService } from './accounts-service.interface';

export const MY_ACCOUNTS_PATH = '/v1/me/accounts';

export const BILLING_ERROR_CODES = {
  noBillingYet: 'no_billing_yet',
  subscriptionExists: 'subscription_exists',
  unavailable: 'billing_unavailable',
  confirmationMismatch: 'confirmation_mismatch',
  accountEnded: 'account_ended',
} as const;

const CLOSURE_REFUSALS: ReadonlyMap<string, CloseAccountOutcome> = new Map([
  [BILLING_ERROR_CODES.confirmationMismatch, { kind: 'confirmationMismatch' }],
  [BILLING_ERROR_CODES.accountEnded, { kind: 'alreadyEnded' }],
  [BILLING_ERROR_CODES.unavailable, { kind: 'unavailable' }],
]);

const REFUSALS: ReadonlyMap<string, BillingRedirectOutcome> = new Map([
  [BILLING_ERROR_CODES.noBillingYet, { kind: 'noBillingYet' }],
  [BILLING_ERROR_CODES.subscriptionExists, { kind: 'subscriptionExists' }],
  [BILLING_ERROR_CODES.unavailable, { kind: 'unavailable' }],
]);

function accountPath(accountId: string): string {
  return `/v1/accounts/${encodeURIComponent(accountId)}`;
}

function refusalOf(error: unknown): BillingRedirectOutcome | undefined {
  if (error instanceof ApiNotFoundError) {
    return { kind: 'unavailable' };
  }
  return error instanceof ApiRequestError && error.code !== null
    ? REFUSALS.get(error.code)
    : undefined;
}

export class HttpAccountsService implements IAccountsService {
  constructor(
    private readonly reader: ApiReader,
    private readonly writer: ApiWriter,
  ) {}

  list(): Promise<readonly Account[]> {
    return this.reader.get(MY_ACCOUNTS_PATH, myAccountsResponseSchema);
  }

  checkout(
    accountId: string,
    interval: BillingInterval,
    locale: string,
  ): Promise<BillingRedirectOutcome> {
    return this.redirect(`${accountPath(accountId)}/checkout`, checkoutWire(interval, locale));
  }

  portal(accountId: string, locale: string): Promise<BillingRedirectOutcome> {
    return this.redirect(`${accountPath(accountId)}/portal`, portalWire(locale));
  }

  async close(accountId: string, confirmEmail: string): Promise<CloseAccountOutcome> {
    try {
      const closed = await this.writer.post(
        `${accountPath(accountId)}/close`,
        closeAccountWire(confirmEmail),
        closedAccountResponseSchema,
      );
      return { kind: 'closed', ...closed };
    } catch (error) {
      const refusal =
        error instanceof ApiRequestError && error.code !== null
          ? CLOSURE_REFUSALS.get(error.code)
          : undefined;
      if (refusal === undefined) {
        throw error;
      }
      return refusal;
    }
  }

  private async redirect(path: string, body: unknown): Promise<BillingRedirectOutcome> {
    try {
      const url = await this.writer.post(path, body, billingRedirectResponseSchema);
      return { kind: 'redirect', url };
    } catch (error) {
      const refusal = refusalOf(error);
      if (refusal === undefined) {
        throw error;
      }
      return refusal;
    }
  }
}
