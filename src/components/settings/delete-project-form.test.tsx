import { act, fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { DeleteProjectOutcome } from '@/domain/project-management';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import {
  DELETE_PROJECT_MIN_BUSY_MS,
  DeleteProjectForm,
  PROJECTS_HOME,
} from './delete-project-form';

const navigation = vi.hoisted(() => ({ router: { push: vi.fn(), refresh: vi.fn() } }));

vi.mock('next/navigation', () => ({
  useRouter: () => navigation.router,
}));

async function settle() {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(DELETE_PROJECT_MIN_BUSY_MS);
  });
}

function confirmField() {
  return screen.getByRole('textbox', { name: 'Type Shop to confirm' });
}

function deleteButton() {
  return screen.getByRole('button', { name: 'Delete project for good' });
}

describe('DeleteProjectForm', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    navigation.router.push.mockClear();
    navigation.router.refresh.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('says what goes for good, deletes with the name typed and leaves for the projects', async () => {
    const remove = vi.fn<(confirmName: string) => Promise<DeleteProjectOutcome>>(() =>
      Promise.resolve({ kind: 'deleted' }),
    );
    renderWithMessages(<DeleteProjectForm projectName="Shop" remove={remove} />);
    expect(screen.getByText(/Deletes Shop, its events and its keys for good/)).toBeInTheDocument();

    fireEvent.change(confirmField(), { target: { value: ' Shop ' } });
    fireEvent.click(deleteButton());
    expect(screen.getByRole('button', { name: 'Deleting…' })).toBeDisabled();
    await settle();

    expect(remove).toHaveBeenCalledWith('Shop');
    expect(navigation.router.push).toHaveBeenCalledWith(PROJECTS_HOME);
    expect(navigation.router.refresh).toHaveBeenCalledOnce();
  });

  it('refuses another name before calling anyone, and clears it as the owner types', () => {
    const remove = vi.fn(() => Promise.resolve<DeleteProjectOutcome>({ kind: 'deleted' }));
    renderWithMessages(<DeleteProjectForm projectName="Shop" remove={remove} />);

    fireEvent.change(confirmField(), { target: { value: 'shop' } });
    fireEvent.click(deleteButton());

    expect(remove).not.toHaveBeenCalled();
    expect(confirmField()).toHaveAccessibleDescription(
      "The name typed is not this project's name.",
    );
    fireEvent.change(confirmField(), { target: { value: 'Sho' } });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('shows the refusal of the API when the name no longer matches', async () => {
    renderWithMessages(
      <DeleteProjectForm
        projectName="Shop"
        remove={() => Promise.resolve({ kind: 'nameMismatch' })}
      />,
    );

    fireEvent.change(confirmField(), { target: { value: 'Shop' } });
    fireEvent.click(deleteButton());
    await settle();

    expect(screen.getByRole('alert')).toHaveTextContent(
      "The name typed is not this project's name.",
    );
    expect(navigation.router.push).not.toHaveBeenCalled();
  });

  it('says nothing can be deleted while the account holds its deletion', async () => {
    renderWithMessages(
      <DeleteProjectForm
        projectName="Shop"
        remove={() => Promise.resolve({ kind: 'deletionOnHold' })}
      />,
    );

    fireEvent.change(confirmField(), { target: { value: 'Shop' } });
    fireEvent.click(deleteButton());
    await settle();

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Nothing in this account can be deleted while Pyxis holds its deletion.',
    );
    expect(navigation.router.push).not.toHaveBeenCalled();
  });

  it('says the project was not deleted when the call fails', async () => {
    renderWithMessages(
      <DeleteProjectForm projectName="Shop" remove={() => Promise.reject(new Error('503'))} />,
    );

    fireEvent.change(confirmField(), { target: { value: 'Shop' } });
    fireEvent.click(deleteButton());
    await settle();

    expect(screen.getByRole('alert')).toHaveTextContent('The project was not deleted.');
  });
});
