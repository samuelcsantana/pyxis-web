import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { english } from '@/test-utils/english';
import { ComparisonSection } from './comparison-section';

const meta = {
  title: 'Landing/ComparisonSection',
  component: ComparisonSection,
  parameters: { layout: 'fullscreen' },
  args: { i18n: english },
  decorators: [
    (Story) => (
      <div className="bg-bg text-ink">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ComparisonSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const English: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('region', { name: 'Pyxis and a typical cookie-based tag' }),
    ).toBeVisible();
  },
};

export const Portuguese: Story = { globals: { locale: 'pt-BR' } };

export const OnAPhone: Story = { globals: { viewport: { value: 'mobile1' } } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
