import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { areaShape } from '@/domain/area-chart';
import { valueAxis } from '@/domain/chart-scale';
import { addDays } from '@/domain/period';
import { stackedBars } from '@/domain/stacked-bars';
import { ChartFrame } from './chart-frame';

const VALUES = [12, 18, 9, 22, 30, 27, 16, 19, 25, 34, 28, 21, 17, 24] as const;
const DATES = VALUES.map((_, index) => addDays('2026-09-22', index));
const AXIS = valueAxis(VALUES);
const LINE = areaShape(VALUES, AXIS.top).line;
const SPLIT = VALUES.map((value) => ({
  first: Math.ceil(value / 3),
  second: Math.floor(value / 3) * 2,
}));
const BARS = stackedBars(SPLIT, ['first', 'second'], AXIS.top);

const meta = {
  title: 'Charts/Chart frame',
  component: ChartFrame,
  tags: ['autodocs'],
  args: {
    summary: 'Line chart of 14 days, between 9 and 34 a day.',
    heightClassName: 'h-30 sm:h-60',
    axis: AXIS,
    dates: DATES,
    layout: 'points',
    children: (
      <path
        d={LINE}
        fill="none"
        stroke="var(--color-sky)"
        strokeWidth={2.5}
        vectorEffect="non-scaling-stroke"
      />
    ),
  },
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="w-[min(100%,48rem)] rounded-card border border-line bg-card p-3.5">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChartFrame>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Points: Story = {};

export const Bars: Story = {
  args: {
    summary: 'Stacked bar chart of 14 days, between 9 and 34 a day.',
    layout: 'bars',
    children: (
      <>
        {BARS.segments.map((segment) => (
          <rect
            key={`${segment.key}-${String(segment.day)}`}
            x={segment.x}
            y={segment.y}
            width={segment.width}
            height={segment.height}
            fill={segment.key === 'first' ? 'var(--color-sky)' : 'var(--color-violet)'}
          />
        ))}
        <path
          d={BARS.separators}
          fill="none"
          stroke="var(--color-card)"
          vectorEffect="non-scaling-stroke"
        />
      </>
    ),
  },
};

export const Empty: Story = {
  args: { summary: 'Line chart of 14 days, all zero.', axis: valueAxis([]), children: null },
};

export const OneDay: Story = {
  args: {
    summary: 'Line chart of 1 day.',
    dates: DATES.slice(-1),
    axis: valueAxis([24]),
    children: (
      <path
        d={areaShape([24], valueAxis([24]).top).line}
        fill="none"
        stroke="var(--color-sky)"
        strokeWidth={2.5}
        vectorEffect="non-scaling-stroke"
      />
    ),
  },
};

export const OnAPhone: Story = {
  decorators: [
    (Story) => (
      <div className="w-[258px]">
        <Story />
      </div>
    ),
  ],
};

export const DarkTheme: Story = { globals: { theme: 'dark' } };

export const BarsDark: Story = { ...Bars, globals: { theme: 'dark' } };
