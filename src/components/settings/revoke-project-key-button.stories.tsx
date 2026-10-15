import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ReactNode } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import type { RevokeProjectKeyOutcome } from '@/domain/project-management';
import { DEMO_CREATED_KEY_ID } from '@/services/project-management/mock-project-management-service';
import { RevokeProjectKeyButton } from './revoke-project-key-button';

const KEY_LABEL_ID = 'story-project-key';
const DESCRIBED = { description: 'pyxis_pk_DemoPublicKeyThatSendsNothing0' };

const meta = {
  title: 'Settings/Revoke project key button',
  component: RevokeProjectKeyButton,
  tags: ['autodocs'],
  args: {
    keyId: DEMO_CREATED_KEY_ID,
    describedBy: KEY_LABEL_ID,
    revoke: (): Promise<RevokeProjectKeyOutcome> => Promise.resolve({ kind: 'revoked' }),
  },
  decorators: [
    (Story: () => ReactNode) => (
      <div className="flex items-start justify-between gap-4">
        <code id={KEY_LABEL_ID}>pyxis_pk_DemoPublicKeyThatSendsNothing0</code>
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
} satisfies Meta<typeof RevokeProjectKeyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Revoked: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', DESCRIBED));
    await expect(await canvas.findByRole('status')).toHaveTextContent('Key revoked');
  },
};

export const LastPublicKey: Story = {
  args: { revoke: () => Promise.resolve({ kind: 'lastPublicKey' }) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', DESCRIBED));
    await expect(await canvas.findByRole('alert')).toHaveTextContent('The last public key stays');
  },
};

export const Failed: Story = {
  args: { revoke: () => Promise.reject(new Error('Pyxis API answered 503')) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', DESCRIBED));
    await expect(await canvas.findByRole('alert')).toHaveTextContent('That did not work');
  },
};

export const DarkTheme: Story = { globals: { theme: 'dark' } };
