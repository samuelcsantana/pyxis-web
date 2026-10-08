import { BrandedPage } from '@/components/brand/branded-page';
import type { ClientSourceMessages } from '@/i18n/messages';
import type { Translator } from '@/i18n/translate';
import { ErrorPanel, type ErrorTexts } from './error-panel';

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

export interface ErrorScreenProps {
  readonly texts: ErrorTexts;
  readonly retry: () => void;
}

export function ErrorScreen({ texts, retry }: ErrorScreenProps) {
  return (
    <BrandedPage>
      <ErrorPanel headingLevel="h1" texts={texts} onRetry={retry} />
    </BrandedPage>
  );
}
