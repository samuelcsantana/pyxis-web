import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { DEFAULT_LANDING_PAGE, landingPageOfLocale } from '@/lib/landing-pages';
import { LanguageLinks } from './language-links';

const meta = {
  title: 'Landing/LanguageLinks',
  component: LanguageLinks,
  args: { current: DEFAULT_LANDING_PAGE, label: 'Language' },
} satisfies Meta<typeof LanguageLinks>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OnTheEnglishPage: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('link', { current: 'page' })).toHaveAttribute(
      'href',
      '/',
    );
  },
};

export const OnThePortuguesePage: Story = {
  args: { current: landingPageOfLocale('pt-BR'), label: 'Idioma' },
};

export const OnAPhone: Story = { globals: { viewport: { value: 'mobile1' } } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
