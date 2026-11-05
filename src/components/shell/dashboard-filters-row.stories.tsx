import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { DEMO_STORE } from '@/services/demo/demo-projects';
import { english } from '@/test-utils/english';
import { DashboardFiltersRow } from './dashboard-filters-row';

const meta = {
  title: 'Shell/Dashboard filters',
  component: DashboardFiltersRow,
  tags: ['autodocs'],
  args: {
    projectId: 'demo',
    screen: 'overview',
    search: { range: '30d', device: 'mobile' },
    goals: DEMO_STORE.goals,
    i18n: english,
  },
  parameters: { layout: 'fullscreen', nextjs: { appDirectory: true } },
} satisfies Meta<typeof DashboardFiltersRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OneFilter: Story = {};

export const ManyFilters: Story = {
  args: {
    search: {
      range: '30d',
      path: '/pricing',
      event: 'signup_completed',
      channel: 'paid',
      device: 'mobile',
      browser: 'safari',
      os: 'ios',
      country: 'BR',
      reached_goal: 'b1e2c3d4-5f60-4a71-8b92-a3c4d5e6f703',
      failed: 'true',
    },
  },
};

export const LongValues: Story = {
  args: {
    screen: 'acquisition',
    search: {
      range: '7d',
      path: '/blog/estrutura-de-pastas-angular-features-lazy-fronteiras-e-dependencias',
      source: 'newsletter-de-outubro-com-um-nome-de-origem-bem-comprido',
      campaign: 'black_friday_antecipada_2026',
    },
  },
};

export const DarkTheme: Story = { args: ManyFilters.args, globals: { theme: 'dark' } };

export const OnAPhone: Story = {
  args: ManyFilters.args,
  globals: { viewport: { value: 'mobile2', isRotated: false } },
};
