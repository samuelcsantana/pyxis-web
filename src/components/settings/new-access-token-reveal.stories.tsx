import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { DEMO_CREATED_ACCESS_TOKEN } from '@/services/access-tokens/mock-access-tokens-service';
import { NewAccessTokenReveal } from './new-access-token-reveal';

const meta = {
  title: 'Settings/New access token reveal',
  component: NewAccessTokenReveal,
  tags: ['autodocs'],
  args: { token: DEMO_CREATED_ACCESS_TOKEN, onDone: () => undefined },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof NewAccessTokenReveal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Spanish: Story = { parameters: { locale: 'es' } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
