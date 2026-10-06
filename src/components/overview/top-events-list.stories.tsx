import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { demoOverviewReport } from '@/services/overview/demo-overview';
import { TopEventsList } from './top-events-list';

const STORY_PERIOD = { from: '2026-09-06', to: '2026-10-05' } as const;
const STORY_REPORT = demoOverviewReport('demo', STORY_PERIOD);

const meta = {
  title: 'Overview/Top events',
  component: TopEventsList,
  tags: ['autodocs'],
  args: { events: STORY_REPORT.topEvents },
  parameters: { layout: 'padded' },
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
