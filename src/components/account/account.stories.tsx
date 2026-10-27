import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { Account, BillingRedirectOutcome, CloseAccountOutcome } from '@/domain/accounts';
import { myAccountsResponseSchema } from '@/domain/accounts.schema';
import { demoAccountsWire } from '@/services/accounts/mock-accounts-service';
import { english } from '@/test-utils/english';
import { AccountOverview } from './account-overview';

const STORY_NOW = new Date('2026-11-20T12:00:00.000Z');
const [DEMO] = myAccountsResponseSchema.parse(demoAccountsWire(STORY_NOW));
if (DEMO === undefined) {
  throw new Error('The demo has an account.');
}
const stay = (): Promise<BillingRedirectOutcome> => Promise.resolve({ kind: 'noBillingYet' });
const refuseToClose = (): Promise<CloseAccountOutcome> =>
  Promise.resolve({ kind: 'confirmationMismatch' });

const meta = {
  title: 'Account/Account overview',
  component: AccountOverview,
  tags: ['autodocs'],
  args: {
    account: DEMO,
    i18n: english,
    now: STORY_NOW,
    openCheckout: stay,
    openPortal: stay,
    close: refuseToClose,
  },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
} satisfies Meta<typeof AccountOverview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FreeTrial: Story = {};

export const Active: Story = {
  args: { account: { ...DEMO, status: 'active', billingInterval: 'year', trialEndsAt: null } },
};

export const PaymentFailed: Story = { args: { account: { ...DEMO, status: 'past_due' } } };

export const Ending: Story = {
  args: { account: { ...DEMO, status: 'ending', accessEndsAt: '2026-12-01T00:00:00.000Z' } },
};

export const Ended: Story = {
  args: {
    account: {
      ...DEMO,
      status: 'ended',
      accessEndsAt: '2026-11-10T00:00:00.000Z',
      eventsThisMonth: 0,
    },
  },
};

export const Suspended: Story = {
  args: {
    account: {
      ...DEMO,
      status: 'active',
      trialEndsAt: null,
      suspendedAt: '2026-11-19T10:00:00.000Z',
      suspensionReason: 'Events carried e-mail addresses.',
    },
  },
};

export const SuspendedInPortuguese: Story = {
  args: {
    account: {
      ...DEMO,
      status: 'active',
      trialEndsAt: null,
      suspendedAt: '2026-11-19T10:00:00.000Z',
      suspensionReason: 'Os eventos traziam endereços de e-mail.',
    },
  },
  globals: { locale: 'pt-BR' },
};

export const EndedWithDeletionOnHold: Story = {
  args: {
    account: {
      ...DEMO,
      status: 'ended',
      accessEndsAt: '2026-11-10T00:00:00.000Z',
      deletionHeldAt: '2026-11-12T00:00:00.000Z',
      eventsThisMonth: 0,
    },
  },
};

export const SignUpNotFinished: Story = {
  args: {
    account: {
      ...DEMO,
      status: 'incomplete',
      billingInterval: null,
      trialEndsAt: null,
      eventsThisMonth: null,
      measuredAt: null,
    },
  },
};

export const MeasuringPaused: Story = {
  args: {
    account: {
      ...DEMO,
      status: 'active',
      eventsThisMonth: 151_000,
      ingestionPausedUntil: '2026-12-01T00:00:00.000Z',
    },
  },
};

export const EndedSubscribeAgainInPortuguese: Story = {
  args: {
    account: {
      ...DEMO,
      status: 'ended',
      billingInterval: 'month',
      accessEndsAt: '2026-11-10T00:00:00.000Z',
      eventsThisMonth: 0,
    },
  },
  globals: { locale: 'pt-BR' },
};

export const EndedSubscribeAgainInSpanish: Story = {
  args: {
    account: {
      ...DEMO,
      status: 'ended',
      billingInterval: 'month',
      accessEndsAt: '2026-11-10T00:00:00.000Z',
      eventsThisMonth: 0,
    },
  },
  globals: { locale: 'es' },
};

export const ExemptFromThePause: Story = {
  args: {
    account: {
      ...DEMO,
      status: 'active',
      trialEndsAt: null,
      eventsThisMonth: 160_000,
      quotaPauseExemptUntil: '2027-01-01T00:00:00.000Z',
    },
  },
};

const FREE_PLAN: Account = {
  ...DEMO,
  status: 'free',
  billingInterval: null,
  trialEndsAt: null,
  currentPeriodEndsAt: null,
  eventsThisMonth: 3_120,
  limits: { eventsPerMonth: 10_000, projects: 1, people: 1, pauseAtEvents: 10_000 },
};

export const FreePlan: Story = { args: { account: FREE_PLAN } };

export const FreePlanPaused: Story = {
  args: {
    account: {
      ...FREE_PLAN,
      eventsThisMonth: 10_000,
      ingestionPausedUntil: '2026-12-01T00:00:00.000Z',
    },
  },
};

export const FreePlanInPortuguese: Story = {
  args: { account: FREE_PLAN },
  globals: { locale: 'pt-BR' },
};

export const InPortuguese: Story = { globals: { locale: 'pt-BR' } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
