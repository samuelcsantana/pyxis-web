'use client';

import { useSearchParams } from 'next/navigation';
import { type ReactNode, useEffect, useState } from 'react';
import type { SharedRequest } from '@/domain/shared-project';
import { type ScreenSearch, screenSearchOf } from '@/components/shell/screen-search';
import { BUTTON_SECONDARY } from '@/components/ui/control-classes';
import { useT } from '@/i18n/messages-provider';
import { forgetUnlock, storedUnlock } from './share-unlock';
import { SharedLinkClosed } from './shared-link-closed';
import { SharedPasswordForm } from './shared-password-form';

export interface SharedReportInput {
  readonly token: string;
  readonly screen: string;
  readonly card: unknown;
  readonly search: ScreenSearch;
}

export interface SharedReportProps {
  readonly token: string;
  readonly screen: string;
  readonly apiBase: string;
  readonly demoPassword: string | null;
  readonly requestsAction: (input: SharedReportInput) => Promise<readonly SharedRequest[]>;
  readonly renderAction: (
    input: SharedReportInput,
    answers: Readonly<Record<string, unknown>>,
  ) => Promise<ReactNode>;
}

type Shown =
  | { readonly kind: 'loading' }
  | { readonly kind: 'closed' }
  | { readonly kind: 'locked' }
  | { readonly kind: 'busy' }
  | { readonly kind: 'failed' }
  | { readonly kind: 'ready'; readonly content: ReactNode };

const UNAUTHORIZED = 401;
const NOT_FOUND = 404;
const TOO_MANY_REQUESTS = 429;
const LOADING: Shown = { kind: 'loading' };
const LOCKED: Shown = { kind: 'locked' };
const CLOSED: Shown = { kind: 'closed' };

function asksForAPassword(card: unknown): boolean {
  return (
    typeof card === 'object' &&
    card !== null &&
    'password_required' in card &&
    card.password_required === true
  );
}

class SharedAnswerError extends Error {
  constructor(readonly status: number) {
    super(`The shared report answered ${String(status)}.`);
    this.name = 'SharedAnswerError';
  }
}

const cards = new Map<string, Promise<unknown>>();

function readOptions(unlock: string | null): RequestInit {
  const options: RequestInit = { credentials: 'omit', cache: 'no-store' };
  return unlock === null ? options : { ...options, headers: { authorization: `Bearer ${unlock}` } };
}

async function readJson(url: string, unlock: string | null): Promise<unknown> {
  const response = await fetch(url, readOptions(unlock));
  if (!response.ok) {
    throw new SharedAnswerError(response.status);
  }
  return response.json();
}

function cardOf(apiBase: string, token: string, unlock: string | null): Promise<unknown> {
  const key = `${token} ${unlock ?? ''}`;
  const known = cards.get(key);
  if (known !== undefined) {
    return known;
  }
  const card = readJson(`${apiBase}/v1/shared/${encodeURIComponent(token)}`, unlock);
  cards.set(key, card);
  card.catch(() => {
    cards.delete(key);
  });
  return card;
}

export function forgetSharedCards(): void {
  cards.clear();
}

function shownAfter(error: unknown, token: string): Shown {
  if (error instanceof SharedAnswerError && error.status === UNAUTHORIZED) {
    forgetUnlock(token);
    return LOCKED;
  }
  if (error instanceof SharedAnswerError && error.status === NOT_FOUND) {
    return CLOSED;
  }
  if (error instanceof SharedAnswerError && error.status === TOO_MANY_REQUESTS) {
    return { kind: 'busy' };
  }
  return { kind: 'failed' };
}

export function SharedReport({
  token,
  screen,
  apiBase,
  demoPassword,
  requestsAction,
  renderAction,
}: SharedReportProps) {
  const t = useT();
  const parameters = useSearchParams();
  const query = parameters.toString();
  const [shown, setShown] = useState<Shown>(LOADING);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let wanted = true;
    const show = (next: Shown) => {
      if (wanted) {
        setShown(next);
      }
    };
    const load = async (): Promise<Shown> => {
      const unlock = storedUnlock(token);
      const card = await cardOf(apiBase, token, unlock);
      if (asksForAPassword(card)) {
        forgetUnlock(token);
        return LOCKED;
      }
      const input = { token, screen, card, search: screenSearchOf(new URLSearchParams(query)) };
      const requests = await requestsAction(input);
      const answers = await Promise.all(
        requests.map(
          async ({ key, path }) => [key, await readJson(`${apiBase}${path}`, unlock)] as const,
        ),
      );
      return { kind: 'ready', content: await renderAction(input, Object.fromEntries(answers)) };
    };
    load().then(
      (next) => {
        show(next);
      },
      (error: unknown) => {
        show(shownAfter(error, token));
      },
    );
    return () => {
      wanted = false;
    };
  }, [token, screen, apiBase, query, attempt, requestsAction, renderAction]);

  const retry = () => {
    setShown(LOADING);
    setAttempt((count) => count + 1);
  };

  switch (shown.kind) {
    case 'loading':
      return (
        <p role="status" className="p-4 text-sm text-muted sm:px-8">
          {t('share.loading')}
        </p>
      );
    case 'closed':
      return <SharedLinkClosed />;
    case 'locked':
      return (
        <SharedPasswordForm
          token={token}
          apiBase={apiBase}
          demoPassword={demoPassword}
          onUnlocked={retry}
          onClosed={() => {
            setShown(CLOSED);
          }}
        />
      );
    case 'busy':
    case 'failed':
      return (
        <div role="alert" className="flex flex-col items-start gap-2 p-4 text-sm sm:px-8">
          <p>{t(shown.kind === 'busy' ? 'share.busy' : 'share.failed')}</p>
          <button
            type="button"
            onClick={retry}
            className={`min-h-9 rounded-input px-3 text-sm ${BUTTON_SECONDARY}`}
          >
            {t('share.retry')}
          </button>
        </div>
      );
    case 'ready':
      return shown.content;
  }
}
