import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { routeRows } from '@/domain/requests';
import { demoRequestsReport } from '@/services/requests/demo-requests';
import { RequestsTable } from './requests-table';

const ROWS = routeRows(
  demoRequestsReport({ from: '2026-09-22', to: '2026-10-05' }, null).routes,
  'America/Sao_Paulo',
);

const meta = {
  title: 'Requests/Routes',
  component: RequestsTable,
  tags: ['autodocs'],
  args: {
    rows: ROWS,
    basePath: '/demo/requests',
    query: 'range=7d',
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

export const Empty: Story = { args: { rows: [] } };

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
