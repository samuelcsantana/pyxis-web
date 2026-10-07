import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { NO_VISIT_FILTERS } from '@/domain/visits';
import { VisitFiltersForm } from './visit-filters-form';

const meta = {
  title: 'Visits/Filters',
  component: VisitFiltersForm,
  tags: ['autodocs'],
  args: {
    action: '/demo/visits',
    period: { preset: '30d', from: '2026-09-06', to: '2026-10-05' },
    filters: NO_VISIT_FILTERS,
    problems: [],
    clearHref: null,
  },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
  decorators: [
    (Story) => (
      <div className="w-[min(100%,77.5rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof VisitFiltersForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoFilter: Story = {};

export const Filtered: Story = {
  args: {
    filters: {
      paths: ['/calculator', '/sign-up'],
      event: 'calculator_result_shown',
      property: 'calculator=ifood',
      channel: 'paid',
      device: 'mobile',
      identity: 'anonymous',
    },
    clearHref: '/demo/visits?range=30d',
  },
};

export const FiltersLeftOut: Story = {
  args: {
    problems: ['A page path starts with "/".', 'A property filter needs an event.'],
  },
};

export const OnAPhone: Story = {
  ...Filtered,
  decorators: [
    (Story) => (
      <div className="w-[358px]">
        <Story />
      </div>
    ),
  ],
};

export const DarkTheme: Story = { ...Filtered, globals: { theme: 'dark' } };
