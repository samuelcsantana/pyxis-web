import type { en } from './messages/en';
import type { Parity, Widen } from './translate';

export type SourceMessages = typeof en;
export type Messages = Widen<SourceMessages>;

export const CLIENT_NAMESPACES = [
  'funnelEditor',
  'screens',
  'nav',
  'theme',
  'periodSelector',
  'notFound',
  'errorPanel',
  'signIn',
  'chartPanel',
  'propertyBreakdown',
] as const satisfies readonly (keyof Messages)[];
export type ClientNamespace = (typeof CLIENT_NAMESPACES)[number];
export type ClientSourceMessages = {
  readonly [Namespace in ClientNamespace]: SourceMessages[Namespace];
};
export type ClientMessages = { readonly [Namespace in ClientNamespace]: Messages[Namespace] };

export function translation<const Translation>(
  messages: Translation & Parity<SourceMessages, Translation>,
): Translation {
  return messages;
}

export function pickNamespaces<Source, Namespace extends keyof Source>(
  messages: Source,
  namespaces: readonly Namespace[],
): Pick<Source, Namespace> {
  return Object.fromEntries(
    namespaces.map((namespace) => [namespace, messages[namespace]]),
  ) as Pick<Source, Namespace>;
}
