import { act, fireEvent, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { DeleteGoalOutcome, Goal, GoalChanges, SaveGoalOutcome } from '@/domain/goals';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { SAVE_GOAL_MIN_BUSY_MS } from './goal-form';
import { DELETE_GOAL_MIN_BUSY_MS, type GoalsManagement, GoalsPanel } from './goals-panel';

const navigation = vi.hoisted(() => ({ router: { refresh: vi.fn() } }));

vi.mock('next/navigation', () => ({
  useRouter: () => navigation.router,
}));

const SIGN_UP: Goal = {
  id: '7f0c2a4e-1b3d-4e5f-8a6b-9c0d1e2f3a4b',
  name: 'Sign-up',
  kind: 'event',
  target: 'signup_completed',
  position: 1,
};
const PRICING: Goal = {
  id: '8a1d3b5f-2c4e-4f6a-9b7c-0d1e2f3a4b5c',
  name: 'Saw the pricing',
  kind: 'page',
  target: '/pricing',
  position: 2,
};
const ADDED: Goal = {
  id: '9b2e4c6a-3d5f-4a7b-8c9d-1e2f3a4b5c6d',
  name: 'Thanks',
  kind: 'page',
  target: '/thank-you/*',
  position: 3,
};

type Create = (changes: GoalChanges) => Promise<SaveGoalOutcome>;
type Update = (goalId: string, changes: GoalChanges) => Promise<SaveGoalOutcome>;
type Remove = (goalId: string) => Promise<DeleteGoalOutcome>;

function management(overrides: Partial<GoalsManagement> = {}) {
  return {
    create: vi.fn<Create>(() => Promise.resolve({ kind: 'saved', goal: ADDED })),
    update: vi.fn<Update>((_goalId, changes) =>
      Promise.resolve({ kind: 'saved', goal: { ...SIGN_UP, ...changes } }),
    ),
    remove: vi.fn<Remove>(() => Promise.resolve({ kind: 'deleted' })),
    ...overrides,
  };
}

async function settle(milliseconds = SAVE_GOAL_MIN_BUSY_MS) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(milliseconds);
  });
}

function panel() {
  return screen.getByRole('region', { name: 'Goals' });
}

function field(name: string) {
  return screen.getByRole('textbox', { name });
}

