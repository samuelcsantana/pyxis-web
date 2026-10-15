import {
  type Account,
  type BillingRedirectOutcome,
  type CloseAccountOutcome,
  deletionDateOf,
} from '@/domain/accounts';
import { myAccountsResponseSchema } from '@/domain/accounts.schema';
import { TRIAL_DAYS } from '@/domain/sign-up';
import { DEMO_ACCOUNT_ID } from '../projects/demo-project-settings';
import { DEMO_ME_RESPONSE } from '../projects/mock-projects-service';
import type { IAccountsService } from './accounts-service.interface';

const DAY_MS = 24 * 60 * 60 * 1000;
const DEMO_EVENTS_THIS_MONTH = 41_230;
const MEASURED_HOURS_AGO = 3;
const HOUR_MS = 60 * 60 * 1000;

export const DEMO_BILLING_URL = '/account';
export const DEMO_WELCOME_URL = `/welcome?account=${DEMO_ACCOUNT_ID}`;
const DEMO_OWNER_EMAIL = DEMO_ME_RESPONSE.email;

export function demoAccountsWire(now: Date) {
  const trialEnd = new Date(now.getTime() + TRIAL_DAYS * DAY_MS).toISOString();
  return {
    accounts: [
      {
        id: DEMO_ACCOUNT_ID,
        role: 'owner',
        status: 'trialing',
        billing_interval: 'month',
        trial_ends_at: trialEnd,
        current_period_ends_at: trialEnd,
        access_ends_at: null,
        ingestion_paused_until: null,
        suspended_at: null,
        suspension_reason: null,
        deletion_held_at: null,
        month: now.toISOString().slice(0, 7),
        events_this_month: DEMO_EVENTS_THIS_MONTH,
        measured_at: new Date(now.getTime() - MEASURED_HOURS_AGO * HOUR_MS).toISOString(),
        limits: { events_per_month: 100_000, projects: 3, people: 3 },
      },
    ],
  };
}

export class MockAccountsService implements IAccountsService {
  constructor(private readonly now: () => Date = () => new Date()) {}

  list(): Promise<readonly Account[]> {
    return Promise.resolve(myAccountsResponseSchema.parse(demoAccountsWire(this.now())));
  }

  checkout(): Promise<BillingRedirectOutcome> {
    return Promise.resolve({ kind: 'redirect', url: DEMO_WELCOME_URL });
  }

  portal(): Promise<BillingRedirectOutcome> {
    return Promise.resolve({ kind: 'redirect', url: DEMO_BILLING_URL });
  }

  close(_accountId: string, confirmEmail: string): Promise<CloseAccountOutcome> {
    if (confirmEmail.trim().toLowerCase() !== DEMO_OWNER_EMAIL) {
      return Promise.resolve({ kind: 'confirmationMismatch' });
    }
    const accessEndsAt = this.now().toISOString();
    return Promise.resolve({
      kind: 'closed',
      accessEndsAt,
      deletionOn: deletionDateOf(accessEndsAt),
      refundedAmount: 0,
    });
  }
}
