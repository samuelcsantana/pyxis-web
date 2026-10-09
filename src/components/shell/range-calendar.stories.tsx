import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { RangeCalendar } from './range-calendar';

const meta = {
  title: 'Shell/RangeCalendar',
  component: RangeCalendar,
  tags: ['autodocs'],
  args: { from: '2026-09-10', to: '2026-10-09', today: '2026-10-09' },
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <form className="w-fit rounded-input border border-line bg-card p-4">
        <Story />
      </form>
    ),
  ],
} satisfies Meta<typeof RangeCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LastThirtyDays: Story = {};

export const ASingleDay: Story = { args: { from: '2026-10-09', to: '2026-10-09' } };

export const PickingTheLastDay: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Friday, October 2, 2026' }));
    await userEvent.hover(canvas.getByRole('button', { name: 'Wednesday, October 7, 2026' }));
    await expect(canvas.getByRole('button', { name: 'Apply' })).toBeDisabled();
  },
};

export const DarkTheme: Story = { globals: { theme: 'dark' } };
