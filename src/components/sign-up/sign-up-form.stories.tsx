import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import type { BillingRedirectOutcome } from '@/domain/accounts';
import { DEMO_SIGN_IN_CODE } from '@/services/auth/mock-auth-service';
import {
  DEMO_TERMS_URL,
  DEMO_TERMS_VERSION,
  MockSignUpService,
} from '@/services/sign-up/mock-sign-up-service';
import { SignUpForm } from './sign-up-form';

const meta = {
  title: 'Sign up/Sign-up form',
  component: SignUpForm,
  tags: ['autodocs'],
  args: {
    terms: { termsVersion: DEMO_TERMS_VERSION, termsUrl: DEMO_TERMS_URL },
    signUpService: new MockSignUpService(),
    openCheckout: (): Promise<BillingRedirectOutcome> => Promise.resolve({ kind: 'unavailable' }),
    demoCode: DEMO_SIGN_IN_CODE,
  },
  parameters: { layout: 'centered', nextjs: { appDirectory: true } },
} satisfies Meta<typeof SignUpForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Details: Story = {};

export const TermsNotAccepted: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox', { name: 'E-mail' }), 'ana@example.com');
    await userEvent.click(canvas.getByRole('button', { name: 'Send code' }));
    await expect(await canvas.findByRole('alert')).toHaveTextContent('Accept the terms');
  },
};

export const Code: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox', { name: 'E-mail' }), 'ana@example.com');
    await userEvent.click(canvas.getByRole('checkbox'));
    await userEvent.click(canvas.getByRole('button', { name: 'Send code' }));
    await expect(await canvas.findByRole('heading', { name: 'Check your e-mail' })).toBeVisible();
  },
};

export const CheckoutDidNotOpen: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox', { name: 'E-mail' }), 'ana@example.com');
    await userEvent.click(canvas.getByRole('checkbox'));
    await userEvent.click(canvas.getByRole('button', { name: 'Send code' }));
    await userEvent.click(await canvas.findByRole('button', { name: `Use ${DEMO_SIGN_IN_CODE}` }));
    await expect(
      await canvas.findByRole('link', { name: 'Open Account and billing' }),
    ).toBeVisible();
  },
};

export const FinishSubscription: Story = {
  args: { unfinishedAccountId: '7d3f9b1e-5a2c-4e8d-9f6b-1c4a7e2d8b5f' },
};

export const InPortuguese: Story = { globals: { locale: 'pt-BR' } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
