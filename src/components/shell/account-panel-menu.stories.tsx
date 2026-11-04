import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import type { MonthUsage } from '@/lib/accounts-in-view';
import { english } from '@/test-utils/english';
import { AccountPanelMenu } from './account-panel-menu';

const USAGE: MonthUsage = {
  events: 103_075,
  limit: 250_000,
  share: 0.4123,
  pausedUntil: null,
  resetsOn: '2026-12-01T00:00:00.000Z',
};

const meta = {
  title: 'Shell/AccountPanelMenu',
  component: AccountPanelMenu,
  tags: ['autodocs'],
  args: {
    projectId: 'p-store',
    email: 'owner@example.com',
    plan: 'pro',
    i18n: english,
    chooseLocale: fn(() => Promise.resolve()),
    usage: USAGE,
  },
  parameters: { nextjs: { appDirectory: true } },
  decorators: [
    (Story) => (
      <div className="flex h-[520px] w-[248px] flex-col justify-end bg-nav p-3.5">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AccountPanelMenu>;

export default meta;
type Story = StoryObj<typeof meta>;
type Play = NonNullable<Story['play']>;

const opens: Play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByText('Account menu'));
  await expect(canvas.getAllByRole('link', { name: 'Settings' })[0]).toBeVisible();
  await expect(canvas.getByRole('button', { name: 'Language' })).toBeVisible();
  await expect(canvas.getByRole('link', { name: 'Help and support' })).toBeVisible();
  await expect(canvas.getByRole('button', { name: 'Sign out' })).toBeVisible();
};

export const Closed: Story = {};

export const ClosedDark: Story = { globals: { theme: 'dark' } };

export const Open: Story = { play: opens };

export const OpenDark: Story = { globals: { theme: 'dark' }, play: opens };

export const WithoutUsage: Story = { args: { usage: null, plan: 'member' }, play: opens };

export const NearTheQuota: Story = {
  args: { usage: { ...USAGE, events: 82_000, share: 0.82 } },
  play: opens,
};

export const Paused: Story = {
  args: { usage: { ...USAGE, pausedUntil: '2026-12-01T00:00:00.000Z' } },
  play: opens,
};

export const NoPlanKnown: Story = { args: { plan: null } };

export const LongEmail: Story = {
  args: { email: 'analytics.operations+dashboards@a-very-long-company-domain.example' },
  play: async ({ canvasElement }) => {
    const name = within(canvasElement).getByText('analytics.operations+dashboards');
    await expect(name.scrollWidth).toBeLessThanOrEqual(name.clientWidth);
  },
};

export const BrazilianPortuguese: Story = {
  globals: { locale: 'pt-BR' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Menu da conta')).toBeInTheDocument();
  },
};
