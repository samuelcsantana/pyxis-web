import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import type { BillingRedirectOutcome } from '@/domain/accounts';
import { BillingActions } from './billing-actions';

const SLOW_MS = 60_000;

const slowly = (): Promise<BillingRedirectOutcome> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({ kind: 'unavailable' });
    }, SLOW_MS);
  });

const meta = {
  title: 'Account/Billing actions',
  component: BillingActions,
  tags: ['autodocs'],
  args: {
    kind: 'portal',
    open: (): Promise<BillingRedirectOutcome> => Promise.resolve({ kind: 'noBillingYet' }),
  },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
} satisfies Meta<typeof BillingActions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ManageBilling: Story = {};

export const FinishSubscription: Story = { args: { kind: 'checkout', open: slowly } };

export const Opening: Story = {
  args: { kind: 'checkout', open: slowly },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Yearly' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Finish subscription' }));
    await expect(canvas.getByRole('button', { name: 'Opening Stripe…' })).toBeDisabled();
  },
};

export const Unavailable: Story = {
  args: { open: (): Promise<BillingRedirectOutcome> => Promise.resolve({ kind: 'unavailable' }) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Manage billing' }));
    await expect(await canvas.findByRole('alert')).toHaveTextContent('not available');
  },
};

export const DarkTheme: Story = {
  args: { kind: 'checkout', open: slowly },
  globals: { theme: 'dark' },
};
