import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { olderVisitsText, visitViews } from '@/domain/timeline';
import { DEMO_USER_ID, demoTimelineReport } from '@/services/timeline/demo-timeline';
import { OlderVisits, type OlderVisitsPage } from './older-visits';
import { english } from '@/test-utils/english';

const [, MIDDLE] = visitViews(
  demoTimelineReport('demo', { kind: 'user', id: DEMO_USER_ID }, new Date()).visits,
  'America/Sao_Paulo',
  'all',
  english,
);

function loadOlder(): Promise<OlderVisitsPage> {
  return Promise.resolve({ visits: MIDDLE === undefined ? [] : [MIDDLE], nextBefore: null });
}

function failing(): Promise<OlderVisitsPage> {
  return Promise.reject(new Error('The API answered 503'));
}

const meta = {
  title: 'Timeline/Older visits',
  component: OlderVisits,
  args: {
    initialBefore: '2026-10-03T12:12:04.000Z',
    loadOlder,
    text: olderVisitsText(english),
  },
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="w-[min(100%,62rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof OlderVisits>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NotLoadedYet: Story = {};

export const Loaded: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Load older visits' }));
    await expect(await canvas.findByText('That is every visit.')).toBeVisible();
  },
};

export const Failed: Story = {
  args: { loadOlder: failing },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Load older visits' }));
    await expect(await canvas.findByRole('alert')).toBeVisible();
  },
};

function pending(): Promise<OlderVisitsPage> {
  return new Promise(() => undefined);
}

const showsLoading: Story['play'] = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByRole('button', { name: 'Load older visits' }));
  const button = await canvas.findByRole('button', { name: 'Loading older visits…' });
  await expect(button).toBeDisabled();
  await expect(button).toHaveAttribute('aria-busy', 'true');
};

export const Loading: Story = { args: { loadOlder: pending }, play: showsLoading };

export const LoadingDark: Story = {
  args: { loadOlder: pending },
  globals: { theme: 'dark' },
  play: showsLoading,
};

export const DarkTheme: Story = { ...Loaded, globals: { theme: 'dark' } };
