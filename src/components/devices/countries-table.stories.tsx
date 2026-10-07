import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { countryLabel, shareRows } from '@/domain/devices';
import { demoDevicesReport } from '@/services/devices/demo-devices';
import { CountriesTable } from './countries-table';

const REPORT = demoDevicesReport('demo', { from: '2026-09-06', to: '2026-10-05' });

const meta = {
  title: 'Devices/Countries',
  component: CountriesTable,
  tags: ['autodocs'],
  args: { rows: shareRows(REPORT.countries, countryLabel) },
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="w-[min(100%,36rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CountriesTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OnlyUnknownCountries: Story = {
  args: {
    rows: shareRows(
      [{ value: 'other', visits: 12, conversions: null, convertingVisits: null }],
      countryLabel,
    ),
  },
};

export const DarkTheme: Story = { globals: { theme: 'dark' } };
