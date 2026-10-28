import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { english } from '@/test-utils/english';
import { HelpView } from './help-view';

const meta = {
  title: 'Help/Help and support',
  component: HelpView,
  args: {
    projectId: '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d',
    email: 'owner@example.com',
    plan: 'paid',
    i18n: english,
  },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
  decorators: [
    (Story) => (
      <div className="max-w-3xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof HelpView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PaidPlan: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('hello@pyxis-analytics.dev')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Copy' })).toBeVisible();
    await expect(canvas.queryByText(/On the free plan/)).toBeNull();
  },
};

export const FreePlan: Story = { args: { plan: 'free' } };

export const NoAccount: Story = { args: { plan: null } };

export const InPortuguese: Story = { globals: { locale: 'pt-BR' } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
