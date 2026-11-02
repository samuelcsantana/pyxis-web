import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ErrorPanel } from '@/components/states/error-panel';
import { errorTexts } from '@/components/states/error-texts';
import { SkeletonChart } from '@/components/states/screen-skeleton';
import { overviewResponseSchema } from '@/domain/overview.schema';
import type { UniqueVisitors } from '@/domain/unique-visitors';
import { demoOverviewWire } from '@/services/overview/demo-overview';
import { DEMO_STORE } from '@/services/demo/demo-projects';
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';
import { UniqueVisitorsPanel } from './unique-visitors-panel';

const STORY_NOW = new Date('2026-10-06T02:30:00.000Z');

function demoVisitors(from: string, to: string): UniqueVisitors {
  return overviewResponseSchema.parse(demoOverviewWire(DEMO_STORE.id, { from, to }, STORY_NOW))
    .visitors;
}

const THIRTY_DAYS = demoVisitors('2026-09-06', '2026-10-05');
const OCTOBER_SO_FAR = demoVisitors('2026-10-01', '2026-10-05');
const ONE_DAY = demoVisitors('2026-10-05', '2026-10-05');

const NOTHING_COUNTED: UniqueVisitors = {
  ...THIRTY_DAYS,
  daily: THIRTY_DAYS.daily.map((day) => ({
    date: day.date,
    firstVisit: 0,
    firstThisMonth: 0,
    firstToday: 0,
    againToday: 0,
  })),
};

const JUST_TURNED_ON: UniqueVisitors = {
  ...OCTOBER_SO_FAR,
  daily: OCTOBER_SO_FAR.daily.map((day) => ({
    ...day,
    firstVisit: day.firstVisit + day.firstThisMonth + day.firstToday,
    firstThisMonth: 0,
    firstToday: 0,
  })),
  months: OCTOBER_SO_FAR.months.map((month) => ({ ...month, exact: false })),
};

const meta = {
  title: 'Overview/Unique visitors',
  component: UniqueVisitorsPanel,
  tags: ['autodocs'],
  args: { visitors: THIRTY_DAYS, endsToday: true, periodLabel: 'last 30 days', i18n: english },
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="w-[min(100%,70rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof UniqueVisitorsPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SumOfDays: Story = {
  play: async ({ canvasElement }) => {
    const card = within(canvasElement).getByRole('region', { name: 'Unique visitors' });
    await expect(card).toHaveTextContent('Sum of daily unique visitors');
    await expect(card).toHaveTextContent('a visitor who came on two days counts twice');
  },
};

export const AsATable: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Table' }));
    await expect(canvas.getByRole('table')).toBeInTheDocument();
  },
};

export const MonthSoFar: Story = {
  args: { visitors: OCTOBER_SO_FAR, periodLabel: 'Oct 1 – Oct 5' },
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toHaveTextContent('Unique visitors in October 2026 so far');
  },
};

export const OneDay: Story = {
  args: { visitors: ONE_DAY, periodLabel: 'today' },
};

export const NothingCountedYet: Story = {
  args: { visitors: NOTHING_COUNTED },
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toHaveTextContent('the count starts with the next visits');
  },
};

export const JustTurnedOn: Story = {
  args: { visitors: JUST_TURNED_ON, periodLabel: 'Oct 1 – Oct 5' },
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toHaveTextContent('almost every visitor shows as new');
  },
};

export const Loading: Story = { render: () => <SkeletonChart /> };

export const Failed: Story = {
  render: () => (
    <ErrorPanel
      texts={errorTexts(
        Object.assign(new Error('GET /v1/projects/demo/overview failed'), { digest: '2861547093' }),
        english.t,
      )}
      onRetry={fn()}
    />
  ),
};

export const InPortuguese: Story = {
  args: {
    visitors: OCTOBER_SO_FAR,
    periodLabel: '1 de out. – 5 de out.',
    i18n: portuguese,
  },
  globals: { locale: 'pt-BR' },
};

export const DarkTheme: Story = { globals: { theme: 'dark' } };

export const MonthSoFarDarkTheme: Story = { ...MonthSoFar, globals: { theme: 'dark' } };

export const OnAPhone: Story = {
  decorators: [
    (Story) => (
      <div className="w-[358px]">
        <Story />
      </div>
    ),
  ],
};
