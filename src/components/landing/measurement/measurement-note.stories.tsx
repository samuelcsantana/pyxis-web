import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { english } from '@/test-utils/english';
import { fakeSdk, startedMeasurement } from '@/test-utils/fake-measurement';
import { measurementLabelsOf } from './measurement-labels';
import { MeasurementNote } from './measurement-note';

const meta = {
  title: 'Landing/MeasurementNote',
  component: MeasurementNote,
  parameters: { layout: 'padded' },
  args: { labels: measurementLabelsOf(english) },
} satisfies Meta<typeof MeasurementNote>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Measuring: Story = {
  args: { measurement: startedMeasurement(fakeSdk('on')) },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Don’t measure my visits' }),
    ).toBeVisible();
  },
};

export const OptedOut: Story = {
  args: { measurement: startedMeasurement(fakeSdk('opted-out')) },
};

export const BlockedByTheBrowser: Story = {
  args: { measurement: startedMeasurement(fakeSdk('blocked-by-browser')) },
};

export const DarkTheme: Story = {
  args: { measurement: startedMeasurement(fakeSdk('on')) },
  globals: { theme: 'dark' },
};
