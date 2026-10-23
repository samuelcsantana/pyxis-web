import type { REQUEST_KINDS } from './requests.schema';

export type RequestKind = (typeof REQUEST_KINDS)[number];

export const FAILED_READS: RequestKind = 'reads';

export interface RequestKindSearch {
  readonly kind?: string | string[];
}

export function requestKindOf(search: RequestKindSearch): RequestKind {
  return search.kind === FAILED_READS ? FAILED_READS : 'writes';
}
