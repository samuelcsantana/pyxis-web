import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { BrandedPage } from '@/components/brand/branded-page';
import { english } from '@/test-utils/english';
import { AccountSuspendedPanel } from './account-suspended-panel';

const meta = {
  title: 'Account/Account suspended page',
  component: AccountSuspendedPanel,
  args: { i18n: english },
  parameters: { layout: 'fullscreen', nextjs: { appDirectory: true } },
  render: (args) => (
    <BrandedPage>
      <AccountSuspendedPanel {...args} />
    </BrandedPage>
  ),
} satisfies Meta<typeof AccountSuspendedPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InPortuguese: Story = { globals: { locale: 'pt-BR' } };

export const InSpanish: Story = { globals: { locale: 'es' } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
