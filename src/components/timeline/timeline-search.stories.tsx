import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { rejectedLookupOf } from '@/domain/timeline';
import { english } from '@/test-utils/english';
import { TimelineSearch } from './timeline-search';

const meta = {
  title: 'Timeline/Search',
  component: TimelineSearch,
  args: { action: '/demo/timeline', lookup: null, hint: 'Try u_7f3a' },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
} satisfies Meta<typeof TimelineSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const LookingUpAPerson: Story = {
  args: { lookup: { kind: 'user', id: 'u_7f3a' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('combobox', { name: 'Look up' })).toHaveValue('user');
    await expect(canvas.getByRole('textbox', { name: 'User id' })).toHaveValue('u_7f3a');
  },
};

const VISIT_ID = '3c07a1b2-5d4e-4f60-8a71-9b8c7d6e5f40';

const showsTheVisitMode: Story['play'] = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await expect(canvas.getByRole('combobox', { name: 'Look up' })).toHaveValue('visit');
  await expect(canvas.getByRole('textbox', { name: 'Visit id' })).toHaveValue(VISIT_ID);
};

export const LookingUpAVisit: Story = {
  args: { lookup: { kind: 'visit', id: VISIT_ID } },
  play: showsTheVisitMode,
};

export const LookingUpAVisitDark: Story = {
  args: { lookup: { kind: 'visit', id: VISIT_ID } },
  globals: { theme: 'dark' },
  play: showsTheVisitMode,
};

export const SwitchedToVisitMode: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.selectOptions(
      canvas.getByRole('combobox', { name: 'Look up' }),
      'One visit, by visit id',
    );
    await expect(canvas.getByRole('textbox', { name: 'Visit id' })).toHaveAttribute(
      'name',
      'visit',
    );
  },
};

const REJECTED_VISIT = rejectedLookupOf({ visit: 'not-a-visit-id' }, english);

const marksTheRejectedId: Story['play'] = async ({ canvasElement }) => {
  const field = within(canvasElement).getByRole('textbox', { name: 'Visit id' });
  await expect(field).toHaveValue('not-a-visit-id');
  await expect(field).toHaveAttribute('aria-invalid', 'true');
};

export const RejectedVisitId: Story = {
  args: { rejected: REJECTED_VISIT },
  play: marksTheRejectedId,
};

export const RejectedVisitIdDark: Story = {
  args: { rejected: REJECTED_VISIT },
  globals: { theme: 'dark' },
  play: marksTheRejectedId,
};
