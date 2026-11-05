import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { appliedVisitFilters } from '@/domain/applied-visit-filters';
import { NO_VISIT_FILTERS, type VisitFilters, visitFilterParameters } from '@/domain/visits';
import { english } from '@/test-utils/english';
import { DEMO_STORE } from '@/services/demo/demo-projects';
import { AppliedVisitFilters } from './applied-visit-filters';

const FILTERS: VisitFilters = {
  ...NO_VISIT_FILTERS,
  paths: ['/pricing'],
  event: 'signup_completed',
  channel: 'paid',
  device: 'mobile',
  reachedGoal: 'b1e2c3d4-5f60-4a71-8b92-a3c4d5e6f703',
  failed: true,
};

function removeHref(without: VisitFilters): string {
  return `/demo/visits?${new URLSearchParams(visitFilterParameters(without)).toString()}`;
}

const meta = {
  title: 'Visits/Applied filters',
  component: AppliedVisitFilters,
  tags: ['autodocs'],
  args: {
    applied: appliedVisitFilters(FILTERS, DEMO_STORE.goals, english),
    removeHref,
    clearHref: '/demo/visits?range=30d',
    i18n: english,
  },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
} satisfies Meta<typeof AppliedVisitFilters>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OneFilter: Story = {
  args: { applied: appliedVisitFilters({ ...NO_VISIT_FILTERS, channel: 'email' }, [], english) },
};

export const NoFilter: Story = { args: { applied: [] } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };

export const OnAPhone: Story = {
  globals: { viewport: { value: 'mobile2', isRotated: false } },
};
