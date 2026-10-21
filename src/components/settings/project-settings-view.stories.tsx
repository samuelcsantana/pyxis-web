import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { accessTokensResponseSchema } from '@/domain/access-tokens.schema';
import { connectedAppsResponseSchema } from '@/domain/connections.schema';
import { timeZoneChoices } from '@/domain/project-management';
import { projectSettingsResponseSchema } from '@/domain/project-settings.schema';
import { sessionsResponseSchema } from '@/domain/sessions.schema';
import {
  DEMO_CREATED_ACCESS_TOKEN,
  demoAccessTokensWire,
} from '@/services/access-tokens/mock-access-tokens-service';
import { demoConnectionsWire } from '@/services/connections/mock-connections-service';
import {
  DEMO_DOCS,
  DEMO_STORE,
  demoProjectNameOf,
  demoProjectOf,
} from '@/services/demo/demo-projects';
import { demoProjectSettingsWire } from '@/services/projects/demo-project-settings';
import { MockExportsService } from '@/services/exports/mock-exports-service';
import { MockProjectManagementService } from '@/services/project-management/mock-project-management-service';
import { DEMO_OWNER_EMAIL } from '@/services/projects/mock-projects-service';
import { projectPeopleResponseSchema } from '@/domain/project-people.schema';
import {
  demoPeopleWire,
  MockProjectPeopleService,
} from '@/services/project-people/mock-project-people-service';
import { demoSessionsWire } from '@/services/sessions/mock-sessions-service';
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';
import { spanish } from '@/test-utils/spanish';
import { ProjectSettingsView } from './project-settings-view';

const STORY_NOW = new Date('2026-10-06T02:30:00.000Z');

function demoSettings(projectId: string) {
  const name = demoProjectNameOf(demoProjectOf(projectId), english.t);
  return projectSettingsResponseSchema.parse(demoProjectSettingsWire(projectId, STORY_NOW, name));
}

const STORE = demoSettings(DEMO_STORE.id);
const MANAGEMENT = new MockProjectManagementService(() => Promise.resolve(english.t));
const PEOPLE = new MockProjectPeopleService(() => STORY_NOW);
const EXPORTS = new MockExportsService(() => STORY_NOW);

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
    connectedApps: connectedAppsResponseSchema.parse(demoConnectionsWire(STORY_NOW)),
    revokeConnection: () => Promise.resolve(),
    manage: {
      timezones: timeZoneChoices(STORE.timezone),
      save: () => MANAGEMENT.update(),
      createKey: (kind) => MANAGEMENT.createKey(STORE.id, kind),
      revokeKey: (keyId) => MANAGEMENT.revokeKey(STORE.id, keyId),
      remove: (confirmName) => MANAGEMENT.delete(STORE.id, confirmName),
      addPerson: (email) => PEOPLE.add(STORE.id, email),
      removePerson: (adminUserId) => PEOPLE.remove(STORE.id, adminUserId),
      requestExport: () => EXPORTS.request(),
    },
    people: projectPeopleResponseSchema.parse(demoPeopleWire()),
    myEmail: DEMO_OWNER_EMAIL,
  },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
} satisfies Meta<typeof ProjectSettingsView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AnotherProject: Story = { args: { settings: demoSettings(DEMO_DOCS.id) } };

export const ReadOnlyForSomeoneTheOwnerAdded: Story = {
  args: { settings: { ...STORE, role: 'member' } },
};

export const OperatorProject: Story = {
  args: { settings: { ...STORE, accountId: null, role: null } },
};

export const WithoutASubscription: Story = {
  args: {
    manage: {
      timezones: timeZoneChoices(STORE.timezone),
      save: () => Promise.resolve({ kind: 'subscriptionRequired' }),
      createKey: () => Promise.resolve({ kind: 'subscriptionRequired' }),
      revokeKey: () => Promise.resolve({ kind: 'subscriptionRequired' }),
      remove: (confirmName) => MANAGEMENT.delete(STORE.id, confirmName),
      addPerson: () => Promise.resolve({ kind: 'subscriptionRequired' }),
      removePerson: (adminUserId) => PEOPLE.remove(STORE.id, adminUserId),
      requestExport: () => Promise.resolve({ kind: 'limitReached' }),
    },
  },
};

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

export const NoLivePublicKey: Story = { args: { settings: { ...STORE, publicKeys: [] } } };

export const NoLivePublicKeyForSomeoneTheOwnerAdded: Story = {
  args: { settings: { ...STORE, role: 'member', publicKeys: [] } },
};

export const NoLivePublicKeyInPortuguese: Story = {
  args: { settings: { ...STORE, publicKeys: [] }, i18n: portuguese },
};

export const DeletionOnHold: Story = {
  args: { settings: { ...STORE, deletionHeldAt: '2026-10-04T12:00:00.000Z' } },
};

export const DeletionOnHoldInSpanish: Story = {
  args: { settings: { ...STORE, deletionHeldAt: '2026-10-04T12:00:00.000Z' }, i18n: spanish },
};

export const InPortuguese: Story = { args: { i18n: portuguese } };

export const InSpanish: Story = { args: { i18n: spanish } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };

export const NoLivePublicKeyDarkTheme: Story = {
  args: { settings: { ...STORE, publicKeys: [] } },
  globals: { theme: 'dark' },
};
