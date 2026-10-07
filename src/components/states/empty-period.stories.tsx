import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { EmptyPeriod } from './empty-period';

const meta = {
  title: 'States/Empty period',
  component: EmptyPeriod,
  tags: ['autodocs'],
  args: {
    view: { kind: 'quiet', latestEvent: 'Sep 19, 2026, 22:30', offersWiderPeriod: true },
    widerPeriodHref: '/demo/overview?range=30d',
    endpoint: 'https://api.pyxis.example.com',
  },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
  decorators: [
    (Story) => (
      <div className="w-[min(100%,36rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EmptyPeriod>;

export default meta;
type Story = StoryObj<typeof meta>;

export const QuietPeriod: Story = {};

export const QuietLastThirtyDays: Story = {
  args: { view: { kind: 'quiet', latestEvent: 'Aug 2, 2026, 09:14', offersWiderPeriod: false } },
};

export const FirstRun: Story = { args: { view: { kind: 'first-run' } } };

export const QuietPeriodDarkTheme: Story = { globals: { theme: 'dark' } };
