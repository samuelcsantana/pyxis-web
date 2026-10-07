import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LinkTabs } from './link-tabs';

const meta = {
  title: 'UI/Link tabs',
  component: LinkTabs,
  tags: ['autodocs'],
  args: {
    label: 'Request kind',
    current: 'writes',
    tabs: [
      { key: 'writes', label: 'Writes', href: '/demo/requests?range=7d' },
      { key: 'reads', label: 'Failed reads', href: '/demo/requests?range=7d&kind=reads' },
    ],
  },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
  decorators: [
    (Story) => (
      <div className="w-[min(100%,40rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LinkTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SecondTabCurrent: Story = { args: { current: 'reads' } };

export const OnAPhone: Story = {
  decorators: [
    (Story) => (
      <div className="w-[358px]">
        <Story />
      </div>
    ),
  ],
};

export const DarkTheme: Story = { globals: { theme: 'dark' } };
