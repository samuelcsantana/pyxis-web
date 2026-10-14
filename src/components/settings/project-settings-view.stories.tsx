import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { accessTokensResponseSchema } from '@/domain/access-tokens.schema';
import { projectSettingsResponseSchema } from '@/domain/project-settings.schema';
import { sessionsResponseSchema } from '@/domain/sessions.schema';
import {
  DEMO_CREATED_ACCESS_TOKEN,
  demoAccessTokensWire,
} from '@/services/access-tokens/mock-access-tokens-service';
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
    accessTokens: accessTokensResponseSchema.parse(demoAccessTokensWire(STORY_NOW)),
    createAccessToken: ({ name, lifetimeDays }) =>
      Promise.resolve({
        kind: 'created',
        token: {
          id: '3c9e5a7b-4d6f-4e8a-8b3c-5d7e9f1a3b4c',
          name,
          token: DEMO_CREATED_ACCESS_TOKEN,
          createdAt: STORY_NOW.toISOString(),
          lastUsedAt: null,
          expiresAt: new Date(STORY_NOW.getTime() + lifetimeDays * 86_400_000).toISOString(),
        },
      }),
    revokeAccessToken: () => Promise.resolve(),
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
