import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { InstallTabs } from './install-tabs';

const meta = {
  title: 'Install/Install tabs',
  component: InstallTabs,
  args: {
    label: 'How to install',
    tabs: [
      {
        id: 'story-yourself',
        label: 'Yourself',
        panel: <p className="text-sm">npm install pyxis-analytics</p>,
      },
      {
        id: 'story-with-agent',
        label: 'With an AI agent',
        panel: <p className="text-sm">Paste this request into your coding agent.</p>,
      },
    ],
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof InstallTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstTab: Story = {};

export const SecondTabByKeyboard: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('tab', { name: 'Yourself' }));
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('tab', { name: 'With an AI agent' })).toHaveFocus();
    await expect(canvas.getByRole('tabpanel', { name: 'With an AI agent' })).toBeVisible();
  },
};

export const DarkTheme: Story = { globals: { theme: 'dark' } };
