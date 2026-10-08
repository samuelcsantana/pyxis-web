import { render, type RenderResult } from '@testing-library/react';
import type { ReactElement } from 'react';
import { DEFAULT_LOCALE, type Locale } from '@/i18n/locales';
import { CLIENT_NAMESPACES, type Messages, pickNamespaces } from '@/i18n/messages';
import { en } from '@/i18n/messages/en';
import { MessagesProvider } from '@/i18n/messages-provider';

const MESSAGES: Readonly<Record<Locale, Messages>> = { en };

export function renderWithMessages(
  ui: ReactElement,
  locale: Locale = DEFAULT_LOCALE,
): RenderResult {
  return render(
    <MessagesProvider
      locale={locale}
      messages={pickNamespaces(MESSAGES[locale], CLIENT_NAMESPACES)}
    >
      {ui}
    </MessagesProvider>,
  );
}
