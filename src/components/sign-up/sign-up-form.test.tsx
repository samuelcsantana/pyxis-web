import { act, fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { BillingInterval, BillingRedirectOutcome } from '@/domain/accounts';
import { RateLimitedError } from '@/domain/errors';
import type { ISignUpService } from '@/services/sign-up/sign-up-service.interface';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import {
  SIGN_UP_BUSY_MS,
  SIGN_UP_RESEND_WAIT_MS,
  SIGN_UP_RESENT_NOTICE_MS,
  SignUpForm,
} from './sign-up-form';

const navigation = vi.hoisted(() => ({ router: { refresh: vi.fn(), replace: vi.fn() } }));

vi.mock('next/navigation', () => ({
  useRouter: () => navigation.router,
}));

const ACCOUNT = '7d3f9b1e-5a2c-4e8d-9f6b-1c4a7e2d8b5f';
const TERMS = {
  termsVersion: '2026-11-01',
  termsUrl: 'https://pyxis.example.com/terms',
  freePlan: 'closed',
} as const;
const UNFINISHED = '9a8b7c6d-5e4f-4a3b-8c2d-1e0f9a8b7c6d';

const calls = {
  requestCode: vi.fn<ISignUpService['requestCode']>(),
  verify: vi.fn<ISignUpService['verify']>(),
};

function service(overrides: Partial<ISignUpService> = {}): ISignUpService {
  calls.requestCode.mockReset().mockResolvedValue(undefined);
  calls.verify.mockReset().mockResolvedValue({
    kind: 'verified',
    accountId: ACCOUNT,
    accountStatus: 'incomplete',
  });
  return {
    status: () => Promise.reject(new Error('status is read by the page')),
    requestCode: calls.requestCode,
    verify: calls.verify,
    ...overrides,
  };
}

type OpenCheckout = (
  accountId: string,
  interval: BillingInterval,
) => Promise<BillingRedirectOutcome>;

function renderForm(
  signUpService: ISignUpService,
  openCheckout: OpenCheckout = () =>
    Promise.resolve({ kind: 'redirect', url: 'https://checkout.stripe.com/c/x' }),
  demoCode?: string,
) {
  return renderWithMessages(
    <SignUpForm
      terms={TERMS}
      signUpService={signUpService}
      openCheckout={openCheckout}
      demoCode={demoCode}
    />,
  );
}

async function settle(milliseconds = SIGN_UP_BUSY_MS) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(milliseconds);
  });
}

function emailField() {
  return screen.getByRole('textbox', { name: 'E-mail' });
}

function terms() {
  return screen.getByRole('checkbox', { name: /I have read and accept/ });
}

async function reachTheCode(email = 'ana@example.com') {
  fireEvent.change(emailField(), { target: { value: email } });
  fireEvent.click(terms());
  fireEvent.click(screen.getByRole('button', { name: 'Send code' }));
  await settle();
}

function typeCode(value: string) {
  fireEvent.change(screen.getByRole('textbox', { name: '6-digit code' }), {
    target: { value },
  });
}

