import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { featureRows } from '@/domain/features';
import { propertyKeyViews } from '@/domain/property-breakdown';
import { demoFeaturesReport } from '@/services/features/demo-features';
import { demoPropertyBreakdownReport } from '@/services/features/demo-properties';
import { FeatureTable } from './feature-table';
import { english } from '@/test-utils/english';

const STORY_NOW = new Date('2026-10-06T02:30:00.000Z');

const PERIOD = { from: '2026-09-22', to: '2026-10-05' };
const EVENTS = demoFeaturesReport('demo', PERIOD, 'events', STORY_NOW).items;
const SCREENS = demoFeaturesReport('demo', PERIOD, 'screens', STORY_NOW).items;

function loadDemoProperties(name: string) {
  return Promise.resolve(
    propertyKeyViews(demoPropertyBreakdownReport('demo', PERIOD, name, STORY_NOW), english),
  );
}

function visitsHref(name: string): string {
  return `/demo/visits?${new URLSearchParams({ range: '7d', event: name }).toString()}`;
}

function failToLoadProperties() {
  return Promise.reject(new Error('The breakdown is unavailable.'));
}

const meta = {
  title: 'Features/Ranking',
  component: FeatureTable,
  tags: ['autodocs'],
  args: {
    i18n: english,
    kind: 'events',
    rows: featureRows(EVENTS, 'events', '', english),
    query: '',
    visitsHref,
  },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
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
  args: { kind: 'screens', rows: featureRows(SCREENS, 'screens', '', english) },
};

export const Searched: Story = {
  args: { rows: featureRows(EVENTS, 'events', 'signup', english), query: 'signup' },
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
