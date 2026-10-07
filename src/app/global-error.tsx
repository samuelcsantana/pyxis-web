'use client';

import { type ErrorBoundaryProps, ErrorScreen } from '@/components/states/error-screen';
import { useChosenTheme } from '@/lib/use-chosen-theme';
import { DOCUMENT_FONT_CLASSES } from './fonts';
import './globals.css';

export default function GlobalError(props: ErrorBoundaryProps) {
  return (
    <html lang="en" data-theme={useChosenTheme()} className={DOCUMENT_FONT_CLASSES}>
      <body>
        <title>Could not load this data · Pyxis</title>
        <ErrorScreen {...props} />
      </body>
    </html>
  );
}
