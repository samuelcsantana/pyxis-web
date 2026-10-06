import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { featureRows } from '@/domain/features';
import { demoFeaturesReport } from '@/services/features/demo-features';
import { FeatureTable } from './feature-table';

const PERIOD = { from: '2026-09-22', to: '2026-10-05' };
const EVENTS = demoFeaturesReport(PERIOD, 'events').items;
const SCREENS = demoFeaturesReport(PERIOD, 'screens').items;

const meta = {
  title: 'Features/Ranking',
  component: FeatureTable,
  tags: ['autodocs'],
  args: { kind: 'events', rows: featureRows(EVENTS, 'events', ''), query: '' },
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="w-[min(100%,70rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FeatureTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Events: Story = {};

export const Screens: Story = {
  args: { kind: 'screens', rows: featureRows(SCREENS, 'screens', '') },
};

export const Searched: Story = {
  args: { rows: featureRows(EVENTS, 'events', 'signup'), query: 'signup' },
};

export const NothingMatches: Story = { args: { rows: [], query: 'refund' } };

export const NothingTracked: Story = { args: { rows: [] } };

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
