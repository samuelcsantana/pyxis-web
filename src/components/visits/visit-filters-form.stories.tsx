import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { NO_VISIT_FILTERS } from '@/domain/visits';
import { VisitFiltersForm } from './visit-filters-form';

const meta = {
  title: 'Visits/Filters',
  component: VisitFiltersForm,
  tags: ['autodocs'],
  args: {
    action: '/demo/visits',
    period: { preset: '30d', from: '2026-09-06', to: '2026-10-05' },
    filters: NO_VISIT_FILTERS,
    problems: [],
    clearHref: null,
  },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
  decorators: [
    (Story) => (
      <div className="w-[min(100%,77.5rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof VisitFiltersForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoFilter: Story = {};

export const Filtered: Story = {
  args: {
    filters: {
      paths: ['/calculator', '/sign-up'],
      event: 'calculator_result_shown',
      property: 'calculator=shipping',
      channel: 'paid',
      device: 'mobile',
      identity: 'anonymous',
    },
    clearHref: '/demo/visits?range=30d',
  },
};

export const FiltersLeftOut: Story = {
  args: {
    problems: ['A page path starts with "/".', 'A property filter needs an event.'],
  },
};

export const DarkTheme: Story = { ...Filtered, globals: { theme: 'dark' } };

const PHONE = { viewport: { value: 'mobile2', isRotated: false } } as const;

export const CollapsedOnAPhone: Story = {
  globals: PHONE,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Filters' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    await expect(canvas.queryByRole('textbox', { name: 'Viewed page' })).toBeNull();
  },
};

export const OpenedOnAPhone: Story = {
  globals: PHONE,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('button', { name: 'Filters' });
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByRole('textbox', { name: 'Viewed page' })).toBeVisible();
  },
};

export const FilteredOnAPhone: Story = {
  ...Filtered,
  globals: PHONE,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Filters · 7 active' }),
    ).toHaveAttribute('aria-expanded', 'true');
  },
};

export const FiltersLeftOutOnAPhone: Story = {
  ...FiltersLeftOut,
  globals: PHONE,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('alert')).toBeVisible();
  },
};

export const DarkThemeOnAPhone: Story = {
  globals: { ...PHONE, theme: 'dark' },
};
