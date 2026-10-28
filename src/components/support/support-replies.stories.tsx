import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { english } from '@/test-utils/english';
import { SupportReplies } from './support-replies';

const meta = {
  title: 'Support/Reply times',
  component: SupportReplies,
  args: { plan: 'paid', i18n: english },
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="flex max-w-md flex-col gap-2 text-ink">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SupportReplies>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PaidPlan: Story = {};

export const FreePlan: Story = { args: { plan: 'free' } };

export const NoKnownPlan: Story = { args: { plan: null } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
