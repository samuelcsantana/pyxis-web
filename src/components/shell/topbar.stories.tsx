import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { presetPeriod } from '@/domain/period';
import { english } from '@/test-utils/english';
import { Topbar, type TopbarWithPeriodProps } from './topbar';

const TODAY = '2026-10-05';

const WITH_PERIOD: TopbarWithPeriodProps = {
  title: 'Overview',
  subtitle: 'How Demo Store was used in the period',
  basePath: '/demo/overview',
  period: presetPeriod('30d', TODAY),
  today: TODAY,
  i18n: english,
};

const meta = {
  title: 'Shell/Topbar',
  component: Topbar,
  tags: ['autodocs'],
  args: WITH_PERIOD,
  parameters: { layout: 'fullscreen', nextjs: { appDirectory: true } },
} satisfies Meta<typeof Topbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ThirtyDays: Story = {};

export const Today: Story = { args: { ...WITH_PERIOD, period: presetPeriod('today', TODAY) } };

export const CustomPeriod: Story = {
  args: { ...WITH_PERIOD, period: { preset: 'custom', from: '2026-08-01', to: '2026-08-31' } },
};

const REJECTED: TopbarWithPeriodProps = {
  ...WITH_PERIOD,
  period: {
    ...presetPeriod('30d', TODAY),
    rejected: { from: '2026-10-05', to: '2026-09-20', problem: 'inverted' },
  },
};

const showsTheRejectedRange: Story['play'] = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await expect(canvas.getByRole('status')).toHaveTextContent(
    'That range was not used: it ends before it starts.',
  );
  await expect(await canvas.findByRole('grid', {}, { timeout: 4000 })).toBeVisible();
  await expect(canvas.getByText(/· 30 days$/)).toHaveAttribute(
    'aria-describedby',
    'period-range-notice',
  );
};

export const RejectedRange: Story = { args: REJECTED, play: showsTheRejectedRange };

export const RejectedRangeDark: Story = {
  args: { ...REJECTED },
  globals: { theme: 'dark' },
  play: showsTheRejectedRange,
};

export const RejectedRangeOnAPhone: Story = {
  args: REJECTED,
  globals: { viewport: { value: 'mobile2', isRotated: false } },
  play: showsTheRejectedRange,
};

const openTheCustomForm: NonNullable<Story['play']> = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByText('Custom'));
  await expect(await canvas.findByRole('grid', {}, { timeout: 4000 })).toBeVisible();
  await expect(canvas.getByRole('button', { name: 'Apply' })).toBeEnabled();
};

export const CustomFormOpen: Story = { play: openTheCustomForm };

export const CustomFormOpenDark: Story = {
  args: { ...WITH_PERIOD },
  globals: { theme: 'dark' },
  play: openTheCustomForm,
};

export const CustomFormOpenOnAPhone: Story = {
  globals: { viewport: { value: 'mobile2', isRotated: false } },
  play: openTheCustomForm,
};

export const CustomFormClosedWithEscape: Story = {
  args: REJECTED,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const grid = await canvas.findByRole('grid', {}, { timeout: 4000 });
    const focusable = grid.querySelector<HTMLButtonElement>('button[tabindex="0"]');
    focusable?.focus();
    await userEvent.keyboard('{Escape}');
    await expect(grid).not.toBeVisible();
    await expect(canvas.getByText('Custom')).toHaveFocus();
  },
};

export const DarkTheme: Story = {
  args: { ...WITH_PERIOD },
  globals: { theme: 'dark' },
};

const focusSevenDays: Story['play'] = async ({ canvasElement }) => {
  const sevenDays = within(canvasElement).getByRole('link', { name: '7 days' });
  sevenDays.focus();
  await expect(sevenDays).toHaveFocus();
};

export const KeyboardFocus: Story = { play: focusSevenDays };

export const KeyboardFocusDark: Story = {
  args: { ...WITH_PERIOD },
  globals: { theme: 'dark' },
  play: focusSevenDays,
};

export const WithoutPeriod: Story = {
  args: { title: 'Timeline', subtitle: 'Everything one person did, in order' },
};

export const OnAPhone: Story = {
  decorators: [
    (Story) => (
      <div className="w-[390px]">
        <Story />
      </div>
    ),
  ],
};
