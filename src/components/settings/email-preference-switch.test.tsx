import { act, fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { EmailPreferences } from '@/domain/email-preferences';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import {
  type ChooseEmailPreference,
  EmailPreferenceSwitch,
  SAVED_NOTICE_MS,
  SAVING_MIN_BUSY_MS,
} from './email-preference-switch';

const ALL_ON: EmailPreferences = {
  weeklyDigest: true,
  noEventsAlert: true,
  failedWritesAlert: true,
  conversionDropAlert: true,
};
const NO_EVENTS_OFF: EmailPreferences = { ...ALL_ON, noEventsAlert: false };
const LABEL = 'No events';
const NOTE = 'When no event has arrived for 24 hours.';

function deferred() {
  let settle: { resolve: (value: EmailPreferences) => void; reject: (error: Error) => void } = {
    resolve: () => undefined,
    reject: () => undefined,
  };
  const promise = new Promise<EmailPreferences>((resolve, reject) => {
    settle = { resolve, reject };
  });
  return { promise, settle: () => settle };
}

function renderSwitch(choose: ChooseEmailPreference, locale: 'en' | 'pt-BR' = 'en') {
  return renderWithMessages(
    <EmailPreferenceSwitch
      preference="noEventsAlert"
      initial
      label={LABEL}
      note={NOTE}
      choose={choose}
    />,
    locale,
  );
}

async function settle(milliseconds: number) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(milliseconds);
  });
}

describe('EmailPreferenceSwitch', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows the stored choice, named and described by what it sends', () => {
    renderSwitch(() => Promise.resolve(ALL_ON));

    const toggle = screen.getByRole('switch', { name: LABEL });
    expect(toggle).toBeChecked();
    expect(toggle).toHaveAccessibleDescription(NOTE);
    expect(screen.getByText('On')).toBeInTheDocument();
  });

  it('turns its own e-mail off at once, says it is saving, then that it saved', async () => {
    const answer = deferred();
    const choose = vi.fn<ChooseEmailPreference>(() => answer.promise);
    renderSwitch(choose);

    fireEvent.click(screen.getByRole('switch', { name: LABEL }));

    expect(choose).toHaveBeenCalledWith({ preference: 'noEventsAlert', on: false });
    expect(screen.getByRole('switch')).not.toBeChecked();
    expect(screen.getByText('Off')).toBeInTheDocument();
    expect(screen.getByRole('switch')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText('Saving…')).toBeInTheDocument();

    answer.settle().resolve(NO_EVENTS_OFF);
    await settle(SAVING_MIN_BUSY_MS);

    expect(screen.getByRole('switch')).toHaveAttribute('aria-busy', 'false');
    expect(screen.getByText('Saved')).toBeInTheDocument();

    await settle(SAVED_NOTICE_MS);

    expect(screen.queryByText('Saved')).not.toBeInTheDocument();
    expect(screen.getByRole('switch')).not.toBeChecked();
  });

  it('shows what the API stored for its own e-mail, whatever the others hold', async () => {
    renderSwitch(() => Promise.resolve({ ...ALL_ON, weeklyDigest: false }));

    fireEvent.click(screen.getByRole('switch'));
    await settle(SAVING_MIN_BUSY_MS);

    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('puts the switch back and says so when the change is not saved', async () => {
    renderSwitch(() => Promise.reject(new Error('Pyxis API answered 503')));

    fireEvent.click(screen.getByRole('switch', { name: LABEL }));
    await settle(SAVING_MIN_BUSY_MS);

    expect(screen.getByRole('switch')).toBeChecked();
    expect(screen.getByRole('alert')).toHaveTextContent('The change was not saved. Try again.');
    expect(screen.queryByText('Saved')).not.toBeInTheDocument();
  });

  it('clears the failure on the next try and shows what the API stored', async () => {
    const choose = vi
      .fn<ChooseEmailPreference>()
      .mockRejectedValueOnce(new Error('timeout'))
      .mockResolvedValueOnce(ALL_ON);
    renderSwitch(choose);
    fireEvent.click(screen.getByRole('switch'));
    await settle(SAVING_MIN_BUSY_MS);

    fireEvent.click(screen.getByRole('switch'));
    await settle(SAVING_MIN_BUSY_MS);

    expect(choose).toHaveBeenNthCalledWith(2, { preference: 'noEventsAlert', on: false });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('keeps only the last of two quick changes', async () => {
    const first = deferred();
    const choose = vi
      .fn<ChooseEmailPreference>()
      .mockReturnValueOnce(first.promise)
      .mockResolvedValueOnce(ALL_ON);
    renderSwitch(choose);

    fireEvent.click(screen.getByRole('switch'));
    fireEvent.click(screen.getByRole('switch'));
    first.settle().resolve(NO_EVENTS_OFF);
    await settle(SAVING_MIN_BUSY_MS);

    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('stops listening when it leaves the page', () => {
    const answer = deferred();
    const view = renderSwitch(() => answer.promise);
    fireEvent.click(screen.getByRole('switch'));

    view.unmount();

    expect(() => {
      answer.settle().resolve(NO_EVENTS_OFF);
    }).not.toThrow();
  });

  it('speaks Portuguese', () => {
    renderSwitch(() => Promise.resolve(ALL_ON), 'pt-BR');

    expect(screen.getByText('Ligado')).toBeInTheDocument();
  });
});
