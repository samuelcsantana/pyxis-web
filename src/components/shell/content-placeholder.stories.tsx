import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { ContentPlaceholder } from './content-placeholder';
import { MainContent } from './main-content';

const meta = {
  title: 'Shell/ContentPlaceholder',
  component: ContentPlaceholder,
  args: { label: 'Loading…' },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ContentPlaceholder>;

export default meta;
type Story = StoryObj<typeof meta>;

const expectShown: Story['play'] = async ({ canvasElement }) => {
  await expect(within(canvasElement).getByRole('status')).toBeVisible();
};

export const WithoutContent: Story = { play: expectShown };

export const DarkTheme: Story = { globals: { theme: 'dark' }, play: expectShown };

export const OnAPhone: Story = {
  decorators: [
    (Story) => (
      <div className="w-[390px]">
        <Story />
      </div>
    ),
  ],
  play: expectShown,
};

export const HiddenOnceContentFollows: Story = {
  decorators: [
    (Story) => (
      <div>
        <Story />
        <MainContent className="p-8 text-ink">
          <p>The screen arrived.</p>
        </MainContent>
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('The screen arrived.')).toBeVisible();
    await expect(canvas.queryByRole('status')).toBeNull();
  },
};
