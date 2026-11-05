'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { catchToState, withSmoothLoading } from 'rx-state-bridge';
import { defer, type Subscription, tap } from 'rxjs';
import { BUTTON_DANGER, BUTTON_SECONDARY, CONTROL_BUSY } from '@/components/ui/control-classes';
import { PANEL, PANEL_TITLE } from '@/components/ui/panel-classes';
import {
  canAddGoal,
  type DeleteGoalOutcome,
  EMPTY_GOAL_DRAFT,
  type Goal,
  type GoalChanges,
  goalDraftOf,
  MAX_GOALS,
  type SaveGoalOutcome,
  withoutGoal,
  withSavedGoal,
} from '@/domain/goals';
import { useT } from '@/i18n/messages-provider';
import { GoalForm } from './goal-form';

export type CreateGoal = (changes: GoalChanges) => Promise<SaveGoalOutcome>;
export type UpdateGoal = (goalId: string, changes: GoalChanges) => Promise<SaveGoalOutcome>;
export type DeleteGoal = (goalId: string) => Promise<DeleteGoalOutcome>;

export interface GoalsManagement {
  readonly create: CreateGoal;
  readonly update: UpdateGoal;
  readonly remove: DeleteGoal;
}

export interface GoalsPanelProps {
  readonly goals: readonly Goal[];
  readonly manage: GoalsManagement | null;
}

type Editing =
  | { readonly kind: 'none' }
  | { readonly kind: 'adding' }
  | { readonly kind: 'editing'; readonly goalId: string }
  | { readonly kind: 'deleting'; readonly goalId: string };

type Done = 'added' | 'saved' | 'deleted';
type DeleteRefusal = 'subscriptionRequired' | 'failed';

export const DELETE_GOAL_MIN_BUSY_MS = 400;

const NONE: Editing = { kind: 'none' };
const NOTE = 'text-xs leading-[18px] text-muted';
const SMALL_BUTTON = `flex min-h-9 items-center rounded-input px-3 text-sm ${BUTTON_SECONDARY}`;
const ROW = 'flex flex-col gap-3 py-3 first:pt-0 last:pb-0';
const DONE_TEXT = {
  added: 'goalsEditor.added',
  saved: 'goalsEditor.saved',
  deleted: 'goalsEditor.deleted',
} as const satisfies Record<Done, string>;
const DELETE_REFUSAL_TEXT = {
  subscriptionRequired: 'goalsEditor.refused.subscriptionRequired',
  failed: 'goalsEditor.refused.deleteFailed',
} as const satisfies Record<DeleteRefusal, string>;

export function goalRowId(goalId: string): string {
  return `goal-${goalId}`;
}

interface GoalSummaryLineProps {
  readonly goal: Goal;
  readonly first: boolean;
}

function GoalSummaryLine({ goal, first }: GoalSummaryLineProps) {
  const t = useT();
  return (
    <div id={goalRowId(goal.id)} className="flex min-w-0 flex-col gap-0.5">
      <span className="flex flex-wrap items-center gap-2 text-sm font-semibold text-ink">
        <span className="wrap-anywhere">{goal.name}</span>
        {first ? (
          <span className="rounded-pill bg-soft px-2 py-0.5 text-micro font-semibold text-muted">
            {t('goalsEditor.first')}
          </span>
        ) : null}
      </span>
      <span className="text-xs text-muted">
        {t(goal.kind === 'event' ? 'goalsEditor.targetEvent' : 'goalsEditor.targetPage')}{' '}
        <code className="font-mono wrap-anywhere">{goal.target}</code>
      </span>
    </div>
  );
}

interface DeleteConfirmationProps {
  readonly goal: Goal;
  readonly remove: DeleteGoal;
  readonly deleted: () => void;
  readonly cancel: () => void;
}

function DeleteConfirmation({ goal, remove, deleted, cancel }: DeleteConfirmationProps) {
  const t = useT();
  const [busy, setBusy] = useState(false);
  const [refusal, setRefusal] = useState<DeleteRefusal | null>(null);
  const request = useRef<Subscription | undefined>(undefined);
  const confirmButton = useRef<HTMLButtonElement>(null);
  const questionId = useId();

  useEffect(() => {
    confirmButton.current?.focus();
    return () => request.current?.unsubscribe();
  }, []);

  const confirm = () => {
    request.current?.unsubscribe();
    setRefusal(null);
    request.current = defer(() => remove(goal.id))
      .pipe(
        tap((outcome) => {
          if (outcome.kind === 'deleted') {
            deleted();
          } else {
            setRefusal(outcome.kind);
          }
        }),
        catchToState(() => {
          setRefusal('failed');
        }),
        withSmoothLoading(setBusy, DELETE_GOAL_MIN_BUSY_MS),
      )
      .subscribe();
  };

  return (
    <div
      role="group"
      aria-labelledby={questionId}
      className="flex flex-col gap-2.5 rounded-card border border-bad bg-bad-soft p-3.5"
    >
      <p id={questionId} className="text-sm text-ink">
        {t('goalsEditor.confirmDelete', { name: goal.name })}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <button
          ref={confirmButton}
          type="button"
          onClick={confirm}
          disabled={busy}
          aria-busy={busy}
          className={`min-h-11 rounded-input px-4 text-sm ${BUTTON_DANGER} ${CONTROL_BUSY}`}
        >
          {busy ? t('goalsEditor.deleting') : t('goalsEditor.confirm')}
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
            {t(DELETE_REFUSAL_TEXT[refusal])}
          </p>
        )}
      </div>
    </div>
  );
}

