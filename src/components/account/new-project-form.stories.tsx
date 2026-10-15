import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { type CreateProjectOutcome, timeZoneChoices } from '@/domain/project-management';
import { NewProjectForm } from './new-project-form';

const meta = {
  title: 'Account/New project form',
  component: NewProjectForm,
  tags: ['autodocs'],
  args: {
    timezones: timeZoneChoices('UTC'),
    projectLimit: 3,
    create: (): Promise<CreateProjectOutcome> => Promise.resolve({ kind: 'limitReached' }),
    localTimeZone: () => 'America/Sao_Paulo',
  },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
} satisfies Meta<typeof NewProjectForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithProblems: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox', { name: 'Site address' }), 'ftp://shop');
    await userEvent.click(canvas.getByRole('button', { name: 'Create project' }));
    await expect(await canvas.findAllByRole('alert')).toHaveLength(2);
  },
};

export const AccountFull: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox', { name: 'Project name' }), 'Shop');
    await userEvent.type(
      canvas.getByRole('textbox', { name: 'Site address' }),
      'https://shop.example.com',
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Create project' }));
    await expect(await canvas.findByRole('alert')).toHaveTextContent('3 projects');
  },
};

export const InSpanish: Story = { globals: { locale: 'es' } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
