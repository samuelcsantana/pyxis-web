import { act, fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { EmailPreferences } from '@/domain/email-preferences';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import {
  type ChooseEmailPreferences,
  SAVED_NOTICE_MS,
  SAVING_MIN_BUSY_MS,
  WeeklyDigestSwitch,
} from './weekly-digest-switch';

const ON: EmailPreferences = { weeklyDigest: true };

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

function renderSwitch(choose: ChooseEmailPreferences, locale: 'en' | 'pt-BR' = 'en') {
  return renderWithMessages(
    <WeeklyDigestSwitch initial={ON} timezone="America/Sao_Paulo" choose={choose} />,
    locale,
  );
}

async function settle(milliseconds: number) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(milliseconds);
  });
}

describe('WeeklyDigestSwitch', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows the stored choice, what the digest holds and the time zone of its week', () => {
    renderSwitch(() => Promise.resolve(ON));

    const toggle = screen.getByRole('switch', { name: 'Weekly digest' });
    expect(toggle).toBeChecked();
    expect(toggle).toHaveAccessibleDescription(
      'Every Monday, the week that closed on Sunday in America/Sao_Paulo: visits, conversions, failed writes, top pages and events. Each admin chooses for themselves.',
    );
    expect(screen.getByText('On')).toBeInTheDocument();
  });

  it('turns the digest off at once, says it is saving, then that it saved', async () => {
    const answer = deferred();
    const choose = vi.fn<ChooseEmailPreferences>(() => answer.promise);
    renderSwitch(choose);

    fireEvent.click(screen.getByRole('switch', { name: 'Weekly digest' }));

    expect(choose).toHaveBeenCalledWith({ weeklyDigest: false });
    expect(screen.getByRole('switch')).not.toBeChecked();
    expect(screen.getByText('Off')).toBeInTheDocument();
    expect(screen.getByRole('switch')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText('Saving…')).toBeInTheDocument();

    answer.settle().resolve({ weeklyDigest: false });
    await settle(SAVING_MIN_BUSY_MS);

    expect(screen.getByRole('switch')).toHaveAttribute('aria-busy', 'false');
    expect(screen.getByText('Saved')).toBeInTheDocument();

    await settle(SAVED_NOTICE_MS);

    expect(screen.queryByText('Saved')).not.toBeInTheDocument();
    expect(screen.getByRole('switch')).not.toBeChecked();
  });

  it('puts the switch back and says so when the change is not saved', async () => {
    renderSwitch(() => Promise.reject(new Error('Pyxis API answered 503')));

    fireEvent.click(screen.getByRole('switch', { name: 'Weekly digest' }));
    await settle(SAVING_MIN_BUSY_MS);

    expect(screen.getByRole('switch')).toBeChecked();
    expect(screen.getByRole('alert')).toHaveTextContent('The change was not saved. Try again.');
    expect(screen.queryByText('Saved')).not.toBeInTheDocument();
  });

  it('clears the failure on the next try and shows what the API stored', async () => {
    const choose = vi
      .fn<ChooseEmailPreferences>()
      .mockRejectedValueOnce(new Error('timeout'))
      .mockResolvedValueOnce({ weeklyDigest: true });
    renderSwitch(choose);
    fireEvent.click(screen.getByRole('switch'));
    await settle(SAVING_MIN_BUSY_MS);

    fireEvent.click(screen.getByRole('switch'));
    await settle(SAVING_MIN_BUSY_MS);

    expect(choose).toHaveBeenNthCalledWith(2, { weeklyDigest: false });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('keeps only the last of two quick changes', async () => {
    const first = deferred();
    const choose = vi
      .fn<ChooseEmailPreferences>()
      .mockReturnValueOnce(first.promise)
      .mockResolvedValueOnce({ weeklyDigest: true });
    renderSwitch(choose);

    fireEvent.click(screen.getByRole('switch'));
    fireEvent.click(screen.getByRole('switch'));
    first.settle().resolve({ weeklyDigest: false });
    await settle(SAVING_MIN_BUSY_MS);

    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('stops listening when it leaves the page', () => {
    const answer = deferred();
    const view = renderSwitch(() => answer.promise);
    fireEvent.click(screen.getByRole('switch'));

    view.unmount();

    expect(() => {
      answer.settle().resolve({ weeklyDigest: false });
    }).not.toThrow();
  });

  it('speaks Portuguese', () => {
    renderSwitch(() => Promise.resolve(ON), 'pt-BR');

    expect(screen.getByRole('switch', { name: 'Resumo semanal' })).toBeChecked();
    expect(screen.getByText('Ligado')).toBeInTheDocument();
  });
});
