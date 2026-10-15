import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import type { AddPersonOutcome } from '@/domain/project-people';
import { AddPersonForm } from './add-person-form';

const SLOW_ADD_MS = 60_000;

const meta = {
  title: 'Settings/Add person form',
  component: AddPersonForm,
  tags: ['autodocs'],
  args: {
    add: (email: string): Promise<AddPersonOutcome> =>
      Promise.resolve({
        kind: 'added',
        invited: true,
        person: {
          adminUserId: 'a03c5e7f-9b1d-4c4e-9f6a-8b0c2d4e6f8a',
          email,
          role: 'member',
          addedAt: '2026-10-15T12:00:00.000Z',
        },
      }),
  },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
} satisfies Meta<typeof AddPersonForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Adding: Story = {
  args: {
    add: () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve({ kind: 'limitReached' });
        }, SLOW_ADD_MS);
      }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox'), 'ana@example.com');
    await userEvent.click(canvas.getByRole('button', { name: 'Add person' }));
    await expect(canvas.getByRole('button', { name: 'Adding…' })).toBeDisabled();
  },
};

export const NotAnAddress: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox'), 'ana@');
    await userEvent.click(canvas.getByRole('button', { name: 'Add person' }));
    await expect(await canvas.findByRole('alert')).toHaveTextContent('Write an e-mail address');
  },
};

export const Failed: Story = {
  args: { add: () => Promise.reject(new Error('Pyxis API answered 503')) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox'), 'ana@example.com');
    await userEvent.click(canvas.getByRole('button', { name: 'Add person' }));
    await expect(await canvas.findByRole('alert')).toHaveTextContent('Nobody was added');
  },
};

export const InSpanish: Story = { globals: { locale: 'es' } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
