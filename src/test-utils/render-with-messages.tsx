import { render, type RenderResult } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { DEFAULT_LOCALE, type Locale } from '@/i18n/locales';
import { CLIENT_NAMESPACES, type Messages, pickNamespaces } from '@/i18n/messages';
import { en } from '@/i18n/messages/en';
import { MessagesProvider } from '@/i18n/messages-provider';

const MESSAGES: Readonly<Record<Locale, Messages>> = { en };

export function renderWithMessages(
  ui: ReactElement,
  locale: Locale = DEFAULT_LOCALE,
): RenderResult {
  const messages = pickNamespaces(MESSAGES[locale], CLIENT_NAMESPACES);
  function WithMessages({ children }: { readonly children: ReactNode }) {
    return (
      <MessagesProvider locale={locale} messages={messages}>
        {children}
      </MessagesProvider>
    );
  }
  return render(ui, { wrapper: WithMessages });
}
