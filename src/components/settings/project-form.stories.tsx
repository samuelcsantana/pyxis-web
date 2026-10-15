import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { type SaveProjectOutcome, timeZoneChoices } from '@/domain/project-management';
import { ProjectForm } from './project-form';

const SAVED = {
  name: 'Demo Store',
  allowedOrigins: ['https://store.example.com', 'https://www.store.example.com'],
  timezone: 'America/Sao_Paulo',
  conversionEvent: 'checkout_completed',
};
const SLOW_SAVE_MS = 60_000;

const meta = {
  title: 'Settings/Project form',
  component: ProjectForm,
  tags: ['autodocs'],
  args: {
    saved: SAVED,
    timezones: timeZoneChoices(SAVED.timezone),
    save: (): Promise<SaveProjectOutcome> => Promise.resolve({ kind: 'saved' }),
  },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
} satisfies Meta<typeof ProjectForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Saved: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Save changes' }));
    await expect(await canvas.findByRole('status')).toHaveTextContent('Saved');
  },
};

export const Saving: Story = {
  args: {
    save: () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve({ kind: 'saved' });
        }, SLOW_SAVE_MS);
      }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Save changes' }));
    await expect(canvas.getByRole('button', { name: 'Saving…' })).toBeDisabled();
  },
};

export const WithProblems: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.clear(canvas.getByRole('textbox', { name: 'Name' }));
    await userEvent.clear(canvas.getByRole('textbox', { name: 'Origin 2' }));
    await userEvent.type(
      canvas.getByRole('textbox', { name: 'Origin 2' }),
      'ftp://store.example.com',
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Save changes' }));
    await expect(await canvas.findAllByRole('alert')).toHaveLength(2);
  },
};

export const WithoutASubscription: Story = {
  args: { save: () => Promise.resolve({ kind: 'subscriptionRequired' }) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Save changes' }));
    await expect(await canvas.findByRole('alert')).toHaveTextContent('no running subscription');
  },
};

export const Failed: Story = {
  args: { save: () => Promise.reject(new Error('Pyxis API answered 503')) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Save changes' }));
    await expect(await canvas.findByRole('alert')).toHaveTextContent('were not saved');
  },
};

export const NothingSetYet: Story = {
  args: { saved: { ...SAVED, allowedOrigins: [], conversionEvent: null } },
};

export const InPortuguese: Story = { globals: { locale: 'pt-BR' } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
