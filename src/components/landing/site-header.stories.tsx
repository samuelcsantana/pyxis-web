import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { LanguageFormSelect } from '@/components/language/language-form-select';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { DEFAULT_LANDING_PAGE, landingPageOfLocale } from '@/lib/landing-pages';
import { english } from '@/test-utils/english';
import { LandingLanguageSelect } from './landing-language-select';
import { SiteHeader } from './site-header';

const meta = {
  title: 'Landing/SiteHeader',
  component: SiteHeader,
  parameters: { layout: 'fullscreen' },
  args: {
    i18n: english,
    homeHref: '/',
    onHomePage: true,
    language: <LandingLanguageSelect current={DEFAULT_LANDING_PAGE} label="Language" />,
    theme: <ThemeToggle remember="device" />,
    withSignIn: true,
  },
  decorators: [
    (Story) => (
      <div className="min-h-64 bg-bg text-ink">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SiteHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OnTheHomePage: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('link', { current: 'page' })).toHaveAccessibleName('English');
    await expect(canvas.getByText('English', { selector: 'summary span' })).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'Sign in' })).toBeVisible();
  },
};

export const OnTheHomePageInPortuguese: Story = {
  args: {
    homeHref: '/pt-br',
    language: <LandingLanguageSelect current={landingPageOfLocale('pt-BR')} label="Idioma" />,
  },
  globals: { locale: 'pt-BR' },
};

export const OnTheSignInPage: Story = {
  args: {
    homeHref: 'https://pyxis-analytics.dev/',
    onHomePage: false,
    language: (
      <LanguageFormSelect locale="en" label="Language" choose={fn(() => Promise.resolve())} />
    ),
    theme: <ThemeToggle />,
    withSignIn: false,
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('link', { name: 'Sign in' }),
    ).not.toBeInTheDocument();
  },
};

export const OnAPhone: Story = { globals: { viewport: { value: 'mobile1' } } };

export const OnATablet: Story = {
  globals: { viewport: { value: 'tablet' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText('Menu'));
    await expect(
      within(canvas.getByRole('navigation', { name: 'Main' })).getAllByRole('link'),
    ).toHaveLength(5);
  },
};

export const DarkTheme: Story = { globals: { theme: 'dark' } };
