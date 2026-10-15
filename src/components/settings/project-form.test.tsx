import { act, fireEvent, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ProjectChanges, SaveProjectOutcome } from '@/domain/project-management';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { ProjectForm, SAVE_PROJECT_MIN_BUSY_MS } from './project-form';

const navigation = vi.hoisted(() => ({ router: { refresh: vi.fn() } }));

vi.mock('next/navigation', () => ({
  useRouter: () => navigation.router,
}));

const SAVED: ProjectChanges = {
  name: 'Shop',
  allowedOrigins: ['https://shop.example.com'],
  timezone: 'UTC',
  conversionEvent: null,
};
const TIMEZONES = ['America/Sao_Paulo', 'UTC'];

async function settle(milliseconds = SAVE_PROJECT_MIN_BUSY_MS) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(milliseconds);
  });
}

function renderForm(save: (changes: ProjectChanges) => Promise<SaveProjectOutcome>) {
  return renderWithMessages(<ProjectForm saved={SAVED} timezones={TIMEZONES} save={save} />);
}

function field(name: string) {
  return screen.getByRole('textbox', { name });
}

function saveButton() {
  return screen.getByRole('button', { name: 'Save changes' });
}

describe('ProjectForm', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    navigation.router.refresh.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts from the saved settings', () => {
    renderForm(() => Promise.resolve({ kind: 'saved' }));

    expect(field('Name')).toHaveValue('Shop');
    expect(field('Origin 1')).toHaveValue('https://shop.example.com');
    expect(screen.getByRole('combobox', { name: 'Time zone' })).toHaveValue('UTC');
    expect(field('Conversion event')).toHaveValue('');
    expect(screen.queryByRole('button', { name: 'Remove origin 1' })).not.toBeInTheDocument();
  });

  it('saves the changes in the API shape, then refreshes the page and says so', async () => {
    const save = vi.fn<(changes: ProjectChanges) => Promise<SaveProjectOutcome>>(() =>
      Promise.resolve<SaveProjectOutcome>({ kind: 'saved' }),
    );
    renderForm(save);

    fireEvent.change(field('Name'), { target: { value: '  Shop BR ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add an origin' }));
    fireEvent.change(field('Origin 2'), { target: { value: 'www.shop.example.com/pricing' } });
    fireEvent.change(screen.getByRole('combobox', { name: 'Time zone' }), {
      target: { value: 'America/Sao_Paulo' },
    });
    fireEvent.change(field('Conversion event'), { target: { value: 'signup_completed' } });
    fireEvent.click(saveButton());

    expect(screen.getByRole('button', { name: 'Saving…' })).toBeDisabled();
    await settle();
    expect(save).toHaveBeenCalledWith({
      name: 'Shop BR',
      allowedOrigins: ['https://shop.example.com', 'https://www.shop.example.com'],
      timezone: 'America/Sao_Paulo',
      conversionEvent: 'signup_completed',
    });
    expect(screen.getByRole('status')).toHaveTextContent('Saved');
    expect(navigation.router.refresh).toHaveBeenCalledOnce();
  });

  it('removes an origin row and stops offering a sixth one', () => {
    renderForm(() => Promise.resolve({ kind: 'saved' }));

    for (let added = 0; added < 4; added += 1) {
      fireEvent.click(screen.getByRole('button', { name: 'Add an origin' }));
    }
    expect(screen.queryByRole('button', { name: 'Add an origin' })).not.toBeInTheDocument();
    fireEvent.change(field('Origin 2'), { target: { value: 'https://two.example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Remove origin 1' }));

    expect(field('Origin 1')).toHaveValue('https://two.example.com');
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
    expect(screen.getByRole('button', { name: 'Add an origin' })).toBeInTheDocument();
  });

  it('names every problem under its field, focuses the first and sends nothing', async () => {
    const save = vi.fn(() => Promise.resolve<SaveProjectOutcome>({ kind: 'saved' }));
    renderForm(save);

    fireEvent.change(field('Name'), { target: { value: '  ' } });
    fireEvent.change(field('Origin 1'), { target: { value: 'ftp://shop.example.com' } });
    fireEvent.change(field('Conversion event'), { target: { value: 'Sign Up' } });
    fireEvent.click(saveButton());
    await settle(16);

    expect(save).not.toHaveBeenCalled();
    expect(field('Name')).toHaveAccessibleDescription('Give the project a name.');
    expect(field('Name')).toHaveFocus();
    expect(screen.getByRole('group', { name: 'Allowed origins' })).toHaveAccessibleDescription(
      expect.stringContaining('Write each origin as scheme, host and port') as string,
    );
    expect(field('Conversion event')).toHaveAccessibleDescription(
      expect.stringContaining('Use lower-case letters') as string,
    );
  });

  it.each([
    ['nothing in any origin row', [''], 'Give at least one origin.'],
    [
      'six different origins',
      ['a', 'b', 'c', 'd', 'e', 'f'].map((host) => `https://${host}.example.com`),
      'Use at most 5 origins.',
    ],
  ])('refuses %s', async (_, origins, message) => {
    renderWithMessages(
      <ProjectForm
        saved={{ ...SAVED, allowedOrigins: origins }}
        timezones={TIMEZONES}
        save={() => Promise.resolve({ kind: 'saved' })}
      />,
    );

    fireEvent.click(saveButton());
    await settle(16);

    expect(
      within(screen.getByRole('group', { name: 'Allowed origins' })).getByRole('alert'),
    ).toHaveTextContent(message);
  });

  it('refuses a name over the limit and a time zone it does not know', async () => {
    renderWithMessages(
      <ProjectForm
        saved={{ ...SAVED, timezone: 'Nowhere/Land' }}
        timezones={[...TIMEZONES, 'Nowhere/Land']}
        save={() => Promise.resolve({ kind: 'saved' })}
      />,
    );

    fireEvent.change(field('Name'), { target: { value: 'x'.repeat(101) } });
    fireEvent.click(saveButton());
    await settle(16);

    expect(field('Name')).toHaveAccessibleDescription('Use at most 100 characters.');
    expect(screen.getByRole('combobox', { name: 'Time zone' })).toHaveAccessibleDescription(
      expect.stringContaining('Choose a time zone from the list.') as string,
    );
  });

  it.each([
    ['invalid', 'These settings were refused.'],
    ['subscriptionRequired', 'This account has no running subscription'],
  ] as const)('explains a %s answer without refreshing', async (kind, message) => {
    renderForm(() => Promise.resolve({ kind }));

    fireEvent.click(saveButton());
    await settle();

    expect(screen.getByRole('alert')).toHaveTextContent(message);
    expect(navigation.router.refresh).not.toHaveBeenCalled();
  });

  it('says the changes were not saved when the call fails, and clears it on the next edit', async () => {
    renderForm(() => Promise.reject(new Error('Pyxis API answered 503')));

    fireEvent.click(saveButton());
    await settle();
    expect(screen.getByRole('alert')).toHaveTextContent('The changes were not saved.');

    fireEvent.change(field('Name'), { target: { value: 'Shop 2' } });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('stops a save still running when it goes away', async () => {
    const save = vi.fn(
      () =>
        new Promise<SaveProjectOutcome>((resolve) => {
          setTimeout(() => {
            resolve({ kind: 'saved' });
          }, 5_000);
        }),
    );
    const { unmount } = renderForm(save);

    fireEvent.click(saveButton());
    unmount();
    await settle(5_000);

    expect(navigation.router.refresh).not.toHaveBeenCalled();
  });
});
