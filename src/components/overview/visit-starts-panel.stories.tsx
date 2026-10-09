import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { timeOfDayResponseSchema } from '@/domain/time-of-day.schema';
import { DEMO_STORE } from '@/services/demo/demo-projects';
import { demoTimeOfDayWire } from '@/services/overview/demo-time-of-day';
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';
import { VisitStartsPanel } from './visit-starts-panel';

const STORY_NOW = new Date('2026-10-06T02:30:00.000Z');

function demoReport(from: string, to: string) {
  return timeOfDayResponseSchema.parse(demoTimeOfDayWire(DEMO_STORE.id, { from, to }, STORY_NOW));
}

const THIRTY_DAYS = demoReport('2026-09-06', '2026-10-05');

const meta = {
  title: 'Overview/When visits start',
  component: VisitStartsPanel,
  tags: ['autodocs'],
  args: { report: THIRTY_DAYS, periodLabel: 'last 30 days', i18n: english },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof VisitStartsPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OneDay: Story = {
  args: { report: demoReport('2026-10-05', '2026-10-05'), periodLabel: 'Oct 5' },
};

export const Empty: Story = {
  args: { report: THIRTY_DAYS.map((day) => ({ ...day, hours: day.hours.map(() => 0) })) },
};

export const InPortuguese: Story = {
  args: { i18n: portuguese, periodLabel: 'últimos 30 dias' },
};

export const DarkTheme: Story = { globals: { theme: 'dark' } };
