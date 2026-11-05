import { act, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { CreateShareLinkOutcome, NewShareLink } from '@/domain/share-links';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { CREATE_SHARE_LINK_MIN_BUSY_MS, CreateShareLinkForm } from './create-share-link-form';

const navigation = vi.hoisted(() => ({ router: { replace: vi.fn(), refresh: vi.fn() } }));

vi.mock('next/navigation', () => ({
  useRouter: () => navigation.router,
}));

const TOKEN = `pyxis_sh_${'Q'.repeat(32)}`;
const onCreated = vi.fn();

function createdOutcome(link: NewShareLink): CreateShareLinkOutcome {
  return {
    kind: 'created',
    link: {
      id: '6f2b8d0e-7a9c-4b1d-8e6f-8a0b2c4d6e7f',
      name: link.name,
      createdAt: '2026-11-05T12:00:00.000Z',
      expiresAt: null,
      token: TOKEN,
    },
  };
}

async function settle(milliseconds: number) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(milliseconds);
  });
}

function nameField() {
  return screen.getByRole('textbox', { name: 'Who it is for' });
}

function submit() {
  fireEvent.click(screen.getByRole('button', { name: 'Create link' }));
}

describe('CreateShareLinkForm', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    navigation.router.refresh.mockClear();
    onCreated.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('creates a link with the trimmed name and the chosen expiry, then shows its address once', async () => {
    const create = vi.fn((link: NewShareLink) => Promise.resolve(createdOutcome(link)));
    renderWithMessages(
      <CreateShareLinkForm create={create} limitReached={false} onCreated={onCreated} />,
    );
    const expiry = screen.getByRole('combobox', { name: 'Expires' });
    expect(expiry).toHaveValue('never');

    fireEvent.change(nameField(), { target: { value: '  Board ' } });
    fireEvent.change(expiry, { target: { value: '90' } });
    fireEvent.change(expiry, { target: { value: 'forged' } });
    expect(expiry).toHaveValue('90');
    submit();

    expect(screen.getByRole('button', { name: 'Creating…' })).toBeDisabled();
    await settle(CREATE_SHARE_LINK_MIN_BUSY_MS);
    expect(create).toHaveBeenCalledWith({ name: 'Board', expiry: 90 });
    expect(onCreated).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Board', token: TOKEN }),
    );
    const reveal = screen.getByRole('group', { name: 'Copy the link now' });
    expect(reveal).toHaveTextContent(`${window.location.origin}/share/${TOKEN}`);
    expect(reveal).toHaveTextContent('This is the only time the link is shown');
    expect(screen.getByRole('heading', { name: 'Copy the link now' })).toHaveFocus();
    expect(navigation.router.refresh).toHaveBeenCalledOnce();
  });

  it('copies the address and goes back to the form when done', async () => {
    const writeText = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    vi.useFakeTimers({ shouldAdvanceTime: true });
    renderWithMessages(
      <CreateShareLinkForm
        create={(link) => Promise.resolve(createdOutcome(link))}
        limitReached={false}
        onCreated={onCreated}
      />,
    );
    fireEvent.change(nameField(), { target: { value: 'Board' } });
    submit();
    await settle(CREATE_SHARE_LINK_MIN_BUSY_MS);

    await userEvent.click(screen.getByRole('button', { name: 'Copy' }));
    expect(writeText).toHaveBeenCalledWith(`${window.location.origin}/share/${TOKEN}`);
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Done' }));
    expect(nameField()).toHaveValue('');
  });

  it.each([
    ['', 'Give the link a name.'],
    ['x'.repeat(65), 'Use at most 64 characters.'],
  ])('refuses the name %j under its field and sends nothing', (name, message) => {
    const create = vi.fn();
    renderWithMessages(
      <CreateShareLinkForm create={create} limitReached={false} onCreated={onCreated} />,
    );

    fireEvent.change(nameField(), { target: { value: name } });
    submit();

    expect(screen.getByRole('alert')).toHaveTextContent(message);
    expect(nameField()).toHaveFocus();
    expect(nameField()).toHaveAttribute('aria-invalid', 'true');
    expect(create).not.toHaveBeenCalled();
  });

  it.each([
    [{ kind: 'planRequired' } as const, 'Public links need the Pro plan.'],
    [{ kind: 'limitReached' } as const, 'This project has 10 links, the most it can have.'],
  ])('explains a %j refusal', async (outcome, message) => {
    renderWithMessages(
      <CreateShareLinkForm
        create={() => Promise.resolve(outcome)}
        limitReached={false}
        onCreated={onCreated}
      />,
    );

    fireEvent.change(nameField(), { target: { value: 'Board' } });
    submit();
    await settle(CREATE_SHARE_LINK_MIN_BUSY_MS);

    expect(screen.getByText(new RegExp(message.replace('.', '\\.')))).toBeInTheDocument();
    expect(navigation.router.refresh).not.toHaveBeenCalled();
  });

  it('says the link was not created when the call fails', async () => {
    renderWithMessages(
      <CreateShareLinkForm
        create={() => Promise.reject(new Error('503'))}
        limitReached={false}
        onCreated={onCreated}
      />,
    );

    fireEvent.change(nameField(), { target: { value: 'Board' } });
    submit();
    await settle(CREATE_SHARE_LINK_MIN_BUSY_MS);

    expect(screen.getByRole('alert')).toHaveTextContent('The link was not created. Try again.');
  });

  it('offers no new link once the project has ten', () => {
    renderWithMessages(<CreateShareLinkForm create={vi.fn()} limitReached onCreated={onCreated} />);

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(
      'This project has 10 links, the most it can have. Revoke one to create another.',
    );
  });

  it('stops a creation still running when it goes away', async () => {
    const create = vi.fn(
      () =>
        new Promise<CreateShareLinkOutcome>((resolve) => {
          setTimeout(() => {
            resolve({ kind: 'planRequired' });
          }, 5_000);
        }),
    );
    const { unmount } = renderWithMessages(
      <CreateShareLinkForm create={create} limitReached={false} onCreated={onCreated} />,
    );

    fireEvent.change(nameField(), { target: { value: 'Board' } });
    submit();
    unmount();
    await settle(5_000);

    expect(navigation.router.refresh).not.toHaveBeenCalled();
  });
});
