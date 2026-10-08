import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { demoOverviewReport } from '@/services/overview/demo-overview';
import { TopEventsList } from './top-events-list';
import { english } from '@/test-utils/english';

const STORY_PERIOD = { from: '2026-09-06', to: '2026-10-05' } as const;
const STORY_NOW = new Date('2026-10-06T02:30:00.000Z');
const STORY_REPORT = demoOverviewReport('demo', STORY_PERIOD, STORY_NOW);

function visitsHref(event: string): string {
  return `/demo/visits?${new URLSearchParams({ range: '30d', event }).toString()}`;
}

const meta = {
  title: 'Overview/Top events',
  component: TopEventsList,
  tags: ['autodocs'],
  args: { i18n: english, events: STORY_REPORT.topEvents, visitsHref },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
  decorators: [
    (Story) => (
      <div className="w-[min(100%,36rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TopEventsList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = { args: { events: [] } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
