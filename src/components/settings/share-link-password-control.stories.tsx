import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import type { SetShareLinkPasswordOutcome, ShareLink } from '@/domain/share-links';
import { ShareLinkPasswordControl } from './share-link-password-control';

const SLOW_SAVE_MS = 60_000;

const LINK: ShareLink = {
  id: '4d0f6b8c-5e7a-4f9b-8c4d-6e8f0a2b4c5d',
  name: 'Monthly board report',
  createdAt: '2026-11-01T12:00:00.000Z',
  expiresAt: null,
  passwordProtected: false,
};

const saveRightAway = (_linkId: string, password: string | null) =>
  Promise.resolve<SetShareLinkPasswordOutcome>({
    kind: 'changed',
    link: { ...LINK, passwordProtected: password !== null },
  });

const saveSlowly = (linkId: string, password: string | null) =>
  new Promise<SetShareLinkPasswordOutcome>((resolve) => {
    setTimeout(() => {
      void saveRightAway(linkId, password).then(resolve);
    }, SLOW_SAVE_MS);
  });

async function typeAndSave(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByRole('button', { name: 'Set password' }));
  await userEvent.type(canvas.getByLabelText('New password'), 'open sesame');
  await userEvent.click(canvas.getByRole('button', { name: 'Save password' }));
  return canvas;
}

const meta = {
  title: 'Settings/Share link password',
  component: ShareLinkPasswordControl,
  tags: ['autodocs'],
  args: {
    link: LINK,
    describedBy: 'share-link-name',
    setPassword: saveRightAway,
    onChanged: () => undefined,
  },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
} satisfies Meta<typeof ShareLinkPasswordControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OpenLink: Story = {};

export const ProtectedLink: Story = { args: { link: { ...LINK, passwordProtected: true } } };

export const Saving: Story = {
  args: { setPassword: saveSlowly },
  play: async ({ canvasElement }) => {
    const canvas = await typeAndSave(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Saving…' })).toBeDisabled();
  },
};

export const Saved: Story = {
  play: async ({ canvasElement }) => {
    const canvas = await typeAndSave(canvasElement);
    await expect(await canvas.findByRole('status', {}, { timeout: 2000 })).toHaveTextContent(
      'Password saved.',
    );
  },
};

export const Failed: Story = {
  args: { setPassword: () => Promise.reject(new Error('Pyxis API answered 503')) },
  play: async ({ canvasElement }) => {
    const canvas = await typeAndSave(canvasElement);
    await expect(await canvas.findByRole('alert', {}, { timeout: 2000 })).toHaveTextContent(
      'The password was not changed. Try again.',
    );
  },
};

export const DarkTheme: Story = {
  globals: { theme: 'dark' },
  args: { link: { ...LINK, passwordProtected: true } },
};
