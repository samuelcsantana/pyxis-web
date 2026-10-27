import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { PANEL } from '@/components/ui/panel-classes';
import type { AccountLimits } from '@/domain/accounts';
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';
import { FreePlanWelcome } from './free-plan-welcome';

const FREE_PLAN: AccountLimits = {
  eventsPerMonth: 10_000,
  projects: 1,
  people: 1,
  pauseAtEvents: 10_000,
};

const meta = {
  title: 'Sign up/Free plan welcome',
  component: FreePlanWelcome,
  tags: ['autodocs'],
  args: { limits: FREE_PLAN, i18n: english },
  decorators: [
    (Story) => (
      <section className={`max-w-xl ${PANEL}`}>
        <Story />
      </section>
    ),
  ],
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
} satisfies Meta<typeof FreePlanWelcome>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OnTheFreePlan: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('status')).toHaveTextContent('Your account is on the free plan.');
    await expect(canvas.getByRole('link', { name: 'Create your first project' })).toBeVisible();
  },
};

export const WithLimitsTheOperatorRaised: Story = {
  args: { limits: { eventsPerMonth: 25_000, projects: 2, people: 2, pauseAtEvents: 25_000 } },
};

export const InPortuguese: Story = { args: { i18n: portuguese }, globals: { locale: 'pt-BR' } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