beforeEach(() => {
  vi.useFakeTimers();
  navigation.router.refresh.mockClear();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('GoalsPanel for someone who cannot change the goals', () => {
  it('lists the goals in order, the first marked, without a button', () => {
    renderWithMessages(<GoalsPanel goals={[SIGN_UP, PRICING]} manage={null} />);

    const [first, second] = within(panel()).getAllByRole('listitem');
    expect(first).toHaveTextContent('Sign-upFirstEvent signup_completed');
    expect(second).toHaveTextContent('Saw the pricingPage /pricing');
    expect(panel()).toHaveTextContent('Only the owner of its account changes the goals.');
    expect(within(panel()).queryByRole('button')).toBeNull();
  });

  it('says there is no goal yet, so no conversion', () => {
    renderWithMessages(<GoalsPanel goals={[]} manage={null} />);

    expect(panel()).toHaveTextContent('No goals yet, so conversions are not shown.');
  });
});

describe('GoalsPanel for the owner', () => {
  it('invites the first goal and counts the goals against the limit', () => {
    renderWithMessages(<GoalsPanel goals={[]} manage={management()} />);

    expect(panel()).toHaveTextContent(
      'No goals yet. Add one and the Overview shows its conversions.',
    );
    expect(panel()).toHaveTextContent('Up to 10 per project.');
    expect(panel()).toHaveTextContent('0 of 10 goals');
  });

  it('adds a page goal, then lists it, says so, refreshes and focuses its edit button', async () => {
    const manage = management();
    renderWithMessages(<GoalsPanel goals={[SIGN_UP, PRICING]} manage={manage} />);

    fireEvent.click(screen.getByRole('button', { name: 'Add a goal' }));
    expect(field('Name')).toHaveFocus();
    fireEvent.change(field('Name'), { target: { value: ' Thanks ' } });
    fireEvent.click(screen.getByRole('radio', { name: 'A page the visit opens' }));
    expect(field('Page path')).toHaveAccessibleDescription(
      'Starts with /. A * matches any characters, as in /orders/*.',
    );
    fireEvent.change(field('Page path'), { target: { value: ' /thank-you/* ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add goal' }));
    expect(screen.getByRole('button', { name: 'Saving…' })).toBeDisabled();
    await settle();

    expect(manage.create).toHaveBeenCalledWith({
      name: 'Thanks',
      kind: 'page',
      target: '/thank-you/*',
    });
    expect(screen.getByRole('status')).toHaveTextContent('Goal added.');
    expect(within(panel()).getAllByRole('listitem')).toHaveLength(3);
    expect(panel()).toHaveTextContent('3 of 10 goals');
    expect(navigation.router.refresh).toHaveBeenCalledOnce();
    await settle(16);
    expect(screen.getByRole('button', { name: 'Edit', description: /^Thanks/ })).toHaveFocus();
  });

  it('names every problem under its field and sends nothing', async () => {
    const manage = management();
    renderWithMessages(<GoalsPanel goals={[]} manage={manage} />);

    fireEvent.click(screen.getByRole('button', { name: 'Add a goal' }));
    fireEvent.change(field('Event name'), { target: { value: 'Sign Up' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add goal' }));
    await settle(16);

    expect(manage.create).not.toHaveBeenCalled();
    expect(field('Name')).toHaveAccessibleDescription(
      'How the goal shows in the reports. Give the goal a name.',
    );
    expect(field('Name')).toHaveFocus();
    expect(field('Event name')).toHaveAccessibleDescription(
      expect.stringContaining('Use lower-case letters, digits and underscores') as string,
    );
  });

  it.each([
    [
      'a name over the limit',
      'x'.repeat(65),
      'event',
      'signup',
      'Name',
      'Use at most 64 characters.',
    ],
    [
      'a page without its slash',
      'Thanks',
      'page',
      'thanks',
      'Page path',
      'A page path starts with /.',
    ],
    [
      'a page path over the limit',
      'Thanks',
      'page',
      `/${'x'.repeat(256)}`,
      'Page path',
      'Use at most 256 characters.',
    ],
  ])('refuses %s', async (_, name, kind, target, problemField, message) => {
    renderWithMessages(<GoalsPanel goals={[]} manage={management()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Add a goal' }));
    fireEvent.change(field('Name'), { target: { value: name } });
    if (kind === 'page') {
      fireEvent.click(screen.getByRole('radio', { name: 'A page the visit opens' }));
    }
    fireEvent.change(field(kind === 'page' ? 'Page path' : 'Event name'), {
      target: { value: target },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Add goal' }));
    await settle(16);

    expect(field(problemField)).toHaveAccessibleDescription(
      expect.stringContaining(message) as string,
    );
  });

  it('clears the problem of the target when the kind changes', async () => {
    renderWithMessages(<GoalsPanel goals={[]} manage={management()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Add a goal' }));
    fireEvent.click(screen.getByRole('button', { name: 'Add goal' }));
    await settle(16);
    expect(field('Event name')).toHaveAttribute('aria-invalid', 'true');
    fireEvent.click(screen.getByRole('radio', { name: 'A page the visit opens' }));

    expect(field('Page path')).toHaveAttribute('aria-invalid', 'false');
  });

  it.each([
    [{ kind: 'invalid' } as const, 'The goal was refused. Check the fields and try again.'],
    [
      { kind: 'limitReached' } as const,
      'This project has 10 goals, the most it can have. Delete one to add another.',
    ],
    [
      { kind: 'notFound' } as const,
      'This goal no longer exists. Close the settings and open them again to see the current goals.',
    ],
    [
      { kind: 'subscriptionRequired' } as const,
      'This account has no running subscription, so its goals cannot change.',
    ],
  ])('says why the API refused the goal: %o', async (outcome, message) => {
    const manage = management({ create: vi.fn<Create>(() => Promise.resolve(outcome)) });
    renderWithMessages(<GoalsPanel goals={[]} manage={manage} />);

    fireEvent.click(screen.getByRole('button', { name: 'Add a goal' }));
    fireEvent.change(field('Name'), { target: { value: 'Sign-up' } });
    fireEvent.change(field('Event name'), { target: { value: 'signup_completed' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add goal' }));
    await settle();

    expect(screen.getByRole('alert')).toHaveTextContent(message);
    fireEvent.change(field('Name'), { target: { value: 'Sign-up again' } });
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('says the goal was not saved when the request fails', async () => {
    const manage = management({ create: vi.fn<Create>(() => Promise.reject(new Error('down'))) });
    renderWithMessages(<GoalsPanel goals={[]} manage={manage} />);

    fireEvent.click(screen.getByRole('button', { name: 'Add a goal' }));
    fireEvent.change(field('Name'), { target: { value: 'Sign-up' } });
    fireEvent.change(field('Event name'), { target: { value: 'signup_completed' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add goal' }));
    await settle();

    expect(screen.getByRole('alert')).toHaveTextContent('The goal was not saved. Try again.');
    expect(navigation.router.refresh).not.toHaveBeenCalled();
  });

  it('gives up adding and focuses the add button again', async () => {
    renderWithMessages(<GoalsPanel goals={[SIGN_UP]} manage={management()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Add a goal' }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await settle(16);

    expect(screen.queryByRole('textbox', { name: 'Name' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Add a goal' })).toHaveFocus();
  });

  it('edits a goal from what it is, saving the new target in its place', async () => {
    const manage = management();
    renderWithMessages(<GoalsPanel goals={[SIGN_UP, PRICING]} manage={manage} />);

    fireEvent.click(screen.getByRole('button', { name: 'Edit', description: /^Sign-up/ }));
    expect(field('Name')).toHaveValue('Sign-up');
    expect(field('Event name')).toHaveValue('signup_completed');
    fireEvent.change(field('Name'), { target: { value: 'Account created' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save goal' }));
    await settle();

    expect(manage.update).toHaveBeenCalledWith(SIGN_UP.id, {
      name: 'Account created',
      kind: 'event',
      target: 'signup_completed',
    });
    expect(screen.getByRole('status')).toHaveTextContent('Goal saved.');
    expect(within(panel()).getAllByRole('listitem')[0]).toHaveTextContent('Account createdFirst');
    await settle(16);
    expect(
      screen.getByRole('button', { name: 'Edit', description: /^Account created/ }),
    ).toHaveFocus();
  });

  it('gives up editing and focuses the edit button again', async () => {
    renderWithMessages(<GoalsPanel goals={[SIGN_UP]} manage={management()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await settle(16);

    expect(screen.getByRole('button', { name: 'Edit' })).toHaveFocus();
  });

  it('deletes a goal after asking, then says so and focuses the add button', async () => {
    const manage = management();
    renderWithMessages(<GoalsPanel goals={[SIGN_UP, PRICING]} manage={manage} />);

    fireEvent.click(
      screen.getByRole('button', { name: 'Delete', description: /^Saw the pricing/ }),
    );
    const question = screen.getByRole('group', {
      name: 'Delete the goal “Saw the pricing”? The events stay; only the goal goes, with its numbers in the reports.',
    });
    expect(within(question).getByRole('button', { name: 'Delete goal' })).toHaveFocus();
    fireEvent.click(within(question).getByRole('button', { name: 'Delete goal' }));
    expect(within(question).getByRole('button', { name: 'Deleting…' })).toBeDisabled();
    await settle(DELETE_GOAL_MIN_BUSY_MS);

    expect(manage.remove).toHaveBeenCalledWith(PRICING.id);
    expect(screen.getByRole('status')).toHaveTextContent('Goal deleted.');
    expect(within(panel()).getAllByRole('listitem')).toHaveLength(1);
    expect(navigation.router.refresh).toHaveBeenCalledOnce();
    await settle(16);
    expect(screen.getByRole('button', { name: 'Add a goal' })).toHaveFocus();
  });

  it('keeps the goal when the deletion is not confirmed', async () => {
    renderWithMessages(<GoalsPanel goals={[SIGN_UP]} manage={management()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await settle(16);

    expect(screen.queryByRole('group')).toBeNull();
    expect(screen.getByRole('button', { name: 'Edit' })).toHaveFocus();
  });

  it.each([
    [
      () => Promise.resolve<DeleteGoalOutcome>({ kind: 'subscriptionRequired' }),
      'This account has no running subscription, so its goals cannot change.',
    ],
    [() => Promise.reject(new Error('down')), 'The goal was not deleted. Try again.'],
  ])('says why a goal was not deleted', async (remove, message) => {
    renderWithMessages(
      <GoalsPanel goals={[SIGN_UP]} manage={management({ remove: vi.fn<Remove>(remove) })} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    fireEvent.click(screen.getByRole('button', { name: 'Delete goal' }));
    await settle(DELETE_GOAL_MIN_BUSY_MS);

    expect(screen.getByRole('alert')).toHaveTextContent(message);
    expect(within(panel()).getAllByRole('listitem')).toHaveLength(1);
  });

  it('stops offering a goal past the limit', () => {
    const goals = Array.from({ length: 10 }, (_, index) => ({
      ...SIGN_UP,
      id: `${String(index)}f0c2a4e-1b3d-4e5f-8a6b-9c0d1e2f3a4b`.slice(-36),
      position: index + 1,
    }));
    renderWithMessages(<GoalsPanel goals={goals} manage={management()} />);

    expect(screen.queryByRole('button', { name: 'Add a goal' })).toBeNull();
    expect(panel()).toHaveTextContent(
      'This project has 10 goals, the most it can have. Delete one to add another.',
    );
    expect(panel()).toHaveTextContent('10 of 10 goals');
  });

  it('drops a request still running when it closes', async () => {
    const manage = management();
    const { unmount } = renderWithMessages(<GoalsPanel goals={[SIGN_UP]} manage={manage} />);

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    fireEvent.click(screen.getByRole('button', { name: 'Delete goal' }));
    unmount();
    await settle(DELETE_GOAL_MIN_BUSY_MS);

    expect(navigation.router.refresh).not.toHaveBeenCalled();
  });
});
