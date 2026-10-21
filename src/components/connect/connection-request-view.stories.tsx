import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ReactNode } from 'react';
import { BrandedPage } from '@/components/brand/branded-page';
import type { ConnectionRequest } from '@/domain/connection-requests';
import { connectionRequestResponseSchema } from '@/domain/connection-requests.schema';
import { demoConnectionRequestWire } from '@/services/connection-requests/mock-connection-requests-service';
import { english } from '@/test-utils/english';
import { ConnectionRequestGone, ConnectionRequestView } from './connection-request-view';

const STORY_NOW = new Date('2026-10-15T23:00:00.000Z');
const FROM_CLAUDE_CODE = connectionRequestResponseSchema.parse(
  demoConnectionRequestWire(STORY_NOW, english.t),
);
const FROM_CLAUDE: ConnectionRequest = {
  ...FROM_CLAUDE_CODE,
  client: { name: 'Claude', host: 'claude.ai' },
  redirect: { host: 'claude.ai', loopback: false },
};

const meta = {
  title: 'Connect/Consent page',
  component: ConnectionRequestView,
  tags: ['autodocs'],
  args: {
    request: FROM_CLAUDE_CODE,
    email: 'owner@example.com',
    i18n: english,
    allow: () => new Promise(() => undefined),
    deny: () => new Promise(() => undefined),
  },
  decorators: [(Story: () => ReactNode) => <BrandedPage>{Story()}</BrandedPage>],
  parameters: { layout: 'fullscreen', nextjs: { appDirectory: true } },
} satisfies Meta<typeof ConnectionRequestView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FromClaudeCode: Story = {};

export const FromClaude: Story = { args: { request: FROM_CLAUDE } };

export const TenAppsConnected: Story = {
  args: { request: { ...FROM_CLAUDE, connectionLimitReached: true } },
};

export const NoProjectsYet: Story = {
  args: { request: { ...FROM_CLAUDE, projects: [] }, email: 'new-owner@example.com' },
};

export const AllowFails: Story = {
  args: { allow: () => Promise.reject(new Error('Pyxis API answered 503')) },
};

export const InPortuguese: Story = { globals: { locale: 'pt-BR' } };

export const InSpanish: Story = { globals: { locale: 'es' } };

export const OnAPhone: Story = { globals: { viewport: { value: 'mobile1' } } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };

export const RequestEnded: Story = {
  render: ({ i18n }) => <ConnectionRequestGone i18n={i18n} />,
};

export const RequestEndedDarkTheme: Story = {
  ...RequestEnded,
  globals: { theme: 'dark' },
};
