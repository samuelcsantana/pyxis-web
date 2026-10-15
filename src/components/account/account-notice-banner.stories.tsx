import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { english } from '@/test-utils/english';
import { AccountNoticeBanner } from './account-notice-banner';

const meta = {
  title: 'Account/Account notice banner',
  component: AccountNoticeBanner,
  tags: ['autodocs'],
  args: { notice: { kind: 'paymentFailed' }, i18n: english },
  parameters: { layout: 'fullscreen', nextjs: { appDirectory: true } },
} satisfies Meta<typeof AccountNoticeBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PaymentFailed: Story = {};

export const Ending: Story = {
  args: { notice: { kind: 'ending', accessEndsAt: '2026-12-01T00:00:00.000Z' } },
};

export const Ended: Story = {
  args: { notice: { kind: 'ended', deletionOn: '2026-12-10T00:00:00.000Z' } },
};

export const Paused: Story = {
  args: { notice: { kind: 'paused', until: '2026-12-01T00:00:00.000Z' } },
};

export const NearQuota: Story = { args: { notice: { kind: 'nearQuota', share: 0.86 } } };

export const InSpanish: Story = { globals: { locale: 'es' } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
