import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { english } from '@/test-utils/english';
import { RequestFilters } from './request-filters';

const meta = {
  title: 'Requests/Filters',
  component: RequestFilters,
  tags: ['autodocs'],
  args: {
    kind: 'writes',
    allHref: '/demo/requests?range=7d',
    failingHref: '/demo/requests?range=7d&show=failing',
    failingOnly: false,
    screen: null,
    clearScreenHref: '/demo/requests?range=7d',
    i18n: english,
  },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
  decorators: [
    (Story) => (
      <div className="w-[min(100%,70rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RequestFilters>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllRoutes: Story = {};

export const FailingFromAScreen: Story = { args: { failingOnly: true, screen: '/orders/new' } };

export const FailedReadsFromAScreen: Story = { args: { kind: 'reads', screen: '/products' } };

export const OnAPhone: Story = {
  args: { screen: '/orders/new' },
  decorators: [
    (Story) => (
      <div className="w-[358px]">
        <Story />
      </div>
    ),
  ],
};

export const DarkTheme: Story = { args: { screen: '/orders/new' }, globals: { theme: 'dark' } };
