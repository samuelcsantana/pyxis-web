import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { forgetSharedCards, SharedReport } from './shared-report';

const TOKEN = `pyxis_sh_${'S'.repeat(32)}`;
const OK = 200;
const NOT_FOUND = 404;
const TOO_MANY_REQUESTS = 429;
const SERVER_ERROR = 500;

function answeringWith(status: number | null, card: unknown = { project: {} }) {
  return () => {
    const original = window.fetch.bind(window);
    forgetSharedCards();
    window.fetch = (): Promise<Response> =>
      status === null
        ? new Promise<Response>(() => undefined)
        : Promise.resolve(new Response(JSON.stringify(card), { status }));
    return () => {
      window.fetch = original;
      forgetSharedCards();
    };
  };
}

const meta = {
  title: 'Share/Shared report',
  component: SharedReport,
  tags: ['autodocs'],
  args: {
    token: TOKEN,
    screen: 'overview',
    apiBase: 'https://api.example.com',
    requestsAction: () => Promise.resolve([]),
    renderAction: () =>
      Promise.resolve(<p className="p-4 text-sm">The server drew the shared Overview here.</p>),
  },
  parameters: {
    layout: 'fullscreen',
    nextjs: { appDirectory: true, navigation: { query: { range: '30d' } } },
  },
  beforeEach: answeringWith(OK),
} satisfies Meta<typeof SharedReport>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('The server drew the shared Overview here.'),
    ).toBeVisible();
  },
};

export const Loading: Story = { beforeEach: answeringWith(null) };

export const LinkClosed: Story = {
  beforeEach: answeringWith(NOT_FOUND),
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByRole('heading', { name: 'This link does not open' }),
    ).toBeVisible();
  },
};

export const PasswordRequired: Story = {
  beforeEach: answeringWith(OK, { password_required: true }),
  play: async ({ canvasElement }) => {
    await expect(await within(canvasElement).findByText(/asks for a password/)).toBeVisible();
  },
};

export const TooManyRequests: Story = {
  beforeEach: answeringWith(TOO_MANY_REQUESTS),
  play: async ({ canvasElement }) => {
    await expect(await within(canvasElement).findByRole('alert')).toHaveTextContent(
      'Wait a minute',
    );
  },
};

export const Failed: Story = {
  beforeEach: answeringWith(SERVER_ERROR),
  play: async ({ canvasElement }) => {
    await expect(await within(canvasElement).findByRole('alert')).toHaveTextContent(
      'could not be loaded',
    );
  },
};

export const DarkTheme: Story = {
  globals: { theme: 'dark' },
  beforeEach: answeringWith(NOT_FOUND),
};
