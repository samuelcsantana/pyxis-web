import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SECTION_LOOKS } from '@/components/settings-window/sections';
import { accessTokensResponseSchema } from '@/domain/access-tokens.schema';
import {
  DEMO_CREATED_ACCESS_TOKEN,
  demoAccessTokensWire,
} from '@/services/access-tokens/mock-access-tokens-service';
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';
import { AccessTokensPanel } from './access-tokens-panel';

const STORY_NOW = new Date('2026-10-14T12:00:00.000Z');
const TOKENS = accessTokensResponseSchema.parse(demoAccessTokensWire(STORY_NOW));
const format = english.format.dateTime('eventTime', 'America/Sao_Paulo');
const DAY_MS = 86_400_000;
const UNUSED_TOKEN = {
  id: '2b8d4f6a-3c5e-4d7f-9a2b-4c6d8e0f2a3b',
  name: 'Script',
  createdAt: '2026-10-11T12:00:00.000Z',
  lastUsedAt: null,
  expiresAt: '2026-11-10T12:00:00.000Z',
};

const LOOK = SECTION_LOOKS.tokens;

const meta = {
  title: 'Settings/Access tokens panel',
  component: AccessTokensPanel,
  tags: ['autodocs'],
  args: {
    tokens: TOKENS,
    i18n: english,
    when: (iso: string) => format(new Date(iso)),
    create: ({ name, lifetimeDays }) =>
      Promise.resolve({
        kind: 'created',
        token: {
          id: '3c9e5a7b-4d6f-4e8a-8b3c-5d7e9f1a3b4c',
          name,
          token: DEMO_CREATED_ACCESS_TOKEN,
          createdAt: STORY_NOW.toISOString(),
          lastUsedAt: null,
          expiresAt: new Date(STORY_NOW.getTime() + lifetimeDays * DAY_MS).toISOString(),
        },
      }),
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
} satisfies Meta<typeof AccessTokensPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoTokensYet: Story = { args: { tokens: [] } };

export const LimitReached: Story = {
  args: {
    tokens: Array.from({ length: 10 }, (_, index) => ({
      ...UNUSED_TOKEN,
      id: `2b8d4f6a-3c5e-4d7f-9a2b-4c6d8e0f2a${String(index).padStart(2, '0')}`,
      name: `Script ${String(index + 1)}`,
    })),
  },
};

export const RevokingFails: Story = {
  args: { revoke: () => Promise.reject(new Error('Pyxis API answered 503')) },
};

export const Portuguese: Story = {
  args: { i18n: portuguese },
  parameters: { locale: 'pt-BR' },
};

export const DarkTheme: Story = { globals: { theme: 'dark' } };
