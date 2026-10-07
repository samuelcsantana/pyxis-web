'use client';

import { type ChangeEvent, useEffect, useRef, useState } from 'react';
import {
  type FunnelStep,
  type FunnelStepType,
  isCountableFunnel,
  MAX_FUNNEL_STEPS,
  MIN_FUNNEL_STEPS,
  serializeSteps,
  stepProblem,
  stepTarget,
} from '@/domain/funnel';
import type { KeptParameters } from '@/components/shell/period-selector';
import { PANEL, PANEL_TITLE } from '@/components/ui/panel-classes';
import {
  BUTTON_PRIMARY,
  BUTTON_STRONG,
  CONTROL_DISABLED,
  FOCUS_RING,
} from '@/components/ui/control-classes';

interface DraftStep {
  readonly id: number;
  readonly type: FunnelStepType;
  readonly value: string;
}

export interface FunnelEditorProps {
  readonly initialSteps: readonly FunnelStep[];
  readonly action: string;
  readonly keep: KeptParameters;
  readonly startOpen: boolean;
}

const ADD_STEP_ID = 'funnel-add-step';
const BUTTON = `min-h-9 rounded-control border border-line bg-card px-2.5 text-[13px] text-ink hover:bg-soft ${FOCUS_RING} disabled:cursor-not-allowed disabled:opacity-50`;
const FIELD = `min-h-10 rounded-control border border-line bg-card px-2.5 text-sm text-ink ${FOCUS_RING} aria-invalid:border-bad`;

function toStep(draft: DraftStep): FunnelStep {
  return draft.type === 'page'
    ? { type: 'page', path: draft.value }
    : { type: 'event', name: draft.value };
}

function toDraft(step: FunnelStep, id: number): DraftStep {
  return { id, type: step.type, value: stepTarget(step) };
}

function statusOf(drafts: readonly DraftStep[], valid: boolean): string {
  if (valid) {
    return `Apply to count these ${String(drafts.length)} steps.`;
  }
  return drafts.some((draft) => draft.value === '')
    ? 'Fill in every step to apply.'
    : 'Fix the highlighted steps to apply.';
}

function moved(drafts: readonly DraftStep[], index: number, offset: number): DraftStep[] {
  const taken = drafts.slice(index, index + 1);
  return drafts.toSpliced(index, 1).toSpliced(index + offset, 0, ...taken);
}

