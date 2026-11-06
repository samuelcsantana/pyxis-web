'use client';

import { useRouter } from 'next/navigation';
import { type SubmitEvent, useEffect, useRef, useState } from 'react';
import { catchToState, withSmoothLoading } from 'rx-state-bridge';
import { defer, type Subscription, tap } from 'rxjs';
import { BUTTON_PRIMARY, CONTROL_BUSY, FIELD } from '@/components/ui/control-classes';
import { SelectField } from '@/components/ui/select-field';
import {
  type CreatedShareLink,
  type CreateShareLinkOutcome,
  DEFAULT_SHARE_LINK_EXPIRY,
  MAX_SHARE_LINK_NAME_LENGTH,
  MAX_SHARE_LINKS,
  type NewShareLink,
  parseShareLinkExpiry,
  SHARE_LINK_LIFETIMES,
  type ShareLinkExpiry,
  type ShareLinkNameProblem,
  shareLinkNameProblem,
  type SharePasswordProblem,
  sharePasswordProblem,
} from '@/domain/share-links';
import { useT } from '@/i18n/messages-provider';
import { NewShareLinkReveal } from './new-share-link-reveal';
import { SharePasswordField } from './share-password-field';

export type CreateShareLink = (link: NewShareLink) => Promise<CreateShareLinkOutcome>;

export interface CreateShareLinkFormProps {
  readonly create: CreateShareLink;
  readonly limitReached: boolean;
  readonly onCreated: (link: CreatedShareLink) => void;
}

type Failure = 'planRequired' | 'limitReached' | 'failed';

export const CREATE_SHARE_LINK_MIN_BUSY_MS = 400;

const NAME_ID = 'share-link-name';
const NAME_ERROR_ID = 'share-link-name-error';
const EXPIRY_ID = 'share-link-expiry';
const PASSWORD_ID = 'share-link-password';
const LABEL = 'text-caption font-medium';
const INPUT = `min-h-11 w-full rounded-input px-3 text-base placeholder:text-muted sm:text-sm ${FIELD}`;
const EXPIRY_CHOICES: readonly ShareLinkExpiry[] = ['never', ...SHARE_LINK_LIFETIMES];
const EXPIRY_LABELS = {
  never: 'shareLinks.expiryNever',
  7: 'shareLinks.expiry7',
  30: 'shareLinks.expiry30',
  90: 'shareLinks.expiry90',
  365: 'shareLinks.expiry365',
} as const satisfies Record<ShareLinkExpiry, string>;

function nameProblemText(problem: ShareLinkNameProblem, t: ReturnType<typeof useT>): string {
  return problem === 'missing'
    ? t('shareLinks.nameMissing')
    : t('shareLinks.nameTooLong', { max: String(MAX_SHARE_LINK_NAME_LENGTH) });
}

export function CreateShareLinkForm({ create, limitReached, onCreated }: CreateShareLinkFormProps) {
  const t = useT();
  const router = useRouter();
  const nameField = useRef<HTMLInputElement>(null);
  const passwordField = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordProblem, setPasswordProblem] = useState<SharePasswordProblem | null>(null);
  const [expiry, setExpiry] = useState<ShareLinkExpiry>(DEFAULT_SHARE_LINK_EXPIRY);
  const [nameProblem, setNameProblem] = useState<ShareLinkNameProblem | null>(null);
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState<Failure | null>(null);
  const [created, setCreated] = useState<CreatedShareLink | null>(null);
  const request = useRef<Subscription | undefined>(undefined);

  useEffect(() => () => request.current?.unsubscribe(), []);

  if (created !== null) {
    return (
      <NewShareLinkReveal
        token={created.token}
        onDone={() => {
          setCreated(null);
        }}
      />
    );
  }

  const tooMany = (
    <p role="status" className="text-sm text-muted">
      {t('shareLinks.tooMany', { max: String(MAX_SHARE_LINKS) })}
    </p>
  );
  if (limitReached) {
    return tooMany;
  }

  const submit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const problem = shareLinkNameProblem(name);
    const chosenPassword = password === '' ? null : password;
    const weakPassword = chosenPassword === null ? null : sharePasswordProblem(chosenPassword);
    setNameProblem(problem);
    setPasswordProblem(weakPassword);
    if (problem !== null) {
      nameField.current?.focus();
      return;
    }
    if (weakPassword !== null) {
      passwordField.current?.focus();
      return;
    }
    request.current?.unsubscribe();
    setFailure(null);
    request.current = defer(() => create({ name: name.trim(), expiry, password: chosenPassword }))
      .pipe(
        tap((outcome) => {
          if (outcome.kind !== 'created') {
            setFailure(outcome.kind);
            return;
          }
          setName('');
          setPassword('');
          setCreated(outcome.link);
          onCreated(outcome.link);
          router.refresh();
        }),
        catchToState(() => {
          setFailure('failed');
        }),
        withSmoothLoading(setBusy, CREATE_SHARE_LINK_MIN_BUSY_MS),
      )
      .subscribe();
  };

  return (
    <form noValidate onSubmit={submit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <label htmlFor={NAME_ID} className={LABEL}>
            {t('shareLinks.name')}
          </label>
          <input
            ref={nameField}
            id={NAME_ID}
            type="text"
            autoComplete="off"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
            placeholder={t('shareLinks.namePlaceholder')}
            aria-invalid={nameProblem !== null}
            aria-describedby={nameProblem === null ? undefined : NAME_ERROR_ID}
            className={INPUT}
          />
        </div>
        <div className="flex flex-col gap-1.5 sm:w-40">
          <label htmlFor={EXPIRY_ID} className={LABEL}>
            {t('shareLinks.expiry')}
          </label>
          <SelectField
            id={EXPIRY_ID}
            value={String(expiry)}
            onChange={(event) => {
              const chosen = parseShareLinkExpiry(event.target.value);
              if (chosen !== null) {
                setExpiry(chosen);
              }
            }}
            className={INPUT}
          >
            {EXPIRY_CHOICES.map((choice) => (
              <option key={choice} value={choice}>
                {t(EXPIRY_LABELS[choice])}
              </option>
            ))}
          </SelectField>
        </div>
      </div>
      {nameProblem === null ? null : (
        <p id={NAME_ERROR_ID} role="alert" className="text-caption font-medium text-bad">
          {nameProblemText(nameProblem, t)}
        </p>
      )}
      <div className="sm:max-w-sm">
        <SharePasswordField
          id={PASSWORD_ID}
          label={t('shareLinks.password')}
          value={password}
          problem={passwordProblem}
          onChange={setPassword}
          fieldRef={passwordField}
        />
      </div>
      <button
        type="submit"
        disabled={busy}
        aria-busy={busy}
        className={`min-h-11 self-start rounded-input px-4 text-sm ${BUTTON_PRIMARY} ${CONTROL_BUSY}`}
      >
        {busy ? t('shareLinks.creating') : t('shareLinks.create')}
      </button>
      {failure === 'limitReached' ? tooMany : null}
      {failure === 'planRequired' ? (
        <p role="alert" className="text-caption font-medium text-bad">
          {t('shareLinks.planRequired')}
        </p>
      ) : null}
      {failure === 'failed' ? (
        <p role="alert" className="text-caption font-medium text-bad">
          {t('shareLinks.failed')}
        </p>
      ) : null}
    </form>
  );
}
