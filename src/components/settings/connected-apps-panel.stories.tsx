import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SECTION_LOOKS } from '@/components/settings-window/sections';
import { connectedAppsResponseSchema } from '@/domain/connections.schema';
import {
  DEMO_CONNECTOR_URL,
  demoConnectionsWire,
} from '@/services/connections/mock-connections-service';
import { english } from '@/test-utils/english';
import { ConnectedAppsPanel } from './connected-apps-panel';

const STORY_NOW = new Date('2026-10-15T23:00:00.000Z');
const APPS = connectedAppsResponseSchema.parse(demoConnectionsWire(STORY_NOW));
const format = english.format.dateTime('eventTime', 'America/Sao_Paulo');

const LOOK = SECTION_LOOKS.apps;

const meta = {
  title: 'Settings/Connected apps panel',
  component: ConnectedAppsPanel,
  tags: ['autodocs'],
  args: {
    apps: APPS,
    i18n: english,
    when: (iso: string) => format(new Date(iso)),
    revoke: () => Promise.resolve(),
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
} satisfies Meta<typeof ConnectedAppsPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoAppsYet: Story = {
  args: { apps: { connectorUrl: DEMO_CONNECTOR_URL, connections: [] } },
};

export const ConnectorClosed: Story = {
  args: { apps: { connectorUrl: null, connections: APPS.connections } },
};

export const ConnectorClosedAndNoApps: Story = {
  args: { apps: { connectorUrl: null, connections: [] } },
};

export const RevokingFails: Story = {
  args: { revoke: () => Promise.reject(new Error('Pyxis API answered 503')) },
};

export const InPortuguese: Story = { globals: { locale: 'pt-BR' } };

export const InSpanish: Story = { globals: { locale: 'es' } };

export const OnAPhone: Story = { globals: { viewport: { value: 'mobile1' } } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
