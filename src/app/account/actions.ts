'use server';

import { z } from 'zod';
import {
  BILLING_INTERVALS,
  type BillingInterval,
  type BillingRedirectOutcome,
} from '@/domain/accounts';
import { currentLocale } from '@/i18n/current-locale';
import { readOrSignIn } from '@/lib/current-admin';
import { createAccountsService } from '@/services/accounts/accounts-service.factory';

const accountIdSchema = z.uuid();
const intervalSchema = z.enum(BILLING_INTERVALS);

function accountIdOf(accountId: string): string {
  const parsed = accountIdSchema.safeParse(accountId);
  if (!parsed.success) {
    throw new Error('An account is named by its id.');
  }
  return parsed.data;
}

export async function openCheckout(
  accountId: string,
  interval: BillingInterval,
): Promise<BillingRedirectOutcome> {
  const id = accountIdOf(accountId);
  const parsed = intervalSchema.safeParse(interval);
  if (!parsed.success) {
    throw new Error('A plan is billed monthly or yearly.');
  }
  const locale = await currentLocale();
  return readOrSignIn(() => createAccountsService().checkout(id, parsed.data, locale));
}

export async function openBillingPortal(accountId: string): Promise<BillingRedirectOutcome> {
  const id = accountIdOf(accountId);
  const locale = await currentLocale();
  return readOrSignIn(() => createAccountsService().portal(id, locale));
}
