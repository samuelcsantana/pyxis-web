import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { overviewKpis } from '@/domain/overview';
import { demoOverviewReport } from '@/services/overview/demo-overview';
import { DEMO_DOCS, DEMO_STORE } from '@/services/demo/demo-projects';
import { KpiGrid } from './kpi-grid';

const STORY_PERIOD = { from: '2026-09-06', to: '2026-10-05' } as const;
const STORY_NOW = new Date('2026-10-06T02:30:00.000Z');
const STORY_REPORT = demoOverviewReport('demo', STORY_PERIOD, STORY_NOW);
const LAST_30_DAYS = { days: 30, endsToday: false } as const;
const STORY_TODAY = { from: '2026-10-05', to: '2026-10-05' } as const;
const TEN_IN_SAO_PAULO = new Date('2026-10-05T13:03:00.000Z');
const TODAY = { days: 1, endsToday: true } as const;

const WITHOUT_CONVERSIONS = demoOverviewReport(DEMO_DOCS.id, STORY_PERIOD, STORY_NOW);
const EVENT = DEMO_STORE.conversionEvent;

const meta = {
  title: 'Overview/KPI cards',
  component: KpiGrid,
  tags: ['autodocs'],
  args: { kpis: overviewKpis(STORY_REPORT, LAST_30_DAYS, EVENT) },
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
  args: { kpis: overviewKpis(WITHOUT_CONVERSIONS, LAST_30_DAYS, DEMO_DOCS.conversionEvent) },
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
      LAST_30_DAYS,
      EVENT,
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
          convertingVisits: null,
          writeErrors: {
            current: { failed: 0, total: 0 },
            previous: { failed: 0, total: 0 },
            daily: [{ failed: 0, total: 0 }],
          },
        },
      },
      { days: 1, endsToday: false },
      EVENT,
    ),
  },
};

export const SmallNumbers: Story = {
  args: {
    kpis: overviewKpis(
      {
        ...STORY_REPORT,
        kpis: {
          visits: { current: 5, previous: 4, daily: [2, 3] },
          identifiedUsers: { current: 1, previous: 2, daily: [0, 1] },
          conversions: { current: 1, previous: 0, daily: [0, 1] },
          convertingVisits: null,
          writeErrors: {
            current: { failed: 1, total: 6 },
            previous: { failed: 0, total: 5 },
            daily: [
              { failed: 0, total: 2 },
              { failed: 1, total: 4 },
            ],
          },
        },
      },
      { days: 2, endsToday: false },
      EVENT,
    ),
  },
};

export const TodayUntilNow: Story = {
  args: {
    kpis: overviewKpis(demoOverviewReport('demo', STORY_TODAY, TEN_IN_SAO_PAULO), TODAY, EVENT),
  },
};

export const TodayAgainstAllOfYesterday: Story = {
  args: {
    kpis: overviewKpis(
      {
        ...demoOverviewReport('demo', STORY_TODAY, TEN_IN_SAO_PAULO),
        comparison: { kind: 'unknown' },
      },
      TODAY,
      EVENT,
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
