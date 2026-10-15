'use client';

import { useRouter } from 'next/navigation';
import { type SubmitEvent, useEffect, useId, useRef, useState } from 'react';
import { catchToState, withSmoothLoading } from 'rx-state-bridge';
import { defer, type Subscription, tap } from 'rxjs';
import {
  BUTTON_PRIMARY,
  BUTTON_SECONDARY,
  CONTROL_BUSY,
  FIELD,
} from '@/components/ui/control-classes';
import { SelectField } from '@/components/ui/select-field';
import {
  hasProblems,
  MAX_ALLOWED_ORIGINS,
  MAX_PROJECT_NAME_LENGTH,
  type ProjectChanges,
  type ProjectDraft,
  type ProjectDraftProblems,
  projectChangesOf,
  projectDraftOf,
  projectDraftProblems,
  type SaveProjectOutcome,
} from '@/domain/project-management';
import { useT } from '@/i18n/messages-provider';

export type SaveProject = (changes: ProjectChanges) => Promise<SaveProjectOutcome>;

export interface ProjectFormProps {
  readonly saved: ProjectChanges;
  readonly timezones: readonly string[];
  readonly save: SaveProject;
}

type Result = 'saved' | 'invalid' | 'subscriptionRequired' | 'failed';

interface OriginRow {
  readonly key: number;
  readonly value: string;
}

export const SAVE_PROJECT_MIN_BUSY_MS = 400;

const LABEL = 'text-caption font-medium';
const REMOVE_ICON = 'M6 6l12 12M18 6L6 18';
const NOTE = 'text-xs leading-[18px] text-muted';
const ERROR = 'text-caption font-medium text-bad';
const INPUT = `min-h-11 w-full rounded-input px-3 text-base placeholder:text-muted sm:text-sm ${FIELD}`;
const SMALL_BUTTON = `flex min-h-9 items-center rounded-input px-3 text-sm ${BUTTON_SECONDARY}`;
const RESULT_TEXT = {
  saved: 'projectForm.saved',
  invalid: 'projectForm.invalid',
  subscriptionRequired: 'projectForm.subscriptionRequired',
  failed: 'projectForm.failed',
} as const satisfies Record<Result, string>;

function rowsOf(origins: readonly string[]): readonly OriginRow[] {
  return origins.map((value, key) => ({ key, value }));
}

function useProblemText() {
  const t = useT();
  return {
    name: (problem: NonNullable<ProjectDraftProblems['name']>) =>
      problem === 'missing'
        ? t('projectForm.nameMissing')
        : t('projectForm.nameTooLong', { max: String(MAX_PROJECT_NAME_LENGTH) }),
    origins: (problem: NonNullable<ProjectDraftProblems['origins']>) =>
      ({
        missing: t('projectForm.originsMissing'),
        invalid: t('projectForm.originsInvalid'),
        tooMany: t('projectForm.originsTooMany', { max: String(MAX_ALLOWED_ORIGINS) }),
      })[problem],
  };
}

