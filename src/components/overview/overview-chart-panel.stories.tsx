import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { OverviewReport } from '@/domain/overview';
import { ACTIVITY, overviewChart } from '@/domain/overview-chart';
import { demoOverviewReport } from '@/services/overview/demo-overview';
import { expect, userEvent, within } from 'storybook/test';
import { OverviewChartPanel } from './overview-chart-panel';

const STORY_PERIOD = { from: '2026-09-06', to: '2026-10-05' } as const;
const STORY_NOW = new Date('2026-10-06T02:30:00.000Z');
const STORY_REPORT = demoOverviewReport('demo', STORY_PERIOD, STORY_NOW);
const WITHOUT_PREVIOUS: OverviewReport = { ...STORY_REPORT, previousDays: null };

const meta = {
  title: 'Overview/Chart panel',
  component: OverviewChartPanel,
  tags: ['autodocs'],
  args: { chart: overviewChart(STORY_REPORT, ACTIVITY), periodLabel: 'last 30 days' },
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="w-[min(100%,70rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof OverviewChartPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Activity: Story = {};

export const WithoutPreviousPeriod: Story = {
  args: { chart: overviewChart(WITHOUT_PREVIOUS, ACTIVITY) },
};

export const Visits: Story = { args: { chart: overviewChart(STORY_REPORT, 'visits') } };

export const IdentifiedUsers: Story = {
  args: { chart: overviewChart(STORY_REPORT, 'identified-users') },
};

export const Conversions: Story = { args: { chart: overviewChart(STORY_REPORT, 'conversions') } };

export const WriteErrorRate: Story = {
  args: { chart: overviewChart(STORY_REPORT, 'write-errors') },
};

export const VisitsWithoutPreviousPeriod: Story = {
  args: { chart: overviewChart(WITHOUT_PREVIOUS, 'visits') },
};

export const AsTable: Story = {
  args: { chart: overviewChart(STORY_REPORT, 'visits') },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Table' }));
    await expect(canvas.getAllByRole('row')).toHaveLength(STORY_REPORT.days.length + 1);
    await expect(canvas.getByRole('columnheader', { name: 'Visits then' })).toBeVisible();
  },
};

export const SingleDay: Story = {
  args: {
    chart: overviewChart(
      {
        ...STORY_REPORT,
        days: STORY_REPORT.days.slice(-1),
        previousDays: STORY_REPORT.previousDays?.slice(-1) ?? null,
      },
      ACTIVITY,
    ),
    periodLabel: 'today',
  },
};

export const Empty: Story = {
  args: {
    chart: overviewChart(
      {
        ...WITHOUT_PREVIOUS,
        days: STORY_REPORT.days.map((day) => ({ ...day, pageViews: 0, events: 0 })),
      },
      ACTIVITY,
    ),
  },
};

export const QuietDays: Story = {
  args: {
    chart: overviewChart(
      {
        ...WITHOUT_PREVIOUS,
        days: STORY_REPORT.days.map((day, index) => ({
          ...day,
          pageViews: index % 5 === 0 ? 2 : 0,
          events: 0,
        })),
      },
      ACTIVITY,
    ),
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

export const WriteErrorRateDark: Story = { ...WriteErrorRate, globals: { theme: 'dark' } };

export const OnAPhoneDark: Story = { ...OnAPhone, globals: { theme: 'dark' } };
