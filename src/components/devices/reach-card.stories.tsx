import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, within } from 'storybook/test';
import { ErrorPanel } from '@/components/states/error-panel';
import { errorTexts } from '@/components/states/error-texts';
import { SkeletonReach } from '@/components/states/screen-skeleton';
import { type Reach, reachSummary } from '@/domain/devices';
import { demoDevicesReport } from '@/services/devices/demo-devices';
import { DEMO_DOCS } from '@/services/demo/demo-projects';
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';
import { ReachCard } from './reach-card';

const STORY_NOW = new Date('2026-10-06T02:30:00.000Z');
const RANGE = { from: '2026-09-06', to: '2026-10-05' };

const STORE = demoDevicesReport('demo', RANGE, STORY_NOW).reach;
const DOCS = demoDevicesReport(DEMO_DOCS.id, RANGE, STORY_NOW).reach;

const ONE_PLACE: Reach = {
  visits: 64,
  continents: 1,
  countries: 1,
  regions: 1,
  cities: 1,
  topCountry: { value: 'BR', visits: 64 },
  topRegion: { value: 'BR-BA', name: 'Bahia', visits: 64 },
};

const meta = {
  title: 'Devices/Reach',
  component: ReachCard,
  tags: ['autodocs'],
  args: { i18n: english, summary: reachSummary(STORE, true, english) },
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="w-[min(100%,62rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ReachCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const card = within(canvasElement).getByRole('region', { name: 'Reach' });
    await expect(within(card).getAllByRole('listitem')).toHaveLength(4);
    await expect(card).toHaveTextContent('Top region: São Paulo, Brazil');
  },
};

export const SeveralCountriesLedByLisbon: Story = {
  args: { summary: reachSummary(DOCS, true, english) },
};

export const WithoutTheCity: Story = {
  args: { summary: reachSummary({ ...STORE, cities: 0 }, false, english) },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getAllByRole('listitem')).toHaveLength(3);
  },
};

export const LedByACountry: Story = {
  args: { summary: reachSummary({ ...STORE, regions: 0, topRegion: null }, true, english) },
};

export const OnePlaceOfEach: Story = {
  args: { summary: reachSummary(ONE_PLACE, true, english) },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('list')).toHaveTextContent(
      '1 continent·1 country·1 region·1 city',
    );
  },
};

export const InPortuguese: Story = {
  args: { summary: reachSummary(STORE, true, portuguese) },
  globals: { locale: 'pt-BR' },
  play: async ({ canvasElement }) => {
    const card = within(canvasElement).getByRole('region', { name: 'Alcance' });
    await expect(card).toHaveTextContent('Estado com mais visitas: São Paulo, Brasil');
  },
};

export const EmptyPeriod: Story = {
  args: { summary: null },
  play: async ({ canvasElement }) => {
    const card = within(canvasElement).getByRole('region', { name: 'Reach' });
    await expect(card).toHaveTextContent('No visit in this period has a known country.');
    await expect(within(card).queryByRole('list')).toBeNull();
  },
};

export const Loading: Story = { render: () => <SkeletonReach /> };

export const Failed: Story = {
  render: () => (
    <ErrorPanel
      texts={errorTexts(
        Object.assign(new Error('GET /v1/projects/demo/devices failed'), { digest: '2861547093' }),
        english.t,
      )}
      onRetry={fn()}
    />
  ),
};

export const DarkTheme: Story = { globals: { theme: 'dark' } };

export const EmptyPeriodDarkTheme: Story = { ...EmptyPeriod, globals: { theme: 'dark' } };

export const OnAPhone: Story = {
  args: { summary: reachSummary(STORE, true, portuguese) },
  globals: { locale: 'pt-BR' },
  decorators: [
    (Story) => (
      <div className="w-[358px]">
        <Story />
      </div>
    ),
  ],
};