describe('SignUpForm', () => {
  const assign = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    navigation.router.refresh.mockClear();
    navigation.router.replace.mockClear();
    assign.mockClear();
    vi.stubGlobal('location', { assign });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('signs up with the plan chosen, then goes to Checkout', async () => {
    const signUp = service();
    const openCheckout = vi.fn<OpenCheckout>(() =>
      Promise.resolve({ kind: 'redirect', url: 'https://checkout.stripe.com/c/x' }),
    );
    renderForm(signUp, openCheckout);

    expect(screen.getByText(/14 days free/)).toBeInTheDocument();
    expect(screen.getByText('One free trial per customer.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Terms of Use/ })).toHaveAttribute(
      'href',
      TERMS.termsUrl,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Yearly' }));
    await reachTheCode(' ana@example.com ');

    expect(calls.requestCode).toHaveBeenCalledWith('ana@example.com', 'en');
    expect(screen.getByRole('heading', { name: 'Check your e-mail' })).toBeInTheDocument();
    typeCode('123456');
    await settle();

    expect(calls.verify).toHaveBeenCalledWith('ana@example.com', '123456', '2026-11-01');
    expect(openCheckout).toHaveBeenCalledWith(ACCOUNT, 'year');
    expect(assign).toHaveBeenCalledWith('https://checkout.stripe.com/c/x');
    expect(screen.getByRole('status')).toHaveTextContent('Preparing the payment…');
  });

  it('starts a new owner on the free plan with no card, then welcomes them', async () => {
    const signUp = service();
    calls.verify.mockResolvedValue({ kind: 'verified', accountId: ACCOUNT, accountStatus: 'free' });
    const openCheckout = vi.fn<OpenCheckout>();
    renderWithMessages(
      <SignUpForm
        terms={{ ...TERMS, freePlan: 'open' }}
        signUpService={signUp}
        openCheckout={openCheckout}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Create your free account' })).toBeInTheDocument();
    expect(
      screen.getByText('Free: up to 10,000 events a month, on one site. No card.'),
    ).toBeInTheDocument();
    expect(screen.queryByText('One free trial per customer.')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Yearly' })).not.toBeInTheDocument();
    await reachTheCode();
    typeCode('123456');
    await settle();

    expect(openCheckout).not.toHaveBeenCalled();
    expect(screen.getByRole('status')).toHaveTextContent('Opening your account…');
    expect(navigation.router.replace).toHaveBeenCalledWith(`/welcome?account=${ACCOUNT}`);
    expect(navigation.router.refresh).toHaveBeenCalledOnce();
  });

  it('writes the free plan in the numbers of the page language', () => {
    renderWithMessages(
      <SignUpForm
        terms={{ ...TERMS, freePlan: 'open' }}
        signUpService={service()}
        openCheckout={vi.fn()}
      />,
      'pt-BR',
    );

    expect(
      screen.getByText('Grátis: até 10.000 eventos por mês, em um site. Sem cartão.'),
    ).toBeInTheDocument();
  });

  it('offers to wait for a free place, or subscribe now, when the free plan is full', async () => {
    const signUp = service();
    const openCheckout = vi.fn<OpenCheckout>(() =>
      Promise.resolve({ kind: 'redirect', url: 'https://checkout.stripe.com/c/now' }),
    );
    renderWithMessages(
      <SignUpForm
        terms={{ ...TERMS, freePlan: 'full' }}
        signUpService={signUp}
        openCheckout={openCheckout}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Create your account' })).toBeInTheDocument();
    expect(screen.getByText(/The free plan is full for now\. Create your account/)).toBeVisible();
    expect(screen.queryByText(/free trial/)).not.toBeInTheDocument();
    await reachTheCode();
    typeCode('123456');
    await settle();

    expect(openCheckout).not.toHaveBeenCalled();
    expect(
      screen.getByRole('heading', { name: 'The free plan is full for now' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/it waits up to 60 days/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Yearly' }));
    fireEvent.click(screen.getByRole('button', { name: 'Subscribe now' }));
    await settle();

    expect(openCheckout).toHaveBeenCalledWith(ACCOUNT, 'year');
    expect(assign).toHaveBeenCalledWith('https://checkout.stripe.com/c/now');
  });

  it('sends a returning owner whose account already runs to the dashboard, not to Checkout', async () => {
    const signUp = service();
    calls.verify.mockResolvedValue({
      kind: 'verified',
      accountId: ACCOUNT,
      accountStatus: 'active',
    });
    const openCheckout = vi.fn<OpenCheckout>();
    renderForm(signUp, openCheckout);
    await reachTheCode();
    typeCode('123456');
    await settle();

    expect(openCheckout).not.toHaveBeenCalled();
    expect(navigation.router.replace).toHaveBeenCalledWith('/');
    expect(navigation.router.refresh).toHaveBeenCalledOnce();
  });

  it.each([
    ['', 'Enter your email.'],
    ['ana@', 'Enter a full email address'],
  ])('refuses the address %j before sending anything', (value, text) => {
    const signUp = service();
    renderForm(signUp);

    fireEvent.change(emailField(), { target: { value } });
    fireEvent.click(screen.getByRole('button', { name: 'Send code' }));

    expect(calls.requestCode).not.toHaveBeenCalled();
    expect(emailField()).toHaveAccessibleDescription(expect.stringContaining(text) as string);
  });

  it('asks for the terms to be accepted before sending anything', () => {
    const signUp = service();
    renderForm(signUp);

    fireEvent.change(emailField(), { target: { value: 'ana@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send code' }));

    expect(calls.requestCode).not.toHaveBeenCalled();
    expect(terms()).toHaveAccessibleDescription('Accept the terms to continue.');
    fireEvent.click(terms());
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it.each([
    [new RateLimitedError(), 'Too many attempts from this address.'],
    [new Error('offline'), 'Pyxis could not be reached.'],
  ])('explains a code that could not be sent: %s', async (failure, text) => {
    renderForm(service({ requestCode: () => Promise.reject(failure) }));

    await reachTheCode();

    expect(screen.getByRole('alert')).toHaveTextContent(text);
    expect(screen.getByRole('heading', { name: 'Start your free trial' })).toBeInTheDocument();
  });

  it('says a wrong code is wrong and keeps the code step', async () => {
    renderForm(service({ verify: () => Promise.resolve({ kind: 'invalidCode' }) }));
    await reachTheCode();

    typeCode('123456');
    await settle();

    expect(screen.getByRole('alert')).toHaveTextContent('This code is wrong or expired.');
    typeCode('12345');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it.each([
    ['termsOutdated', 'The terms changed while this page was open.'],
    ['closed', 'Sign-up closed while this page was open.'],
  ] as const)(
    'goes back to the details on %s, unchecks the terms and reloads them',
    async (kind, text) => {
      renderForm(service({ verify: () => Promise.resolve({ kind }) }));
      await reachTheCode();

      typeCode('123456');
      await settle();

      expect(screen.getByRole('alert')).toHaveTextContent(text);
      expect(terms()).not.toBeChecked();
      expect(navigation.router.refresh).toHaveBeenCalledOnce();
    },
  );

  it('explains a code that could not be checked', async () => {
    renderForm(service({ verify: () => Promise.reject(new RateLimitedError()) }));
    await reachTheCode();

    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByRole('textbox', { name: '6-digit code' })).toHaveFocus();
    typeCode('123456');
    fireEvent.submit(screen.getByRole('button', { name: 'Checking…' }));
    await settle();

    expect(screen.getByRole('alert')).toHaveTextContent('Too many attempts');
  });

  it.each([
    ['a refusal', () => Promise.resolve<BillingRedirectOutcome>({ kind: 'unavailable' })],
    ['a failure', () => Promise.reject(new Error('503'))],
  ])('sends the new account to Account and billing after %s of Checkout', async (_, open) => {
    renderForm(service(), open);
    await reachTheCode();

    typeCode('123456');
    await settle();

    expect(screen.getByRole('alert')).toHaveTextContent('Your account is ready');
    expect(screen.getByRole('link', { name: 'Open Account and billing' })).toHaveAttribute(
      'href',
      '/account',
    );
  });

  it('waits before sending a new code, then says it is on its way', async () => {
    const signUp = service();
    renderForm(signUp);
    await reachTheCode();

    expect(screen.getByRole('button', { name: 'Send a new code in 0:30' })).toBeDisabled();
    await settle(SIGN_UP_RESEND_WAIT_MS);
    fireEvent.click(screen.getByRole('button', { name: 'Send a new code' }));
    await settle();

    expect(calls.requestCode).toHaveBeenCalledTimes(2);
    expect(screen.getByText('A new code is on its way.')).toBeInTheDocument();
    await settle(SIGN_UP_RESENT_NOTICE_MS);
    expect(screen.queryByText('A new code is on its way.')).not.toBeInTheDocument();
  });

  it('goes back to change the address', async () => {
    renderForm(service());
    await reachTheCode();

    fireEvent.click(screen.getByRole('button', { name: 'Change the e-mail' }));

    expect(emailField()).toHaveValue('ana@example.com');
    expect(emailField()).toHaveFocus();
  });

  it('uses the sign-up service of the environment when given none', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
    renderWithMessages(
      <SignUpForm terms={TERMS} openCheckout={() => Promise.resolve({ kind: 'unavailable' })} />,
    );

    await reachTheCode();

    expect(screen.getByRole('heading', { name: 'Check your e-mail' })).toBeInTheDocument();
    vi.unstubAllEnvs();
  });

  it('offers an owner whose sign-up is unfinished to finish the subscription', async () => {
    const openCheckout = vi.fn<OpenCheckout>(() =>
      Promise.resolve({ kind: 'redirect', url: 'https://checkout.stripe.com/c/again' }),
    );
    renderWithMessages(
      <SignUpForm
        terms={null}
        unfinishedAccountId={UNFINISHED}
        signUpService={service()}
        openCheckout={openCheckout}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Finish your subscription' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Finish subscription' }));
    await settle();

    expect(openCheckout).toHaveBeenCalledWith(UNFINISHED, 'month');
    expect(assign).toHaveBeenCalledWith('https://checkout.stripe.com/c/again');
  });

  it('offers an owner who waits for a free place to subscribe now, on a later visit', async () => {
    const openCheckout = vi.fn<OpenCheckout>(() =>
      Promise.resolve({ kind: 'redirect', url: 'https://checkout.stripe.com/c/later' }),
    );
    renderWithMessages(
      <SignUpForm
        terms={{ ...TERMS, freePlan: 'full' }}
        unfinishedAccountId={UNFINISHED}
        unfinishedWaitsForAFreePlace
        signUpService={service()}
        openCheckout={openCheckout}
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'The free plan is full for now' }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/free trial/)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Subscribe now' }));
    await settle();

    expect(openCheckout).toHaveBeenCalledWith(UNFINISHED, 'month');
    expect(assign).toHaveBeenCalledWith('https://checkout.stripe.com/c/later');
  });

  it('keeps its Checkout going when the page learns of the new account', async () => {
    const openCheckout = vi.fn<OpenCheckout>(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({ kind: 'redirect', url: 'https://checkout.stripe.com/c/x' });
          }, 1_000);
        }),
    );
    const signUp = service();
    const { rerender } = renderForm(signUp, openCheckout);
    await reachTheCode();
    typeCode('123456');
    await settle(16);

    rerender(
      <SignUpForm
        terms={TERMS}
        unfinishedAccountId={ACCOUNT}
        signUpService={signUp}
        openCheckout={openCheckout}
      />,
    );
    await settle(1_000);

    expect(
      screen.queryByRole('heading', { name: 'Finish your subscription' }),
    ).not.toBeInTheDocument();
    expect(assign).toHaveBeenCalledWith('https://checkout.stripe.com/c/x');
  });

  it('shows nothing when sign-up is closed and nothing is unfinished', () => {
    const { container } = renderWithMessages(
      <SignUpForm terms={null} signUpService={service()} openCheckout={vi.fn()} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('fills the demo code', async () => {
    const signUp = service();
    renderForm(signUp, undefined, '000000');
    await reachTheCode();

    expect(screen.getByText(/This is the demo: the code is/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Use 000000' }));
    await settle();

    expect(calls.verify).toHaveBeenCalledWith('ana@example.com', '000000', '2026-11-01');
  });
});
