'use server';

import { z } from 'zod';
import {
  BILLING_INTERVALS,
  type BillingInterval,
  type BillingRedirectOutcome,
  type CloseAccountOutcome,
  type WithdrawOutcome,
} from '@/domain/accounts';
import { currentLocale } from '@/i18n/current-locale';
import { readOrSignIn } from '@/lib/current-admin';
import { rememberFreePlanCheckout } from '@/lib/free-plan-checkout';
import { createAccountsService } from '@/services/accounts/accounts-service.factory';

const accountIdSchema = z.uuid();
const intervalSchema = z.enum(BILLING_INTERVALS);
const MAX_EMAIL_LENGTH = 254;
const confirmEmailSchema = z.email().max(MAX_EMAIL_LENGTH);

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

export async function subscribeFromFreePlan(
  accountId: string,
  interval: BillingInterval,
): Promise<BillingRedirectOutcome> {
  const outcome = await openCheckout(accountId, interval);
  if (outcome.kind === 'redirect') {
    await rememberFreePlanCheckout(accountIdOf(accountId));
  }
  return outcome;
}

export async function openBillingPortal(accountId: string): Promise<BillingRedirectOutcome> {
  const id = accountIdOf(accountId);
  const locale = await currentLocale();
  return readOrSignIn(() => createAccountsService().portal(id, locale));
}

export async function closeAccount(
  accountId: string,
  confirmEmail: string,
): Promise<CloseAccountOutcome> {
  const id = accountIdOf(accountId);
  const parsed = confirmEmailSchema.safeParse(confirmEmail.trim());
  if (!parsed.success) {
    return { kind: 'confirmationMismatch' };
  }
  return readOrSignIn(() => createAccountsService().close(id, parsed.data));
}

export async function withdrawToFreePlan(accountId: string): Promise<WithdrawOutcome> {
  const id = accountIdOf(accountId);
  return readOrSignIn(() => createAccountsService().withdraw(id));
}
