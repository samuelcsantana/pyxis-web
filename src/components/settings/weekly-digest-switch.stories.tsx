import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import type { EmailPreferences } from '@/domain/email-preferences';
import { WeeklyDigestSwitch } from './weekly-digest-switch';

const SLOW_SAVE_MS = 60_000;

const saveRightAway = (chosen: EmailPreferences) => Promise.resolve(chosen);

const saveSlowly = (chosen: EmailPreferences) =>
  new Promise<EmailPreferences>((resolve) => {
    setTimeout(() => {
      resolve(chosen);
    }, SLOW_SAVE_MS);
  });

const failToSave = () => Promise.reject(new Error('Pyxis API answered 503'));

const meta = {
  title: 'Settings/Weekly digest switch',
  component: WeeklyDigestSwitch,
  tags: ['autodocs'],
  args: {
    initial: { weeklyDigest: true },
    timezone: 'America/Sao_Paulo',
    choose: saveRightAway,
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof WeeklyDigestSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const On: Story = {};

export const Off: Story = { args: { initial: { weeklyDigest: false } } };

export const Saving: Story = {
  args: { choose: saveSlowly },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('switch'));
    await expect(canvas.getByText('Saving…')).toBeInTheDocument();
  },
};

export const Saved: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('switch'));
    await expect(await canvas.findByText('Saved', {}, { timeout: 2000 })).toBeInTheDocument();
  },
};

export const Failed: Story = {
  args: { choose: failToSave },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('switch'));
    await expect(await canvas.findByRole('alert', {}, { timeout: 2000 })).toBeInTheDocument();
  },
};

export const DarkTheme: Story = { globals: { theme: 'dark' } };
