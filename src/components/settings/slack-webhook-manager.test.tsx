import { act, fireEvent, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { SlackWebhook, TestSlackWebhookOutcome } from '@/domain/slack-webhook';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import {
  type RemoveSlackWebhook,
  type SaveSlackWebhook,
  SLACK_MIN_BUSY_MS,
  SlackWebhookManager,
  type SlackWebhookManagerProps,
  type TestSlackWebhook,
} from './slack-webhook-manager';

const refresh = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), refresh }),
}));

const NOW = new Date('2026-11-06T12:00:00.000Z');
const WEBHOOK_URL = 'https://hooks.slack.com/services/T0001/B0002/abcdefghijklWXYZ';
const WORKING: SlackWebhook = {
  maskedUrl: 'hooks.slack.com/…/WXYZ',
  connectedAt: '2026-11-01T12:00:00.000Z',
  brokenAt: null,
  brokenReason: null,
};
const BROKEN: SlackWebhook = {
  ...WORKING,
  brokenAt: '2026-11-05T06:00:00.000Z',
  brokenReason: 'channel_not_found',
};

function renderManager(overrides: Partial<SlackWebhookManagerProps> = {}) {
  const props: SlackWebhookManagerProps = {
    initial: null,
    onPro: true,
    save: vi.fn<SaveSlackWebhook>(() =>
      Promise.resolve({ kind: 'saved', webhook: WORKING } as const),
    ),
    test: vi.fn<TestSlackWebhook>(() =>
      Promise.resolve({ kind: 'tested', result: 'sent' } as const),
    ),
    remove: vi.fn<RemoveSlackWebhook>(() => Promise.resolve()),
    timezone: 'UTC',
    proOffer: <p>Available on Pro</p>,
    ...overrides,
  };
  renderWithMessages(<SlackWebhookManager {...props} />);
  return props;
}

async function settle() {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(SLACK_MIN_BUSY_MS);
  });
}

function field() {
  return screen.getByRole('textbox', { name: 'Webhook address' });
}

function paste(url: string) {
  fireEvent.change(field(), { target: { value: url } });
  fireEvent.click(screen.getByRole('button', { name: 'Save' }));
}

