import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { demoAcquisitionReport } from '@/services/acquisition/demo-acquisition';
import { ChannelChart } from './channel-chart';
import { english } from '@/test-utils/english';

const STORY_NOW = new Date('2026-10-06T02:30:00.000Z');

const REPORT = demoAcquisitionReport('demo', { from: '2026-09-06', to: '2026-10-05' }, STORY_NOW);

const meta = {
  title: 'Acquisition/Visits by channel',
  component: ChannelChart,
  tags: ['autodocs'],
  args: { i18n: english, days: REPORT.days, periodLabel: 'last 30 days' },
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="w-[min(100%,70rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChannelChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ThirtyDays: Story = {};

export const AsTable: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Table' }));
    await expect(canvas.getAllByRole('row')).toHaveLength(REPORT.days.length + 1);
  },
};

export const SingleDay: Story = {
  args: { days: REPORT.days.slice(-1), periodLabel: 'today' },
};

export const Empty: Story = {
  args: {
    days: REPORT.days.map((day) => ({
      ...day,
      byChannel: {
        paid: 0,
        email: 0,
        social: 0,
        campaign: 0,
        organic: 0,
        referral: 0,
        direct: 0,
      },
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

export const OnAPhoneDark: Story = { ...OnAPhone, globals: { theme: 'dark' } };
