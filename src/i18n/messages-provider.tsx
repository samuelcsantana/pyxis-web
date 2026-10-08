'use client';

import { createContext, type ReactNode, use, useMemo } from 'react';
import type { Locale } from './locales';
import type { ClientMessages, ClientSourceMessages } from './messages';
import { createTranslator, type Translator } from './translate';

interface MessagesContextValue {
  readonly locale: Locale;
  readonly t: Translator<ClientSourceMessages>;
}

const MessagesContext = createContext<MessagesContextValue | null>(null);

export interface MessagesProviderProps {
  readonly locale: Locale;
  readonly messages: ClientMessages;
  readonly children: ReactNode;
}

export function MessagesProvider({ locale, messages, children }: MessagesProviderProps) {
  const value = useMemo(
    () => ({ locale, t: createTranslator<ClientSourceMessages>(messages, locale) }),
    [locale, messages],
  );
  return <MessagesContext value={value}>{children}</MessagesContext>;
}

function useMessages(): MessagesContextValue {
  const value = use(MessagesContext);
  if (value === null) {
    throw new Error('useT and useLocale need a MessagesProvider above them.');
  }
  return value;
}

export function useT(): Translator<ClientSourceMessages> {
  return useMessages().t;
}

export function useLocale(): Locale {
  return useMessages().locale;
}
