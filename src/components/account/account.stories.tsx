import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { BillingRedirectOutcome, CloseAccountOutcome } from '@/domain/accounts';
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

export const InPortuguese: Story = { globals: { locale: 'pt-BR' } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
