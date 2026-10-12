import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { regionRows } from '@/domain/devices';
import { demoDevicesReport } from '@/services/devices/demo-devices';
import { DEMO_DOCS } from '@/services/demo/demo-projects';
import { RegionsTable } from './regions-table';
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';

const STORY_NOW = new Date('2026-10-06T02:30:00.000Z');
const RANGE = { from: '2026-09-06', to: '2026-10-05' };

const STORE = demoDevicesReport('demo', RANGE, STORY_NOW);
const DOCS = demoDevicesReport(DEMO_DOCS.id, RANGE, STORY_NOW);

const meta = {
  title: 'Devices/Regions',
  component: RegionsTable,
  tags: ['autodocs'],
  args: { i18n: english, rows: regionRows(STORE.regions, english) },
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="w-[min(100%,36rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RegionsTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithConversionRate: Story = { args: { withConversionRate: true } };

export const LinkedToTheirVisits: Story = {
  args: {
    visitsHref: (region: string) => `/demo/visits?range=30d&region=${region}`,
  },
  parameters: { nextjs: { appDirectory: true } },
};

export const SeveralCountries: Story = { args: { rows: regionRows(DOCS.regions, english) } };

export const OnlyUnknownRegions: Story = {
  args: {
    rows: regionRows(
      [{ value: null, name: null, visits: 12, conversions: null, convertingVisits: null }],
      english,
    ),
  },
};

export const InPortuguese: Story = {
  args: { i18n: portuguese, rows: regionRows(STORE.regions, portuguese) },
};

export const DarkTheme: Story = { globals: { theme: 'dark' } };

export const WithConversionRateDarkTheme: Story = {
  args: { withConversionRate: true },
  globals: { theme: 'dark' },
};
