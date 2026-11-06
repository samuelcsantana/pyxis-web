import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import type { CreateShareLinkOutcome, ShareLink } from '@/domain/share-links';
import {
  createdShareLinkResponseSchema,
  shareLinksResponseSchema,
} from '@/domain/share-links.schema';
import {
  demoCreatedShareLinkWire,
  demoShareLinksWire,
  MockShareLinksService,
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
  passwordProtected: false,
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
          demoCreatedShareLinkWire({ name, expiresAt: null, password: null }, STORY_NOW),
        ),
      }),
    setPassword: (linkId, password) =>
      new MockShareLinksService(() => STORY_NOW).setPassword('p-story', linkId, password),
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

export const SettingAPassword: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const [firstOpenLink] = canvas.getAllByRole('button', { name: 'Set password' });
    if (firstOpenLink === undefined) {
      throw new Error('An open link was expected.');
    }
    await userEvent.click(firstOpenLink);
    await userEvent.type(canvas.getByLabelText('New password'), 'open sesame');
    await expect(canvas.getByRole('button', { name: 'Save password' })).toBeInTheDocument();
  },
};

export const RemovingAPassword: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Remove password' }));
    await expect(canvas.getByRole('group')).toHaveTextContent('Remove the password of');
  },
};

export const PasswordChangeFails: Story = {
  args: { setPassword: () => Promise.reject(new Error('Pyxis API answered 503')) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Remove password' }));
    await userEvent.click(
      within(canvas.getByRole('group')).getByRole('button', { name: 'Remove password' }),
    );
    await expect(await canvas.findByRole('alert', {}, { timeout: 2000 })).toHaveTextContent(
      'The password was not changed. Try again.',
    );
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
