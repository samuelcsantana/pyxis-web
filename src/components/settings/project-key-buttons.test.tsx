import { act, fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { CreateProjectKeyOutcome, RevokeProjectKeyOutcome } from '@/domain/project-management';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import {
  CREATE_PROJECT_KEY_MIN_BUSY_MS,
  CreateProjectKeyButton,
} from './create-project-key-button';
import {
  REVOKE_PROJECT_KEY_MIN_BUSY_MS,
  RevokeProjectKeyButton,
} from './revoke-project-key-button';

const navigation = vi.hoisted(() => ({ router: { refresh: vi.fn() } }));

vi.mock('next/navigation', () => ({
  useRouter: () => navigation.router,
}));

const SECRET = `pyxis_sk_${'S'.repeat(32)}`;
const KEY_ID = '4d0f6b8c-5e7a-4f9b-8c4d-6e8f0a2b4c5d';

async function settle(milliseconds: number) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(milliseconds);
  });
}

describe('CreateProjectKeyButton', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    navigation.router.refresh.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows a new secret key once, focused, until the owner is done with it', async () => {
    const create = vi.fn(() =>
      Promise.resolve<CreateProjectKeyOutcome>({
        kind: 'created',
        key: { id: KEY_ID, kind: 'secret', key: SECRET },
      }),
    );
    renderWithMessages(<CreateProjectKeyButton kind="secret" create={create} />);

    fireEvent.click(screen.getByRole('button', { name: 'New secret key' }));
    expect(screen.getByRole('button', { name: 'Creating…' })).toBeDisabled();
    await settle(CREATE_PROJECT_KEY_MIN_BUSY_MS);

    expect(create).toHaveBeenCalledWith('secret');
    const reveal = screen.getByRole('group', { name: 'Copy the secret key now' });
    expect(reveal).toHaveTextContent(SECRET);
    expect(screen.getByRole('heading', { name: 'Copy the secret key now' })).toHaveFocus();
    expect(navigation.router.refresh).toHaveBeenCalledOnce();

    fireEvent.click(screen.getByRole('button', { name: 'Done' }));
    expect(screen.queryByText(SECRET)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'New secret key' })).toBeInTheDocument();
  });

  it('says a new public key was created, since the list shows it', async () => {
    renderWithMessages(
      <CreateProjectKeyButton
        kind="public"
        create={() =>
          Promise.resolve({
            kind: 'created',
            key: { id: KEY_ID, kind: 'public', key: 'pyxis_pk_x' },
          })
        }
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'New public key' }));
    await settle(CREATE_PROJECT_KEY_MIN_BUSY_MS);

    expect(screen.getByRole('status')).toHaveTextContent('Public key created.');
    expect(navigation.router.refresh).toHaveBeenCalledOnce();
  });

  it.each([
    ['tooMany', 'This project has 5 live keys of this kind'],
    ['subscriptionRequired', 'This account has no running subscription'],
  ] as const)('explains a %s refusal', async (kind, message) => {
    renderWithMessages(
      <CreateProjectKeyButton kind="public" create={() => Promise.resolve({ kind })} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'New public key' }));
    await settle(CREATE_PROJECT_KEY_MIN_BUSY_MS);

    expect(screen.getByRole('alert')).toHaveTextContent(message);
    expect(navigation.router.refresh).not.toHaveBeenCalled();
  });

  it('says it did not work when the call fails', async () => {
    renderWithMessages(
      <CreateProjectKeyButton kind="secret" create={() => Promise.reject(new Error('503'))} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'New secret key' }));
    await settle(CREATE_PROJECT_KEY_MIN_BUSY_MS);

    expect(screen.getByRole('alert')).toHaveTextContent('That did not work. Try again.');
  });
});

describe('RevokeProjectKeyButton', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    navigation.router.refresh.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function renderButton(revoke: (keyId: string) => Promise<RevokeProjectKeyOutcome>) {
    return renderWithMessages(
      <div>
        <span id="key-label">pyxis_pk_x</span>
        <RevokeProjectKeyButton keyId={KEY_ID} describedBy="key-label" revoke={revoke} />
      </div>,
    );
  }

  it('revokes the key it names, then refreshes the page', async () => {
    const revoke = vi.fn(() => Promise.resolve<RevokeProjectKeyOutcome>({ kind: 'revoked' }));
    renderButton(revoke);

    fireEvent.click(screen.getByRole('button', { name: 'Revoke', description: 'pyxis_pk_x' }));
    expect(screen.getByRole('button', { name: 'Revoking…' })).toBeDisabled();
    await settle(REVOKE_PROJECT_KEY_MIN_BUSY_MS);

    expect(revoke).toHaveBeenCalledWith(KEY_ID);
    expect(screen.getByRole('status')).toHaveTextContent('Key revoked');
    expect(navigation.router.refresh).toHaveBeenCalledOnce();
  });

  it.each([
    ['lastPublicKey', 'The last public key stays'],
    ['subscriptionRequired', 'This account has no running subscription'],
  ] as const)('explains a %s refusal and keeps the button', async (kind, message) => {
    renderButton(() => Promise.resolve({ kind }));

    fireEvent.click(screen.getByRole('button', { name: 'Revoke' }));
    await settle(REVOKE_PROJECT_KEY_MIN_BUSY_MS);

    expect(screen.getByRole('alert')).toHaveTextContent(message);
    expect(screen.getByRole('button', { name: 'Revoke' })).toBeEnabled();
  });

  it('says it did not work when the call fails', async () => {
    renderButton(() => Promise.reject(new Error('503')));

    fireEvent.click(screen.getByRole('button', { name: 'Revoke' }));
    await settle(REVOKE_PROJECT_KEY_MIN_BUSY_MS);

    expect(screen.getByRole('alert')).toHaveTextContent('That did not work. Try again.');
  });
});
