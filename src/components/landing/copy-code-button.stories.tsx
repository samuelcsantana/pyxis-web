import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { CopyCodeButton } from './copy-code-button';

const meta = {
  title: 'Landing/CopyCodeButton',
  component: CopyCodeButton,
  args: {
    code: 'npm install pyxis-analytics',
    targetId: 'story-code',
    labels: { copy: 'Copy', copied: 'Copied', selected: 'Selected, press Ctrl+C' },
  },
  decorators: [
    (Story) => (
      <div className="relative w-96 rounded-card bg-nav py-4.5 pr-24 pl-5 font-mono text-sm text-nav-strong">
        <pre id="story-code" className="m-0">
          npm install pyxis-analytics
        </pre>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CopyCodeButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AtRest: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('button', { name: 'Copy' })).toBeVisible();
  },
};

export const DarkTheme: Story = { globals: { theme: 'dark' } };
