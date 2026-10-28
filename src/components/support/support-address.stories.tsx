import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SupportAddress } from './support-address';

const meta = {
  title: 'Support/Support address',
  component: SupportAddress,
  args: {
    id: 'story-support-address',
    labels: { copy: 'Copy', copied: 'Copied', selected: 'Selected, press Ctrl+C' },
  },
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SupportAddress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div className="w-56">
        <Story />
      </div>
    ),
  ],
};

export const DarkTheme: Story = { globals: { theme: 'dark' } };
