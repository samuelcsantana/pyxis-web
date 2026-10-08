import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { type RequestKind, routeRows } from '@/domain/requests';
import { requestsResponseSchema } from '@/domain/requests.schema';
import { routeDaysText, routeDaysView } from '@/domain/route-days';
import {
  demoFailedReadsReport,
  demoRequestsReport,
  demoRouteRequestsWire,
} from '@/services/requests/demo-requests';
import { RequestsTable } from './requests-table';
import type { LoadRouteDays } from './use-route-days';
import { english } from '@/test-utils/english';

const ROWS = routeRows(
  demoRequestsReport(
    'demo',
    { from: '2026-09-22', to: '2026-10-05' },
    null,
    new Date('2026-10-06T02:30:00.000Z'),
  ).routes,
  'America/Sao_Paulo',
  'writes',
  english,
);

function demoRouteDays(kind: RequestKind): LoadRouteDays {
  return (route: string) =>
    Promise.resolve(
      routeDaysView(
        requestsResponseSchema.parse(
          demoRouteRequestsWire(
            'demo',
            { from: '2026-09-22', to: '2026-10-05' },
            kind,
            null,
            route,
            new Date('2026-10-06T02:30:00.000Z'),
          ),
        ).routeDays ?? [],
        kind,
        english,
      ),
    );
}

const FAILED_READS = routeRows(
  demoFailedReadsReport('demo', { from: '2026-09-06', to: '2026-10-05' }, null).routes,
  'America/Sao_Paulo',
  'reads',
  english,
);

const meta = {
  title: 'Requests/Routes',
  component: RequestsTable,
  tags: ['autodocs'],
  args: {
    kind: 'writes',
    rows: ROWS,
    basePath: '/demo/requests',
    query: 'range=7d',
    timelinePath: '/demo/timeline',
    visitsPath: '/demo/visits',
    emptyMessage: 'No writes in this period.',
    loadRouteDays: demoRouteDays('writes'),
    routeDaysText: routeDaysText('writes', english),
  },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
  decorators: [
    (Story) => (
      <div className="w-[min(100%,70rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RequestsTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DetailsOpen: Story = {
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(page.getByRole('button', { name: 'POST /orders, show details' }));
    const details = await page.findByRole('dialog', { name: 'POST /orders' });
    await expect(await within(details).findByRole('table', { name: 'Day by day' })).toBeVisible();
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();
    await expect(details.contains(canvasElement.ownerDocument.activeElement)).toBe(true);
  },
};

export const EscapeClosesAndRefocuses: Story = {
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const opener = page.getByRole('button', { name: 'POST /payouts, show details' });
    await userEvent.click(opener);
    await page.findByRole('dialog', { name: 'POST /payouts' });
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(page.queryByRole('dialog')).toBeNull());
    await expect(opener).toHaveFocus();
  },
};

export const OpenedFromTheAddress: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: { pathname: '/demo/requests', query: { route: 'PATCH /users/me' } },
    },
  },
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    await expect(await page.findByRole('dialog', { name: 'PATCH /users/me' })).toBeVisible();
  },
};

const QUIET_ROUTE = ROWS.find((row) => !row.hasFailures);
if (QUIET_ROUTE === undefined) {
  throw new Error('Every demo route has failures.');
}

export const DetailsOfARouteWithoutFailures: Story = {
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(page.getByRole('button', { name: `${QUIET_ROUTE.key}, show details` }));
    const details = await page.findByRole('dialog', { name: QUIET_ROUTE.key });
    await expect(within(details).getAllByText('No failures in this period.')).toHaveLength(2);
  },
};

export const RouteHovered: Story = {
  parameters: { pseudo: { hover: ['tbody tr:first-child button'] } },
};

export const Empty: Story = { args: { rows: [] } };

export const FailedReads: Story = {
  args: {
    kind: 'reads',
    rows: FAILED_READS,
    query: 'range=30d&kind=reads',
    loadRouteDays: demoRouteDays('reads'),
    routeDaysText: routeDaysText('reads', english),
  },
};

export const FailedReadDetails: Story = {
  args: FailedReads.args,
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(page.getByRole('button', { name: 'GET /orders/:id, show details' }));
    const details = await page.findByRole('dialog', { name: 'GET /orders/:id' });
    await expect(details).toBeVisible();
    const days = await within(details).findByRole('table', { name: 'Day by day' });
    await expect(within(days).queryByRole('columnheader', { name: 'Total' })).toBeNull();
  },
};

export const NoFailedReads: Story = {
  args: { kind: 'reads', rows: [], emptyMessage: 'No read failed in this period.' },
};

export const FailedReadsDarkTheme: Story = { ...FailedReads, globals: { theme: 'dark' } };

export const OnAPhone: Story = {
  decorators: [
    (Story) => (
      <div className="w-[358px]">
        <Story />
      </div>
    ),
  ],
};

export const DayByDayLoading: Story = {
  args: { loadRouteDays: () => new Promise(() => undefined) },
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(page.getByRole('button', { name: 'POST /orders, show details' }));
    await expect(await page.findByText('Loading the days of this route…')).toBeVisible();
  },
};

export const DayByDayFailed: Story = {
  args: { loadRouteDays: () => Promise.reject(new Error('The API is unreachable.')) },
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(page.getByRole('button', { name: 'POST /orders, show details' }));
    await expect(await page.findByRole('button', { name: 'Try again' })).toBeVisible();
  },
};

export const DayByDayFromAnOlderApi: Story = {
  args: { loadRouteDays: () => Promise.resolve(null) },
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(page.getByRole('button', { name: 'POST /orders, show details' }));
    await expect(await page.findByText('Day-by-day figures need a newer Pyxis API.')).toBeVisible();
  },
};

export const DarkThemeWithDetails: Story = {
  ...DetailsOpen,
  globals: { theme: 'dark' },
};
