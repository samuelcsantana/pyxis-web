import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import type { RequestExportOutcome } from '@/domain/exports';
import { MockExportsService } from '@/services/exports/mock-exports-service';
import { RequestExportButton } from './request-export-button';

const EXPORTS = new MockExportsService(() => new Date('2026-11-20T12:00:00.000Z'));

const meta = {
  title: 'Settings/Request export button',
  component: RequestExportButton,
  tags: ['autodocs'],
  args: {
    projectId: '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d',
    request: (): Promise<RequestExportOutcome> => EXPORTS.request(),
  },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
} satisfies Meta<typeof RequestExportButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Requested: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Export events' }));
    await expect(await canvas.findByRole('link', { name: 'Open the export' })).toBeVisible();
  },
};

export const LimitReached: Story = {
  args: { request: () => Promise.resolve({ kind: 'limitReached' }) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Export events' }));
    await expect(await canvas.findByRole('alert')).toHaveTextContent('3 exports');
  },
};

export const DarkTheme: Story = { globals: { theme: 'dark' } };
