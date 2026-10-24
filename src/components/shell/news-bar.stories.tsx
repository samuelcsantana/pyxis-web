import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { type ReactNode, useEffect } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { type OpenScreenNews, publishOpenScreenNews } from './arrival-news';
import { NewsBar } from './news-bar';

const PROJECT_ID = 'demo';

function on(news: OpenScreenNews) {
  return {
    news,
    nextjs: { appDirectory: true, navigation: { pathname: `/${PROJECT_ID}/${news.screen}` } },
  };
}

function WithNews({
  news,
  children,
}: {
  readonly news: OpenScreenNews;
  readonly children: ReactNode;
}) {
  useEffect(() => {
    publishOpenScreenNews(news);
    return () => {
      publishOpenScreenNews(undefined);
    };
  }, [news]);
  return children;
}

const THREE_VISITS: OpenScreenNews = { screen: 'overview', shown: '3', label: '3 new visits' };

const meta = {
  title: 'Shell/NewsBar',
  component: NewsBar,
  parameters: { layout: 'fullscreen', ...on(THREE_VISITS) },
  decorators: [
    (Story, { parameters }) => (
      <WithNews news={parameters.news as OpenScreenNews}>
        <div className="min-h-48 bg-bg">
          <div className="border-b border-line bg-card px-8 py-5 text-title font-semibold text-ink">
            Overview
          </div>
          <Story />
          <div className="mx-8 h-24 rounded-card border border-line bg-card" />
        </div>
      </WithNews>
    ),
  ],
} satisfies Meta<typeof NewsBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NewVisits: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByRole('button', { name: /^3 new visits\s*,\s*Refresh$/ }),
    ).toBeInTheDocument();
  },
};

export const MoreThan99: Story = {
  parameters: on({ screen: 'features', shown: '99+', label: 'More than 99 new events' }),
};

export const FailedRequests: Story = {
  parameters: on({ screen: 'requests', shown: '2', label: '2 new failed requests' }),
};

export const Refreshing: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole('button', { name: /^3 new visits/ }));
    await expect(canvas.getByRole('button', { name: 'Refreshing…' })).toHaveAttribute(
      'aria-busy',
      'true',
    );
  },
};

export const DarkTheme: Story = { globals: { theme: 'dark' } };
