export const MAX_PROJECT_NAME_LENGTH = 100;
export const MAX_ALLOWED_ORIGINS = 5;
export const MAX_LIVE_KEYS_PER_KIND = 5;
export const PROJECT_KEY_KINDS = ['public', 'secret'] as const;

const EVENT_NAME_PATTERN = /^[a-z][a-z0-9_]{0,63}$/;
const SCHEME_PATTERN = /^[a-z][a-z0-9+.-]*:\/\//i;
const DEFAULT_SCHEME = 'https://';
const DEFAULT_TIME_ZONE = 'UTC';
const WEB_PROTOCOLS: ReadonlySet<string> = new Set(['http:', 'https:']);

export type ProjectKeyKind = (typeof PROJECT_KEY_KINDS)[number];

export interface ProjectChanges {
  readonly name: string;
  readonly allowedOrigins: readonly string[];
  readonly timezone: string;
  readonly conversionEvent: string | null;
}

export interface ProjectDraft {
  readonly name: string;
  readonly origins: readonly string[];
  readonly timezone: string;
  readonly conversionEvent: string;
}

export interface ProjectDraftProblems {
  readonly name?: 'missing' | 'tooLong';
  readonly origins?: 'missing' | 'invalid' | 'tooMany';
  readonly timezone?: 'invalid';
  readonly conversionEvent?: 'invalid';
}

export type SaveProjectOutcome =
  | { readonly kind: 'saved' }
  | { readonly kind: 'invalid' }
  | { readonly kind: 'subscriptionRequired' };

export type SetCityOutcome =
  | { readonly kind: 'saved'; readonly cityEnabled: boolean }
  | { readonly kind: 'subscriptionRequired' };

export interface CreatedProjectKey {
  readonly id: string;
  readonly kind: ProjectKeyKind;
  readonly key: string;
}

export type CreateProjectKeyOutcome =
  | { readonly kind: 'created'; readonly key: CreatedProjectKey }
  | { readonly kind: 'tooMany' }
  | { readonly kind: 'subscriptionRequired' };

export type RevokeProjectKeyOutcome =
  | { readonly kind: 'revoked' }
  | { readonly kind: 'lastPublicKey' }
  | { readonly kind: 'subscriptionRequired' };

export interface CreatedProject {
  readonly projectId: string;
  readonly publicKey: string;
}

export type CreateProjectOutcome =
  | { readonly kind: 'created'; readonly project: CreatedProject }
  | { readonly kind: 'limitReached' }
  | { readonly kind: 'subscriptionRequired' }
  | { readonly kind: 'invalid' };

export type DeleteProjectOutcome =
  | { readonly kind: 'deleted' }
  | { readonly kind: 'nameMismatch' }
  | { readonly kind: 'deletionOnHold' };

export function originOf(input: string): string | null {
  const trimmed = input.trim();
  if (trimmed === '') {
    return null;
  }
  const withScheme = SCHEME_PATTERN.test(trimmed) ? trimmed : `${DEFAULT_SCHEME}${trimmed}`;
  try {
    const url = new URL(withScheme);
    return WEB_PROTOCOLS.has(url.protocol) && url.hostname !== '' ? url.origin : null;
  } catch {
    return null;
  }
}

export function isTimeZone(timezone: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: timezone });
    return timezone !== '';
  } catch {
    return false;
  }
}

function nameProblem(name: string): ProjectDraftProblems['name'] {
  const trimmed = name.trim();
  if (trimmed === '') {
    return 'missing';
  }
  return trimmed.length > MAX_PROJECT_NAME_LENGTH ? 'tooLong' : undefined;
}

function filledOrigins(origins: readonly string[]): readonly string[] {
  return origins.filter((origin) => origin.trim() !== '');
}

function originsProblem(origins: readonly string[]): ProjectDraftProblems['origins'] {
  const filled = filledOrigins(origins);
  if (filled.length === 0) {
    return 'missing';
  }
  if (filled.some((origin) => originOf(origin) === null)) {
    return 'invalid';
  }
  return uniqueOrigins(filled).length > MAX_ALLOWED_ORIGINS ? 'tooMany' : undefined;
}

function uniqueOrigins(origins: readonly string[]): readonly string[] {
  return [...new Set(origins.flatMap((origin) => originOf(origin) ?? []))];
}

function conversionEventProblem(conversionEvent: string): ProjectDraftProblems['conversionEvent'] {
  const trimmed = conversionEvent.trim();
  return trimmed === '' || EVENT_NAME_PATTERN.test(trimmed) ? undefined : 'invalid';
}

export function projectDraftProblems(draft: ProjectDraft): ProjectDraftProblems {
  const name = nameProblem(draft.name);
  const origins = originsProblem(draft.origins);
  const conversionEvent = conversionEventProblem(draft.conversionEvent);
  return {
    ...(name === undefined ? {} : { name }),
    ...(origins === undefined ? {} : { origins }),
    ...(isTimeZone(draft.timezone) ? {} : { timezone: 'invalid' as const }),
    ...(conversionEvent === undefined ? {} : { conversionEvent }),
  };
}

export function hasProblems(problems: ProjectDraftProblems): boolean {
  return Object.keys(problems).length > 0;
}

export function projectChangesOf(draft: ProjectDraft): ProjectChanges {
  const conversionEvent = draft.conversionEvent.trim();
  return {
    name: draft.name.trim(),
    allowedOrigins: uniqueOrigins(filledOrigins(draft.origins)),
    timezone: draft.timezone,
    conversionEvent: conversionEvent === '' ? null : conversionEvent,
  };
}

export function projectDraftOf(changes: ProjectChanges): ProjectDraft {
  return {
    name: changes.name,
    origins: changes.allowedOrigins.length === 0 ? [''] : changes.allowedOrigins,
    timezone: changes.timezone,
    conversionEvent: changes.conversionEvent ?? '',
  };
}

export function timeZoneChoices(current: string): readonly string[] {
  return [...new Set([...Intl.supportedValuesOf('timeZone'), DEFAULT_TIME_ZONE, current])].sort();
}

export function canCreateProjectKey(liveKeys: number): boolean {
  return liveKeys < MAX_LIVE_KEYS_PER_KIND;
}
