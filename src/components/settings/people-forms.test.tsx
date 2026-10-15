import { act, fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { AddPersonOutcome, RemovePersonOutcome } from '@/domain/project-people';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { ADD_PERSON_MIN_BUSY_MS, AddPersonForm } from './add-person-form';
import { REMOVE_PERSON_MIN_BUSY_MS, RemovePersonButton } from './remove-person-button';

const navigation = vi.hoisted(() => ({ router: { refresh: vi.fn() } }));

vi.mock('next/navigation', () => ({
  useRouter: () => navigation.router,
}));

const PERSON = {
  adminUserId: 'a03c5e7f-9b1d-4c4e-9f6a-8b0c2d4e6f8a',
  email: 'ana@example.com',
  role: 'member',
  addedAt: '2026-10-15T12:00:00.000Z',
} as const;

async function settle(milliseconds: number) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(milliseconds);
  });
}

function emailField() {
  return screen.getByRole('textbox', { name: 'E-mail address' });
}

function addButton() {
  return screen.getByRole('button', { name: 'Add person' });
}

describe('AddPersonForm', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    navigation.router.refresh.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('adds the trimmed address, says it was invited, clears the field and refreshes', async () => {
    const add = vi.fn<(email: string) => Promise<AddPersonOutcome>>(() =>
      Promise.resolve({ kind: 'added', person: PERSON, invited: true }),
    );
    renderWithMessages(<AddPersonForm add={add} />);

    fireEvent.change(emailField(), { target: { value: '  ana@example.com ' } });
    fireEvent.click(addButton());
    expect(screen.getByRole('button', { name: 'Adding…' })).toBeDisabled();
    await settle(ADD_PERSON_MIN_BUSY_MS);

    expect(add).toHaveBeenCalledWith('ana@example.com');
    expect(screen.getByRole('status')).toHaveTextContent(
      'ana@example.com was added and got an e-mail with how to sign in.',
    );
    expect(emailField()).toHaveValue('');
    expect(navigation.router.refresh).toHaveBeenCalledOnce();
  });

  it('says when the person already opened the project', async () => {
    renderWithMessages(
      <AddPersonForm
        add={() => Promise.resolve({ kind: 'added', person: PERSON, invited: false })}
      />,
    );

    fireEvent.change(emailField(), { target: { value: 'ana@example.com' } });
    fireEvent.click(addButton());
    await settle(ADD_PERSON_MIN_BUSY_MS);

    expect(screen.getByRole('status')).toHaveTextContent(
      'ana@example.com already opens this project.',
    );
  });

  it.each([
    ['', 'Write the e-mail address of the person to add.'],
    ['ana@', 'Write an e-mail address, like ana@example.com.'],
  ])('refuses %j under the field before calling anyone', (value, message) => {
    const add = vi.fn<(email: string) => Promise<AddPersonOutcome>>();
    renderWithMessages(<AddPersonForm add={add} />);

    fireEvent.change(emailField(), { target: { value } });
    fireEvent.click(addButton());

    expect(add).not.toHaveBeenCalled();
    expect(emailField()).toHaveAccessibleDescription(message);
    expect(emailField()).toHaveFocus();
    fireEvent.change(emailField(), { target: { value: 'a' } });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it.each([
    ['limitReached', 'The account already has its 3 people, you included.'],
    ['subscriptionRequired', 'This account has no running subscription'],
    ['invalidEmail', 'Write an e-mail address, like ana@example.com.'],
  ] as const)('explains a %s answer', async (kind, message) => {
    renderWithMessages(<AddPersonForm add={() => Promise.resolve({ kind })} />);

    fireEvent.change(emailField(), { target: { value: 'ana@example.com' } });
    fireEvent.click(addButton());
    await settle(ADD_PERSON_MIN_BUSY_MS);

    expect(screen.getByRole('alert')).toHaveTextContent(message);
    expect(navigation.router.refresh).not.toHaveBeenCalled();
  });

  it('says nobody was added when the call fails', async () => {
    renderWithMessages(<AddPersonForm add={() => Promise.reject(new Error('503'))} />);

    fireEvent.change(emailField(), { target: { value: 'ana@example.com' } });
    fireEvent.click(addButton());
    await settle(ADD_PERSON_MIN_BUSY_MS);

    expect(screen.getByRole('alert')).toHaveTextContent('Nobody was added. Try again.');
  });
});

describe('RemovePersonButton', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    navigation.router.refresh.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function renderButton(remove: (adminUserId: string) => Promise<RemovePersonOutcome>) {
    return renderWithMessages(
      <div>
        <span id="person-row">ana@example.com</span>
        <RemovePersonButton
          adminUserId={PERSON.adminUserId}
          describedBy="person-row"
          remove={remove}
        />
      </div>,
    );
  }

  it('removes the person it names, then refreshes', async () => {
    const remove = vi.fn<(adminUserId: string) => Promise<RemovePersonOutcome>>(() =>
      Promise.resolve({ kind: 'removed' }),
    );
    renderButton(remove);

    fireEvent.click(screen.getByRole('button', { name: 'Remove', description: 'ana@example.com' }));
    expect(screen.getByRole('button', { name: 'Removing…' })).toBeDisabled();
    await settle(REMOVE_PERSON_MIN_BUSY_MS);

    expect(remove).toHaveBeenCalledWith(PERSON.adminUserId);
    expect(screen.getByRole('status')).toHaveTextContent('Removed');
    expect(navigation.router.refresh).toHaveBeenCalledOnce();
  });

  it('says the owner stays, or that the removal failed', async () => {
    const first = renderButton(() => Promise.resolve({ kind: 'ownerStays' }));
    fireEvent.click(screen.getByRole('button', { name: 'Remove' }));
    await settle(REMOVE_PERSON_MIN_BUSY_MS);
    expect(screen.getByRole('alert')).toHaveTextContent('The owner keeps access');
    first.unmount();

    renderButton(() => Promise.reject(new Error('503')));
    fireEvent.click(screen.getByRole('button', { name: 'Remove' }));
    await settle(REMOVE_PERSON_MIN_BUSY_MS);
    expect(screen.getByRole('alert')).toHaveTextContent('That person was not removed.');
  });
});
