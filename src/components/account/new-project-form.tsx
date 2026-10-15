'use client';

import { useRouter } from 'next/navigation';
import { type SubmitEvent, useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import { catchToState, withSmoothLoading } from 'rx-state-bridge';
import { defer, type Subscription, tap } from 'rxjs';
import { BUTTON_PRIMARY, CONTROL_BUSY, FIELD } from '@/components/ui/control-classes';
import { SelectField } from '@/components/ui/select-field';
import {
  type CreateProjectOutcome,
  hasProblems,
  MAX_PROJECT_NAME_LENGTH,
  type ProjectChanges,
  type ProjectDraft,
  type ProjectDraftProblems,
  projectChangesOf,
  projectDraftProblems,
} from '@/domain/project-management';
import { useT } from '@/i18n/messages-provider';

export type CreateProject = (changes: ProjectChanges) => Promise<CreateProjectOutcome>;

export interface NewProjectFormProps {
  readonly timezones: readonly string[];
  readonly projectLimit: number;
  readonly create: CreateProject;
  readonly localTimeZone?: () => string;
}

type Refusal = 'limitReached' | 'subscriptionRequired' | 'invalid' | 'failed';

export const CREATE_PROJECT_MIN_BUSY_MS = 400;
export const FALLBACK_TIME_ZONE = 'UTC';

const LABEL = 'text-caption font-medium';
const ERROR = 'text-caption font-medium text-bad';
const INPUT = `min-h-11 w-full rounded-input px-3 text-base placeholder:text-muted sm:text-sm ${FIELD}`;
const SITE_PROBLEMS = {
  missing: 'newProject.siteMissing',
  invalid: 'newProject.siteInvalid',
} as const;

export function installHref(projectId: string): string {
  return `/${encodeURIComponent(projectId)}/install`;
}

function browserTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function neverChanges(): () => void {
  return () => undefined;
}

function useLocalTimeZone(choices: readonly string[], localTimeZone: () => string): string {
  return useSyncExternalStore(
    neverChanges,
    () => {
      const zone = localTimeZone();
      return choices.includes(zone) ? zone : FALLBACK_TIME_ZONE;
    },
    () => FALLBACK_TIME_ZONE,
  );
}

export function NewProjectForm({
  timezones,
  projectLimit,
  create,
  localTimeZone = browserTimeZone,
}: NewProjectFormProps) {
  const t = useT();
  const router = useRouter();
  const ids = useId();
  const form = useRef<HTMLFormElement>(null);
  const [name, setName] = useState('');
  const [site, setSite] = useState('');
  const detectedZone = useLocalTimeZone(timezones, localTimeZone);
  const [chosenZone, setTimezone] = useState<string | null>(null);
  const timezone = chosenZone ?? detectedZone;
  const [conversionEvent, setConversionEvent] = useState('');
  const [problems, setProblems] = useState<ProjectDraftProblems>({});
  const [busy, setBusy] = useState(false);
  const [refusal, setRefusal] = useState<Refusal | null>(null);
  const request = useRef<Subscription | undefined>(undefined);

  useEffect(() => () => request.current?.unsubscribe(), []);

  const fieldId = (field: string) => `${ids}-${field}`;
  const errorId = (field: string) => `${ids}-${field}-error`;
  const draft: ProjectDraft = { name, origins: [site], timezone, conversionEvent };

  const edited = () => {
    setRefusal(null);
  };

  const submit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = projectDraftProblems(draft);
    setProblems(found);
    if (hasProblems(found)) {
      requestAnimationFrame(() => {
        form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      });
      return;
    }
    request.current?.unsubscribe();
    setRefusal(null);
    request.current = defer(() => create(projectChangesOf(draft)))
      .pipe(
        tap((outcome) => {
          if (outcome.kind !== 'created') {
            setRefusal(outcome.kind);
            return;
          }
          router.push(installHref(outcome.project.projectId));
        }),
        catchToState(() => {
          setRefusal('failed');
        }),
        withSmoothLoading(setBusy, CREATE_PROJECT_MIN_BUSY_MS),
      )
      .subscribe();
  };

  const refusalText = (shown: Refusal) =>
    shown === 'limitReached'
      ? t('newProject.limitReached', { max: String(projectLimit) })
      : t(`newProject.${shown}`);

  const fieldError = (field: keyof ProjectDraftProblems, text: string | null) =>
    text === null ? null : (
      <p id={errorId(field)} role="alert" className={ERROR}>
        {text}
      </p>
    );

  return (
    <form ref={form} noValidate onSubmit={submit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor={fieldId('name')} className={LABEL}>
          {t('newProject.name')}
        </label>
        <input
          id={fieldId('name')}
          type="text"
          autoComplete="off"
          value={name}
          placeholder={t('newProject.namePlaceholder')}
          onChange={(event) => {
            edited();
            setName(event.target.value);
          }}
          aria-invalid={problems.name !== undefined}
          aria-describedby={problems.name === undefined ? undefined : errorId('name')}
          className={INPUT}
        />
        {fieldError(
          'name',
          problems.name === undefined
            ? null
            : problems.name === 'missing'
              ? t('newProject.nameMissing')
              : t('newProject.nameTooLong', { max: String(MAX_PROJECT_NAME_LENGTH) }),
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={fieldId('site')} className={LABEL}>
          {t('newProject.site')}
        </label>
        <input
          id={fieldId('site')}
          type="url"
          inputMode="url"
          autoComplete="url"
          spellCheck={false}
          value={site}
          placeholder={t('newProject.sitePlaceholder')}
          onChange={(event) => {
            edited();
            setSite(event.target.value);
          }}
          aria-invalid={problems.origins !== undefined}
          aria-describedby={problems.origins === undefined ? undefined : errorId('origins')}
          className={INPUT}
        />
        {fieldError(
          'origins',
          problems.origins === undefined || problems.origins === 'tooMany'
            ? null
            : t(SITE_PROBLEMS[problems.origins]),
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-1.5">
          <label htmlFor={fieldId('timezone')} className={LABEL}>
            {t('newProject.timezone')}
          </label>
          <SelectField
            id={fieldId('timezone')}
            value={timezone}
            onChange={(event) => {
              edited();
              setTimezone(event.target.value);
            }}
            aria-invalid={problems.timezone !== undefined}
            aria-describedby={problems.timezone === undefined ? undefined : errorId('timezone')}
            className={INPUT}
          >
            {timezones.map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </SelectField>
          {fieldError(
            'timezone',
            problems.timezone === undefined ? null : t('newProject.timezoneInvalid'),
          )}
        </div>
        <div className="flex min-w-0 flex-col gap-1.5">
          <label htmlFor={fieldId('conversionEvent')} className={LABEL}>
            {t('newProject.conversionEvent')}
          </label>
          <input
            id={fieldId('conversionEvent')}
            type="text"
            autoComplete="off"
            spellCheck={false}
            value={conversionEvent}
            placeholder={t('newProject.conversionEventPlaceholder')}
            onChange={(event) => {
              edited();
              setConversionEvent(event.target.value);
            }}
            aria-invalid={problems.conversionEvent !== undefined}
            aria-describedby={
              problems.conversionEvent === undefined ? undefined : errorId('conversionEvent')
            }
            className={`${INPUT} font-mono`}
          />
          {fieldError(
            'conversionEvent',
            problems.conversionEvent === undefined ? null : t('newProject.conversionEventInvalid'),
          )}
        </div>
      </div>
      <button
        type="submit"
        disabled={busy}
        aria-busy={busy}
        className={`min-h-11 self-start rounded-input px-4 text-sm ${BUTTON_PRIMARY} ${CONTROL_BUSY}`}
      >
        {busy ? t('newProject.creating') : t('newProject.create')}
      </button>
      {refusal === null ? null : (
        <p role="alert" className={ERROR}>
          {refusalText(refusal)}
        </p>
      )}
    </form>
  );
}
