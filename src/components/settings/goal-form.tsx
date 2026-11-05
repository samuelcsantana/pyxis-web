'use client';

import { type SubmitEvent, useEffect, useId, useRef, useState } from 'react';
import { catchToState, withSmoothLoading } from 'rx-state-bridge';
import { defer, type Subscription, tap } from 'rxjs';
import {
  BUTTON_PRIMARY,
  BUTTON_SECONDARY,
  CONTROL_BUSY,
  FIELD,
} from '@/components/ui/control-classes';
import {
  GOAL_KINDS,
  type GoalChanges,
  type GoalDraft,
  type GoalDraftProblems,
  type GoalKind,
  goalChangesOf,
  goalDraftProblems,
  hasGoalProblems,
  MAX_GOAL_NAME_LENGTH,
  MAX_GOAL_PATH_LENGTH,
  MAX_GOALS,
  type SaveGoalOutcome,
} from '@/domain/goals';
import { useT } from '@/i18n/messages-provider';

export type SaveGoal = (changes: GoalChanges) => Promise<SaveGoalOutcome>;

export interface GoalFormProps {
  readonly initial: GoalDraft;
  readonly save: SaveGoal;
  readonly saved: (outcome: Extract<SaveGoalOutcome, { kind: 'saved' }>) => void;
  readonly cancel: () => void;
  readonly submitLabel: 'add' | 'save';
}

type Refusal = Exclude<SaveGoalOutcome['kind'], 'saved'> | 'failed';

export const SAVE_GOAL_MIN_BUSY_MS = 400;

const LABEL = 'text-caption font-medium';
const NOTE = 'text-xs leading-[18px] text-muted';
const ERROR = 'text-caption font-medium text-bad';
const INPUT = `min-h-11 w-full rounded-input px-3 text-base placeholder:text-muted sm:text-sm ${FIELD}`;
const KIND_OPTION =
  'flex min-h-11 cursor-pointer items-center gap-2.5 rounded-input border border-line px-3 text-sm has-checked:border-ink has-checked:font-medium';

const REFUSAL_TEXT = {
  invalid: 'goalsEditor.refused.invalid',
  limitReached: 'goalsEditor.refused.limitReached',
  notFound: 'goalsEditor.refused.notFound',
  subscriptionRequired: 'goalsEditor.refused.subscriptionRequired',
  failed: 'goalsEditor.refused.failed',
} as const satisfies Record<Refusal, string>;

const TARGET_PROBLEM_TEXT = {
  eventName: 'goalsEditor.problems.eventName',
  pathStart: 'goalsEditor.problems.pathStart',
  pathLength: 'goalsEditor.problems.pathLength',
} as const;

const TARGET_TEXT = {
  event: {
    label: 'goalsEditor.eventName',
    placeholder: 'goalsEditor.eventPlaceholder',
    note: 'goalsEditor.eventNote',
  },
  page: {
    label: 'goalsEditor.pagePath',
    placeholder: 'goalsEditor.pagePlaceholder',
    note: 'goalsEditor.pageNote',
  },
} as const satisfies Record<GoalKind, Record<'label' | 'placeholder' | 'note', string>>;

const KIND_TEXT = {
  event: 'goalsEditor.kindEvent',
  page: 'goalsEditor.kindPage',
} as const satisfies Record<GoalKind, string>;

