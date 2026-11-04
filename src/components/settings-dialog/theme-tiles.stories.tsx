import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { ThemeTiles } from './theme-tiles';

const meta = {
  title: 'Settings/ThemeTiles',
  component: ThemeTiles,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-xl bg-card p-5">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ThemeTiles>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ShowsTheThemeOnScreen: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getAllByRole('button', { pressed: true })).toHaveLength(1);
  },
};

export const ShowsTheThemeOnScreenDark: Story = {
  globals: { theme: 'dark' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('button', { name: 'Dark' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  },
};

export const ChoosingDark: Story = {
  play: async ({ canvasElement }) => {
    const dark = within(canvasElement).getByRole('button', { name: 'Dark' });
    await userEvent.click(dark);
    await expect(dark).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'System' }));
  },
};

export const KeyboardFocus: Story = {
  play: async ({ canvasElement }) => {
    const light = within(canvasElement).getByRole('button', { name: 'Light' });
    light.focus();
    await expect(light).toHaveFocus();
  },
};

export const BrazilianPortuguese: Story = {
  globals: { locale: 'pt-BR' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('group', { name: 'Tema' })).toBeVisible();
  },
};
