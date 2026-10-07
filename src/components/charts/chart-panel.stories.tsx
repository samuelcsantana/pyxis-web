import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { ChartPanel, LegendItem } from './chart-panel';

const meta = {
  title: 'Charts/Chart panel',
  component: ChartPanel,
  tags: ['autodocs'],
  args: {
    title: 'Visits per day',
    description: 'Every visit of the period, last 7 days',
    legend: <LegendItem swatch="bg-sky" label="Visits" total="1,204" />,
    chart: (
      <figure
        role="img"
        aria-label="A placeholder drawing for the chart"
        className="h-30 rounded-input bg-soft"
      />
    ),
    table: (
      <table className="text-[13px]">
        <caption className="text-left text-muted">Visits per day, last 7 days</caption>
        <tbody>
          <tr>
            <th scope="row" className="pr-4 text-left font-normal">
              Oct 5
            </th>
            <td>172</td>
          </tr>
        </tbody>
      </table>
    ),
  },
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="w-[min(100%,48rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChartPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Chart: Story = {};

export const Table: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Table' }));
    await expect(canvas.getByRole('table')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Table' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  },
};

export const DarkTheme: Story = { globals: { theme: 'dark' } };

export const TableDark: Story = { ...Table, globals: { theme: 'dark' } };

export const OptionHovered: Story = {
  parameters: { pseudo: { hover: ['[aria-pressed="false"]'] } },
};

export const OptionPressed: Story = {
  parameters: { pseudo: { active: ['[aria-pressed="false"]'] } },
};
