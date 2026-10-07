import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ThemeToggle } from './theme-toggle';

const meta = {
  title: 'Shell/ThemeToggle',
  component: ThemeToggle,
  tags: ['autodocs'],
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LightChosen: Story = { args: { initialTheme: 'light' } };

export const FollowsTheSystem: Story = {};

export const DarkTheme: Story = {
  args: { initialTheme: 'dark' },
  globals: { theme: 'dark' },
};

export const Hovered: Story = {
  args: { initialTheme: 'light' },
  parameters: { pseudo: { hover: true } },
};

export const HoveredDark: Story = {
  args: { initialTheme: 'dark' },
  globals: { theme: 'dark' },
  parameters: { pseudo: { hover: true } },
};

export const KeyboardFocus: Story = {
  args: { initialTheme: 'light' },
  parameters: { pseudo: { focusVisible: true } },
};
