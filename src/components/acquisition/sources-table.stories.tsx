import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { sourceRows } from '@/domain/acquisition';
import { demoAcquisitionReport } from '@/services/acquisition/demo-acquisition';
import { DEMO_DOCS } from '@/services/demo/demo-projects';
import { SourcesTable } from './sources-table';

const PERIOD = { from: '2026-09-06', to: '2026-10-05' };
const REPORT = demoAcquisitionReport('demo', PERIOD);
const WITHOUT_CONVERSIONS = demoAcquisitionReport(DEMO_DOCS.id, PERIOD);

const meta = {
  title: 'Acquisition/Sources',
  component: SourcesTable,
  tags: ['autodocs'],
  args: { rows: sourceRows(REPORT.sources) },
  parameters: { layout: 'padded' },
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
  args: { rows: sourceRows(WITHOUT_CONVERSIONS.sources) },
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
