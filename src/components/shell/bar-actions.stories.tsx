import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, spyOn, userEvent, within } from 'storybook/test';
import { TEST_PROJECT, withProjectChoices } from '@/test-utils/project-choices';
import { BarActions } from './bar-actions';

const meta = {
  title: 'Shell/BarActions',
  component: BarActions,
  tags: ['autodocs'],
  args: { projectId: TEST_PROJECT.id },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: { pathname: `/${TEST_PROJECT.id}/overview`, query: { range: '7d' } },
    },
  },
  decorators: [
    (Story, { parameters }) =>
      withProjectChoices(
        <div className="flex min-h-40 items-start justify-end gap-3 bg-card p-6 text-ink">
          <Story />
        </div>,
        TEST_PROJECT,
        parameters.owner !== false,
      ),
  ],
} satisfies Meta<typeof BarActions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ForTheOwner: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('link', { name: 'Export' })).toHaveAttribute(
      'href',
      `/${TEST_PROJECT.id}/settings/export?range=7d`,
    );
  },
};

export const ForTheOwnerDark: Story = { ...ForTheOwner, globals: { theme: 'dark' } };

export const ForAMember: Story = {
  parameters: { owner: false },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('link', { name: 'Export' })).toBeNull();
  },
};

const copyTheLink: NonNullable<Story['play']> = async ({ canvasElement }) => {
  spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByRole('button', { name: 'Copy link' }));
  await expect(await canvas.findByText('Link copied')).toBeVisible();
};

export const LinkCopied: Story = { play: copyTheLink };

export const LinkCopiedDark: Story = { globals: { theme: 'dark' }, play: copyTheLink };

const refuseTheClipboard: NonNullable<Story['play']> = async ({ canvasElement }) => {
  spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('denied'));
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByRole('button', { name: 'Copy link' }));
  await expect(await canvas.findByRole('textbox', { name: 'Copy link' })).toHaveFocus();
};

export const ClipboardRefused: Story = { play: refuseTheClipboard };

export const ClipboardRefusedDark: Story = { globals: { theme: 'dark' }, play: refuseTheClipboard };
