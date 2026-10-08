import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { countedSteps, funnelRows } from '@/domain/funnel';
import { DEMO_FUNNEL_STEPS, demoFunnelReport } from '@/services/funnel/demo-funnel';
import { FunnelModes } from './funnel-modes';
import { FunnelSteps } from './funnel-steps';
import { english } from '@/test-utils/english';

const PERIOD = { from: '2026-09-06', to: '2026-10-05' };
const ROWS = funnelRows(
  countedSteps(DEMO_FUNNEL_STEPS, demoFunnelReport('demo', PERIOD, 'visit', DEMO_FUNNEL_STEPS)),
  english,
);

const meta = {
  title: 'Funnel/Steps',
  component: FunnelSteps,
  tags: ['autodocs'],
  args: { rows: ROWS, mode: 'visit' },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
  decorators: [
    (Story) => (
      <div className="flex w-[min(100%,70rem)] flex-col gap-4">
        <FunnelModes
          current="visit"
          links={[
            { mode: 'visit', label: 'Per visit', href: '/demo/funnel?mode=visit' },
            { mode: 'user', label: 'Per person', href: '/demo/funnel?mode=user' },
          ]}
        />
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FunnelSteps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BoardFunnel: Story = {};

export const PerPerson: Story = {
  args: {
    mode: 'user',
    rows: funnelRows(
      countedSteps(DEMO_FUNNEL_STEPS, demoFunnelReport('demo', PERIOD, 'user', DEMO_FUNNEL_STEPS)),
      english,
    ),
  },
};

export const NobodyYet: Story = {
  args: {
    rows: funnelRows(
      countedSteps(DEMO_FUNNEL_STEPS.slice(0, 3), {
        steps: [{ count: 0 }, { count: 0 }, { count: 0 }],
      }),
      english,
    ),
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
