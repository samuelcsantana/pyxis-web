import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { DEMO_SHARE_TOKEN } from '@/services/share-links/mock-share-links-service';
import { NewShareLinkReveal } from './new-share-link-reveal';

const meta = {
  title: 'Settings/New share link reveal',
  component: NewShareLinkReveal,
  tags: ['autodocs'],
  args: { token: DEMO_SHARE_TOKEN, onDone: () => undefined },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof NewShareLinkReveal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Spanish: Story = { parameters: { locale: 'es' } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
