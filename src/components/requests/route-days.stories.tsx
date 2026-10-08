import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { requestsResponseSchema } from '@/domain/requests.schema';
import { routeDaysText, routeDaysView } from '@/domain/route-days';
import { demoRouteRequestsWire } from '@/services/requests/demo-requests';
import { RouteDays } from './route-days';
import { english } from '@/test-utils/english';

const RANGE = { from: '2026-09-22', to: '2026-10-05' };
const NOW = new Date('2026-10-06T02:30:00.000Z');

function demoView(kind: 'writes' | 'reads', screen: string | null, route: string) {
  return routeDaysView(
    requestsResponseSchema.parse(demoRouteRequestsWire('demo', RANGE, kind, screen, route, NOW))
      .routeDays ?? [],
    kind,
    english,
  );
}

const meta = {
  title: 'Requests/Route days',
  component: RouteDays,
  tags: ['autodocs'],
  args: {
    state: { status: 'ready', view: demoView('writes', null, 'POST /orders') },
    text: routeDaysText('writes', english),
    onRetry: fn(),
  },
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="w-[min(100%,28.75rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RouteDays>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Writes: Story = {};

export const QuietDaysLeftOut: Story = {
  args: { state: { status: 'ready', view: demoView('writes', '/orders', 'PATCH /users/me') } },
};

export const FailedReads: Story = {
  args: {
    state: { status: 'ready', view: demoView('reads', null, 'GET /products') },
    text: routeDaysText('reads', english),
  },
};

export const NoCalls: Story = {
  args: { state: { status: 'ready', view: { rows: [], note: null } } },
};

export const Loading: Story = { args: { state: { status: 'loading' } } };

export const Failed: Story = {
  args: { state: { status: 'error' } },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Try again' }));
    await expect(args.onRetry).toHaveBeenCalledOnce();
  },
};

export const FromAnOlderApi: Story = { args: { state: { status: 'unavailable' } } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };

export const OnAPhone: Story = {
  decorators: [
    (Story) => (
      <div className="w-[342px]">
        <Story />
      </div>
    ),
  ],
};
