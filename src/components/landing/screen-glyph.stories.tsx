import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { SCREENS_SHOWN } from './dashboard-answers-section';
import { ScreenGlyph } from './screen-glyph';

const meta = {
  title: 'Landing/ScreenGlyph',
  component: ScreenGlyph,
  args: { screen: 'overview' },
  render: () => (
    <div className="grid w-[32rem] grid-cols-4 gap-4 bg-card p-4">
      {SCREENS_SHOWN.map((screen) => (
        <ScreenGlyph key={screen} screen={screen} />
      ))}
    </div>
  ),
} satisfies Meta<typeof ScreenGlyph>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EveryScreen: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('svg[data-screen]')).toHaveLength(8);
  },
};

export const DarkTheme: Story = { globals: { theme: 'dark' } };
