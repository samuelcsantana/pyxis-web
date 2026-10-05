import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { DesignTokens } from './design-tokens';

const meta = {
  title: 'Design/Tokens',
  component: DesignTokens,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof DesignTokens>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {};

export const Dark: Story = { globals: { theme: 'dark' } };
