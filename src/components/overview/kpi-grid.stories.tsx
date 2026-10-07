import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { overviewKpis } from '@/domain/overview';
import { demoOverviewReport } from '@/services/overview/demo-overview';
import { DEMO_DOCS } from '@/services/demo/demo-projects';
import { KpiGrid } from './kpi-grid';

const STORY_PERIOD = { from: '2026-09-06', to: '2026-10-05' } as const;
const STORY_NOW = new Date('2026-10-06T02:30:00.000Z');
const STORY_REPORT = demoOverviewReport('demo', STORY_PERIOD, STORY_NOW);

const WITHOUT_CONVERSIONS = demoOverviewReport(DEMO_DOCS.id, STORY_PERIOD, STORY_NOW);

const meta = {
  title: 'Overview/KPI cards',
  component: KpiGrid,
  tags: ['autodocs'],
  args: { kpis: overviewKpis(STORY_REPORT, 30) },
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="w-[min(100%,70rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof KpiGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutConversionEvent: Story = {
  args: { kpis: overviewKpis(WITHOUT_CONVERSIONS, 30) },
};

export const BadNews: Story = {
  args: {
    kpis: overviewKpis(
      {
        ...STORY_REPORT,
        kpis: {
          ...STORY_REPORT.kpis,
          visits: { ...STORY_REPORT.kpis.visits, previous: STORY_REPORT.kpis.visits.current * 2 },
          writeErrors: {
            ...STORY_REPORT.kpis.writeErrors,
            previous: { failed: 0, total: STORY_REPORT.kpis.writeErrors.previous.total },
          },
        },
      },
      30,
    ),
  },
};

export const NothingToCompare: Story = {
  args: {
    kpis: overviewKpis(
      {
        ...STORY_REPORT,
        kpis: {
          visits: { current: 3, previous: 0, daily: [3] },
          identifiedUsers: { current: 0, previous: 0, daily: [0] },
          conversions: { current: 0, previous: 0, daily: [0] },
          writeErrors: {
            current: { failed: 0, total: 0 },
            previous: { failed: 0, total: 0 },
            daily: [{ failed: 0, total: 0 }],
          },
        },
      },
      1,
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
