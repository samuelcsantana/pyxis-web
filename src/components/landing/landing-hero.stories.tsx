import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { english } from '@/test-utils/english';
import { showcasePreview } from '@/test-utils/landing-preview';
import { LandingHero } from './landing-hero';

const meta = {
  title: 'Landing/LandingHero',
  component: LandingHero,
  parameters: { layout: 'fullscreen' },
  args: { i18n: english, preview: showcasePreview(english), signUpOpen: true },
  render: (args) => (
    <LandingHero
      i18n={args.i18n}
      preview={showcasePreview(args.i18n)}
      signUpOpen={args.signUpOpen}
    />
  ),
  decorators: [
    (Story) => (
      <div className="bg-bg text-ink">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LandingHero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const English: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('link', { name: 'Start your free trial' }),
    ).toBeVisible();
    await expect(
      within(canvasElement).getByRole('link', { name: 'Open the live demo' }),
    ).toBeVisible();
  },
};

export const SignUpClosed: Story = {
  args: { signUpOpen: false },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('link', { name: 'See pricing' })).toBeVisible();
  },
};

export const Portuguese: Story = { globals: { locale: 'pt-BR' } };

export const OnAPhone: Story = { globals: { viewport: { value: 'mobile1' } } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
