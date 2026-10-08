import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { MainContent } from './main-content';
import { SkipLink } from './skip-link';

const meta = {
  title: 'Shell/SkipLink',
  component: SkipLink,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className="min-h-40 bg-nav">
        <Story />
        <MainContent className="bg-bg p-8 text-ink">
          <p>The first Tab on a project page shows the link; Enter moves the focus here.</p>
        </MainContent>
      </div>
    ),
  ],
} satisfies Meta<typeof SkipLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Hidden: Story = {};

const focusTheLink: Story['play'] = async ({ canvasElement }) => {
  const link = within(canvasElement).getByRole('link', { name: 'Skip to content' });
  link.focus();
  await expect(link).toBeVisible();
  await expect(link.getBoundingClientRect().width).toBeGreaterThan(1);
};

export const Focused: Story = { play: focusTheLink };

export const FocusedDark: Story = { globals: { theme: 'dark' }, play: focusTheLink };
