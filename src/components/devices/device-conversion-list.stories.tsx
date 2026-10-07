import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { deviceConversions } from '@/domain/devices';
import { demoDevicesReport } from '@/services/devices/demo-devices';
import { DeviceConversionList } from './device-conversion-list';

const REPORT = demoDevicesReport('demo', { from: '2026-09-06', to: '2026-10-05' });

const meta = {
  title: 'Devices/Conversion by device',
  component: DeviceConversionList,
  tags: ['autodocs'],
  args: {
    conversions: deviceConversions(REPORT.deviceTypes),
    conversionEvent: 'signup_completed',
  },
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="w-[min(100%,36rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DeviceConversionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DeviceWithoutVisits: Story = {
  args: {
    conversions: deviceConversions([
      { value: 'desktop', visits: 40, conversions: 3, convertingVisits: null },
      { value: 'tablet', visits: 0, conversions: 0, convertingVisits: null },
    ]),
  },
};

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
