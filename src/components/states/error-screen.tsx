import { LogoMark } from '@/components/brand/logo-mark';
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
    <main className="mx-auto flex min-h-dvh w-full max-w-lg flex-col justify-center gap-6 px-4 py-16 text-ink">
      <p className="flex items-center gap-2.5 text-xl font-bold tracking-tight">
        <LogoMark size={32} />
        Pyxis
      </p>
      <ErrorPanel headingLevel="h1" detail={errorDetail(error)} onRetry={retry} />
    </main>
  );
}
