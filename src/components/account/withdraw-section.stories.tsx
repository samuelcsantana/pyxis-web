import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import type { WithdrawOutcome } from '@/domain/accounts';
import { type Withdraw, WithdrawSection } from './withdraw-section';

const WITHDRAWN: WithdrawOutcome = { kind: 'withdrawn', refundedAmount: 3900, fitBy: null };
const WITHDRAWN_TO_FIT: WithdrawOutcome = {
  kind: 'withdrawn',
  refundedAmount: 0,
  fitBy: '2026-12-20T12:00:00.000Z',
};

const withdrawWithARefund: Withdraw = () => Promise.resolve(WITHDRAWN);

function RefreshedAfterWithdrawing({ withdraw }: { readonly withdraw: Withdraw }) {
  const [open, setOpen] = useState(true);
  return (
    <WithdrawSection
      open={open}
      withdraw={async () => {
        const outcome = await withdraw();
        setOpen(outcome.kind !== 'withdrawn');
        return outcome;
      }}
    />
  );
}

const meta = {
  title: 'Account/Withdraw section',
  component: WithdrawSection,
  tags: ['autodocs'],
  args: { open: true, withdraw: withdrawWithARefund },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
} satisfies Meta<typeof WithdrawSection>;

export default meta;
type Story = StoryObj<typeof meta>;

async function askToWithdraw(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByRole('button', { name: 'Withdraw from the subscription' }));
  return canvas;
}

async function withdraw(canvasElement: HTMLElement) {
  const canvas = await askToWithdraw(canvasElement);
  await userEvent.click(canvas.getByRole('button', { name: 'Withdraw and get the refund' }));
  return canvas;
}

export const Default: Story = {};

export const Confirming: Story = {
  play: async ({ canvasElement }) => {
    const canvas = await askToWithdraw(canvasElement);
    await expect(canvas.getByText(/^Withdraw now\?/)).toHaveFocus();
  },
};

export const Withdrawn: Story = {
  render: (args) => <RefreshedAfterWithdrawing withdraw={args.withdraw} />,
  play: async ({ canvasElement }) => {
    const canvas = await withdraw(canvasElement);
    await expect(await canvas.findByRole('status')).toHaveTextContent('were refunded');
  },
};

export const WithdrawnWithAnAccountToFit: Story = {
  args: { withdraw: () => Promise.resolve(WITHDRAWN_TO_FIT) },
  play: async ({ canvasElement }) => {
    const canvas = await withdraw(canvasElement);
    await expect(await canvas.findByRole('status')).toHaveTextContent('make it fit by');
  },
};

export const SevenDaysOver: Story = {
  args: { withdraw: () => Promise.resolve<WithdrawOutcome>({ kind: 'windowClosed' }) },
  play: async ({ canvasElement }) => {
    const canvas = await withdraw(canvasElement);
    await expect(await canvas.findByRole('alert')).toHaveTextContent('The 7 days to withdraw');
  },
};

export const FreePlanClosed: Story = {
  args: { withdraw: () => Promise.resolve<WithdrawOutcome>({ kind: 'freePlanClosed' }) },
  play: async ({ canvasElement }) => {
    const canvas = await withdraw(canvasElement);
    await expect(await canvas.findByRole('alert')).toHaveTextContent('The free plan is closed');
  },
};

export const InPortuguese: Story = { globals: { locale: 'pt-BR' } };

export const ConfirmingInPortuguese: Story = {
  globals: { locale: 'pt-BR' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Desistir da assinatura' }));
    await expect(canvas.getByText(/^Desistir agora\?/)).toHaveFocus();
  },
};

export const DarkTheme: Story = { globals: { theme: 'dark' } };
