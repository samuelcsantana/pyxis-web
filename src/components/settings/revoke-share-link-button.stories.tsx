import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { RevokeShareLinkButton } from './revoke-share-link-button';

const SLOW_REVOKE_MS = 60_000;

const meta = {
  title: 'Settings/Revoke share link button',
  component: RevokeShareLinkButton,
  tags: ['autodocs'],
  args: {
    linkId: '4d0f6b8c-5e7a-4f9b-8c4d-6e8f0a2b4c5d',
    name: 'Monthly board report',
    describedBy: 'story-link-name',
    revoke: () => Promise.resolve(),
  },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
} satisfies Meta<typeof RevokeShareLinkButton>;

export default meta;
type Story = StoryObj<typeof meta>;

async function askToRevoke(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByRole('button', { name: 'Revoke' }));
  return canvas;
}

export const Default: Story = {};

export const Confirming: Story = {
  play: async ({ canvasElement }) => {
    const canvas = await askToRevoke(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Revoke the link' })).toHaveFocus();
  },
};

export const Revoking: Story = {
  args: {
    revoke: () =>
      new Promise((resolve) => {
        setTimeout(resolve, SLOW_REVOKE_MS);
      }),
  },
  play: async ({ canvasElement }) => {
    const canvas = await askToRevoke(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Revoke the link' }));
    await expect(canvas.getByRole('button', { name: 'Revoking…' })).toBeDisabled();
  },
};

export const Revoked: Story = {
  play: async ({ canvasElement }) => {
    const canvas = await askToRevoke(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Revoke the link' }));
    await expect(await canvas.findByRole('status')).toHaveTextContent('Revoked');
  },
};

export const Failed: Story = {
  args: { revoke: () => Promise.reject(new Error('Pyxis API answered 503')) },
  play: async ({ canvasElement }) => {
    const canvas = await askToRevoke(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Revoke the link' }));
    await expect(await canvas.findByRole('alert')).toHaveTextContent('Could not revoke it');
  },
};

export const DarkTheme: Story = {
  globals: { theme: 'dark' },
  play: async ({ canvasElement }) => {
    await askToRevoke(canvasElement);
  },
};
