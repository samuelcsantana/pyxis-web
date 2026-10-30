import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { SECTION_LOOKS } from '@/components/settings-window/sections';
import type { ProjectSettings } from '@/domain/project-settings';
import { projectSettingsResponseSchema } from '@/domain/project-settings.schema';
import { DEMO_STORE, demoProjectNameOf } from '@/services/demo/demo-projects';
import {
  DEMO_CREATED_KEYS,
  MockProjectManagementService,
} from '@/services/project-management/mock-project-management-service';
import { demoProjectSettingsWire } from '@/services/projects/demo-project-settings';
import { english } from '@/test-utils/english';
import { KeysPart } from './keys-part';

const STORY_NOW = new Date('2026-10-30T12:00:00.000Z');
const STORE: ProjectSettings = projectSettingsResponseSchema.parse(
  demoProjectSettingsWire(DEMO_STORE.id, STORY_NOW, demoProjectNameOf(DEMO_STORE, english.t)),
);
const MEMBER_VIEW: ProjectSettings = { ...STORE, role: 'member' };
const [LIVE_PUBLIC_KEY] = STORE.publicKeys;
if (LIVE_PUBLIC_KEY === undefined) {
  throw new Error('The demo project has no public key.');
}
const NEW_PUBLIC_KEY = {
  id: '6b2d4f8a-1c3e-4a5b-9d7f-2e4a6c8b0d1f',
  key: 'pyxis_pk_NewDemoKeyThatSendsNothing00',
  createdAt: '2026-10-28T09:00:00.000Z',
};
const TWO_PUBLIC_KEYS: ProjectSettings = {
  ...STORE,
  publicKeys: [...STORE.publicKeys, NEW_PUBLIC_KEY],
};
const MANAGEMENT = new MockProjectManagementService(() => Promise.resolve(english.t));
const format = english.format.dateTime('eventTime', STORE.timezone);
const LOOK = SECTION_LOOKS.keys;

const meta = {
  title: 'Settings/Keys part',
  component: KeysPart,
  tags: ['autodocs'],
  args: {
    settings: STORE,
    i18n: english,
    when: (iso: string) => format(new Date(iso)),
    manage: {
      createKey: (kind) => MANAGEMENT.createKey(STORE.id, kind),
      revokeKey: (keyId) => MANAGEMENT.revokeKey(STORE.id, keyId),
    },
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
} satisfies Meta<typeof KeysPart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ForTheOwner: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/The only public key stays/)).toBeVisible();
    await expect(canvas.getAllByRole('button', { name: 'Revoke' })).toHaveLength(1);
  },
};

export const ForTheOwnerWithTwoPublicKeys: Story = {
  args: { settings: TWO_PUBLIC_KEYS },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByText(/The only public key stays/)).toBeNull();
    await expect(canvas.getAllByRole('button', { name: 'Revoke' })).toHaveLength(3);
  },
};

export const ForTheOwnerWithoutALivePublicKey: Story = {
  args: { settings: { ...STORE, publicKeys: [] } },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText(/Create a public key below/)).toBeVisible();
  },
};

export const ForTheOwnerWithoutASecretKey: Story = {
  args: { settings: { ...STORE, secretKeys: [] } },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('No live secret key.')).toBeVisible();
  },
};

export const SecretKeyShownOnce: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'New secret key' }));
    await expect(
      await canvas.findByRole('group', { name: 'Copy the secret key now' }),
    ).toHaveTextContent(DEMO_CREATED_KEYS.secret);
  },
};

export const ForTheOwnerWithoutASubscription: Story = {
  args: {
    manage: {
      createKey: () => Promise.resolve({ kind: 'subscriptionRequired' }),
      revokeKey: () => Promise.resolve({ kind: 'subscriptionRequired' }),
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'New public key' }));
    await expect(await canvas.findByRole('alert')).toHaveTextContent('no running subscription');
  },
};

export const ForSomeoneTheOwnerAdded: Story = {
  args: { settings: MEMBER_VIEW, manage: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(LIVE_PUBLIC_KEY.key)).toBeVisible();
    await expect(canvas.queryAllByRole('button')).toHaveLength(0);
  },
};

export const ForSomeoneTheOwnerAddedWithoutALivePublicKey: Story = {
  args: { settings: { ...MEMBER_VIEW, publicKeys: [] }, manage: null },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(/Only the account's owner can create one/),
    ).toBeVisible();
  },
};

export const ForSomeoneTheOwnerAddedWithoutASecretKey: Story = {
  args: { settings: { ...MEMBER_VIEW, secretKeys: [] }, manage: null },
};

export const InPortuguese: Story = { globals: { locale: 'pt-BR' } };

export const WithoutALivePublicKeyInPortuguese: Story = {
  args: { settings: { ...STORE, publicKeys: [] } },
  globals: { locale: 'pt-BR' },
};

export const DarkTheme: Story = { globals: { theme: 'dark' } };

export const WithoutALivePublicKeyDarkTheme: Story = {
  args: { settings: { ...STORE, publicKeys: [] } },
  globals: { theme: 'dark' },
};
