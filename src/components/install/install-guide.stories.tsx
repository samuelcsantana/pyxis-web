import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { projectSettingsResponseSchema } from '@/domain/project-settings.schema';
import { PYXIS_INGESTION_URL } from '@/lib/landing-measurement-config';
import { DEMO_STORE, demoProjectNameOf } from '@/services/demo/demo-projects';
import { demoProjectSettingsWire } from '@/services/projects/demo-project-settings';
import { english } from '@/test-utils/english';
import { InstallGuide } from './install-guide';

const STORY_NOW = new Date('2026-11-20T12:00:00.000Z');
const RECEIVING = projectSettingsResponseSchema.parse(
  demoProjectSettingsWire(DEMO_STORE.id, STORY_NOW, demoProjectNameOf(DEMO_STORE, english.t)),
);

const meta = {
  title: 'Install/Install guide',
  component: InstallGuide,
  tags: ['autodocs'],
  args: {
    settings: { ...RECEIVING, firstEventAt: null, lastEventAt: null },
    endpoint: PYXIS_INGESTION_URL,
    i18n: english,
  },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
} satisfies Meta<typeof InstallGuide>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WaitingForTheFirstEvent: Story = {};

export const FirstEventArrived: Story = { args: { settings: RECEIVING } };

export const NoLivePublicKey: Story = {
  args: { settings: { ...RECEIVING, firstEventAt: null, lastEventAt: null, publicKeys: [] } },
};

export const NoLivePublicKeyForSomeoneTheOwnerAdded: Story = {
  args: {
    settings: {
      ...RECEIVING,
      role: 'member',
      firstEventAt: null,
      lastEventAt: null,
      publicKeys: [],
    },
  },
};

export const NoLivePublicKeyInSpanish: Story = {
  args: { settings: { ...RECEIVING, firstEventAt: null, lastEventAt: null, publicKeys: [] } },
  globals: { locale: 'es' },
};

export const InPortuguese: Story = { globals: { locale: 'pt-BR' } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
