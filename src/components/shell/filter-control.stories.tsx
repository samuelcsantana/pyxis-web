import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { english } from '@/test-utils/english';
import { FilterControl } from './filter-control';
import { screenTopbarTexts } from './screen-topbar-texts';

const PROJECT_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';

const meta = {
  title: 'Shell/FilterControl',
  component: FilterControl,
  tags: ['autodocs'],
  args: { fields: screenTopbarTexts(english).filterFields },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: { pathname: `/${PROJECT_ID}/overview`, query: { range: '7d' } },
    },
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-[28rem] bg-card p-6 text-ink">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FilterControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {};

const openTheForm: NonNullable<Story['play']> = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByText('Filter'));
  await expect(await canvas.findByLabelText('Filter by')).toHaveValue('country');
  await expect(canvas.getByLabelText('Value')).toHaveAccessibleDescription('Two-letter code');
};

export const Open: Story = { play: openTheForm };

export const OpenDark: Story = { globals: { theme: 'dark' }, play: openTheForm };

export const OpenOnAField: Story = {
  play: async (context) => {
    await openTheForm(context);
    const canvas = within(context.canvasElement);
    await userEvent.selectOptions(canvas.getByLabelText('Filter by'), 'channel');
    await expect(canvas.getByLabelText('Value')).toHaveValue('paid');
  },
};

export const KeyboardFocus: Story = {
  play: async ({ canvasElement }) => {
    const summary = within(canvasElement).getByText('Filter');
    summary.focus();
    await expect(summary).toHaveFocus();
  },
};
