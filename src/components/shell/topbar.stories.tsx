import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { presetPeriod } from '@/domain/period';
import { Topbar } from './topbar';

const TODAY = '2026-10-05';

const meta = {
  title: 'Shell/Topbar',
  component: Topbar,
  tags: ['autodocs'],
  args: {
    title: 'Overview',
    subtitle: 'How Demo Store was used in the period',
    basePath: '/demo/overview',
    period: presetPeriod('30d', TODAY),
    today: TODAY,
    theme: 'light',
  },
  parameters: { layout: 'fullscreen', nextjs: { appDirectory: true } },
} satisfies Meta<typeof Topbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ThirtyDays: Story = {};

export const Today: Story = { args: { period: presetPeriod('today', TODAY) } };

export const CustomPeriod: Story = {
  args: { period: { preset: 'custom', from: '2026-08-01', to: '2026-08-31' } },
};

export const DarkTheme: Story = { args: { theme: 'dark' }, globals: { theme: 'dark' } };

export const OnAPhone: Story = {
  decorators: [
    (Story) => (
      <div className="w-[390px]">
        <Story />
      </div>
    ),
  ],
};
