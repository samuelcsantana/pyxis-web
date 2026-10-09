import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { LazyRangeCalendar } from './lazy-range-calendar';

const meta = {
  title: 'Shell/LazyRangeCalendar',
  component: LazyRangeCalendar,
  tags: ['autodocs'],
  args: { from: '2026-09-10', to: '2026-10-09', today: '2026-10-09', openAtFirst: false },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof LazyRangeCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WaitingToOpen: Story = {};

export const LoadedWithThePage: Story = {
  args: { openAtFirst: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByRole('grid', { name: 'October 2026' })).toBeInTheDocument();
  },
};
