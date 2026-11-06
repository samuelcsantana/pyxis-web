import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import type {
  SaveSlackWebhookOutcome,
  SlackWebhook,
  TestSlackWebhookOutcome,
} from '@/domain/slack-webhook';
import { MockSlackWebhookService } from '@/services/slack/mock-slack-webhook-service';
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';
import { SlackPanel } from './slack-panel';

const STORY_NOW = new Date('2026-11-06T12:00:00.000Z');
const SLOW_MS = 60_000;
const WEBHOOK: SlackWebhook = {
  maskedUrl: 'hooks.slack.com/…/9XQZ',
  connectedAt: '2026-10-25T12:00:00.000Z',
  brokenAt: null,
  brokenReason: null,
};
const PASTED = 'https://hooks.slack.com/services/T0001/B0002/abcdefghijklWXYZ';

const slowly = <Value,>(value: Value) =>
  new Promise<Value>((resolve) => {
    setTimeout(() => {
      resolve(value);
    }, SLOW_MS);
  });

const meta = {
  title: 'Settings/Slack panel',
  component: SlackPanel,
  tags: ['autodocs'],
  args: {
    webhook: WEBHOOK,
    onPro: true,
    save: (url: string) => new MockSlackWebhookService(() => STORY_NOW).save('p-story', url),
    test: () => Promise.resolve<TestSlackWebhookOutcome>({ kind: 'tested', result: 'sent' }),
    remove: () => Promise.resolve(),
    timezone: 'America/Sao_Paulo',
    i18n: english,
  },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
} satisfies Meta<typeof SlackPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Connected: Story = {};

export const NotConnectedYet: Story = { args: { webhook: null } };

export const Saving: Story = {
  args: {
    webhook: null,
    save: () => slowly<SaveSlackWebhookOutcome>({ kind: 'saved', webhook: WEBHOOK }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox', { name: 'Webhook address' }), PASTED);
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }));
    await expect(canvas.getByRole('button', { name: 'Saving…' })).toBeDisabled();
  },
};

export const TestSent: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Send test' }));
    await expect(await canvas.findByRole('status', {}, { timeout: 2000 })).toHaveTextContent(
      'Slack accepted the test message',
    );
  },
};

export const Broken: Story = {
  args: {
    webhook: {
      ...WEBHOOK,
      brokenAt: '2026-11-05T09:00:00.000Z',
      brokenReason: 'channel_not_found',
    },
  },
};

export const TestFailed: Story = {
  args: {
    test: () => Promise.resolve<TestSlackWebhookOutcome>({ kind: 'tested', result: 'failed' }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Send test' }));
    await expect(await canvas.findByRole('alert', {}, { timeout: 2000 })).toHaveTextContent(
      'Slack could not be reached',
    );
  },
};

export const RemoveQuestion: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Remove' }));
    await expect(canvas.getByRole('group')).toHaveTextContent('Remove the Slack webhook?');
  },
};

export const OnHobby: Story = { args: { webhook: null, onPro: false } };

export const OnHobbyWithAStoredWebhook: Story = { args: { onPro: false } };

export const Portuguese: Story = {
  args: { i18n: portuguese },
  parameters: { locale: 'pt-BR' },
};

export const DarkTheme: Story = { globals: { theme: 'dark' } };
