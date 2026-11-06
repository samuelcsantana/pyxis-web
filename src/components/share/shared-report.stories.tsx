import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
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

function lockedWithUnlockAnswering(status: number, headers: Record<string, string> = {}) {
  return () => {
    const original = window.fetch.bind(window);
    forgetSharedCards();
    window.sessionStorage.clear();
    window.fetch = (_input, init): Promise<Response> =>
      Promise.resolve(
        init?.method === 'POST'
          ? new Response(JSON.stringify({ error: 'wrong_share_password' }), { status, headers })
          : new Response(JSON.stringify({ password_required: true }), { status: OK }),
      );
    return () => {
      window.fetch = original;
      window.sessionStorage.clear();
      forgetSharedCards();
    };
  };
}

async function typeAndOpen(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  await userEvent.type(await canvas.findByLabelText('Password'), 'not the one');
  await userEvent.click(canvas.getByRole('button', { name: 'Open the report' }));
  return canvas;
}

const meta = {
  title: 'Share/Shared report',
  component: SharedReport,
  tags: ['autodocs'],
  args: {
    token: TOKEN,
    screen: 'overview',
    apiBase: 'https://api.example.com',
    demoPassword: null,
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
    await expect(
      await within(canvasElement).findByRole('heading', {
        name: 'This report asks for a password',
      }),
    ).toBeVisible();
  },
};

export const PasswordInTheDemo: Story = {
  args: { demoPassword: 'pyxis-demo' },
  beforeEach: answeringWith(OK, { password_required: true }),
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('In this demo, the password is pyxis-demo.'),
    ).toBeVisible();
  },
};

export const WrongPassword: Story = {
  beforeEach: lockedWithUnlockAnswering(401),
  play: async ({ canvasElement }) => {
    const canvas = await typeAndOpen(canvasElement);
    await expect(await canvas.findByRole('alert')).toHaveTextContent('Wrong password');
    await expect(canvas.getByLabelText('Password')).toHaveValue('not the one');
  },
};

export const TooManyAttempts: Story = {
  beforeEach: lockedWithUnlockAnswering(TOO_MANY_REQUESTS, { 'retry-after': '540' }),
  play: async ({ canvasElement }) => {
    const canvas = await typeAndOpen(canvasElement);
    await expect(await canvas.findByRole('alert')).toHaveTextContent(
      'Too many attempts. Try again in 9 minutes.',
    );
  },
};

export const PasswordDarkTheme: Story = {
  globals: { theme: 'dark' },
  beforeEach: answeringWith(OK, { password_required: true }),
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
