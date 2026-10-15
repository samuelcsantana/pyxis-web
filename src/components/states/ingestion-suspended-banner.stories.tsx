import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { english } from '@/test-utils/english';
import { IngestionSuspendedBanner } from './ingestion-suspended-banner';

const meta = {
  title: 'States/Ingestion suspended banner',
  component: IngestionSuspendedBanner,
  tags: ['autodocs'],
  args: {
    suspension: { since: '2026-11-19T10:00:00.000Z', reason: 'Events carried e-mail addresses.' },
    i18n: english,
  },
  parameters: { layout: 'fullscreen', nextjs: { appDirectory: true } },
} satisfies Meta<typeof IngestionSuspendedBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ForTheOwner: Story = {};

export const ForSomeoneTheOwnerAdded: Story = {
  args: { suspension: { since: '2026-11-19T10:00:00.000Z', reason: null } },
};

export const InPortuguese: Story = { globals: { locale: 'pt-BR' } };

export const InSpanish: Story = { globals: { locale: 'es' } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