export function GoalsPanel({ goals: initial, manage }: GoalsPanelProps) {
  const t = useT();
  const router = useRouter();
  const ids = useId();
  const [goals, setGoals] = useState(initial);
  const [editing, setEditing] = useState<Editing>(NONE);
  const [done, setDone] = useState<Done | null>(null);
  const [focusTarget, setFocusTarget] = useState<string | null>(null);
  const addButtonId = `${ids}-add`;
  const editButtonId = (goalId: string) => `${ids}-edit-${goalId}`;
  const headingId = `${ids}-heading`;

  useEffect(() => {
    if (focusTarget !== null) {
      document.getElementById(focusTarget)?.focus();
    }
  }, [focusTarget]);

  const start = (next: Editing) => {
    setFocusTarget(null);
    setDone(null);
    setEditing(next);
  };

  const finish = (result: Done, nextGoals: readonly Goal[], focus: string) => {
    setGoals(nextGoals);
    setEditing(NONE);
    setDone(result);
    router.refresh();
    setFocusTarget(focus);
  };

  const backTo = (focus: string) => {
    setEditing(NONE);
    setFocusTarget(focus);
  };

  return (
    <section aria-labelledby={headingId} className={PANEL}>
      <h2 id={headingId} className={PANEL_TITLE}>
        {t('goalsEditor.heading')}
      </h2>
      <p className={NOTE}>
        {t(manage === null ? 'goalsEditor.noteReadOnly' : 'goalsEditor.note', {
          max: String(MAX_GOALS),
        })}
      </p>
      {goals.length === 0 ? (
        <p className="text-sm text-muted">
          {t(manage === null ? 'goalsEditor.emptyReadOnly' : 'goalsEditor.empty')}
        </p>
      ) : (
        <ol className="flex flex-col divide-y divide-line">
          {goals.map((goal, index) => (
            <li key={goal.id} className={ROW}>
              {manage !== null && editing.kind === 'editing' && editing.goalId === goal.id ? (
                <GoalForm
                  initial={goalDraftOf(goal)}
                  save={(changes) => manage.update(goal.id, changes)}
                  saved={(outcome) => {
                    finish('saved', withSavedGoal(goals, outcome.goal), editButtonId(goal.id));
                  }}
                  cancel={() => {
                    backTo(editButtonId(goal.id));
                  }}
                  submitLabel="save"
                />
              ) : (
                <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                  <GoalSummaryLine goal={goal} first={index === 0} />
                  {manage === null ? null : (
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        id={editButtonId(goal.id)}
                        type="button"
                        onClick={() => {
                          start({ kind: 'editing', goalId: goal.id });
                        }}
                        aria-describedby={goalRowId(goal.id)}
                        className={SMALL_BUTTON}
                      >
                        {t('goalsEditor.edit')}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          start({ kind: 'deleting', goalId: goal.id });
                        }}
                        aria-describedby={goalRowId(goal.id)}
                        className={SMALL_BUTTON}
                      >
                        {t('goalsEditor.delete')}
                      </button>
                    </div>
                  )}
                </div>
              )}
              {manage !== null && editing.kind === 'deleting' && editing.goalId === goal.id ? (
                <DeleteConfirmation
                  goal={goal}
                  remove={manage.remove}
                  deleted={() => {
                    finish('deleted', withoutGoal(goals, goal.id), addButtonId);
                  }}
                  cancel={() => {
                    backTo(editButtonId(goal.id));
                  }}
                />
              ) : null}
            </li>
          ))}
        </ol>
      )}
      {done === null ? null : (
        <p role="status" className="text-sm font-medium text-ok">
          {t(DONE_TEXT[done])}
        </p>
      )}
      {manage === null ? null : (
        <div className="flex flex-col gap-2 border-t border-line pt-3">
          {editing.kind === 'adding' ? (
            <GoalForm
              initial={EMPTY_GOAL_DRAFT}
              save={manage.create}
              saved={(outcome) => {
                finish('added', withSavedGoal(goals, outcome.goal), editButtonId(outcome.goal.id));
              }}
              cancel={() => {
                backTo(addButtonId);
              }}
              submitLabel="add"
            />
          ) : canAddGoal(goals) ? (
            <button
              id={addButtonId}
              type="button"
              onClick={() => {
                start({ kind: 'adding' });
              }}
              className={`${SMALL_BUTTON} self-start`}
            >
              {t('goalsEditor.addGoal')}
            </button>
          ) : (
            <p className={NOTE}>{t('goalsEditor.full', { max: String(MAX_GOALS) })}</p>
          )}
          <p className={NOTE}>
            {t('goalsEditor.count', {
              count: String(goals.length),
              max: String(MAX_GOALS),
            })}
          </p>
        </div>
      )}
    </section>
  );
}
