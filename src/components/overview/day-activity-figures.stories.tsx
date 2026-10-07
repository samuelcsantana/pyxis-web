import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { DayActivityFigures } from './day-activity-figures';

const meta = {
  title: 'Overview/Activity of the day',
  component: DayActivityFigures,
  tags: ['autodocs'],
  args: {
    days: [{ date: '2026-10-05', pageViews: 1234, events: 56 }],
    periodLabel: 'today',
  },
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="w-[min(100%,70rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DayActivityFigures>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Today: Story = {};

export const QuietDay: Story = {
  args: { days: [{ date: '2026-10-04', pageViews: 3, events: 0 }], periodLabel: 'Oct 4, 2026' },
};

export const OnAPhone: Story = {
  decorators: [
    (Story) => (
      <div className="w-[358px]">
        <Story />
      </div>
    ),
  ],
};

export const DarkTheme: Story = { globals: { theme: 'dark' } };
