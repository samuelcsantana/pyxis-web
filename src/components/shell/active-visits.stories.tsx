import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { type ReactNode, useEffect } from 'react';
import { expect, within } from 'storybook/test';
import { ActiveVisits } from './active-visits';
import { publishActiveVisits } from './arrival-news';

function WithCount({ count, children }: { readonly count: number; readonly children: ReactNode }) {
  useEffect(() => {
    publishActiveVisits(count);
    return () => {
      publishActiveVisits(undefined);
    };
  }, [count]);
  return children;
}

const meta = {
  title: 'Shell/ActiveVisits',
  component: ActiveVisits,
  parameters: { count: 4 },
  decorators: [
    (Story, { parameters }) => (
      <WithCount count={parameters.count as number}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 bg-card px-8 py-5 text-ink">
          <h1 className="text-title leading-7 font-semibold tracking-tight">Overview</h1>
          <Story />
        </div>
      </WithCount>
    ),
  ],
} satisfies Meta<typeof ActiveVisits>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SomeoneOnTheSite: Story = {
  play: async ({ canvasElement }) => {
    await expect(await within(canvasElement).findByText('4 on the site now')).toBeInTheDocument();
  },
};

export const NobodyOnTheSite: Story = { parameters: { count: 0 } };

export const ManyOnTheSite: Story = { parameters: { count: 1234 } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
