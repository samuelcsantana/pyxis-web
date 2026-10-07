import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { demoOverviewReport } from '@/services/overview/demo-overview';
import { expect, userEvent, within } from 'storybook/test';
import { DailyActivityChart } from './daily-activity-chart';

const STORY_PERIOD = { from: '2026-09-06', to: '2026-10-05' } as const;
const STORY_NOW = new Date('2026-10-06T02:30:00.000Z');
const STORY_REPORT = demoOverviewReport('demo', STORY_PERIOD, STORY_NOW);

const meta = {
  title: 'Overview/Daily activity chart',
  component: DailyActivityChart,
  tags: ['autodocs'],
  args: { days: STORY_REPORT.days, periodLabel: 'last 30 days' },
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="w-[min(100%,70rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DailyActivityChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ThirtyDays: Story = {};

export const AsTable: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'View as table' }));
    await expect(canvas.getAllByRole('row')).toHaveLength(STORY_REPORT.days.length + 1);
  },
};

export const SingleDay: Story = {
  args: { days: STORY_REPORT.days.slice(-1), periodLabel: 'today' },
};

export const QuietDays: Story = {
  args: {
    days: STORY_REPORT.days.map((day, index) => ({
      ...day,
      pageViews: index % 5 === 0 ? 2 : 0,
      events: 0,
    })),
  },
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
