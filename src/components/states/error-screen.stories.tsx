import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { english } from '@/test-utils/english';
import { ErrorScreen, errorTexts } from './error-screen';

const meta = {
  title: 'States/Error screen',
  component: ErrorScreen,
  parameters: { layout: 'fullscreen' },
  args: {
    texts: errorTexts(
      Object.assign(new Error('GET /v1/me failed'), { digest: '2861547093' }),
      english.t,
    ),
    retry: fn(),
  },
} satisfies Meta<typeof ErrorScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithErrorId: Story = {};

export const WithoutErrorId: Story = {
  args: { texts: errorTexts(new Error('GET /v1/me failed'), english.t) },
};

export const DarkTheme: Story = { globals: { theme: 'dark' } };
