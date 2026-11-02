import { act, fireEvent, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import {
  OPTION_SAVED_NOTICE_MS,
  OPTION_SAVING_MIN_BUSY_MS,
  type ProjectOptionOutcome,
  ProjectOptionSwitch,
  type SetProjectOption,
} from './project-option-switch';

const LABEL = 'Record the visitor’s approximate city';

function deferred() {
  let settle: { resolve: (value: ProjectOptionOutcome) => void; reject: (error: Error) => void } = {
    resolve: () => undefined,
    reject: () => undefined,
  };
  const promise = new Promise<ProjectOptionOutcome>((resolve, reject) => {
    settle = { resolve, reject };
  });
  return { promise, settle: () => settle };
}

function renderSwitch(initial: boolean, setCity: SetProjectOption, locale: 'en' | 'pt-BR' = 'en') {
  return renderWithMessages(
    <ProjectOptionSwitch option="cityOption" initial={initial} save={setCity} />,
    locale,
  );
}

async function settle(milliseconds: number) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(milliseconds);
  });
}

const saved = (): Promise<ProjectOptionOutcome> => Promise.resolve({ kind: 'saved' });

describe('ProjectOptionSwitch for the city', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows the stored choice and what turning it on means', () => {
    renderSwitch(false, saved);

    const toggle = screen.getByRole('switch', { name: LABEL });
    expect(toggle).not.toBeChecked();
    expect(toggle).toHaveAccessibleDescription(/Off by default\. .*identify/);
    expect(screen.getByText('Off')).toBeInTheDocument();
  });

  it('turns the city on at once, says it is saving, then that it saved', async () => {
    const answer = deferred();
    const setCity = vi.fn<SetProjectOption>(() => answer.promise);
    renderSwitch(false, setCity);

    fireEvent.click(screen.getByRole('switch', { name: LABEL }));

    expect(setCity).toHaveBeenCalledWith(true);
    expect(screen.getByRole('switch')).toBeChecked();
    expect(screen.getByText('Saving…')).toBeInTheDocument();

    await act(async () => {
      answer.settle().resolve({ kind: 'saved' });
      await vi.advanceTimersByTimeAsync(OPTION_SAVING_MIN_BUSY_MS);
    });

    expect(screen.getByText('Saved')).toBeInTheDocument();
    await settle(OPTION_SAVED_NOTICE_MS);
    expect(screen.queryByText('Saved')).not.toBeInTheDocument();
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('asks before turning it off, and saves nothing when the owner keeps it on', () => {
    const setCity = vi.fn<SetProjectOption>(saved);
    renderSwitch(true, setCity);

    fireEvent.click(screen.getByRole('switch', { name: LABEL }));

    const confirmation = screen.getByRole('group', { name: 'Turn off the city?' });
    expect(confirmation).toHaveTextContent('erased within 48 hours if it stays off');
    expect(screen.getByRole('switch')).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('switch')).toBeChecked();

    fireEvent.click(screen.getByRole('button', { name: 'Keep it on' }));

    expect(screen.queryByRole('group')).not.toBeInTheDocument();
    expect(screen.getByRole('switch')).toBeChecked();
    expect(setCity).not.toHaveBeenCalled();
  });

  it('turns it off once the owner confirms', async () => {
    const setCity = vi.fn<SetProjectOption>(saved);
    renderSwitch(true, setCity);

    fireEvent.click(screen.getByRole('switch', { name: LABEL }));
    fireEvent.click(screen.getByRole('button', { name: 'Turn off and erase' }));
    await settle(OPTION_SAVING_MIN_BUSY_MS);

    expect(setCity).toHaveBeenCalledWith(false);
    expect(screen.getByRole('switch')).not.toBeChecked();
    expect(screen.queryByRole('group')).not.toBeInTheDocument();
    expect(screen.getByText('Saved')).toBeInTheDocument();
  });

  it('puts the switch back and says so when the save fails', async () => {
    renderSwitch(false, () => Promise.reject(new Error('Pyxis API answered 503')));

    fireEvent.click(screen.getByRole('switch', { name: LABEL }));
    await settle(OPTION_SAVING_MIN_BUSY_MS);

    expect(screen.getByRole('switch')).not.toBeChecked();
    expect(screen.getByRole('alert')).toHaveTextContent('The change was not saved. Try again.');
  });

  it('puts the switch back and names the plan when the account has none', async () => {
    renderSwitch(true, () => Promise.resolve({ kind: 'subscriptionRequired' }));

    fireEvent.click(screen.getByRole('switch', { name: LABEL }));
    fireEvent.click(screen.getByRole('button', { name: 'Turn off and erase' }));
    await settle(OPTION_SAVING_MIN_BUSY_MS);

    expect(screen.getByRole('switch')).toBeChecked();
    expect(screen.getByRole('alert')).toHaveTextContent('the account needs an active plan');
  });

  it('clears an earlier refusal when the owner opens the confirmation again', async () => {
    renderSwitch(true, () => Promise.resolve({ kind: 'subscriptionRequired' }));
    fireEvent.click(screen.getByRole('switch', { name: LABEL }));
    fireEvent.click(screen.getByRole('button', { name: 'Turn off and erase' }));
    await settle(OPTION_SAVING_MIN_BUSY_MS);

    fireEvent.click(screen.getByRole('switch', { name: LABEL }));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('speaks Portuguese', () => {
    renderSwitch(true, saved, 'pt-BR');

    fireEvent.click(
      screen.getByRole('switch', { name: 'Registrar a cidade aproximada do visitante' }),
    );

    expect(screen.getByRole('button', { name: 'Desligar e apagar' })).toBeInTheDocument();
  });
});

describe('ProjectOptionSwitch for unique visitors', () => {
  const VISITORS = 'Count unique visitors per day and per month';

  function renderVisitors(initial: boolean, save: SetProjectOption, locale: 'en' | 'pt-BR' = 'en') {
    return renderWithMessages(
      <ProjectOptionSwitch option="visitorsOption" initial={initial} save={save} />,
      locale,
    );
  }

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('says what the browser keeps, and that no identifier is created', () => {
    renderVisitors(false, saved);

    expect(screen.getByRole('switch', { name: VISITORS })).toHaveAccessibleDescription(
      /only when your site’s day and month end.*No identifier, no cookie\..*Annex IV/,
    );
  });

  it('asks before turning it off, saying the counted visits stay, and erases nothing', async () => {
    const save = vi.fn<SetProjectOption>(saved);
    renderVisitors(true, save);

    fireEvent.click(screen.getByRole('switch', { name: VISITORS }));

    const confirmation = screen.getByRole('group', { name: 'Turn off unique visitors?' });
    expect(confirmation).toHaveTextContent('each browser’s marker is deleted the next time');
    expect(confirmation).toHaveTextContent('Visits already counted keep their kind');
    expect(within(confirmation).queryByRole('button', { name: /erase/ })).toBeNull();

    fireEvent.click(within(confirmation).getByRole('button', { name: 'Turn off' }));
    await settle(OPTION_SAVING_MIN_BUSY_MS);

    expect(save).toHaveBeenCalledWith(false);
    expect(screen.getByRole('switch')).not.toBeChecked();
  });

  it('keeps counting when the owner says so', () => {
    const save = vi.fn<SetProjectOption>(saved);
    renderVisitors(true, save);

    fireEvent.click(screen.getByRole('switch', { name: VISITORS }));
    fireEvent.click(screen.getByRole('button', { name: 'Keep counting' }));

    expect(screen.getByRole('switch')).toBeChecked();
    expect(save).not.toHaveBeenCalled();
  });

  it('speaks Portuguese', () => {
    renderVisitors(true, saved, 'pt-BR');

    fireEvent.click(
      screen.getByRole('switch', { name: 'Contar visitantes únicos por dia e por mês' }),
    );

    expect(
      screen.getByRole('group', { name: 'Desligar os visitantes únicos?' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continuar contando' })).toBeInTheDocument();
  });
});