export function ProjectForm({ saved, timezones, save }: ProjectFormProps) {
  const t = useT();
  const router = useRouter();
  const ids = useId();
  const problemText = useProblemText();
  const initial = projectDraftOf(saved);
  const [name, setName] = useState(initial.name);
  const [rows, setRows] = useState<readonly OriginRow[]>(rowsOf(initial.origins));
  const [timezone, setTimezone] = useState(initial.timezone);
  const [conversionEvent, setConversionEvent] = useState(initial.conversionEvent);
  const [problems, setProblems] = useState<ProjectDraftProblems>({});
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const nextRowKey = useRef(rows.length);
  const form = useRef<HTMLFormElement>(null);
  const request = useRef<Subscription | undefined>(undefined);

  useEffect(() => () => request.current?.unsubscribe(), []);

  const fieldId = (field: string) => `${ids}-${field}`;
  const errorId = (field: string) => `${ids}-${field}-error`;
  const draft: ProjectDraft = {
    name,
    origins: rows.map((row) => row.value),
    timezone,
    conversionEvent,
  };

  const edited = () => {
    setResult(null);
  };

  const setOrigin = (key: number, value: string) => {
    edited();
    setRows((current) => current.map((row) => (row.key === key ? { key, value } : row)));
  };

  const addOrigin = () => {
    edited();
    const key = nextRowKey.current;
    nextRowKey.current += 1;
    setRows((current) => [...current, { key, value: '' }]);
  };

  const removeOrigin = (key: number) => {
    edited();
    setRows((current) => current.filter((row) => row.key !== key));
  };

  const focusFirstProblem = () => {
    form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  };

  const submit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = projectDraftProblems(draft);
    setProblems(found);
    if (hasProblems(found)) {
      setResult(null);
      requestAnimationFrame(focusFirstProblem);
      return;
    }
    request.current?.unsubscribe();
    setResult(null);
    request.current = defer(() => save(projectChangesOf(draft)))
      .pipe(
        tap((outcome) => {
          setResult(outcome.kind);
          if (outcome.kind === 'saved') {
            router.refresh();
          }
        }),
        catchToState(() => {
          setResult('failed');
        }),
        withSmoothLoading(setBusy, SAVE_PROJECT_MIN_BUSY_MS),
      )
      .subscribe();
  };

  const describedBy = (field: keyof ProjectDraftProblems, note?: string) => {
    const described = [note, problems[field] === undefined ? undefined : errorId(field)].filter(
      (id) => id !== undefined,
    );
    return described.length === 0 ? undefined : described.join(' ');
  };

  return (
    <form ref={form} noValidate onSubmit={submit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor={fieldId('name')} className={LABEL}>
          {t('projectForm.name')}
        </label>
        <input
          id={fieldId('name')}
          type="text"
          autoComplete="off"
          value={name}
          onChange={(event) => {
            edited();
            setName(event.target.value);
          }}
          aria-invalid={problems.name !== undefined}
          aria-describedby={describedBy('name')}
          className={INPUT}
        />
        {problems.name === undefined ? null : (
          <p id={errorId('name')} role="alert" className={ERROR}>
            {problemText.name(problems.name)}
          </p>
        )}
      </div>

      <fieldset
        className="flex flex-col gap-1.5"
        aria-describedby={describedBy('origins', fieldId('origins-note'))}
      >
        <legend className={`${LABEL} mb-1.5`}>{t('projectForm.origins')}</legend>
        <ul className="flex flex-col gap-2">
          {rows.map((row, index) => {
            const number = String(index + 1);
            return (
              <li key={row.key} className="flex items-center gap-2">
                <input
                  id={fieldId(`origin-${String(row.key)}`)}
                  type="url"
                  inputMode="url"
                  autoComplete="off"
                  spellCheck={false}
                  value={row.value}
                  placeholder={t('projectForm.originPlaceholder')}
                  aria-label={t('projectForm.origin', { number })}
                  aria-invalid={problems.origins !== undefined}
                  onChange={(event) => {
                    setOrigin(row.key, event.target.value);
                  }}
                  className={INPUT}
                />
                {rows.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      removeOrigin(row.key);
                    }}
                    aria-label={t('projectForm.removeOrigin', { number })}
                    className={`${SMALL_BUTTON} shrink-0`}
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="size-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d={REMOVE_ICON} />
                    </svg>
                  </button>
                ) : null}
              </li>
            );
          })}
        </ul>
        {rows.length < MAX_ALLOWED_ORIGINS ? (
          <button type="button" onClick={addOrigin} className={`${SMALL_BUTTON} self-start`}>
            {t('projectForm.addOrigin')}
          </button>
        ) : null}
        <p id={fieldId('origins-note')} className={NOTE}>
          {t('projectForm.originsNote', { max: String(MAX_ALLOWED_ORIGINS) })}
        </p>
        {problems.origins === undefined ? null : (
          <p id={errorId('origins')} role="alert" className={ERROR}>
            {problemText.origins(problems.origins)}
          </p>
        )}
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-1.5">
          <label htmlFor={fieldId('timezone')} className={LABEL}>
            {t('projectForm.timezone')}
          </label>
          <SelectField
            id={fieldId('timezone')}
            value={timezone}
            onChange={(event) => {
              edited();
              setTimezone(event.target.value);
            }}
            aria-invalid={problems.timezone !== undefined}
            aria-describedby={describedBy('timezone', fieldId('timezone-note'))}
            className={INPUT}
          >
            {timezones.map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </SelectField>
          <p id={fieldId('timezone-note')} className={NOTE}>
            {t('projectForm.timezoneNote')}
          </p>
          {problems.timezone === undefined ? null : (
            <p id={errorId('timezone')} role="alert" className={ERROR}>
              {t('projectForm.timezoneInvalid')}
            </p>
          )}
        </div>
        <div className="flex min-w-0 flex-col gap-1.5">
          <label htmlFor={fieldId('conversionEvent')} className={LABEL}>
            {t('projectForm.conversionEvent')}
          </label>
          <input
            id={fieldId('conversionEvent')}
            type="text"
            autoComplete="off"
            spellCheck={false}
            value={conversionEvent}
            placeholder={t('projectForm.conversionEventPlaceholder')}
            onChange={(event) => {
              edited();
              setConversionEvent(event.target.value);
            }}
            aria-invalid={problems.conversionEvent !== undefined}
            aria-describedby={describedBy('conversionEvent', fieldId('conversionEvent-note'))}
            className={`${INPUT} font-mono`}
          />
          <p id={fieldId('conversionEvent-note')} className={NOTE}>
            {t('projectForm.conversionEventNote')}
          </p>
          {problems.conversionEvent === undefined ? null : (
            <p id={errorId('conversionEvent')} role="alert" className={ERROR}>
              {t('projectForm.conversionEventInvalid')}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={busy}
          aria-busy={busy}
          className={`min-h-11 rounded-input px-4 text-sm ${BUTTON_PRIMARY} ${CONTROL_BUSY}`}
        >
          {busy ? t('projectForm.saving') : t('projectForm.save')}
        </button>
        {result === null ? null : (
          <p
            role={result === 'saved' ? 'status' : 'alert'}
            className={result === 'saved' ? 'text-sm font-medium text-ok' : 'text-sm text-bad'}
          >
            {t(RESULT_TEXT[result])}
          </p>
        )}
      </div>
    </form>
  );
}
