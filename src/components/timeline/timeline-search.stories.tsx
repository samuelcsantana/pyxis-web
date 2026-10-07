import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { rejectedLookupOf } from '@/domain/timeline';
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

const REJECTED_VISIT = rejectedLookupOf({ visit: 'not-a-visit-id' });

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
