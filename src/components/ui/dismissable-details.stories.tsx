import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { DismissableDetails } from './dismissable-details';

const meta = {
  title: 'UI/Dismissable details',
  component: DismissableDetails,
  tags: ['autodocs'],
  args: {
    className: 'relative w-fit',
    children: (
      <>
        <summary className="cursor-pointer rounded-control border border-line bg-card px-3 py-2 text-sm text-ink">
          Options
        </summary>
        <ul className="absolute top-full left-0 z-10 mt-1.5 flex w-48 flex-col gap-1 rounded-input border border-line bg-card p-1.5 text-sm text-ink shadow-lg">
          <li>
            <a href="#first" className="block rounded-control px-2.5 py-1.5 hover:bg-soft">
              First option
            </a>
          </li>
          <li>
            <a href="#second" className="block rounded-control px-2.5 py-1.5 hover:bg-soft">
              Second option
            </a>
          </li>
        </ul>
      </>
    ),
  },
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="flex h-48 items-start gap-4">
        <Story />
        <button
          type="button"
          className="rounded-control border border-line px-3 py-2 text-sm text-ink"
        >
          Next control
        </button>
      </div>
    ),
  ],
} satisfies Meta<typeof DismissableDetails>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {};

export const Open: Story = { args: { defaultOpen: true } };

export const OpenDark: Story = { args: { defaultOpen: true }, globals: { theme: 'dark' } };

export const ClosedWithEscape: Story = {
  args: { defaultOpen: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole('link', { name: 'First option' }).focus();
    await userEvent.keyboard('{Escape}');
    await expect(
      canvas.getByRole('link', { name: 'First option', hidden: true }),
    ).not.toBeVisible();
    await expect(canvas.getByText('Options')).toHaveFocus();
  },
};

export const ClosedWhenTabbingAway: Story = {
  args: { defaultOpen: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole('link', { name: 'Second option' }).focus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Next control' })).toHaveFocus();
    await expect(
      canvas.getByRole('link', { name: 'Second option', hidden: true }),
    ).not.toBeVisible();
  },
};
