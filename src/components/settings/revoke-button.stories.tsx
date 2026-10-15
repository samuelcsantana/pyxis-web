import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ReactNode } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { DEMO_ACCESS_TOKEN_IDS } from '@/services/access-tokens/mock-access-tokens-service';
import { RevokeButton } from './revoke-button';

const SLOW_REVOKE_MS = 60_000;
const NAME_ID = 'story-token-name';
const DESCRIBED = { description: 'Claude Code' };

const revokeRightAway = () => Promise.resolve();

const revokeSlowly = () =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, SLOW_REVOKE_MS);
  });

const failToRevoke = () => Promise.reject(new Error('Pyxis API answered 503'));

const meta = {
  title: 'Settings/Revoke button',
  component: RevokeButton,
  tags: ['autodocs'],
  args: {
    id: DEMO_ACCESS_TOKEN_IDS.agent,
    describedBy: NAME_ID,
    revoke: revokeRightAway,
    texts: 'accessTokens',
  },
  decorators: [
    (Story: () => ReactNode) => (
      <div className="flex items-center justify-between gap-4">
        <span id={NAME_ID}>Claude Code</span>
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
} satisfies Meta<typeof RevokeButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Revoking: Story = {
  args: { revoke: revokeSlowly },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', DESCRIBED));
    await expect(canvas.getByRole('button', DESCRIBED)).toBeDisabled();
  },
};

export const Revoked: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', DESCRIBED));
    await expect(await canvas.findByRole('status')).toHaveTextContent('Token revoked');
  },
};

export const Failed: Story = {
  args: { revoke: failToRevoke },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', DESCRIBED));
    await expect(await canvas.findByRole('alert')).toHaveTextContent('The token was not revoked');
  },
};

export const DarkTheme: Story = { globals: { theme: 'dark' } };
