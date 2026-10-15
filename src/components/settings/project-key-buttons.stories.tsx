import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import type { CreateProjectKeyOutcome } from '@/domain/project-management';
import {
  DEMO_CREATED_KEY_ID,
  DEMO_CREATED_KEYS,
} from '@/services/project-management/mock-project-management-service';
import { CreateProjectKeyButton } from './create-project-key-button';

const SLOW_CREATE_MS = 60_000;

const meta = {
  title: 'Settings/Create project key button',
  component: CreateProjectKeyButton,
  tags: ['autodocs'],
  args: {
    kind: 'secret',
    create: (kind): Promise<CreateProjectKeyOutcome> =>
      Promise.resolve({
        kind: 'created',
        key: { id: DEMO_CREATED_KEY_ID, kind, key: DEMO_CREATED_KEYS[kind] },
      }),
  },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
} satisfies Meta<typeof CreateProjectKeyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NewSecretKey: Story = {};

export const NewPublicKey: Story = { args: { kind: 'public' } };

export const SecretKeyShownOnce: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'New secret key' }));
    await expect(
      await canvas.findByRole('group', { name: 'Copy the secret key now' }),
    ).toHaveTextContent(DEMO_CREATED_KEYS.secret);
  },
};

export const PublicKeyCreated: Story = {
  args: { kind: 'public' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'New public key' }));
    await expect(await canvas.findByRole('status')).toHaveTextContent('Public key created');
  },
};

export const Creating: Story = {
  args: {
    create: () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve({ kind: 'tooMany' });
        }, SLOW_CREATE_MS);
      }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'New secret key' }));
    await expect(canvas.getByRole('button', { name: 'Creating…' })).toBeDisabled();
  },
};

export const TooMany: Story = {
  args: { create: () => Promise.resolve({ kind: 'tooMany' }) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'New secret key' }));
    await expect(await canvas.findByRole('alert')).toHaveTextContent('5 live keys');
  },
};

export const Failed: Story = {
  args: { create: () => Promise.reject(new Error('Pyxis API answered 503')) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'New secret key' }));
    await expect(await canvas.findByRole('alert')).toHaveTextContent('That did not work');
  },
};

export const DarkTheme: Story = { globals: { theme: 'dark' } };
