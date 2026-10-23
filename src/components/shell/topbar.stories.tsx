import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Topbar } from './topbar';

const meta = {
  title: 'Shell/Topbar',
  component: Topbar,
  tags: ['autodocs'],
  args: {
    title: 'Settings',
    subtitle: 'How Demo Store is set up, its keys, and the e-mails you get about it.',
  },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Topbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DarkTheme: Story = { globals: { theme: 'dark' } };

export const OnAPhone: Story = {
  decorators: [
    (Story) => (
      <div className="w-[390px]">
        <Story />
      </div>
    ),
  ],
};
