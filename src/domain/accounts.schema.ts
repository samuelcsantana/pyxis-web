import { z } from 'zod';
import {
  ACCOUNT_ROLES,
  ACCOUNT_STATUSES,
  type Account,
  BILLING_INTERVALS,
  type BillingInterval,
} from './accounts';

const accountWireSchema = z.object({
  id: z.string(),
  role: z.enum(ACCOUNT_ROLES),
  status: z.enum(ACCOUNT_STATUSES),
  billing_interval: z.enum(BILLING_INTERVALS).nullable(),
  trial_ends_at: z.string().nullable(),
  current_period_ends_at: z.string().nullable(),
  access_ends_at: z.string().nullable(),
  ingestion_paused_until: z.string().nullable(),
  suspended_at: z.string().nullable(),
  suspension_reason: z.string().nullable(),
  deletion_held_at: z.string().nullable(),
  quota_pause_exempt_until: z.string().nullable(),
  free_waitlisted_at: z.string().nullable().default(null),
  free_plan_fit_due_at: z.string().nullable().default(null),
  project_count: z.number().int().nullable().default(null),
  people_count: z.number().int().nullable().default(null),
  bound_by_free_plan_terms: z.boolean().nullable().default(null),
  month: z.string(),
  events_this_month: z.number().int().nullable(),
  measured_at: z.string().nullable(),
  limits: z.object({
    events_per_month: z.number().int(),
    projects: z.number().int(),
    people: z.number().int(),
    pause_at_events: z.number().int(),
  }),
});

function fromWire(body: z.infer<typeof accountWireSchema>): Account {
  return {
    id: body.id,
    role: body.role,
    status: body.status,
    billingInterval: body.billing_interval,
    trialEndsAt: body.trial_ends_at,
    currentPeriodEndsAt: body.current_period_ends_at,
    accessEndsAt: body.access_ends_at,
    ingestionPausedUntil: body.ingestion_paused_until,
    suspendedAt: body.suspended_at,
    suspensionReason: body.suspension_reason,
    deletionHeldAt: body.deletion_held_at,
    quotaPauseExemptUntil: body.quota_pause_exempt_until,
    freeWaitlistedAt: body.free_waitlisted_at,
    freePlanFitDueAt: body.free_plan_fit_due_at,
    projectCount: body.project_count,
    peopleCount: body.people_count,
    boundByFreePlanTerms: body.bound_by_free_plan_terms,
    month: body.month,
    eventsThisMonth: body.events_this_month,
    measuredAt: body.measured_at,
    limits: {
      eventsPerMonth: body.limits.events_per_month,
      projects: body.limits.projects,
      people: body.limits.people,
      pauseAtEvents: body.limits.pause_at_events,
    },
  };
}

export const myAccountsResponseSchema = z
  .object({ accounts: z.array(accountWireSchema) })
  .transform((body): readonly Account[] => body.accounts.map(fromWire));

export const billingRedirectResponseSchema = z
  .object({ url: z.url() })
  .transform((body) => body.url);

export function checkoutWire(interval: BillingInterval, locale: string) {
  return { interval, locale };
}

export const closedAccountResponseSchema = z
  .object({
    access_ends_at: z.string(),
    deletion_on: z.string(),
    refunded_amount: z.number().int(),
  })
  .transform((body) => ({
    accessEndsAt: body.access_ends_at,
    deletionOn: body.deletion_on,
    refundedAmount: body.refunded_amount,
  }));

export const withdrawnResponseSchema = z
  .object({
    status: z.literal('free'),
    refunded_amount: z.number().int(),
    fit_by: z.string().nullable(),
  })
  .transform((body) => ({ refundedAmount: body.refunded_amount, fitBy: body.fit_by }));

export function closeAccountWire(confirmEmail: string) {
  return { confirm_email: confirmEmail.trim() };
}

export function portalWire(locale: string) {
  return { locale };
}
