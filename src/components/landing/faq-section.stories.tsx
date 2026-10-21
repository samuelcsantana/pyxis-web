import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { english } from '@/test-utils/english';
import { FaqSection } from './faq-section';

const meta = {
  title: 'Landing/FaqSection',
  component: FaqSection,
  parameters: { layout: 'fullscreen' },
  args: { i18n: english, signUpOpen: false },
  decorators: [
    (Story) => (
      <div className="bg-bg text-ink">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FaqSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const English: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('region')).toBeVisible();
  },
};

export const Portuguese: Story = { globals: { locale: 'pt-BR' } };

export const OnAPhone: Story = { globals: { viewport: { value: 'mobile1' } } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };

export const SignUpOpen: Story = {
  args: { signUpOpen: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const cancel = canvas.getByText('How do I cancel?');
    await userEvent.click(cancel);
    const answer = cancel.closest('details');
    await expect(answer).not.toBeNull();
    await expect(
      within(answer as HTMLElement).getByRole('link', { name: 'Terms of Use' }),
    ).toBeVisible();
  },
};
