import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { featureRows } from '@/domain/features';
import { propertyKeyViews } from '@/domain/property-breakdown';
import { demoFeaturesReport } from '@/services/features/demo-features';
import { demoPropertyBreakdownReport } from '@/services/features/demo-properties';
import { FeatureTable } from './feature-table';

const PERIOD = { from: '2026-09-22', to: '2026-10-05' };
const EVENTS = demoFeaturesReport(PERIOD, 'events').items;
const SCREENS = demoFeaturesReport(PERIOD, 'screens').items;

function loadDemoProperties(name: string) {
  return Promise.resolve(propertyKeyViews(demoPropertyBreakdownReport(PERIOD, name)));
}

function failToLoadProperties() {
  return Promise.reject(new Error('The breakdown is unavailable.'));
}

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

export const PropertiesOpen: Story = {
  args: { loadProperties: loadDemoProperties },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('button', { name: 'Properties of Calculator result shown' });
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(
      await canvas.findByRole('table', { name: /^calculator · carried by/ }),
    ).toBeVisible();
  },
};

export const PropertiesFailed: Story = {
  args: { loadProperties: failToLoadProperties },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Properties of Calculator result shown' }),
    );
    await expect(await canvas.findByRole('alert')).toHaveTextContent(
      'Could not load the properties of Calculator result shown.',
    );
  },
};

export const DarkThemeWithProperties: Story = {
  ...PropertiesOpen,
  globals: { theme: 'dark' },
};

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
