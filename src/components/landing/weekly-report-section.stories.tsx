import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { english } from '@/test-utils/english';
import { showcaseDigest } from '@/test-utils/landing-preview';
import { WeeklyReportSection } from './weekly-report-section';

const meta = {
  title: 'Landing/WeeklyReportSection',
  component: WeeklyReportSection,
  parameters: { layout: 'fullscreen' },
  args: { i18n: english, digest: showcaseDigest(english) },
  render: (args) => <WeeklyReportSection i18n={args.i18n} digest={showcaseDigest(args.i18n)} />,
  decorators: [
    (Story) => (
      <div className="bg-bg text-ink">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WeeklyReportSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const English: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('figure')).toBeVisible();
    await expect(canvas.getAllByRole('heading', { level: 3 })).toHaveLength(3);
  },
};

export const Portuguese: Story = { globals: { locale: 'pt-BR' } };

export const German: Story = { globals: { locale: 'de' } };

export const OnAPhone: Story = { globals: { viewport: { value: 'mobile1' } } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
