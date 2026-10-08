import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { BUTTON_PRIMARY, BUTTON_SECONDARY, CONTROL_DISABLED } from './control-classes';
import { PendingSubmitButton } from './pending-submit-button';

function neverSettles(): Promise<void> {
  return new Promise(() => undefined);
}

const meta = {
  title: 'UI/Pending submit button',
  component: PendingSubmitButton,
  tags: ['autodocs'],
  args: {
    label: 'Apply filters',
    pendingLabel: 'Applying…',
    className: `min-h-11 rounded-input px-4.5 text-sm ${BUTTON_PRIMARY} ${CONTROL_DISABLED}`,
  },
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <form action={neverSettles}>
        <Story />
      </form>
    ),
  ],
} satisfies Meta<typeof PendingSubmitButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Idle: Story = {};

export const Pending: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Apply filters' }));
    await expect(await canvas.findByRole('button', { name: 'Applying…' })).toHaveAttribute(
      'aria-busy',
      'true',
    );
  },
};

export const Secondary: Story = {
  args: {
    label: 'Search',
    pendingLabel: 'Searching…',
    className: `min-h-11 rounded-input px-3.5 text-sm font-medium ${BUTTON_SECONDARY}`,
  },
};

export const SecondaryPending: Story = {
  args: Secondary.args,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Search' }));
    await expect(await canvas.findByRole('button', { name: 'Searching…' })).toHaveAttribute(
      'aria-busy',
      'true',
    );
  },
};

export const Disabled: Story = { args: { disabled: true } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
