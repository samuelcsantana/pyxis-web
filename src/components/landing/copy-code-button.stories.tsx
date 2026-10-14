import type { Decorator, Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { CopyCodeButton } from './copy-code-button';

const inTheCornerOfACodeBlock: Decorator = (Story) => (
  <div className="relative w-96 rounded-card bg-nav py-4.5 pr-24 pl-5 font-mono text-sm text-nav-strong">
    <pre id="story-code" className="m-0">
      npm install pyxis-analytics
    </pre>
    <Story />
  </div>
);

const besideAnAddress: Decorator = (Story) => (
  <div className="flex w-96 flex-wrap items-center justify-between gap-3 rounded-card bg-nav py-2.5 pr-2.5 pl-5 font-mono text-sm text-nav-strong">
    <code id="story-email">hello@pyxis-analytics.dev</code>
    <Story />
  </div>
);

const meta = {
  title: 'Landing/CopyCodeButton',
  component: CopyCodeButton,
  args: {
    code: 'npm install pyxis-analytics',
    targetId: 'story-code',
    labels: { copy: 'Copy', copied: 'Copied', selected: 'Selected, press Ctrl+C' },
  },
} satisfies Meta<typeof CopyCodeButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AtRest: Story = {
  decorators: [inTheCornerOfACodeBlock],
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('button', { name: 'Copy' })).toBeVisible();
  },
};

export const DarkTheme: Story = {
  decorators: [inTheCornerOfACodeBlock],
  globals: { theme: 'dark' },
};

export const BesideTheCode: Story = {
  args: { code: 'hello@pyxis-analytics.dev', targetId: 'story-email', placement: 'inline' },
  decorators: [besideAnAddress],
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('button', { name: 'Copy' })).toBeVisible();
  },
};
