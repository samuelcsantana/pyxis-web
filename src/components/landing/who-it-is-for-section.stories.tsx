import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { english } from '@/test-utils/english';
import { WhoItIsForSection } from './who-it-is-for-section';

const meta = {
  title: 'Landing/WhoItIsForSection',
  component: WhoItIsForSection,
  parameters: { layout: 'fullscreen' },
  args: { i18n: english },
  decorators: [
    (Story) => (
      <div className="bg-bg text-ink">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WhoItIsForSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const English: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('region')).toBeVisible();
    await expect(canvas.getAllByRole('heading', { level: 3 })).toHaveLength(3);
  },
};

export const Portuguese: Story = { globals: { locale: 'pt-BR' } };

export const German: Story = { globals: { locale: 'de' } };

export const OnAPhone: Story = { globals: { viewport: { value: 'mobile1' } } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
