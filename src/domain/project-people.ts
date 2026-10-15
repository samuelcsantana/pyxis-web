import type { ProjectRole } from './project-settings';

export const MAX_ACCOUNT_PEOPLE = 3;

export interface ProjectPerson {
  readonly adminUserId: string;
  readonly email: string;
  readonly role: ProjectRole;
  readonly addedAt: string;
}

export type AddPersonOutcome =
  | { readonly kind: 'added'; readonly person: ProjectPerson; readonly invited: boolean }
  | { readonly kind: 'limitReached' }
  | { readonly kind: 'subscriptionRequired' }
  | { readonly kind: 'invalidEmail' };

export type RemovePersonOutcome = { readonly kind: 'removed' } | { readonly kind: 'ownerStays' };
