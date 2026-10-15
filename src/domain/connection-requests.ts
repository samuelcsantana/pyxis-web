export const CONNECTION_REQUEST_MINUTES = 10;
export const MAX_CONNECTED_APPS = 10;

export interface ConnectionRequestProject {
  readonly id: string;
  readonly name: string;
}

export interface ConnectionRequest {
  readonly id: string;
  readonly client: { readonly name: string; readonly host: string };
  readonly redirect: { readonly host: string; readonly loopback: boolean };
  readonly expiresAt: string;
  readonly projects: readonly ConnectionRequestProject[];
  readonly connectionLimitReached: boolean;
}

export type DenyConnectionOutcome =
  { readonly kind: 'redirect'; readonly url: string } | { readonly kind: 'gone' };

export type AllowConnectionOutcome = DenyConnectionOutcome | { readonly kind: 'tooMany' };
