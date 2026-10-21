import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ReactNode } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import type { RemovePersonOutcome } from '@/domain/project-people';
import { DEMO_PEOPLE_IDS } from '@/services/project-people/mock-project-people-service';
import { RemovePersonButton } from './remove-person-button';

const ROW_ID = 'story-person';
const DESCRIBED = { description: 'analyst@example.com' };

const meta = {
  title: 'Settings/Remove person button',
  component: RemovePersonButton,
  tags: ['autodocs'],
  args: {
    adminUserId: DEMO_PEOPLE_IDS.member,
    describedBy: ROW_ID,
    remove: (): Promise<RemovePersonOutcome> => Promise.resolve({ kind: 'removed' }),
  },
  decorators: [
    (Story: () => ReactNode) => (
      <div className="flex items-start justify-between gap-4">
        <span id={ROW_ID}>analyst@example.com</span>
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
} satisfies Meta<typeof RemovePersonButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Removed: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', DESCRIBED));
    await expect(await canvas.findByRole('status')).toHaveTextContent('Removed');
  },
};

export const OwnerStays: Story = {
  args: { remove: () => Promise.resolve({ kind: 'ownerStays' }) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', DESCRIBED));
    await expect(await canvas.findByRole('alert')).toHaveTextContent('The owner keeps access');
  },
};

export const DarkTheme: Story = { globals: { theme: 'dark' } };
