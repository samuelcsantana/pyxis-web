import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ProjectPanel } from './project-panel';

const meta = {
  title: 'Project/ProjectPanel',
  component: ProjectPanel,
  tags: ['autodocs'],
  args: {
    project: {
      id: '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d',
      name: 'Demo Store',
      timezone: 'America/Sao_Paulo',
      conversionEvent: 'signup_completed',
    },
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ProjectPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithConversionEvent: Story = {};

export const WithoutConversionEvent: Story = {
  args: {
    project: {
      id: '0c9b8a7d-6e5f-4a3b-8c2d-1e0f9a8b7c6d',
      name: 'Demo Docs',
      timezone: 'Europe/Lisbon',
      conversionEvent: null,
    },
  },
};

export const DarkTheme: Story = { globals: { theme: 'dark' } };
