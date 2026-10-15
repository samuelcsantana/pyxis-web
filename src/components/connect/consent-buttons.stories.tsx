import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { type AllowConnection, ConsentButtons, type DenyConnection } from './consent-buttons';

const answerNever = () => new Promise<never>(() => undefined);
const allowNever: AllowConnection = answerNever;
const denyNever: DenyConnection = answerNever;

const meta = {
  title: 'Connect/Consent buttons',
  component: ConsentButtons,
  tags: ['autodocs'],
  args: {
    app: 'Claude',
    allow: allowNever,
    deny: denyNever,
    limitReached: false,
    settingsHref: '/6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d/settings',
  },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
} satisfies Meta<typeof ConsentButtons>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Allowing: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Allow' }));
    await expect(await canvas.findByRole('button', { name: 'Allowing…' })).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Cancel' })).toBeDisabled();
  },
};

export const RequestEndedMeanwhile: Story = {
  args: { allow: () => Promise.resolve({ kind: 'gone' }) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Allow' }));
    await expect(await canvas.findByRole('alert')).toHaveTextContent(
      'It was already answered, or more than 10 minutes went by.',
    );
  },
};

export const TenAppsConnected: Story = { args: { limitReached: true } };

export const Failed: Story = {
  args: { allow: () => Promise.reject(new Error('Pyxis API answered 503')) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Allow' }));
    await expect(await canvas.findByRole('alert')).toHaveTextContent('Nothing was sent.');
  },
};

export const DarkTheme: Story = { args: { limitReached: true }, globals: { theme: 'dark' } };
