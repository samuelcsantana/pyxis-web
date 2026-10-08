import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { demoFailedReadsReport, demoRequestsReport } from '@/services/requests/demo-requests';
import { FailureDaysChart } from './failure-days-chart';
import { english } from '@/test-utils/english';

const PERIOD = { from: '2026-09-06', to: '2026-10-05' };
const NOW = new Date('2026-10-06T02:30:00.000Z');
const WRITES = demoRequestsReport('demo', PERIOD, null, NOW, null).days;
const READS = demoFailedReadsReport('demo', PERIOD, null, NOW, null).days;

const meta = {
  title: 'Requests/Failures per day',
  component: FailureDaysChart,
  tags: ['autodocs'],
  args: {
    days: WRITES,
    description: 'Every write that failed, by what went wrong, last 30 days',
    periodLabel: 'last 30 days',
    i18n: english,
  },
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="w-[min(100%,70rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FailureDaysChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Writes: Story = {};

export const FailedReads: Story = {
  args: {
    days: READS,
    description: 'Every read that failed, by what went wrong, last 30 days',
  },
};

export const NothingFailed: Story = {
  args: {
    days: WRITES.map((day) => ({
      ...day,
      byStatusClass: { ...day.byStatusClass, clientError: 0, serverError: 0, noResponse: 0 },
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
