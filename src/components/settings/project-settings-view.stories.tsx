import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { projectSettingsResponseSchema } from '@/domain/project-settings.schema';
import { sessionsResponseSchema } from '@/domain/sessions.schema';
import { DEMO_DOCS, DEMO_STORE } from '@/services/demo/demo-projects';
import { demoProjectSettingsWire } from '@/services/projects/demo-project-settings';
import { demoSessionsWire } from '@/services/sessions/mock-sessions-service';
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';
import { ProjectSettingsView } from './project-settings-view';

const STORY_NOW = new Date('2026-10-06T02:30:00.000Z');

function demoSettings(projectId: string) {
  return projectSettingsResponseSchema.parse(demoProjectSettingsWire(projectId, STORY_NOW));
}

const STORE = demoSettings(DEMO_STORE.id);

const meta = {
  title: 'Settings/Project settings',
  component: ProjectSettingsView,
  tags: ['autodocs'],
  args: {
    settings: STORE,
    i18n: english,
    emailPreferences: { weeklyDigest: true },
    chooseEmailPreferences: (chosen) => Promise.resolve(chosen),
    sessions: sessionsResponseSchema.parse(demoSessionsWire(STORY_NOW)),
    endSession: () => Promise.resolve(),
  },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
} satisfies Meta<typeof ProjectSettingsView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AnotherProject: Story = { args: { settings: demoSettings(DEMO_DOCS.id) } };

export const WaitingForTheFirstEvent: Story = {
  args: {
    settings: {
      ...STORE,
      conversionEvent: null,
      allowedOrigins: [],
      firstEventAt: null,
      lastEventAt: null,
      publicKeys: [],
      secretKeys: [],
    },
  },
};

export const InPortuguese: Story = { args: { i18n: portuguese } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
