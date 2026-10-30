'use client';

import { WINDOW_TITLE_ID } from '@/components/settings-window/frame-view';
import { ErrorPanel } from '@/components/states/error-panel';
import { type ErrorBoundaryProps, errorTexts } from '@/components/states/error-texts';
import { useT } from '@/i18n/messages-provider';

export default function WindowError({ error, retry }: ErrorBoundaryProps) {
  const t = useT();
  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pr-16 sm:p-6 sm:pr-16">
      <h2 id={WINDOW_TITLE_ID} tabIndex={-1} className="sr-only">
        {t('nav.settings')}
      </h2>
      <ErrorPanel texts={errorTexts(error, t)} onRetry={retry} />
    </div>
  );
}
