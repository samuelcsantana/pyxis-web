import { BrandedPage } from '@/components/brand/branded-page';
import { ErrorPanel } from './error-panel';

export interface ErrorBoundaryProps {
  readonly error: Error & { readonly digest?: string };
  readonly retry: () => void;
}

export function errorDetail(error: ErrorBoundaryProps['error']): string | undefined {
  return error.digest === undefined ? undefined : `error id ${error.digest}`;
}

export function ErrorScreen({ error, retry }: ErrorBoundaryProps) {
  return (
    <BrandedPage>
      <ErrorPanel headingLevel="h1" detail={errorDetail(error)} onRetry={retry} />
    </BrandedPage>
  );
}
