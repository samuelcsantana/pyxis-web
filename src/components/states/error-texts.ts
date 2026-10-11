import type { ClientSourceMessages } from '@/i18n/messages';
import type { Translator } from '@/i18n/translate';
import type { ErrorTexts } from './error-panel';

export interface ErrorBoundaryProps {
  readonly error: Error & { readonly digest?: string };
  readonly retry: () => void;
}

export function errorTexts(
  error: ErrorBoundaryProps['error'],
  t: Translator<ClientSourceMessages>,
): ErrorTexts {
  return {
    title: t('errorPanel.title'),
    body: t('errorPanel.body'),
    retry: t('errorPanel.retry'),
    detail:
      error.digest === undefined ? undefined : t('errorPanel.detail', { digest: error.digest }),
  };
}
