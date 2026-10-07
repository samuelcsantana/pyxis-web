import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { ControlRecipes } from './control-recipes';

const meta = {
  title: 'Design/Control recipes',
  component: ControlRecipes,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ControlRecipes>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AtRest: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const unavailable = getComputedStyle(
      canvas.getByRole('button', { name: 'Primary, unavailable' }),
    );
    const busy = getComputedStyle(canvas.getByRole('button', { name: 'Primary, busy…' }));
    const enabled = getComputedStyle(canvas.getByRole('button', { name: 'Primary' }));

    await expect(enabled.cursor).toBe('pointer');
    await expect(unavailable.cursor).toBe('not-allowed');
    await expect(unavailable.opacity).toBe('0.5');
    await expect(busy.cursor).toBe('wait');
    await expect(busy.opacity).toBe('1');
  },
};

export const Hovered: Story = { parameters: { pseudo: { hover: true } } };

export const Pressed: Story = { parameters: { pseudo: { active: true } } };

export const KeyboardFocus: Story = { parameters: { pseudo: { focusVisible: true } } };

export const Dark: Story = { globals: { theme: 'dark' } };

export const DarkHovered: Story = { ...Hovered, globals: { theme: 'dark' } };

export const DarkPressed: Story = { ...Pressed, globals: { theme: 'dark' } };
