import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { BrandedPage } from '@/components/brand/branded-page';
import { english } from '@/test-utils/english';
import { AccountSupport } from './account-support';

const meta = {
  title: 'Account/Support',
  component: AccountSupport,
  args: { email: 'owner@example.com', plan: 'paid', i18n: english },
  parameters: { layout: 'fullscreen', nextjs: { appDirectory: true } },
  render: (args) => (
    <BrandedPage>
      <AccountSupport {...args} />
    </BrandedPage>
  ),
} satisfies Meta<typeof AccountSupport>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PaidPlan: Story = {};

export const FreePlan: Story = { args: { plan: 'free' } };

export const InPortuguese: Story = { globals: { locale: 'pt-BR' } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
