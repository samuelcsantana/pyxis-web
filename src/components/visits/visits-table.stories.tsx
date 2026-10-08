import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { NO_VISIT_FILTERS, type VisitRowsPage, visitRows, visitsTableText } from '@/domain/visits';
import { showcaseVisitsReport } from '@/test-utils/showcase-visits';
import { VisitsTable } from './visits-table';
import { english } from '@/test-utils/english';

const TIME_ZONE = 'America/Sao_Paulo';
const RANGE = { from: '2026-09-22', to: '2026-10-05' };
const NOW = new Date('2026-10-06T02:30:00.000Z');
const FIRST = showcaseVisitsReport('demo', RANGE, NO_VISIT_FILTERS, null, NOW);
const SECOND = showcaseVisitsReport('demo', RANGE, NO_VISIT_FILTERS, FIRST.nextCursor, NOW);

function loadOlder(): Promise<VisitRowsPage> {
  return Promise.resolve({ rows: visitRows(SECOND.visits, TIME_ZONE, english), nextCursor: null });
}

function failing(): Promise<VisitRowsPage> {
  return Promise.reject(new Error('The API answered 503'));
}

function pending(): Promise<VisitRowsPage> {
  return new Promise<VisitRowsPage>(() => undefined);
}

const meta = {
  title: 'Visits/Visits table',
  component: VisitsTable,
  tags: ['autodocs'],
  args: {
    rows: visitRows(FIRST.visits, TIME_ZONE, english),
    nextCursor: FIRST.nextCursor,
    timelinePath: '/demo/timeline',
    emptyMessage: 'No visits in this period.',
    loadOlder,
    text: visitsTableText(english),
  },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
  decorators: [
    (Story) => (
      <div className="w-[min(100%,77.5rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof VisitsTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OlderVisitsLoaded: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Load older visits' }));
    await expect(await canvas.findByText('That is every visit of this period.')).toBeVisible();
    await waitFor(() =>
      expect(canvas.getByRole('link', { name: /, open visit 19c2e5f6$/ })).toHaveFocus(),
    );
  },
};

export const LoadingOlderVisits: Story = {
  args: { loadOlder: pending },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Load older visits' }));
    const loading = await canvas.findByRole('button', { name: 'Loading older visits…' });
    await expect(loading).toBeDisabled();
    await expect(getComputedStyle(loading).cursor).toBe('wait');
    await expect(getComputedStyle(loading).opacity).toBe('1');
  },
};

export const OlderVisitsFailed: Story = {
  args: { loadOlder: failing },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Load older visits' }));
    await expect(await canvas.findByRole('alert')).toBeVisible();
  },
};

export const Empty: Story = {
  args: {
    rows: [],
    nextCursor: null,
    emptyMessage: 'No visit matches these filters in this period.',
  },
};

export const DarkTheme: Story = { ...OlderVisitsLoaded, globals: { theme: 'dark' } };

const PHONE = { viewport: { value: 'mobile2', isRotated: false } } as const;

export const CardsOnAPhone: Story = {
  globals: PHONE,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('list', { name: 'Visits' })).toBeVisible();
    await expect(canvas.queryByRole('table', { name: 'Visits' })).toBeNull();
  },
};

export const OlderCardsLoadedOnAPhone: Story = {
  globals: PHONE,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Load older visits' }));
    await expect(await canvas.findByText('That is every visit of this period.')).toBeVisible();
    await waitFor(() =>
      expect(canvas.getByRole('link', { name: /, open visit 19c2e5f6$/ })).toHaveFocus(),
    );
  },
};

export const EmptyOnAPhone: Story = { ...Empty, globals: PHONE };

export const DarkThemeOnAPhone: Story = { globals: { ...PHONE, theme: 'dark' } };
