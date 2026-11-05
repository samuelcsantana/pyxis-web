import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import type { CreateShareLinkOutcome, NewShareLink } from '@/domain/share-links';
import { createdShareLinkResponseSchema } from '@/domain/share-links.schema';
import { demoCreatedShareLinkWire } from '@/services/share-links/mock-share-links-service';
import { CreateShareLinkForm } from './create-share-link-form';

const STORY_NOW = new Date('2026-11-05T12:00:00.000Z');
const SLOW_CREATE_MS = 60_000;

const createRightAway = (link: NewShareLink): Promise<CreateShareLinkOutcome> =>
  Promise.resolve({
    kind: 'created',
    link: createdShareLinkResponseSchema.parse(
      demoCreatedShareLinkWire({ name: link.name, expiresAt: null }, STORY_NOW),
    ),
  });

const createSlowly = (link: NewShareLink) =>
  new Promise<CreateShareLinkOutcome>((resolve) => {
    setTimeout(() => {
      void createRightAway(link).then(resolve);
    }, SLOW_CREATE_MS);
  });

const refuseOffPro = (): Promise<CreateShareLinkOutcome> =>
  Promise.resolve({ kind: 'planRequired' });

const failToCreate = () => Promise.reject(new Error('Pyxis API answered 503'));

const meta = {
  title: 'Settings/Create share link form',
  component: CreateShareLinkForm,
  tags: ['autodocs'],
  args: { create: createRightAway, limitReached: false, onCreated: () => undefined },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
} satisfies Meta<typeof CreateShareLinkForm>;

export default meta;
type Story = StoryObj<typeof meta>;

async function typeAndSubmit(canvasElement: HTMLElement, name: string) {
  const canvas = within(canvasElement);
  if (name.length > 0) {
    await userEvent.type(canvas.getByRole('textbox', { name: 'Who it is for' }), name);
  }
  await userEvent.click(canvas.getByRole('button', { name: 'Create link' }));
  return canvas;
}

export const Default: Story = {};

export const MissingName: Story = {
  play: async ({ canvasElement }) => {
    const canvas = await typeAndSubmit(canvasElement, '');
    await expect(canvas.getByRole('alert')).toHaveTextContent('Give the link a name.');
  },
};

export const Creating: Story = {
  args: { create: createSlowly },
  play: async ({ canvasElement }) => {
    const canvas = await typeAndSubmit(canvasElement, 'Board');
    await expect(canvas.getByRole('button', { name: 'Creating…' })).toBeDisabled();
  },
};

export const Created: Story = {
  play: async ({ canvasElement }) => {
    const canvas = await typeAndSubmit(canvasElement, 'Board');
    await expect(await canvas.findByRole('group', { name: 'Copy the link now' })).toHaveTextContent(
      '/share/pyxis_sh_',
    );
  },
};

export const RefusedOffPro: Story = {
  args: { create: refuseOffPro },
  play: async ({ canvasElement }) => {
    const canvas = await typeAndSubmit(canvasElement, 'Board');
    await expect(await canvas.findByRole('alert')).toHaveTextContent('Public links need the Pro');
  },
};

export const Failed: Story = {
  args: { create: failToCreate },
  play: async ({ canvasElement }) => {
    const canvas = await typeAndSubmit(canvasElement, 'Board');
    await expect(await canvas.findByRole('alert')).toHaveTextContent('The link was not created');
  },
};

export const LimitReached: Story = { args: { limitReached: true } };

export const Portuguese: Story = { parameters: { locale: 'pt-BR' } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
