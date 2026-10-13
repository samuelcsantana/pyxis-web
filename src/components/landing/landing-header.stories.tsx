import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { DEFAULT_LANDING_PAGE, landingPageOfLocale } from '@/lib/landing-pages';
import { english } from '@/test-utils/english';
import { LandingHeader } from './landing-header';

const meta = {
  title: 'Landing/LandingHeader',
  component: LandingHeader,
  parameters: { layout: 'fullscreen' },
  args: { i18n: english, page: DEFAULT_LANDING_PAGE },
  decorators: [
    (Story) => (
      <div className="min-h-64 bg-bg text-ink">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LandingHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const English: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('link', { current: 'page' })).toHaveAccessibleName('English');
    await expect(canvas.getByRole('link', { name: 'Sign in' })).toBeVisible();
  },
};

export const Portuguese: Story = {
  args: { page: landingPageOfLocale('pt-BR') },
  globals: { locale: 'pt-BR' },
};

export const OnAPhone: Story = { globals: { viewport: { value: 'mobile1' } } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
