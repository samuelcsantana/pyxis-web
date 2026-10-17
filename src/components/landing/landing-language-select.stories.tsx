import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { DEFAULT_LANDING_PAGE, landingPageOfLocale } from '@/lib/landing-pages';
import { LandingLanguageSelect } from './landing-language-select';

const meta = {
  title: 'Landing/LandingLanguageSelect',
  component: LandingLanguageSelect,
  args: { current: DEFAULT_LANDING_PAGE, label: 'Language' },
  decorators: [
    (Story) => (
      <div className="flex min-h-64 justify-end bg-bg p-4 text-ink">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LandingLanguageSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OnTheEnglishPage: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText('English', { selector: 'summary span' }));
    await expect(canvas.getByRole('link', { current: 'page' })).toHaveAttribute('href', '/');
    await expect(canvas.getByRole('link', { name: 'Português (Brasil)' })).toBeVisible();
  },
};

export const OnThePortuguesePage: Story = {
  args: { current: landingPageOfLocale('pt-BR'), label: 'Idioma' },
};

export const OnAPhone: Story = { globals: { viewport: { value: 'mobile1' } } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
