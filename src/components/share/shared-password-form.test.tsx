import { fireEvent, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { SharedPasswordForm, type SharedPasswordFormProps } from './shared-password-form';

const TOKEN = `pyxis_sh_${'P'.repeat(32)}`;
const API = 'https://api.example.com';
const UNLOCK = `pyxis_su_${'U'.repeat(32)}`;

function answering(response: () => Promise<Response>) {
  const fetch = vi.fn<typeof window.fetch>(response);
  vi.stubGlobal('fetch', fetch);
  return fetch;
}

function renderForm(overrides: Partial<SharedPasswordFormProps> = {}) {
  const props: SharedPasswordFormProps = {
    token: TOKEN,
    apiBase: API,
    demoPassword: null,
    onUnlocked: vi.fn(),
    onClosed: vi.fn(),
    ...overrides,
  };
  return { props, view: renderWithMessages(<SharedPasswordForm {...props} />) };
}

function typeAndOpen(password = 'open sesame') {
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: password } });
  fireEvent.click(screen.getByRole('button', { name: 'Open the report' }));
}

describe('SharedPasswordForm', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    window.sessionStorage.clear();
  });

  it('asks for the password with the field focused, naming no project', () => {
    renderForm();

    expect(screen.getByRole('heading', { name: 'This report asks for a password' })).toBeVisible();
    expect(screen.getByLabelText('Password')).toHaveFocus();
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
  });

  it('posts the password exactly as typed, without cookies, and keeps the unlock for this tab', async () => {
    const fetch = answering(() =>
      Promise.resolve(Response.json({ unlock: UNLOCK, expires_at: '2026-11-06T02:00:00Z' })),
    );
    const { props } = renderForm();

    typeAndOpen(' open sesame ');

    expect(screen.getByRole('button', { name: 'Opening…' })).toHaveAttribute('aria-busy', 'true');
    await waitFor(() => {
      expect(props.onUnlocked).toHaveBeenCalledOnce();
    });
    expect(fetch).toHaveBeenCalledWith(`${API}/v1/shared/${TOKEN}/unlock`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{"password":" open sesame "}',
      credentials: 'omit',
      cache: 'no-store',
    });
    expect(window.sessionStorage.getItem(`pyxis.share-unlock.${TOKEN}`)).toBe(UNLOCK);
    expect(window.localStorage.length).toBe(0);
  });

  it.each([401, 400])(
    'says the password is wrong on a %i, keeping what was typed',
    async (status) => {
      answering(() => Promise.resolve(new Response(null, { status })));
      renderForm();

      typeAndOpen('not the one');

      expect(await screen.findByRole('alert')).toHaveTextContent(
        'Wrong password. Check it and try again.',
      );
      expect(screen.getByLabelText('Password')).toHaveValue('not the one');
      expect(screen.getByLabelText('Password')).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getByLabelText('Password')).toHaveFocus();
    },
  );

  it.each([
    ['540', 'Too many attempts. Try again in 9 minutes.'],
    ['60', 'Too many attempts. Try again in 1 minute.'],
    ['61', 'Too many attempts. Try again in 2 minutes.'],
    [null, 'Too many attempts. Try again in 1 minute.'],
    ['soon', 'Too many attempts. Try again in 1 minute.'],
  ])('reads Retry-After %s as minutes to wait', async (retryAfter, text) => {
    const headers: Record<string, string> =
      retryAfter === null ? {} : { 'retry-after': retryAfter };
    answering(() => Promise.resolve(new Response(null, { status: 429, headers })));
    renderForm();

    typeAndOpen();

    expect(await screen.findByRole('alert')).toHaveTextContent(text);
    expect(screen.getByLabelText('Password')).toHaveAttribute('aria-invalid', 'false');
  });

  it('shows the closed page when the link no longer opens', async () => {
    answering(() => Promise.resolve(new Response(null, { status: 404 })));
    const { props } = renderForm();

    typeAndOpen();

    await waitFor(() => {
      expect(props.onClosed).toHaveBeenCalledOnce();
    });
  });

  it('reads the reports again when the owner removed the password meanwhile', async () => {
    answering(() => Promise.resolve(new Response(null, { status: 409 })));
    const { props } = renderForm();

    typeAndOpen();

    await waitFor(() => {
      expect(props.onUnlocked).toHaveBeenCalledOnce();
    });
    expect(window.sessionStorage.length).toBe(0);
  });

  it.each([
    ['the API fails', () => Promise.resolve(new Response(null, { status: 500 }))],
    ['the network fails', () => Promise.reject(new TypeError('Failed to fetch'))],
    ['the answer has no unlock', () => Promise.resolve(Response.json({ unlock: 42 }))],
    ['the answer is not an object', () => Promise.resolve(Response.json('unlocked'))],
  ])('says the report could not be loaded when %s', async (_, answer) => {
    answering(answer);
    const { props } = renderForm();

    typeAndOpen();

    expect(await screen.findByRole('alert')).toHaveTextContent('The report could not be loaded.');
    expect(props.onUnlocked).not.toHaveBeenCalled();
  });

  it.each([
    ['an answer', () => Promise.resolve(new Response(null, { status: 401 }))],
    ['a failure', () => Promise.reject(new TypeError('Failed to fetch'))],
  ])('ignores %s that arrives after it went away', async (_, answer) => {
    let settle: () => void = () => undefined;
    const arrived = new Promise<void>((resolve) => {
      settle = resolve;
    });
    answering(() => arrived.then(answer));
    const { props, view } = renderForm();
    typeAndOpen();

    view.unmount();
    settle();
    await arrived;

    expect(props.onUnlocked).not.toHaveBeenCalled();
  });

  it('shows the demo password in the demo', () => {
    renderForm({ demoPassword: 'pyxis-demo' });

    expect(screen.getByText('In this demo, the password is pyxis-demo.')).toBeVisible();
  });

  it('speaks Portuguese', () => {
    renderWithMessages(
      <SharedPasswordForm
        token={TOKEN}
        apiBase={API}
        demoPassword={null}
        onUnlocked={vi.fn()}
        onClosed={vi.fn()}
      />,
      'pt-BR',
    );

    expect(screen.getByRole('heading', { name: 'Este relatório pede uma senha' })).toBeVisible();
  });
});
