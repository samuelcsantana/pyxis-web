import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { cityRows, type CityFilterValue } from '@/domain/devices';
import { demoDevicesReport } from '@/services/devices/demo-devices';
import { DEMO_DOCS } from '@/services/demo/demo-projects';
import { CitiesTable } from './cities-table';
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';

const STORY_NOW = new Date('2026-10-06T02:30:00.000Z');
const RANGE = { from: '2026-09-06', to: '2026-10-05' };

const STORE = demoDevicesReport('demo', RANGE, STORY_NOW);
const DOCS = demoDevicesReport(DEMO_DOCS.id, RANGE, STORY_NOW);

const meta = {
  title: 'Devices/Cities',
  component: CitiesTable,
  tags: ['autodocs'],
  args: { i18n: english, rows: cityRows(STORE.cities, english) },
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="w-[min(100%,36rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CitiesTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithConversionRate: Story = { args: { withConversionRate: true } };

export const LinkedToTheirVisits: Story = {
  args: {
    visitsHref: ({ region, city }: CityFilterValue) =>
      `/demo/visits?range=30d&${new URLSearchParams({ region, city }).toString()}`,
  },
  parameters: { nextjs: { appDirectory: true } },
};

export const SeveralCountries: Story = { args: { rows: cityRows(DOCS.cities, english) } };

export const OnlyUnknownCities: Story = {
  args: {
    rows: cityRows(
      [
        {
          value: null,
          region: null,
          regionName: null,
          visits: 12,
          conversions: null,
          convertingVisits: null,
        },
      ],
      english,
    ),
  },
};

export const Empty: Story = { args: { rows: [] } };

export const InPortuguese: Story = {
  args: { i18n: portuguese, rows: cityRows(STORE.cities, portuguese) },
};

export const DarkTheme: Story = { globals: { theme: 'dark' } };

export const WithConversionRateDarkTheme: Story = {
  args: { withConversionRate: true },
  globals: { theme: 'dark' },
};
