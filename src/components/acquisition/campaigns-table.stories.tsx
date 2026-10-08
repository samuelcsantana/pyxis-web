import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { type CampaignRow, campaignRows } from '@/domain/acquisition';
import { demoAcquisitionReport } from '@/services/acquisition/demo-acquisition';
import { DEMO_DOCS } from '@/services/demo/demo-projects';
import { CampaignsTable } from './campaigns-table';
import { english } from '@/test-utils/english';

const PERIOD = { from: '2026-09-06', to: '2026-10-05' };
const REPORT = demoAcquisitionReport('demo', PERIOD);
const WITHOUT_CONVERSIONS = demoAcquisitionReport(DEMO_DOCS.id, PERIOD);

function campaignVisitsHref({ campaign, source }: CampaignRow): string {
  return `/demo/visits?${new URLSearchParams({ range: '30d', campaign, source }).toString()}`;
}

const meta = {
  title: 'Acquisition/Campaigns',
  component: CampaignsTable,
  tags: ['autodocs'],
  args: { rows: campaignRows(REPORT.campaigns, english), campaignVisitsHref, i18n: english },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
  decorators: [
    (Story) => (
      <div className="w-[min(100%,70rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CampaignsTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutConversionEvent: Story = {
  args: { rows: campaignRows(WITHOUT_CONVERSIONS.campaigns, english) },
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
