import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { english } from '@/test-utils/english';
import { showcasePreview } from '@/test-utils/landing-preview';
import { LandingPreview } from './landing-preview';

const meta = {
  title: 'Landing/LandingPreview',
  component: LandingPreview,
  args: { i18n: english, view: showcasePreview(english) },
  render: (args) => (
    <div className="w-[min(32rem,100vw)] bg-bg p-4">
      <LandingPreview i18n={args.i18n} view={showcasePreview(args.i18n)} />
    </div>
  ),
} satisfies Meta<typeof LandingPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const English: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Demo Store')).toBeVisible();
  },
};

export const Portuguese: Story = { globals: { locale: 'pt-BR' } };

export const OnAPhone: Story = { globals: { viewport: { value: 'mobile1' } } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
