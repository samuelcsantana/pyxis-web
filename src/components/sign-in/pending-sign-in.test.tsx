import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import {
  bestEffortForgetPendingSignIn,
  bestEffortRememberPendingSignIn,
  PENDING_SIGN_IN_KEY,
  PENDING_SIGN_IN_LIFETIME_MS,
  restoredSignIn,
  type SessionStore,
  useRestoredSignIn,
} from './pending-sign-in';

const SENT_AT = Date.UTC(2026, 9, 11, 12, 0, 0);

function brokenStore(): SessionStore {
  const fail = () => {
    throw new DOMException('The operation is insecure.', 'SecurityError');
  };
  return { getItem: fail, setItem: fail, removeItem: fail };
}

function Probe({ store }: { readonly store?: () => SessionStore }) {
  const restored = useRestoredSignIn(store);
  return <p>{restored === null ? 'nothing' : `${restored.email} ${String(restored.sentAt)}`}</p>;
}

describe('restoredSignIn', () => {
  it('restores the email and the time the code was sent, and when it was read', () => {
    const raw = JSON.stringify({ email: 'ana@example.com', sentAt: SENT_AT });

    expect(restoredSignIn(raw, SENT_AT + 1_000)).toEqual({
      email: 'ana@example.com',
      sentAt: SENT_AT,
      readAt: SENT_AT + 1_000,
    });
  });

  it('restores nothing when nothing was kept', () => {
    expect(restoredSignIn(null, SENT_AT)).toBeNull();
  });

  it('restores nothing once the code has expired', () => {
    const raw = JSON.stringify({ email: 'ana@example.com', sentAt: SENT_AT });

    expect(restoredSignIn(raw, SENT_AT + PENDING_SIGN_IN_LIFETIME_MS)).toBeNull();
  });

  it.each([
    ['not an object', '42'],
    ['null', 'null'],
    ['without an email', JSON.stringify({ sentAt: SENT_AT })],
    ['with an empty email', JSON.stringify({ email: '', sentAt: SENT_AT })],
    ['without a time', JSON.stringify({ email: 'ana@example.com' })],
    ['with a time that is not a number', JSON.stringify({ email: 'a@b.co', sentAt: 'soon' })],
    ['with an endless time', '{"email":"a@b.co","sentAt":1e999}'],
  ])('restores nothing from a value %s', (_, raw) => {
    expect(restoredSignIn(raw, SENT_AT)).toBeNull();
  });

  it('restores nothing from broken JSON, and says so in the console', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    expect(restoredSignIn('{broken', SENT_AT)).toBeNull();
    expect(warn).toHaveBeenCalledWith(
      'sign-in: could not parse the pending sign-in in this tab',
      expect.any(SyntaxError),
    );
  });
});

describe('remembering and forgetting', () => {
  it('keeps the pending sign-in in this tab and forgets it', () => {
    bestEffortRememberPendingSignIn({ email: 'ana@example.com', sentAt: SENT_AT });

    expect(JSON.parse(window.sessionStorage.getItem(PENDING_SIGN_IN_KEY) ?? '')).toEqual({
      email: 'ana@example.com',
      sentAt: SENT_AT,
    });

    bestEffortForgetPendingSignIn();

    expect(window.sessionStorage.getItem(PENDING_SIGN_IN_KEY)).toBeNull();
  });

  it('carries on when the browser refuses the storage, and says so in the console', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    bestEffortRememberPendingSignIn({ email: 'ana@example.com', sentAt: SENT_AT }, brokenStore);
    bestEffortForgetPendingSignIn(brokenStore);

    expect(warn.mock.calls.map(([message]: unknown[]) => message)).toEqual([
      'sign-in: could not remember the pending sign-in in this tab',
      'sign-in: could not forget the pending sign-in in this tab',
    ]);
  });
});

describe('useRestoredSignIn', () => {
  it('reads the pending sign-in of this tab', () => {
    window.sessionStorage.setItem(
      PENDING_SIGN_IN_KEY,
      JSON.stringify({ email: 'ana@example.com', sentAt: Date.now() }),
    );

    render(<Probe />);

    expect(screen.getByText(/^ana@example\.com \d+$/)).toBeInTheDocument();
  });

  it('gives the same answer while the kept value does not change', () => {
    window.sessionStorage.setItem(
      PENDING_SIGN_IN_KEY,
      JSON.stringify({ email: 'ana@example.com', sentAt: Date.now() }),
    );
    const { rerender } = render(<Probe />);
    const first = screen.getByText(/ana@example\.com/).textContent;

    rerender(<Probe />);

    expect(screen.getByText(/ana@example\.com/).textContent).toBe(first);
  });

  it('reads nothing on the server, where no tab exists', () => {
    window.sessionStorage.setItem(
      PENDING_SIGN_IN_KEY,
      JSON.stringify({ email: 'ana@example.com', sentAt: Date.now() }),
    );

    expect(renderToString(<Probe />)).toContain('nothing');
  });

  it('lets go of the storage when it unmounts', () => {
    const { unmount } = render(<Probe />);

    unmount();

    expect(screen.queryByText('nothing')).not.toBeInTheDocument();
  });

  it('reads nothing when the browser refuses the storage, and says so in the console', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    render(<Probe store={brokenStore} />);

    expect(screen.getByText('nothing')).toBeInTheDocument();
    expect(warn).toHaveBeenCalledWith(
      'sign-in: could not read the pending sign-in in this tab',
      expect.any(DOMException),
    );
  });
});