export function FunnelEditor({ initialSteps, action, keep, startOpen }: FunnelEditorProps) {
  const [open, setOpen] = useState(startOpen);
  const [drafts, setDrafts] = useState<readonly DraftStep[]>(() => initialSteps.map(toDraft));
  const nextId = useRef(initialSteps.length);
  const pendingFocus = useRef<readonly string[]>([]);
  const formRef = useRef<HTMLFormElement>(null as unknown as HTMLFormElement);

  useEffect(() => {
    const selectors = pendingFocus.current;
    pendingFocus.current = [];
    selectors
      .flatMap((selector) => [...formRef.current.querySelectorAll<HTMLElement>(selector)])
      .filter((element) => !element.matches(':disabled'))
      .slice(0, 1)
      .forEach((element) => {
        element.focus();
      });
  });

  const steps = drafts.map(toStep);
  const valid = isCountableFunnel(steps);

  const add = () => {
    const id = nextId.current;
    nextId.current += 1;
    pendingFocus.current = [`#step-value-${String(id)}`];
    setDrafts([...drafts, { id, type: 'event', value: '' }]);
  };

  const remove = (index: number) => {
    const remaining = drafts.toSpliced(index, 1);
    const following = remaining[index];
    pendingFocus.current = [
      ...(following === undefined ? [] : [`#remove-step-${String(following.id)}`]),
      `#${ADD_STEP_ID}`,
    ];
    setDrafts(remaining);
  };

  const move = (index: number, offset: number, id: number) => {
    const [kept, other] = offset < 0 ? ['up', 'down'] : ['down', 'up'];
    pendingFocus.current = [`#move-${kept}-${String(id)}`, `#move-${other}-${String(id)}`];
    setDrafts(moved(drafts, index, offset));
  };

  const update = (id: number, change: Partial<Omit<DraftStep, 'id'>>) => {
    setDrafts(drafts.map((draft) => (draft.id === id ? { ...draft, ...change } : draft)));
  };

  return (
    <section aria-labelledby="funnel-editor-heading" className={PANEL}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="funnel-editor-heading" className={PANEL_TITLE}>
          Steps
        </h2>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="funnel-editor"
          onClick={() => {
            setOpen((wasOpen) => !wasOpen);
          }}
          className={`min-h-10 rounded-input px-4 text-sm ${BUTTON_PRIMARY}`}
        >
          {open ? 'Close the editor' : 'Edit steps'}
        </button>
      </div>
      {open ? (
        <form
          id="funnel-editor"
          ref={formRef}
          action={action}
          method="get"
          className="flex flex-col gap-3"
        >
          {Object.entries(keep).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))}
          <input type="hidden" name="steps" value={serializeSteps(steps)} />
          <ol className="flex flex-col gap-2.5">
            {drafts.map((draft, index) => {
              const position = String(index + 1);
              const problem = draft.value === '' ? null : stepProblem(toStep(draft));
              const problemId = `step-problem-${String(draft.id)}`;
              return (
                <li
                  key={draft.id}
                  className="grid grid-cols-1 gap-2 rounded-input border border-line p-3 sm:grid-cols-[10rem_minmax(0,1fr)_auto] sm:items-end"
                >
                  <label className="flex flex-col gap-1 text-xs font-medium text-muted">
                    Step {position} type
                    <select
                      id={`step-type-${String(draft.id)}`}
                      value={draft.type}
                      onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                        update(draft.id, {
                          type: event.target.value === 'page' ? 'page' : 'event',
                        });
                      }}
                      className={FIELD}
                    >
                      <option value="page">Page path</option>
                      <option value="event">Event name</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-1 text-xs font-medium text-muted">
                    Step {position} {draft.type === 'page' ? 'page path' : 'event name'}
                    <input
                      id={`step-value-${String(draft.id)}`}
                      value={draft.value}
                      placeholder={
                        draft.type === 'page' ? '/pricing or /blog/*' : 'signup_completed'
                      }
                      aria-invalid={problem !== null}
                      aria-describedby={problem === null ? undefined : problemId}
                      onChange={(event) => {
                        update(draft.id, { value: event.target.value });
                      }}
                      className={`${FIELD} font-mono`}
                    />
                  </label>
                  <span className="flex gap-1.5">
                    <button
                      id={`move-up-${String(draft.id)}`}
                      type="button"
                      aria-label={`Move step ${position} up`}
                      disabled={index === 0}
                      onClick={() => {
                        move(index, -1, draft.id);
                      }}
                      className={BUTTON}
                    >
                      ↑
                    </button>
                    <button
                      id={`move-down-${String(draft.id)}`}
                      type="button"
                      aria-label={`Move step ${position} down`}
                      disabled={index === drafts.length - 1}
                      onClick={() => {
                        move(index, 1, draft.id);
                      }}
                      className={BUTTON}
                    >
                      ↓
                    </button>
                    <button
                      id={`remove-step-${String(draft.id)}`}
                      type="button"
                      aria-label={`Remove step ${position}`}
                      disabled={drafts.length <= MIN_FUNNEL_STEPS}
                      onClick={() => {
                        remove(index);
                      }}
                      className={BUTTON}
                    >
                      Remove
                    </button>
                  </span>
                  {problem === null ? null : (
                    <p id={problemId} className="text-xs text-bad sm:col-span-3">
                      {problem}
                    </p>
                  )}
                </li>
              );
            })}
          </ol>
          <div className="flex flex-wrap items-center gap-3">
            <button
              id={ADD_STEP_ID}
              type="button"
              disabled={drafts.length >= MAX_FUNNEL_STEPS}
              onClick={add}
              className={BUTTON}
            >
              Add step
            </button>
            <span className="text-xs text-muted">
              {drafts.length} of {MAX_FUNNEL_STEPS} steps, at least {MIN_FUNNEL_STEPS}
            </span>
            <button
              type="submit"
              disabled={!valid}
              aria-describedby="funnel-editor-status"
              className={`min-h-10 rounded-input px-4 text-sm ${BUTTON_STRONG} ${CONTROL_DISABLED}`}
            >
              Apply
            </button>
            <p id="funnel-editor-status" className="text-xs text-muted">
              {statusOf(drafts, valid)}
            </p>
          </div>
        </form>
      ) : null}
    </section>
  );
}
