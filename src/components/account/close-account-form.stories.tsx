import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import type { CloseAccountOutcome } from '@/domain/accounts';
import { MockAccountsService } from '@/services/accounts/mock-accounts-service';
import { DEMO_ACCOUNT_ID } from '@/services/projects/demo-project-settings';
import { CloseAccountForm } from './close-account-form';

const ACCOUNTS = new MockAccountsService(() => new Date('2026-11-20T12:00:00.000Z'));

const meta = {
  title: 'Account/Close account form',
  component: CloseAccountForm,
  tags: ['autodocs'],
  args: {
    close: (email: string): Promise<CloseAccountOutcome> => ACCOUNTS.close(DEMO_ACCOUNT_ID, email),
  },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
} satisfies Meta<typeof CloseAccountForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Closed: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox'), 'owner@demo-store.example');
    await userEvent.click(canvas.getByRole('button', { name: 'Close the account for good' }));
    await expect(await canvas.findByRole('status')).toHaveTextContent('The account is closed.');
  },
};

export const Refunded: Story = {
  args: {
    close: () =>
      Promise.resolve({
        kind: 'closed',
        accessEndsAt: '2026-11-20T12:00:00.000Z',
        deletionOn: '2026-12-20T12:00:00.000Z',
        refundedAmount: 3900,
      }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox'), 'owner@demo-store.example');
    await userEvent.click(canvas.getByRole('button', { name: 'Close the account for good' }));
    await expect(await canvas.findByRole('status')).toHaveTextContent('were refunded');
  },
};

export const WrongAddress: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox'), 'someone@example.com');
    await userEvent.click(canvas.getByRole('button', { name: 'Close the account for good' }));
    await expect(await canvas.findByRole('alert')).toHaveTextContent('not your e-mail address');
  },
};

export const InPortuguese: Story = { globals: { locale: 'pt-BR' } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
