import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { english } from '@/test-utils/english';
import { NoActivityYet } from './no-activity-yet';

const meta = {
  title: 'States/No activity yet',
  component: NoActivityYet,
  tags: ['autodocs'],
  args: { endpoint: 'https://api.pyxis.example.com', i18n: english },
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="w-[min(100%,36rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NoActivityYet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DemoMode: Story = { args: { endpoint: undefined } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
