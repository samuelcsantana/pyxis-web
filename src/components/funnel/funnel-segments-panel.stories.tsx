import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { funnelSegmentsResponseSchema } from '@/domain/funnel-segments.schema';
import { DEMO_STORE } from '@/services/demo/demo-projects';
import { demoFunnelSegmentsWire } from '@/services/funnel/demo-funnel';
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';
import { FunnelSegmentsPanel } from './funnel-segments-panel';

const STORY_NOW = new Date('2026-10-06T02:30:00.000Z');
const RANGE = { from: '2026-09-06', to: '2026-10-05' };
const STEPS = DEMO_STORE.exampleFunnel;

function demoReport(by: 'device' | 'channel') {
  return funnelSegmentsResponseSchema.parse(
    demoFunnelSegmentsWire(DEMO_STORE.id, RANGE, STEPS, by, STORY_NOW),
  );
}

const meta = {
  title: 'Funnel/Segments',
  component: FunnelSegmentsPanel,
  tags: ['autodocs'],
  args: {
    by: 'device',
    report: demoReport('device'),
    stepCount: STEPS.length,
    periodLabel: 'last 30 days',
    hrefOf: (by: string) => `/demo/funnel?by=${by}`,
    i18n: english,
  },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
} satisfies Meta<typeof FunnelSegmentsPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ByDevice: Story = {};

export const ByChannel: Story = { args: { by: 'channel', report: demoReport('channel') } };

export const NobodyStarted: Story = { args: { report: { by: 'device', segments: [] } } };

export const PerPerson: Story = { args: { report: null } };

export const InPortuguese: Story = { args: { i18n: portuguese, periodLabel: 'últimos 30 dias' } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
