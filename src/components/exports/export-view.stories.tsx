import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { projectExportResponseSchema } from '@/domain/exports.schema';
import { demoExportWire } from '@/services/exports/mock-exports-service';
import { english } from '@/test-utils/english';
import { ExportView } from './export-view';

const STORY_NOW = new Date('2026-11-20T12:00:00.000Z');
const DONE = projectExportResponseSchema.parse(demoExportWire(STORY_NOW, 'done'));

const meta = {
  title: 'Exports/Export view',
  component: ExportView,
  tags: ['autodocs'],
  args: {
    projectId: '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d',
    found: DONE,
    i18n: english,
    now: STORY_NOW,
  },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
} satisfies Meta<typeof ExportView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {};

export const Preparing: Story = {
  args: { found: projectExportResponseSchema.parse(demoExportWire(STORY_NOW, 'pending')) },
};

export const Expired: Story = {
  args: { now: new Date('2026-12-01T12:00:00.000Z') },
};

export const Failed: Story = { args: { found: { ...DONE, status: 'failed' } } };

export const InPortuguese: Story = { globals: { locale: 'pt-BR' } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
