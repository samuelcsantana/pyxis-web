import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { ErrorScreen } from './error-screen';

const meta = {
  title: 'States/Error screen',
  component: ErrorScreen,
  parameters: { layout: 'fullscreen' },
  args: {
    error: Object.assign(new Error('GET /v1/me failed'), { digest: '2861547093' }),
    retry: fn(),
  },
} satisfies Meta<typeof ErrorScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithErrorId: Story = {};

export const WithoutErrorId: Story = { args: { error: new Error('GET /v1/me failed') } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
