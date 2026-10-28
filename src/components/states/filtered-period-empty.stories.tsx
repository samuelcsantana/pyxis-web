import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { english } from '@/test-utils/english';
import { FilteredPeriodEmpty } from './filtered-period-empty';

const meta = {
  title: 'States/Filtered period empty',
  component: FilteredPeriodEmpty,
  tags: ['autodocs'],
  args: {
    periodLabel: 'Sep 30 – Oct 6, 2026',
    removeFiltersHref: '/demo/overview?range=7d',
    i18n: english,
  },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
  decorators: [
    (Story) => (
      <div className="w-[min(100%,36rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FilteredPeriodEmpty>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DarkTheme: Story = { globals: { theme: 'dark' } };

export const OnAPhone: Story = {
  globals: { viewport: { value: 'mobile2', isRotated: false } },
};
