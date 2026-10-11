import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { BrandBackdrop } from './brand-backdrop';

const meta = {
  title: 'Brand/BrandBackdrop',
  component: BrandBackdrop,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className="relative isolate flex min-h-dvh items-center justify-center bg-bg p-6">
        <Story />
        <section className="w-full max-w-sm rounded-panel border border-line-strong bg-card p-8 text-ink shadow-raised">
          A standalone page card
        </section>
      </div>
    ),
  ],
} satisfies Meta<typeof BrandBackdrop>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BehindACard: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByTestId('brand-backdrop-mark')).toBeVisible();
  },
};

export const OnAPhone: Story = { globals: { viewport: { value: 'mobile1' } } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
