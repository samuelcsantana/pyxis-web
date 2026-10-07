import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { routeRows } from '@/domain/requests';
import { demoFailedReadsReport, demoRequestsReport } from '@/services/requests/demo-requests';
import { RequestsTable } from './requests-table';

const ROWS = routeRows(
  demoRequestsReport(
    'demo',
    { from: '2026-09-22', to: '2026-10-05' },
    null,
    new Date('2026-10-06T02:30:00.000Z'),
  ).routes,
  'America/Sao_Paulo',
  'writes',
);

const FAILED_READS = routeRows(
  demoFailedReadsReport('demo', { from: '2026-09-06', to: '2026-10-05' }, null).routes,
  'America/Sao_Paulo',
  'reads',
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
    emptyMessage: 'No writes in this period.',
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

export const RouteHovered: Story = {
  parameters: { pseudo: { hover: ['tbody tr:first-child button'] } },
};

export const Empty: Story = { args: { rows: [] } };

export const FailedReads: Story = {
  args: { kind: 'reads', rows: FAILED_READS, query: 'range=30d&kind=reads' },
};

export const FailedReadDetails: Story = {
  args: FailedReads.args,
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(page.getByRole('button', { name: 'GET /orders/:id, show details' }));
    await expect(await page.findByRole('dialog', { name: 'GET /orders/:id' })).toBeVisible();
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

export const DarkThemeWithDetails: Story = {
  ...DetailsOpen,
  globals: { theme: 'dark' },
};
