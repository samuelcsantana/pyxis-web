import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { english } from '@/test-utils/english';
import { fakeSdk, SAMPLE_BATCH, startedMeasurement } from '@/test-utils/fake-measurement';
import { recordedLabelsOf } from './measurement-labels';
import { RecordedDrawer } from './recorded-drawer';

function measurementWithTwoEvents(open: boolean) {
  const sdk = fakeSdk();
  const measurement = startedMeasurement(sdk);
  sdk.sendBatch(SAMPLE_BATCH);
  measurement.setDrawerOpen(open);
  return measurement;
}

const meta = {
  title: 'Landing/RecordedDrawer',
  component: RecordedDrawer,
  parameters: { layout: 'fullscreen' },
  args: { labels: recordedLabelsOf(english), locale: 'en-US', revealAfterScroll: 0 },
  decorators: [
    (Story) => (
      <div className="min-h-[36rem] bg-bg text-ink">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RecordedDrawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {
  args: { measurement: measurementWithTwoEvents(false) },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'What this page recorded 2' }),
    ).toBeVisible();
  },
};

export const Open: Story = {
  args: { measurement: measurementWithTwoEvents(true) },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('region', { name: 'What this page recorded' }),
    ).toBeVisible();
  },
};

export const NothingSentYet: Story = {
  args: {
    measurement: (() => {
      const measurement = startedMeasurement(fakeSdk());
      measurement.setDrawerOpen(true);
      return measurement;
    })(),
  },
};

export const DarkTheme: Story = {
  args: { measurement: measurementWithTwoEvents(true) },
  globals: { theme: 'dark' },
};
