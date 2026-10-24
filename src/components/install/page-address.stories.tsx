import type { Decorator, Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { PageAddress } from './page-address';

const inANotice: Decorator = (Story) => (
  <div className="flex max-w-sm flex-col gap-2 rounded-card border border-warn/35 bg-warn-soft px-3.5 py-3">
    <Story />
  </div>
);

const meta = {
  title: 'Install/Page address',
  component: PageAddress,
  decorators: [inANotice],
  args: {
    id: 'story-page-address',
    labels: { copy: 'Copy the address', copied: 'Copied', selected: 'Selected, press Ctrl+C' },
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof PageAddress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OnAPhone: Story = {
  globals: { viewport: { value: 'mobile1' } },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Copy the address' }),
    ).toBeVisible();
  },
};

export const DarkTheme: Story = { globals: { theme: 'dark' } };
