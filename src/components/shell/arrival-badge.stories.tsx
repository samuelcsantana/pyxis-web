import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useEffect } from 'react';
import { expect, within } from 'storybook/test';
import { ArrivalBadge } from './arrival-badge';
import { type ArrivalNews, publishArrivalNews } from './arrival-news';

const NEWS: ArrivalNews = {
  visits: { shown: '3', label: '3 new visits' },
  features: { shown: '99+', label: 'More than 99 new events' },
  requests: { shown: '2', label: '2 new failed requests' },
};

function WithNews({ children }: { readonly children: React.ReactNode }) {
  useEffect(() => {
    publishArrivalNews(NEWS);
    return () => {
      publishArrivalNews({});
    };
  }, []);
  return children;
}

const meta = {
  title: 'Shell/ArrivalBadge',
  component: ArrivalBadge,
  args: { screen: 'visits', active: false },
  decorators: [
    (Story) => (
      <WithNews>
        <div className="flex w-60 items-center gap-3 rounded-input bg-nav px-3 py-2.5 text-sm text-nav-text">
          <span>Menu item</span>
          <Story />
        </div>
      </WithNews>
    ),
  ],
} satisfies Meta<typeof ArrivalBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NewVisits: Story = {
  play: async ({ canvasElement }) => {
    await expect(await within(canvasElement).findByText(', 3 new visits')).toBeInTheDocument();
  },
};

export const MoreThan99: Story = { args: { screen: 'features' } };

export const FailedRequests: Story = { args: { screen: 'requests' } };

export const OnTheCurrentScreen: Story = {
  args: { active: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByText('3')).toBeNull();
  },
};

export const DarkTheme: Story = { args: { screen: 'requests' }, globals: { theme: 'dark' } };
