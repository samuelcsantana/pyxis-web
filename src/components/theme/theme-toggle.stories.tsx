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
