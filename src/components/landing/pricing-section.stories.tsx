import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { english } from '@/test-utils/english';
import { PricingSection } from './pricing-section';

const meta = {
  title: 'Landing/PricingSection',
  component: PricingSection,
  parameters: { layout: 'fullscreen' },
  args: { i18n: english },
  decorators: [
    (Story) => (
      <div className="bg-bg text-ink">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PricingSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const English: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('region')).toBeVisible();
  },
};

export const Yearly: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('radio', { name: /^Yearly/ }));
    await expect(canvas.getByText('R$ 390')).toBeVisible();
    await expect(canvas.getByText('R$ 39')).not.toBeVisible();
  },
};

export const AccessRequested: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText('Request access'));
    await expect(canvas.getByText('hello@pyxis-analytics.dev')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Copy' })).toBeVisible();
  },
};

export const Portuguese: Story = { globals: { locale: 'pt-BR' } };

export const OnAPhone: Story = { globals: { viewport: { value: 'mobile1' } } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
