import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import type { EmailPreferenceChoice, EmailPreferences } from '@/domain/email-preferences';
import { EmailPreferenceSwitches } from './email-preference-switches';

const SLOW_SAVE_MS = 60_000;

const ALL_ON: EmailPreferences = {
  weeklyDigest: true,
  noEventsAlert: true,
  failedWritesAlert: true,
  conversionDropAlert: true,
};

const ALL_OFF: EmailPreferences = {
  weeklyDigest: false,
  noEventsAlert: false,
  failedWritesAlert: false,
  conversionDropAlert: false,
};

const saveRightAway = (choice: EmailPreferenceChoice) =>
  Promise.resolve({ ...ALL_ON, [choice.preference]: choice.on });

const saveSlowly = (choice: EmailPreferenceChoice) =>
  new Promise<EmailPreferences>((resolve) => {
    setTimeout(() => {
      resolve({ ...ALL_ON, [choice.preference]: choice.on });
    }, SLOW_SAVE_MS);
  });

const failToSave = () => Promise.reject(new Error('Pyxis API answered 503'));

const meta = {
  title: 'Settings/E-mail preference switches',
  component: EmailPreferenceSwitches,
  tags: ['autodocs'],
  args: {
    initial: ALL_ON,
    timezone: 'America/Sao_Paulo',
    choose: saveRightAway,
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof EmailPreferenceSwitches>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllOn: Story = {};

export const AllOff: Story = { args: { initial: ALL_OFF } };

export const Saving: Story = {
  args: { choose: saveSlowly },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('switch', { name: 'No events' }));
    await expect(canvas.getByText('Saving…')).toBeInTheDocument();
  },
};

export const Saved: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('switch', { name: 'Failed writes' }));
    await expect(await canvas.findByText('Saved', {}, { timeout: 2000 })).toBeInTheDocument();
  },
};

export const Failed: Story = {
  args: { choose: failToSave },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('switch', { name: 'Conversion drop' }));
    await expect(await canvas.findByRole('alert', {}, { timeout: 2000 })).toBeInTheDocument();
  },
};

export const DarkTheme: Story = { globals: { theme: 'dark' } };
