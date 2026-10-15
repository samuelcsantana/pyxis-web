'use client';

import { useRouter } from 'next/navigation';
import { type SubmitEvent, useEffect, useId, useRef, useState } from 'react';
import { catchToState, withSmoothLoading } from 'rx-state-bridge';
import { defer, type Subscription, tap } from 'rxjs';
import { BUTTON_DANGER, CONTROL_BUSY, FIELD } from '@/components/ui/control-classes';
import type { DeleteProjectOutcome } from '@/domain/project-management';
import { useT } from '@/i18n/messages-provider';

export type DeleteProject = (confirmName: string) => Promise<DeleteProjectOutcome>;

export interface DeleteProjectFormProps {
  readonly projectName: string;
  readonly remove: DeleteProject;
}

type Refusal = 'nameMismatch' | 'failed';

export const DELETE_PROJECT_MIN_BUSY_MS = 400;
export const PROJECTS_HOME = '/';

const INPUT = `min-h-11 w-full rounded-input px-3 text-base sm:text-sm ${FIELD}`;
const REFUSALS = {
  nameMismatch: 'deleteProject.nameMismatch',
  failed: 'deleteProject.failed',
} as const satisfies Record<Refusal, string>;

export function DeleteProjectForm({ projectName, remove }: DeleteProjectFormProps) {
  const t = useT();
  const router = useRouter();
  const ids = useId();
  const [typed, setTyped] = useState('');
  const [busy, setBusy] = useState(false);
  const [refusal, setRefusal] = useState<Refusal | null>(null);
  const request = useRef<Subscription | undefined>(undefined);

  useEffect(() => () => request.current?.unsubscribe(), []);

  const confirmed = typed.trim() === projectName;
  const fieldId = `${ids}-confirm`;
  const errorId = `${ids}-error`;

  const submit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!confirmed) {
      setRefusal('nameMismatch');
      return;
    }
    request.current?.unsubscribe();
    setRefusal(null);
    request.current = defer(() => remove(typed.trim()))
      .pipe(
        tap((outcome) => {
          if (outcome.kind === 'nameMismatch') {
            setRefusal('nameMismatch');
            return;
          }
          router.push(PROJECTS_HOME);
          router.refresh();
        }),
        catchToState(() => {
          setRefusal('failed');
        }),
        withSmoothLoading(setBusy, DELETE_PROJECT_MIN_BUSY_MS),
      )
      .subscribe();
  };

  return (
    <form noValidate onSubmit={submit} className="flex flex-col gap-3">
      <p className="text-sm">{t('deleteProject.note', { project: projectName })}</p>
      <div className="flex flex-col gap-1.5 sm:max-w-md">
        <label htmlFor={fieldId} className="text-caption font-medium">
          {t('deleteProject.confirm', { project: projectName })}
        </label>
        <input
          id={fieldId}
          type="text"
          autoComplete="off"
          spellCheck={false}
          value={typed}
          onChange={(event) => {
            setTyped(event.target.value);
            setRefusal(null);
          }}
          aria-invalid={refusal === 'nameMismatch'}
          aria-describedby={refusal === null ? undefined : errorId}
          className={INPUT}
        />
      </div>
      <button
        type="submit"
        disabled={busy}
        aria-busy={busy}
        className={`min-h-11 self-start rounded-input px-4 text-sm ${BUTTON_DANGER} ${CONTROL_BUSY}`}
      >
        {busy ? t('deleteProject.deleting') : t('deleteProject.delete')}
      </button>
      {refusal === null ? null : (
        <p id={errorId} role="alert" className="text-caption font-medium text-bad">
          {t(REFUSALS[refusal])}
        </p>
      )}
    </form>
  );
}
