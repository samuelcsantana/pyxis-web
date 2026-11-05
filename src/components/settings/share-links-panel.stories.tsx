import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { CreateShareLinkOutcome, ShareLink } from '@/domain/share-links';
import {
  createdShareLinkResponseSchema,
  shareLinksResponseSchema,
} from '@/domain/share-links.schema';
import {
  demoCreatedShareLinkWire,
  demoShareLinksWire,
} from '@/services/share-links/mock-share-links-service';
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';
import { ShareLinksPanel } from './share-links-panel';

const STORY_NOW = new Date('2026-11-05T12:00:00.000Z');
const LINKS = shareLinksResponseSchema.parse(demoShareLinksWire(STORY_NOW));
const ONE_LINK: ShareLink = {
  id: '4d0f6b8c-5e7a-4f9b-8c4d-6e8f0a2b4c5d',
  name: 'Client review',
  createdAt: '2026-11-01T12:00:00.000Z',
  expiresAt: '2026-12-01T12:00:00.000Z',
};

const meta = {
  title: 'Settings/Share links panel',
  component: ShareLinksPanel,
  tags: ['autodocs'],
  args: {
    links: LINKS,
    onPro: true,
    i18n: english,
    timezone: 'America/Sao_Paulo',
    create: ({ name }): Promise<CreateShareLinkOutcome> =>
      Promise.resolve({
        kind: 'created',
        link: createdShareLinkResponseSchema.parse(
          demoCreatedShareLinkWire({ name, expiresAt: null }, STORY_NOW),
        ),
      }),
    revoke: () => Promise.resolve(),
  },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
} satisfies Meta<typeof ShareLinksPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoLinksYet: Story = { args: { links: [] } };

export const OnHobby: Story = { args: { onPro: false } };

export const LimitReached: Story = {
  args: {
    links: Array.from({ length: 10 }, (_, index) => ({
      ...ONE_LINK,
      id: `4d0f6b8c-5e7a-4f9b-8c4d-6e8f0a2b4c${String(index).padStart(2, '0')}`,
      name: `Client ${String(index + 1)}`,
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
