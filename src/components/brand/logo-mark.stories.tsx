import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LogoMark } from './logo-mark';

const meta = {
  title: 'Brand/LogoMark',
  component: LogoMark,
  tags: ['autodocs'],
  args: { size: 64 },
  decorators: [
    (Story) => (
      <div className="text-ink">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LogoMark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Decorative: Story = {};

export const WithTitle: Story = { args: { title: 'Pyxis' } };

export const Small: Story = { args: { size: 24, title: 'Pyxis' } };

export const DarkTheme: Story = {
  args: { title: 'Pyxis' },
  globals: { theme: 'dark' },
};
