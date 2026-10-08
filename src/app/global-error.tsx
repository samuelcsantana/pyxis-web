'use client';

import { ENGLISH_ERROR_TEXTS, englishErrorTexts } from '@/components/states/english-error-texts';
import { type ErrorBoundaryProps, ErrorScreen } from '@/components/states/error-screen';
import { APP_NAME } from '@/lib/site';
import { useChosenTheme } from '@/lib/use-chosen-theme';
import { DOCUMENT_FONT_CLASSES } from './fonts';
import './globals.css';

export default function GlobalError({ error, retry }: ErrorBoundaryProps) {
  return (
    <html lang="en" data-theme={useChosenTheme()} className={DOCUMENT_FONT_CLASSES}>
      <body>
        <title>{`${ENGLISH_ERROR_TEXTS.title} · ${APP_NAME}`}</title>
        <ErrorScreen texts={englishErrorTexts(error)} retry={retry} />
      </body>
    </html>
  );
}
