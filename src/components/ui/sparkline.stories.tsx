import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Sparkline } from './sparkline';

const meta = {
  title: 'UI/Sparkline',
  component: Sparkline,
  tags: ['autodocs'],
  args: {
    values: [12, 18, 15, 22, 30, 26, 34, 28, 31, 40],
    box: { width: 120, height: 36, inset: 3 },
    width: 240,
    strokeClass: 'stroke-sky',
    strokeWidth: 2,
  },
} satisfies Meta<typeof Sparkline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Rising: Story = {};

export const Flat: Story = { args: { values: [5, 5, 5, 5] } };

export const SingleDay: Story = { args: { values: [9] } };

export const WithGaps: Story = {
  args: { values: [0.02, 0.05, null, null, 0.03, null, 0.04, 0.01] },
};

export const DarkTheme: Story = {
  args: { strokeClass: 'stroke-violet' },
  globals: { theme: 'dark' },
};
