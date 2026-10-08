import type { en } from './messages/en';
import type { Widen } from './translate';

export type SourceMessages = typeof en;
export type Messages = Widen<SourceMessages>;

export const CLIENT_NAMESPACES = [] as const satisfies readonly (keyof Messages)[];
export type ClientNamespace = (typeof CLIENT_NAMESPACES)[number];
export type ClientSourceMessages = {
  readonly [Namespace in ClientNamespace]: SourceMessages[Namespace];
};
export type ClientMessages = { readonly [Namespace in ClientNamespace]: Messages[Namespace] };

export function pickNamespaces<Source, Namespace extends keyof Source>(
  messages: Source,
  namespaces: readonly Namespace[],
): Pick<Source, Namespace> {
  return Object.fromEntries(
    namespaces.map((namespace) => [namespace, messages[namespace]]),
  ) as Pick<Source, Namespace>;
}
