import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { demoOverviewReport } from '@/services/overview/demo-overview';
import { activityTotals } from '@/domain/overview';
import { TopPagesTable } from './top-pages-table';

const STORY_PERIOD = { from: '2026-09-06', to: '2026-10-05' } as const;
const STORY_REPORT = demoOverviewReport('demo', STORY_PERIOD);

const meta = {
  title: 'Overview/Top pages',
  component: TopPagesTable,
  tags: ['autodocs'],
  args: {
    pages: STORY_REPORT.topPages,
    totalPageViews: activityTotals(STORY_REPORT.days).pageViews,
  },
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="w-[min(100%,36rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TopPagesTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongPaths: Story = {
  args: {
    pages: [
      { path: '/settings/notifications/:channel/preferences/:id', views: 120, visits: 80 },
      ...STORY_REPORT.topPages.slice(0, 2),
    ],
  },
};

export const Empty: Story = { args: { pages: [], totalPageViews: 0 } };

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
