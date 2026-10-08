import type { ErrorTexts } from './error-panel';
import type { ErrorBoundaryProps } from './error-screen';

export const ENGLISH_ERROR_TEXTS = {
  title: 'Could not load this data',
  body: 'The dashboard could not read this data. Try again in a moment.',
  retry: 'Try again',
} as const;

export function englishErrorTexts(error: ErrorBoundaryProps['error']): ErrorTexts {
  return {
    ...ENGLISH_ERROR_TEXTS,
    detail: error.digest === undefined ? undefined : `error id ${error.digest}`,
  };
}