export function GoalForm({ initial, save, saved, cancel, submitLabel }: GoalFormProps) {
  const t = useT();
  const ids = useId();
  const [name, setName] = useState(initial.name);
  const [kind, setKind] = useState<GoalKind>(initial.kind);
  const [target, setTarget] = useState(initial.target);
  const [problems, setProblems] = useState<GoalDraftProblems>({});
  const [refusal, setRefusal] = useState<Refusal | null>(null);
  const [busy, setBusy] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  const nameField = useRef<HTMLInputElement>(null);
  const request = useRef<Subscription | undefined>(undefined);

  useEffect(() => {
    nameField.current?.focus();
    return () => request.current?.unsubscribe();
  }, []);

  const fieldId = (field: string) => `${ids}-${field}`;
  const errorId = (field: string) => `${ids}-${field}-error`;
  const draft: GoalDraft = { name, kind, target };

  const edited = () => {
    setRefusal(null);
  };

  const focusFirstProblem = () => {
    form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  };

  const submit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = goalDraftProblems(draft);
    setProblems(found);
    setRefusal(null);
    if (hasGoalProblems(found)) {
      requestAnimationFrame(focusFirstProblem);
      return;
    }
    request.current?.unsubscribe();
    request.current = defer(() => save(goalChangesOf(draft)))
      .pipe(
        tap((outcome) => {
          if (outcome.kind === 'saved') {
            saved(outcome);
          } else {
            setRefusal(outcome.kind);
          }
        }),
        catchToState(() => {
          setRefusal('failed');
        }),
        withSmoothLoading(setBusy, SAVE_GOAL_MIN_BUSY_MS),
      )
      .subscribe();
  };

  const describedBy = (field: keyof GoalDraftProblems, note: string) =>
    problems[field] === undefined ? note : `${note} ${errorId(field)}`;

  const targetText = TARGET_TEXT[kind];

  return (
    <form
      ref={form}
      noValidate
      onSubmit={submit}
      className="flex flex-col gap-4 rounded-card border border-line bg-bg p-3.5 sm:p-4"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor={fieldId('name')} className={LABEL}>
          {t('goalsEditor.name')}
        </label>
        <input
          ref={nameField}
          id={fieldId('name')}
          type="text"
          autoComplete="off"
          value={name}
          placeholder={t('goalsEditor.namePlaceholder')}
          onChange={(event) => {
            edited();
            setName(event.target.value);
          }}
          aria-invalid={problems.name !== undefined}
          aria-describedby={describedBy('name', fieldId('name-note'))}
          className={INPUT}
        />
        <p id={fieldId('name-note')} className={NOTE}>
          {t('goalsEditor.nameNote')}
        </p>
        {problems.name === undefined ? null : (
          <p id={errorId('name')} role="alert" className={ERROR}>
            {problems.name === 'missing'
              ? t('goalsEditor.problems.nameMissing')
              : t('goalsEditor.problems.nameTooLong', { max: String(MAX_GOAL_NAME_LENGTH) })}
          </p>
        )}
      </div>
      <fieldset className="flex flex-col gap-1.5">
        <legend className={`${LABEL} mb-1.5`}>{t('goalsEditor.kind')}</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {GOAL_KINDS.map((option) => (
            <label key={option} className={KIND_OPTION}>
              <input
                type="radio"
                name={fieldId('kind')}
                value={option}
                checked={kind === option}
                onChange={() => {
                  edited();
                  setKind(option);
                  setProblems((current) => ({ ...current, target: undefined }));
                }}
                className="size-4 shrink-0"
              />
              {t(KIND_TEXT[option])}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={fieldId('target')} className={LABEL}>
          {t(targetText.label)}
        </label>
        <input
          id={fieldId('target')}
          type="text"
          autoComplete="off"
          spellCheck={false}
          value={target}
          placeholder={t(targetText.placeholder)}
          onChange={(event) => {
            edited();
            setTarget(event.target.value);
          }}
          aria-invalid={problems.target !== undefined}
          aria-describedby={describedBy('target', fieldId('target-note'))}
          className={`${INPUT} font-mono`}
        />
        <p id={fieldId('target-note')} className={NOTE}>
          {t(targetText.note)}
        </p>
        {problems.target === undefined ? null : (
          <p id={errorId('target')} role="alert" className={ERROR}>
            {t(TARGET_PROBLEM_TEXT[problems.target], { max: String(MAX_GOAL_PATH_LENGTH) })}
          </p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={busy}
          aria-busy={busy}
          className={`min-h-11 rounded-input px-4 text-sm ${BUTTON_PRIMARY} ${CONTROL_BUSY}`}
        >
          {busy
            ? t('goalsEditor.saving')
            : t(submitLabel === 'add' ? 'goalsEditor.add' : 'goalsEditor.save')}
        </button>
        <button
          type="button"
          onClick={cancel}
          className={`min-h-11 rounded-input px-4 text-sm ${BUTTON_SECONDARY}`}
        >
          {t('goalsEditor.cancel')}
        </button>
        {refusal === null ? null : (
          <p role="alert" className="text-sm text-bad">
            {t(REFUSAL_TEXT[refusal], { max: String(MAX_GOALS) })}
          </p>
        )}
      </div>
    </form>
  );
}
