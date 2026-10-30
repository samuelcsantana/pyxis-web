import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SECTION_LOOKS } from '@/components/settings-window/sections';
import { sessionsResponseSchema } from '@/domain/sessions.schema';
import { demoSessionsWire } from '@/services/sessions/mock-sessions-service';
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';
import { SessionsPanel } from './sessions-panel';

const STORY_NOW = new Date('2026-10-10T12:00:00.000Z');
const SESSIONS = sessionsResponseSchema.parse(demoSessionsWire(STORY_NOW));
const format = english.format.dateTime('eventTime', 'America/Sao_Paulo');

const LOOK = SECTION_LOOKS.sessions;

const meta = {
  title: 'Settings/Sessions panel',
  component: SessionsPanel,
  tags: ['autodocs'],
  args: {
    sessions: SESSIONS,
    i18n: english,
    when: (iso: string) => format(new Date(iso)),
    end: () => Promise.resolve(),
  },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
  decorators: [
    (Story, { args }) => (
      <section
        aria-labelledby={LOOK.titleId}
        className="flex max-w-2xl flex-col gap-4 rounded-card border border-line bg-card p-6 text-ink"
      >
        <h2 id={LOOK.titleId} className="text-2xl font-bold tracking-tight">
          {args.i18n.t(LOOK.label)}
        </h2>
        <Story />
      </section>
    ),
  ],
} satisfies Meta<typeof SessionsPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OnlyThisDevice: Story = {
  args: { sessions: SESSIONS.filter((session) => session.current) },
};

export const UnknownDevices: Story = {
  args: {
    sessions: SESSIONS.map((session) => ({
      ...session,
      browser: null,
      os: null,
      deviceType: null,
    })),
  },
};

export const EndingFails: Story = {
  args: { end: () => Promise.reject(new Error('Pyxis API answered 503')) },
};

export const Portuguese: Story = {
  args: { i18n: portuguese },
  parameters: { locale: 'pt-BR' },
};
