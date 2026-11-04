import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { english } from '@/test-utils/english';
import { AvailableOnPro } from './available-on-pro';

const meta = {
  title: 'Account/Available on Pro',
  component: AvailableOnPro,
  tags: ['autodocs'],
  args: { i18n: english, feature: 'public_share_link', viewer: 'owner' },
  parameters: { nextjs: { appDirectory: true } },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AvailableOnPro>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Owner: Story = {};

export const InvitedPerson: Story = { args: { viewer: 'member' } };

export const RefusedByTheApi: Story = { args: { feature: 'slack_alerts', refused: true } };

export const InPortuguese: Story = { globals: { locale: 'pt-BR' } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
