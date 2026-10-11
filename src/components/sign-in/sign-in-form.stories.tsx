import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { InvalidCodeError, RateLimitedError } from '@/domain/errors';
import type { IAuthService } from '@/services/auth/auth-service.interface';
import { DEMO_SIGN_IN_CODE, MockAuthService } from '@/services/auth/mock-auth-service';
import { PENDING_SIGN_IN_KEY } from './pending-sign-in';
import { SignInForm } from './sign-in-form';

const neverAnswers: IAuthService = {
  requestCode: () => new Promise<void>(() => undefined),
  verifyCode: () => new Promise<void>(() => undefined),
  signOut: () => new Promise<void>(() => undefined),
  signOutEverywhere: () => new Promise<void>(() => undefined),
};

const refusesEveryCode: IAuthService = {
  requestCode: () => Promise.resolve(),
  verifyCode: () => Promise.reject(new InvalidCodeError()),
  signOut: () => Promise.resolve(),
  signOutEverywhere: () => Promise.resolve(),
};

const refusesEveryEmail: IAuthService = {
  requestCode: () => Promise.reject(new RateLimitedError()),
  verifyCode: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
  signOutEverywhere: () => Promise.resolve(),
};

const meta = {
  title: 'Sign in/SignInForm',
  component: SignInForm,
  tags: ['autodocs'],
  args: { authService: new MockAuthService() },
  parameters: { layout: 'centered', nextjs: { appDirectory: true } },
  beforeEach: () => {
    window.sessionStorage.removeItem(PENDING_SIGN_IN_KEY);
  },
  decorators: [
    (Story) => (
      <div className="flex w-[min(92vw,420px)] justify-center">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SignInForm>;

export default meta;
type Story = StoryObj<typeof meta>;

async function reachCodeStep(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  await userEvent.type(canvas.getByLabelText('Email'), 'owner@demo-store.example');
  await userEvent.click(canvas.getByRole('button', { name: 'Send code' }));
  return canvas;
}

export const EmailStep: Story = {};

export const DemoEmailStep: Story = { args: { demoCode: DEMO_SIGN_IN_CODE } };

export const SessionExpired: Story = { args: { sessionExpired: true } };

export const CodeStep: Story = {
  args: { demoCode: DEMO_SIGN_IN_CODE },
  play: async ({ canvasElement }) => {
    const canvas = await reachCodeStep(canvasElement);
    await expect(await canvas.findByLabelText('6-digit code')).toHaveFocus();
    await expect(canvas.getByTestId('code-cells')).toBeVisible();
  },
};

export const RestoredAfterReload: Story = {
  beforeEach: () => {
    window.sessionStorage.setItem(
      PENDING_SIGN_IN_KEY,
      JSON.stringify({ email: 'owner@demo-store.example', sentAt: Date.now() - 12_000 }),
    );
    return () => {
      window.sessionStorage.removeItem(PENDING_SIGN_IN_KEY);
    };
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByRole('heading', { name: 'Check your email' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: /Send a new code in 0:1\d/ })).toBeDisabled();
  },
};

export const Loading: Story = {
  args: { authService: neverAnswers },
  play: async ({ canvasElement }) => {
    const canvas = await reachCodeStep(canvasElement);
    const sending = canvas.getByRole('button', { name: 'Sending…' });
    await expect(sending).toBeDisabled();
    await expect(getComputedStyle(sending).cursor).toBe('wait');
    await expect(getComputedStyle(sending).opacity).toBe('1');
  },
};

export const WrongCode: Story = {
  args: { authService: refusesEveryCode },
  play: async ({ canvasElement }) => {
    const canvas = await reachCodeStep(canvasElement);
    const code = await canvas.findByLabelText<HTMLInputElement>('6-digit code');
    await userEvent.type(code, '123456');
    await expect(await canvas.findByRole('alert')).toHaveTextContent('Invalid or expired code');
    await expect(code).toHaveFocus();
    await expect([code.selectionStart, code.selectionEnd]).toEqual([0, 6]);
  },
};

export const EmailMissing: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Send code' }));
    await expect(await canvas.findByRole('alert')).toHaveTextContent('Enter your email.');
    await expect(canvas.getByLabelText('Email')).toHaveFocus();
  },
};

export const CodeIncomplete: Story = {
  play: async ({ canvasElement }) => {
    const canvas = await reachCodeStep(canvasElement);
    await expect(await canvas.findByRole('button', { name: 'Verify and continue' })).toBeEnabled();
    await userEvent.type(canvas.getByLabelText('6-digit code'), '482{Enter}');
    await expect(await canvas.findByRole('alert')).toHaveTextContent(
      'Enter all 6 digits of the code.',
    );
  },
};

export const EmailRefused: Story = {
  args: { authService: refusesEveryEmail },
  play: async ({ canvasElement }) => {
    const canvas = await reachCodeStep(canvasElement);
    await expect(await canvas.findByRole('alert')).toHaveTextContent('Too many attempts');
    await expect(canvas.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
  },
};

export const DarkTheme: Story = {
  args: { sessionExpired: true },
  globals: { theme: 'dark' },
};
