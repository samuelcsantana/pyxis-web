import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import type { CloseAccountOutcome } from '@/domain/accounts';
import { MockAccountsService } from '@/services/accounts/mock-accounts-service';
import { DEMO_ACCOUNT_ID } from '@/services/projects/demo-project-settings';
import type { CloseAccount } from './close-account-form';
import { CloseAccountSection } from './close-account-section';

const ACCOUNTS = new MockAccountsService(() => new Date('2026-11-20T12:00:00.000Z'));
const OWNER_EMAIL = 'owner@example.com';
const REFUNDED: CloseAccountOutcome = {
  kind: 'closed',
  accessEndsAt: '2026-11-20T12:00:00.000Z',
  deletionOn: '2026-12-20T12:00:00.000Z',
  refundedAmount: 3900,
};

function RefreshedAfterClosing({ close }: { readonly close: CloseAccount }) {
  const [open, setOpen] = useState(true);
  return (
    <CloseAccountSection
      open={open}
      close={async (email) => {
        const outcome = await close(email);
        setOpen(outcome.kind !== 'closed');
        return outcome;
      }}
    />
  );
}

const meta = {
  title: 'Account/Close account section',
  component: CloseAccountSection,
  tags: ['autodocs'],
  args: {
    open: true,
    close: (email: string): Promise<CloseAccountOutcome> => ACCOUNTS.close(DEMO_ACCOUNT_ID, email),
  },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
} satisfies Meta<typeof CloseAccountSection>;

export default meta;
type Story = StoryObj<typeof meta>;

async function closeTheAccount(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  await userEvent.type(canvas.getByRole('textbox'), OWNER_EMAIL);
  await userEvent.click(canvas.getByRole('button', { name: 'Close the account for good' }));
  return canvas.findByRole('status');
}

export const Default: Story = {};

export const Closed: Story = {
  play: async ({ canvasElement }) => {
    await expect(await closeTheAccount(canvasElement)).toHaveTextContent('The account is closed.');
  },
};

export const Refunded: Story = {
  args: { close: () => Promise.resolve(REFUNDED) },
  play: async ({ canvasElement }) => {
    await expect(await closeTheAccount(canvasElement)).toHaveTextContent('were refunded');
  },
};

export const StaysAfterTheRefresh: Story = {
  args: { close: () => Promise.resolve(REFUNDED) },
  render: (args) => <RefreshedAfterClosing close={args.close} />,
  play: async ({ canvasElement }) => {
    const status = await closeTheAccount(canvasElement);
    await expect(status).toHaveTextContent('The account is closed.');
    await expect(status).toHaveTextContent('were refunded');
  },
};

export const InPortuguese: Story = { globals: { locale: 'pt-BR' } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
