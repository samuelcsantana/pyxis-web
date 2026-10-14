import { act, fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { CreateAccessTokenOutcome, NewAccessToken } from '@/domain/access-tokens';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { CREATE_ACCESS_TOKEN_MIN_BUSY_MS, CreateAccessTokenForm } from './create-access-token-form';

const navigation = vi.hoisted(() => ({ router: { replace: vi.fn(), refresh: vi.fn() } }));

vi.mock('next/navigation', () => ({
  useRouter: () => navigation.router,
}));

const TOKEN = `pyxis_at_${'Q'.repeat(32)}`;

function createdOutcome(request: NewAccessToken): CreateAccessTokenOutcome {
  return {
    kind: 'created',
    token: {
      id: '3c9e5a7b-4d6f-4e8a-8b3c-5d7e9f1a3b4c',
      name: request.name,
      token: TOKEN,
      createdAt: '2026-10-14T12:00:00.000Z',
      lastUsedAt: null,
      expiresAt: '2027-10-14T12:00:00.000Z',
    },
  };
}

async function settle(milliseconds: number) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(milliseconds);
  });
}

function nameField() {
  return screen.getByRole('textbox', { name: 'Name' });
}

function submit() {
  fireEvent.click(screen.getByRole('button', { name: 'Create token' }));
}

describe('CreateAccessTokenForm', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    navigation.router.refresh.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('creates a token with the trimmed name and the chosen lifetime, then shows it once', async () => {
    const create = vi.fn((request: NewAccessToken) => Promise.resolve(createdOutcome(request)));
    renderWithMessages(<CreateAccessTokenForm create={create} limitReached={false} />);
    expect(screen.getByRole('combobox', { name: 'Expires in' })).toHaveValue('90');

    fireEvent.change(nameField(), { target: { value: '  Claude Code ' } });
    fireEvent.change(screen.getByRole('combobox', { name: 'Expires in' }), {
      target: { value: '365' },
    });
    submit();

    expect(screen.getByRole('button', { name: 'Creating…' })).toBeDisabled();
    await settle(CREATE_ACCESS_TOKEN_MIN_BUSY_MS);
    expect(create).toHaveBeenCalledWith({ name: 'Claude Code', lifetimeDays: 365 });
    expect(screen.getByRole('group', { name: 'Copy your new token now' })).toHaveTextContent(TOKEN);
    expect(navigation.router.refresh).toHaveBeenCalledOnce();
  });

  it('offers an empty form again once the admin is done with the new token', async () => {
    renderWithMessages(
      <CreateAccessTokenForm
        create={(request) => Promise.resolve(createdOutcome(request))}
        limitReached={false}
      />,
    );
    fireEvent.change(nameField(), { target: { value: 'Cursor' } });
    submit();
    await settle(CREATE_ACCESS_TOKEN_MIN_BUSY_MS);

    fireEvent.click(screen.getByRole('button', { name: 'Done' }));

    expect(nameField()).toHaveValue('');
    expect(screen.queryByText(TOKEN)).not.toBeInTheDocument();
  });

  it.each([
    ['   ', 'Give the token a name, so you can tell it apart later.'],
    ['x'.repeat(65), 'Use at most 64 characters.'],
  ])('refuses the name %j under the field, without calling the API', (name, message) => {
    const create = vi.fn();
    renderWithMessages(<CreateAccessTokenForm create={create} limitReached={false} />);

    fireEvent.change(nameField(), { target: { value: name } });
    submit();

    expect(screen.getByRole('alert')).toHaveTextContent(message);
    expect(nameField()).toHaveAttribute('aria-invalid', 'true');
    expect(nameField()).toHaveAccessibleDescription(message);
    expect(nameField()).toHaveFocus();
    expect(create).not.toHaveBeenCalled();
  });

  it('keeps the lifetime when the select reports a value it does not offer', () => {
    renderWithMessages(
      <CreateAccessTokenForm
        create={() => Promise.resolve({ kind: 'tooMany' })}
        limitReached={false}
      />,
    );
    const lifetime = screen.getByRole('combobox', { name: 'Expires in' });

    fireEvent.change(lifetime, { target: { value: '7' } });

    expect(lifetime).toHaveValue('90');
  });

  it('says the limit was reached when the API refuses an eleventh token', async () => {
    renderWithMessages(
      <CreateAccessTokenForm
        create={() => Promise.resolve({ kind: 'tooMany' })}
        limitReached={false}
      />,
    );
    fireEvent.change(nameField(), { target: { value: 'One more' } });

    submit();
    await settle(CREATE_ACCESS_TOKEN_MIN_BUSY_MS);

    expect(screen.getByRole('status')).toHaveTextContent(
      'You have 10 tokens, the most you can keep. Revoke one to create another.',
    );
    expect(nameField()).toHaveValue('One more');
    expect(navigation.router.refresh).not.toHaveBeenCalled();
  });

  it('says so and keeps the name when creating fails', async () => {
    renderWithMessages(
      <CreateAccessTokenForm
        create={() => Promise.reject(new Error('Pyxis API answered 503'))}
        limitReached={false}
      />,
    );
    fireEvent.change(nameField(), { target: { value: 'Claude Code' } });

    submit();
    await settle(CREATE_ACCESS_TOKEN_MIN_BUSY_MS);

    expect(screen.getByRole('alert')).toHaveTextContent('The token was not created. Try again.');
    expect(nameField()).toHaveValue('Claude Code');
    expect(screen.getByRole('button', { name: 'Create token' })).toBeEnabled();
  });

  it('offers no form once the admin keeps the most tokens allowed', () => {
    renderWithMessages(
      <CreateAccessTokenForm create={() => Promise.resolve({ kind: 'tooMany' })} limitReached />,
    );

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('You have 10 tokens');
  });

  it('does nothing once it is gone', async () => {
    const { unmount } = renderWithMessages(
      <CreateAccessTokenForm
        create={(request) => Promise.resolve(createdOutcome(request))}
        limitReached={false}
      />,
    );
    fireEvent.change(nameField(), { target: { value: 'Claude Code' } });

    submit();
    unmount();
    await settle(CREATE_ACCESS_TOKEN_MIN_BUSY_MS);

    expect(navigation.router.refresh).not.toHaveBeenCalled();
  });

  it('speaks the language of the dashboard', () => {
    renderWithMessages(
      <CreateAccessTokenForm
        create={() => Promise.resolve({ kind: 'tooMany' })}
        limitReached={false}
      />,
      'pt-BR',
    );

    expect(screen.getByRole('button', { name: 'Criar token' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '1 ano' })).toBeInTheDocument();
  });
});
