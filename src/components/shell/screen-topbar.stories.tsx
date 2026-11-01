import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { english } from '@/test-utils/english';
import { ScreenTopbar } from './screen-topbar';
import { screenTopbarTexts } from './screen-topbar-texts';

const PROJECT_ID = 'demo';
const MIDDAY_OF_OCTOBER_5_IN_SAO_PAULO = Date.UTC(2026, 9, 5, 15);

function at(screen: string, query: Readonly<Record<string, string>> = {}) {
  return {
    nextjs: { appDirectory: true, navigation: { pathname: `/${PROJECT_ID}/${screen}`, query } },
  };
}

const meta = {
  title: 'Shell/Screen top bar',
  component: ScreenTopbar,
  tags: ['autodocs'],
  args: {
    projectId: PROJECT_ID,
    timeZone: 'America/Sao_Paulo',
    serverNow: MIDDAY_OF_OCTOBER_5_IN_SAO_PAULO,
    texts: screenTopbarTexts('Demo Store', english),
  },
  parameters: { layout: 'fullscreen', ...at('overview') },
} satisfies Meta<typeof ScreenTopbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ThirtyDays: Story = {};

export const Today: Story = { parameters: at('overview', { range: 'today' }) };

export const CustomPeriod: Story = {
  parameters: at('overview', { from: '2026-08-01', to: '2026-08-31' }),
};

const REJECTED = at('overview', { from: '2026-10-05', to: '2026-09-20' });

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

export const RejectedRange: Story = { parameters: REJECTED, play: showsTheRejectedRange };

export const RejectedRangeDark: Story = {
  parameters: REJECTED,
  globals: { theme: 'dark' },
  play: showsTheRejectedRange,
};

export const RejectedRangeOnAPhone: Story = {
  parameters: REJECTED,
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

export const CustomFormOpenDark: Story = { globals: { theme: 'dark' }, play: openTheCustomForm };

export const CustomFormOpenOnAPhone: Story = {
  globals: { viewport: { value: 'mobile2', isRotated: false } },
  play: openTheCustomForm,
};

export const CustomFormClosedWithEscape: Story = {
  parameters: REJECTED,
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

export const DarkTheme: Story = { globals: { theme: 'dark' } };

const focusSevenDays: Story['play'] = async ({ canvasElement }) => {
  const sevenDays = within(canvasElement).getByRole('link', { name: '7 days' });
  sevenDays.focus();
  await expect(sevenDays).toHaveFocus();
};

export const KeyboardFocus: Story = { play: focusSevenDays };

export const KeyboardFocusDark: Story = { globals: { theme: 'dark' }, play: focusSevenDays };

export const RequestsReads: Story = { parameters: at('requests', { kind: 'reads' }) };

export const TimelineWithoutPeriod: Story = { parameters: at('timeline') };

export const TimelineWithoutPeriodDark: Story = {
  parameters: at('timeline'),
  globals: { theme: 'dark' },
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
