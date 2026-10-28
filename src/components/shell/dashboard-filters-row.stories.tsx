import type { Meta, StoryObj } from '@storybook/nextjs-vite';
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
