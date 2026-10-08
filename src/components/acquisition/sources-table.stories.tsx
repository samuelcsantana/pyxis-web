import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { sourceRows } from '@/domain/acquisition';
import { demoAcquisitionReport } from '@/services/acquisition/demo-acquisition';
import { DEMO_DOCS } from '@/services/demo/demo-projects';
import { SourcesTable } from './sources-table';
import { english } from '@/test-utils/english';

const STORY_NOW = new Date('2026-10-06T02:30:00.000Z');

const PERIOD = { from: '2026-09-06', to: '2026-10-05' };
const REPORT = demoAcquisitionReport('demo', PERIOD, STORY_NOW);
const WITHOUT_CONVERSIONS = demoAcquisitionReport(DEMO_DOCS.id, PERIOD, STORY_NOW);

function channelVisitsHref(channel: string): string {
  return `/demo/visits?${new URLSearchParams({ range: '30d', channel }).toString()}`;
}

function sourceVisitsHref(source: string): string {
  return `/demo/visits?${new URLSearchParams({ range: '30d', source }).toString()}`;
}

const meta = {
  title: 'Acquisition/Sources',
  component: SourcesTable,
  tags: ['autodocs'],
  args: {
    rows: sourceRows(REPORT.sources, english),
    channelVisitsHref,
    sourceVisitsHref,
    i18n: english,
  },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
  decorators: [
    (Story) => (
      <div className="w-[min(100%,70rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SourcesTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutConversionEvent: Story = {
  args: { rows: sourceRows(WITHOUT_CONVERSIONS.sources, english) },
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

export const DarkTheme: Story = { globals: { theme: 'dark' } };
