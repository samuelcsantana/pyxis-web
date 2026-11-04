import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, within } from 'storybook/test';
import { english } from '@/test-utils/english';
import { GeneralSection } from './general-section';

const meta = {
  title: 'Settings/GeneralSection',
  component: GeneralSection,
  tags: ['autodocs'],
  args: {
    email: 'owner@example.com',
    i18n: english,
    chooseLocale: fn(() => Promise.resolve()),
  },
  decorators: [
    (Story) => (
      <div className="max-w-3xl bg-card p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof GeneralSection>;

export default meta;
type Story = StoryObj<typeof meta>;

const showsItsParts: NonNullable<Story['play']> = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await expect(canvas.getByRole('heading', { name: 'Email' })).toBeVisible();
  await expect(canvas.getByRole('heading', { name: 'Appearance' })).toBeVisible();
  await expect(canvas.getByRole('heading', { name: 'Language' })).toBeVisible();
};

export const Default: Story = { play: showsItsParts };

export const Dark: Story = { globals: { theme: 'dark' }, play: showsItsParts };

export const LongEmail: Story = {
  args: { email: 'analytics.operations+dashboards@a-very-long-company-domain.example' },
};
