import type { Account } from './accounts';
import { isOnProPlan } from './pro-features';
import { SHARE_PAGE_PATH } from './share-page-path';

export const MAX_SHARE_LINK_NAME_LENGTH = 64;
export const MAX_SHARE_LINKS = 10;
export const SHARE_LINK_LIFETIMES = [7, 30, 90, 365] as const;
export const MIN_SHARE_PASSWORD_LENGTH = 8;
export const MAX_SHARE_PASSWORD_LENGTH = 128;

const DAY_MS = 24 * 60 * 60 * 1000;

export type ShareLinkLifetime = (typeof SHARE_LINK_LIFETIMES)[number];
export type ShareLinkExpiry = ShareLinkLifetime | 'never';
export const DEFAULT_SHARE_LINK_EXPIRY: ShareLinkExpiry = 'never';

export interface ShareLink {
  readonly id: string;
  readonly name: string;
  readonly createdAt: string;
  readonly expiresAt: string | null;
  readonly passwordProtected: boolean;
}

export interface CreatedShareLink extends ShareLink {
  readonly token: string;
}

export interface NewShareLink {
  readonly name: string;
  readonly expiry: ShareLinkExpiry;
  readonly password: string | null;
}

export interface ShareLinkRequest {
  readonly name: string;
  readonly expiresAt: string | null;
  readonly password: string | null;
}

export type CreateShareLinkOutcome =
  | { readonly kind: 'created'; readonly link: CreatedShareLink }
  | { readonly kind: 'planRequired' }
  | { readonly kind: 'limitReached' };

export type SetShareLinkPasswordOutcome =
  | { readonly kind: 'changed'; readonly link: ShareLink }
  | { readonly kind: 'planRequired' }
  | { readonly kind: 'gone' };

export type ShareLinkNameProblem = 'missing' | 'tooLong';

export type SharePasswordProblem = 'tooShort' | 'tooLong';

export type ShareLinkValidity =
  | { readonly kind: 'forever' }
  | { readonly kind: 'until'; readonly at: string }
  | { readonly kind: 'expired'; readonly at: string };

export function parseShareLinkExpiry(value: string): ShareLinkExpiry | null {
  if (value === 'never') {
    return 'never';
  }
  return SHARE_LINK_LIFETIMES.find((days) => String(days) === value) ?? null;
}

export function shareLinkNameProblem(name: string): ShareLinkNameProblem | null {
  const trimmed = name.trim();
  if (trimmed.length === 0) {
    return 'missing';
  }
  return trimmed.length > MAX_SHARE_LINK_NAME_LENGTH ? 'tooLong' : null;
}

export function sharePasswordProblem(password: string): SharePasswordProblem | null {
  const length = Array.from(password).length;
  if (length < MIN_SHARE_PASSWORD_LENGTH) {
    return 'tooShort';
  }
  return length > MAX_SHARE_PASSWORD_LENGTH ? 'tooLong' : null;
}

export function canCreateShareLink(links: readonly ShareLink[]): boolean {
  return links.length < MAX_SHARE_LINKS;
}

export function shareLinkRequestOf(link: NewShareLink, now: Date): ShareLinkRequest {
  return {
    name: link.name.trim(),
    expiresAt:
      link.expiry === 'never' ? null : new Date(now.getTime() + link.expiry * DAY_MS).toISOString(),
    password: link.password,
  };
}

export function shareLinkValidity(link: ShareLink, now: Date): ShareLinkValidity {
  if (link.expiresAt === null) {
    return { kind: 'forever' };
  }
  return new Date(link.expiresAt).getTime() > now.getTime()
    ? { kind: 'until', at: link.expiresAt }
    : { kind: 'expired', at: link.expiresAt };
}

export function shareLinkUrl(origin: string, token: string): string {
  return `${origin}${SHARE_PAGE_PATH}/${encodeURIComponent(token)}`;
}

export function sharesOnPro(accounts: readonly Account[], accountId: string | null): boolean {
  if (accountId === null) {
    return true;
  }
  const account = accounts.find((candidate) => candidate.id === accountId);
  return account !== undefined && isOnProPlan(account.status);
}
