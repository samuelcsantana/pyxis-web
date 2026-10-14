import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import type { CreateAccessTokenOutcome, NewAccessToken } from '@/domain/access-tokens';
import { demoCreatedAccessTokenWire } from '@/services/access-tokens/mock-access-tokens-service';
import { createdAccessTokenResponseSchema } from '@/domain/access-tokens.schema';
import { CreateAccessTokenForm } from './create-access-token-form';

const STORY_NOW = new Date('2026-10-14T12:00:00.000Z');
const SLOW_CREATE_MS = 60_000;

const createRightAway = (request: NewAccessToken): Promise<CreateAccessTokenOutcome> =>
  Promise.resolve({
    kind: 'created',
    token: createdAccessTokenResponseSchema.parse(demoCreatedAccessTokenWire(request, STORY_NOW)),
  });

const createSlowly = (request: NewAccessToken) =>
  new Promise<CreateAccessTokenOutcome>((resolve) => {
    setTimeout(() => {
      void createRightAway(request).then(resolve);
    }, SLOW_CREATE_MS);
  });

const refuseOneMore = (): Promise<CreateAccessTokenOutcome> => Promise.resolve({ kind: 'tooMany' });

const failToCreate = () => Promise.reject(new Error('Pyxis API answered 503'));

const meta = {
  title: 'Settings/Create access token form',
  component: CreateAccessTokenForm,
  tags: ['autodocs'],
  args: { create: createRightAway, limitReached: false },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
} satisfies Meta<typeof CreateAccessTokenForm>;

export default meta;
type Story = StoryObj<typeof meta>;

async function typeAndSubmit(canvasElement: HTMLElement, name: string) {
  const canvas = within(canvasElement);
  if (name.length > 0) {
    await userEvent.type(canvas.getByRole('textbox', { name: 'Name' }), name);
  }
  await userEvent.click(canvas.getByRole('button', { name: 'Create token' }));
  return canvas;
}

export const Default: Story = {};

export const MissingName: Story = {
  play: async ({ canvasElement }) => {
    const canvas = await typeAndSubmit(canvasElement, '');
    await expect(canvas.getByRole('alert')).toHaveTextContent('Give the token a name');
  },
};

export const Creating: Story = {
  args: { create: createSlowly },
  play: async ({ canvasElement }) => {
    const canvas = await typeAndSubmit(canvasElement, 'Claude Code');
    await expect(canvas.getByRole('button', { name: 'Creating…' })).toBeDisabled();
  },
};

export const Created: Story = {
  play: async ({ canvasElement }) => {
    const canvas = await typeAndSubmit(canvasElement, 'Claude Code');
    await expect(
      await canvas.findByRole('group', { name: 'Copy your new token now' }),
    ).toBeInTheDocument();
  },
};

export const RefusedAsTheEleventh: Story = {
  args: { create: refuseOneMore },
  play: async ({ canvasElement }) => {
    const canvas = await typeAndSubmit(canvasElement, 'One more');
    await expect(await canvas.findByRole('status')).toHaveTextContent('You have 10 tokens');
  },
};

export const Failed: Story = {
  args: { create: failToCreate },
  play: async ({ canvasElement }) => {
    const canvas = await typeAndSubmit(canvasElement, 'Claude Code');
    await expect(await canvas.findByRole('alert')).toHaveTextContent('The token was not created');
  },
};

export const LimitReached: Story = { args: { limitReached: true } };

export const Portuguese: Story = { parameters: { locale: 'pt-BR' } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
