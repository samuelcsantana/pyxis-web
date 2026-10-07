import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { InvalidCodeError, RateLimitedError } from '@/domain/errors';
import type { IAuthService } from '@/services/auth/auth-service.interface';
import { DEMO_SIGN_IN_CODE, MockAuthService } from '@/services/auth/mock-auth-service';
import { SignInForm } from './sign-in-form';

const neverAnswers: IAuthService = {
  requestCode: () => new Promise<void>(() => undefined),
  verifyCode: () => new Promise<void>(() => undefined),
  signOut: () => new Promise<void>(() => undefined),
};

const refusesEveryCode: IAuthService = {
  requestCode: () => Promise.resolve(),
  verifyCode: () => Promise.reject(new InvalidCodeError()),
  signOut: () => Promise.resolve(),
};

const refusesEveryEmail: IAuthService = {
  requestCode: () => Promise.reject(new RateLimitedError()),
  verifyCode: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
};

const meta = {
  title: 'Sign in/SignInForm',
  component: SignInForm,
  tags: ['autodocs'],
  args: { authService: new MockAuthService() },
  parameters: { layout: 'centered', nextjs: { appDirectory: true } },
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
    await expect(await canvas.findByLabelText('6-digit code')).toBeVisible();
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
    await userEvent.type(await canvas.findByLabelText('6-digit code'), '123456');
    await userEvent.click(await canvas.findByRole('button', { name: 'Verify and continue' }));
    await expect(await canvas.findByRole('alert')).toHaveTextContent('Invalid or expired code');
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
