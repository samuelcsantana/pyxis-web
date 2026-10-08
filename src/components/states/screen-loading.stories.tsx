import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { english } from '@/test-utils/english';
import { ScreenLoading } from './screen-loading';

const meta = {
  title: 'States/Screen loading',
  component: ScreenLoading,
  parameters: { layout: 'fullscreen' },
  args: { screen: 'overview', i18n: english },
} satisfies Meta<typeof ScreenLoading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {};

export const Requests: Story = { args: { screen: 'requests' } };

export const Visits: Story = { args: { screen: 'visits' } };

export const TimelineWithoutPeriod: Story = { args: { screen: 'timeline' } };

export const Funnel: Story = { args: { screen: 'funnel' } };

export const Features: Story = { args: { screen: 'features' } };

export const DarkTheme: Story = { args: { screen: 'devices' }, globals: { theme: 'dark' } };

export const OnAPhone: Story = {
  args: { screen: 'acquisition' },
  decorators: [
    (Story) => (
      <div className="w-[390px]">
        <Story />
      </div>
    ),
  ],
};
