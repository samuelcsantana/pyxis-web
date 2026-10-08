import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Breakable } from './breakable';

const meta = {
  title: 'UI/Breakable',
  component: Breakable,
  tags: ['autodocs'],
  args: { text: 'error_code=order_number_in_use' },
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <p className="w-28 font-mono text-xs wrap-anywhere text-ink">
        <Story />
      </p>
    ),
  ],
} satisfies Meta<typeof Breakable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Route: Story = { args: { text: '/projects/:projectId/orders/:id' } };

export const PlainText: Story = { args: { text: 'Organic search' } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
