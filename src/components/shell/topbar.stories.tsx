import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { presetPeriod } from '@/domain/period';
import { Topbar, type TopbarWithPeriodProps } from './topbar';

const TODAY = '2026-10-05';

const WITH_PERIOD: TopbarWithPeriodProps = {
  title: 'Overview',
  subtitle: 'How Demo Store was used in the period',
  basePath: '/demo/overview',
  period: presetPeriod('30d', TODAY),
  today: TODAY,
  theme: 'light',
};

const meta = {
  title: 'Shell/Topbar',
  component: Topbar,
  tags: ['autodocs'],
  args: WITH_PERIOD,
  parameters: { layout: 'fullscreen', nextjs: { appDirectory: true } },
} satisfies Meta<typeof Topbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ThirtyDays: Story = {};

export const Today: Story = { args: { ...WITH_PERIOD, period: presetPeriod('today', TODAY) } };

export const CustomPeriod: Story = {
  args: { ...WITH_PERIOD, period: { preset: 'custom', from: '2026-08-01', to: '2026-08-31' } },
};

export const DarkTheme: Story = {
  args: { ...WITH_PERIOD, theme: 'dark' },
  globals: { theme: 'dark' },
};

export const WithoutPeriod: Story = {
  args: { title: 'Timeline', subtitle: 'Everything one person did, in order' },
};

export const OnAPhone: Story = {
  decorators: [
    (Story) => (
      <div className="w-[390px]">
        <Story />
      </div>
    ),
  ],
};
