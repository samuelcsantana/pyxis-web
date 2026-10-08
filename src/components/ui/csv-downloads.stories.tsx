import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CsvDownloads } from './csv-downloads';

const meta = {
  title: 'UI/CSV downloads',
  component: CsvDownloads,
  tags: ['autodocs'],
  args: {
    downloads: [
      { label: 'Activity per day', href: '/demo/overview/export?range=30d&table=daily' },
      { label: 'Top pages', href: '/demo/overview/export?range=30d&table=pages' },
      { label: 'Top events', href: '/demo/overview/export?range=30d&table=events' },
    ],
  },
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="w-[min(100%,48rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CsvDownloads>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OneTable: Story = {
  args: { downloads: [{ label: 'Writes', href: '/demo/requests/export?range=7d' }] },
};

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
