import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { StatCard } from './stat-card';

const meta = {
  title: 'UI/Stat card',
  component: StatCard,
  tags: ['autodocs'],
  args: { id: 'paid-visits', label: 'Paid visits', value: '829', note: '34.7% of 2,390 visits' },
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="w-[min(100%,18rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Words: Story = {
  args: {
    id: 'top-channel',
    label: 'Top channel',
    value: 'Organic search',
    note: '31% of 2,390 visits',
  },
};

export const NothingYet: Story = { args: { value: '0', note: '— of 0 visits' } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