describe('SlackWebhookManager', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date', 'setTimeout', 'clearTimeout'] });
    vi.setSystemTime(NOW);
    refresh.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('explains how to create a webhook in Slack, linking to Slack’s own guide', () => {
    renderManager();

    const steps = screen.getAllByRole('listitem');
    expect(steps).toHaveLength(3);
    const [first] = steps;
    if (first === undefined) {
      throw new Error('Three steps were expected.');
    }
    expect(
      within(first).getByRole('link', {
        name: 'Sending messages using incoming webhooks',
      }),
    ).toHaveAttribute('href', 'https://api.slack.com/messaging/webhooks');
    expect(field()).toHaveAccessibleDescription(
      'It starts with https://hooks.slack.com/services/. Pyxis keeps it encrypted and shows only its last four characters.',
    );
  });

  it('saves a pasted address, then shows only its masked form', async () => {
    const props = renderManager();

    paste(WEBHOOK_URL);
    expect(screen.getByRole('button', { name: 'Saving…' })).toBeDisabled();
    await settle();

    expect(props.save).toHaveBeenCalledWith(WEBHOOK_URL);
    expect(screen.getByText('hooks.slack.com/…/WXYZ')).toBeVisible();
    expect(screen.getByText('Connected on Nov 1, 2026, 12:00')).toBeVisible();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(document.body.innerHTML).not.toContain('abcdefghijkl');
    expect(refresh).toHaveBeenCalled();
  });

  it.each([
    ['', 'Paste the webhook address.'],
    ['https://example.com/hook', 'This is not a Slack Incoming Webhook address'],
  ])('checks the address %j before sending it', (url, text) => {
    const props = renderManager();

    paste(url);

    expect(screen.getByRole('alert')).toHaveTextContent(text);
    expect(field()).toHaveFocus();
    expect(field()).toHaveAttribute('aria-invalid', 'true');
    expect(props.save).not.toHaveBeenCalled();
  });

  it.each([
    ['invalid', 'This is not a Slack Incoming Webhook address'],
    ['planRequired', 'Slack alerts need the Pro plan.'],
    ['unavailable', 'Slack alerts are not available right now. Try again later.'],
  ] as const)('says why the API refused the address (%s)', async (kind, text) => {
    renderManager({ save: () => Promise.resolve({ kind }) });

    paste(WEBHOOK_URL);
    await settle();

    expect(screen.getByRole('alert')).toHaveTextContent(text);
    expect(field()).toHaveValue(WEBHOOK_URL);
  });

  it('says the change was not saved when the request fails', async () => {
    renderManager({ save: () => Promise.reject(new Error('Pyxis API answered 500')) });

    paste(WEBHOOK_URL);
    await settle();

    expect(screen.getByRole('alert')).toHaveTextContent('The change was not saved. Try again.');
  });

  it.each([
    ['sent', 'status', 'Slack accepted the test message. Look for it in the channel.'],
    ['broken', 'alert', 'Slack says this webhook no longer exists. Paste a new address.'],
    ['failed', 'alert', 'Slack could not be reached. Try again later.'],
  ] as const)('shows plainly that a test was %s', async (result, role, text) => {
    const props = renderManager({
      initial: WORKING,
      test: () => Promise.resolve({ kind: 'tested', result }),
    });

    fireEvent.click(screen.getByRole('button', { name: 'Send test' }));
    expect(screen.getByRole('button', { name: 'Sending…' })).toBeDisabled();
    await settle();

    expect(screen.getByRole(role)).toHaveTextContent(text);
    expect(props.save).not.toHaveBeenCalled();
  });

  it('marks the webhook broken at once when a test finds it gone', async () => {
    renderManager({
      initial: WORKING,
      test: () => Promise.resolve({ kind: 'tested', result: 'broken' }),
    });

    fireEvent.click(screen.getByRole('button', { name: 'Send test' }));
    await settle();

    expect(screen.getByText('Broken since Nov 6, 2026, 12:00. Paste a new address.')).toBeVisible();
  });

  it.each([
    [{ kind: 'tooMany' }, 'Too many tests. Try again in a few minutes.'],
    [{ kind: 'planRequired' }, 'Slack alerts need the Pro plan.'],
    [{ kind: 'missing' }, 'This project has no Slack webhook any more. Reload the page.'],
    [{ kind: 'unavailable' }, 'Slack alerts are not available right now. Try again later.'],
  ] as const satisfies readonly (readonly [TestSlackWebhookOutcome, string])[])(
    'says why a test did not run (%j)',
    async (outcome, text) => {
      renderManager({ initial: WORKING, test: () => Promise.resolve(outcome) });

      fireEvent.click(screen.getByRole('button', { name: 'Send test' }));
      await settle();

      expect(screen.getByRole('alert')).toHaveTextContent(text);
    },
  );

  it('shows a broken webhook with what Slack answered', () => {
    renderManager({ initial: BROKEN });

    expect(
      screen.getByText(
        'Broken since Nov 5, 2026, 06:00: Slack answered “channel_not_found”. Paste a new address.',
      ),
    ).toBeVisible();
  });

  it('replaces the address, and can go back without changing it', async () => {
    const props = renderManager({ initial: WORKING });

    fireEvent.click(screen.getByRole('button', { name: 'Replace' }));
    fireEvent.change(field(), { target: { value: 'typo' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Replace' }));
    expect(field()).toHaveValue('');
    paste(WEBHOOK_URL);
    await settle();

    expect(props.save).toHaveBeenCalledWith(WEBHOOK_URL);
  });

  it('removes the webhook only after a confirmation, then offers the form again', async () => {
    const props = renderManager({ initial: WORKING });

    fireEvent.click(screen.getByRole('button', { name: 'Remove' }));
    const question = screen.getByRole('group', {
      name: 'Remove the Slack webhook? The alerts stop going to this channel.',
    });
    const confirm = within(question).getByRole('button', { name: 'Remove' });
    expect(confirm).toHaveFocus();
    fireEvent.click(within(question).getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('group')).not.toBeInTheDocument();
    expect(props.remove).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Remove' }));
    fireEvent.click(within(screen.getByRole('group')).getByRole('button', { name: 'Remove' }));
    expect(screen.getByRole('button', { name: 'Removing…' })).toBeDisabled();
    await settle();

    expect(props.remove).toHaveBeenCalledOnce();
    expect(screen.queryByText('hooks.slack.com/…/WXYZ')).not.toBeInTheDocument();
    expect(field()).toBeVisible();
    expect(refresh).toHaveBeenCalled();
  });

  it('says the webhook was not removed when the request fails', async () => {
    renderManager({
      initial: WORKING,
      remove: () => Promise.reject(new Error('Pyxis API answered 500')),
    });

    fireEvent.click(screen.getByRole('button', { name: 'Remove' }));
    fireEvent.click(within(screen.getByRole('group')).getByRole('button', { name: 'Remove' }));
    await settle();

    expect(screen.getByRole('alert')).toHaveTextContent('The webhook was not removed. Try again.');
  });

  it('offers Pro instead of the form on Hobby, and still shows and removes a stored webhook', () => {
    renderManager({ initial: null, onPro: false });
    expect(screen.getByText('Available on Pro')).toBeVisible();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('keeps only Remove for a stored webhook on Hobby', () => {
    renderManager({ initial: WORKING, onPro: false });

    expect(screen.getByText('hooks.slack.com/…/WXYZ')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Remove' })).toBeVisible();
    expect(screen.queryByRole('button', { name: 'Send test' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Replace' })).not.toBeInTheDocument();
  });

  it('stops listening when it leaves the page', () => {
    let finish: () => void = () => undefined;
    const view = renderWithMessages(
      <SlackWebhookManager
        initial={WORKING}
        onPro
        save={vi.fn()}
        test={() =>
          new Promise((resolve) => {
            finish = () => {
              resolve({ kind: 'tested', result: 'sent' });
            };
          })
        }
        remove={vi.fn()}
        timezone="UTC"
        proOffer={null}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Send test' }));

    view.unmount();

    expect(() => {
      finish();
    }).not.toThrow();
  });

  it('speaks Portuguese', () => {
    renderWithMessages(
      <SlackWebhookManager
        initial={WORKING}
        onPro
        save={vi.fn()}
        test={vi.fn()}
        remove={vi.fn()}
        timezone="UTC"
        proOffer={null}
      />,
      'pt-BR',
    );

    expect(screen.getByRole('button', { name: 'Enviar teste' })).toBeVisible();
  });
});
