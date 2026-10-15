import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import type { DeleteProjectOutcome } from '@/domain/project-management';
import { DeleteProjectForm } from './delete-project-form';

const SLOW_DELETE_MS = 60_000;

const meta = {
  title: 'Settings/Delete project form',
  component: DeleteProjectForm,
  tags: ['autodocs'],
  args: {
    projectName: 'Demo Store',
    remove: (): Promise<DeleteProjectOutcome> =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve({ kind: 'deleted' });
        }, SLOW_DELETE_MS);
      }),
  },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
} satisfies Meta<typeof DeleteProjectForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WrongName: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox'), 'Demo');
    await userEvent.click(canvas.getByRole('button', { name: 'Delete project for good' }));
    await expect(await canvas.findByRole('alert')).toHaveTextContent('not this project');
  },
};

export const Deleting: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox'), 'Demo Store');
    await userEvent.click(canvas.getByRole('button', { name: 'Delete project for good' }));
    await expect(canvas.getByRole('button', { name: 'Deleting…' })).toBeDisabled();
  },
};

export const Failed: Story = {
  args: { remove: () => Promise.reject(new Error('Pyxis API answered 503')) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox'), 'Demo Store');
    await userEvent.click(canvas.getByRole('button', { name: 'Delete project for good' }));
    await expect(await canvas.findByRole('alert')).toHaveTextContent('was not deleted');
  },
};

export const DeletionOnHold: Story = {
  args: { remove: () => Promise.resolve({ kind: 'deletionOnHold' }) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox'), 'Demo Store');
    await userEvent.click(canvas.getByRole('button', { name: 'Delete project for good' }));
    await expect(await canvas.findByRole('alert')).toHaveTextContent('holds its deletion');
  },
};

export const InPortuguese: Story = { globals: { locale: 'pt-BR' } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
