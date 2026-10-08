import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { browserLabel, deviceTypeLabel, operatingSystemLabel, shareRows } from '@/domain/devices';
import { demoDevicesReport } from '@/services/devices/demo-devices';
import { ShareDonut } from './share-donut';
import { english } from '@/test-utils/english';

const STORY_NOW = new Date('2026-10-06T02:30:00.000Z');

const REPORT = demoDevicesReport('demo', { from: '2026-09-06', to: '2026-10-05' }, STORY_NOW);

function deviceVisitsHref(device: string): string {
  return `/demo/visits?${new URLSearchParams({ range: '30d', device }).toString()}`;
}

const meta = {
  title: 'Devices/Share donut',
  component: ShareDonut,
  tags: ['autodocs'],
  args: {
    i18n: english,
    id: 'device-type',
    title: 'Device type',
    rows: shareRows(REPORT.deviceTypes, deviceTypeLabel, english),
    visitsHref: deviceVisitsHref,
  },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
  decorators: [
    (Story) => (
      <div className="w-[min(100%,24rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ShareDonut>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DeviceType: Story = {};

export const Browser: Story = {
  args: {
    id: 'browser',
    title: 'Browser',
    rows: shareRows(REPORT.browsers, browserLabel, english),
    visitsHref: undefined,
  },
};

export const BrowserWithConversionRate: Story = {
  args: { ...Browser.args, withConversionRate: true },
};

export const OperatingSystem: Story = {
  args: {
    id: 'operating-system',
    title: 'Operating system',
    rows: shareRows(REPORT.operatingSystems, operatingSystemLabel, english),
    visitsHref: undefined,
  },
};

export const SingleValue: Story = {
  args: {
    rows: shareRows(
      [{ value: 'desktop', visits: 3, conversions: null, convertingVisits: null }],
      deviceTypeLabel,
      english,
    ),
  },
};

export const Empty: Story = { args: { rows: [] } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };

export const WithConversionRateDarkTheme: Story = {
  args: { ...Browser.args, withConversionRate: true },
  globals: { theme: 'dark' },
};
