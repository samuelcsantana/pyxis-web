import { BrandedPage } from '@/components/brand/branded-page';
import { ErrorPanel, type ErrorTexts } from './error-panel';

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
