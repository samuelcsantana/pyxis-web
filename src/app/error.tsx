'use client';

import { ErrorScreen } from '@/components/states/error-screen';
import { type ErrorBoundaryProps, errorTexts } from '@/components/states/error-texts';
import { useT } from '@/i18n/messages-provider';

export default function RootError({ error, retry }: ErrorBoundaryProps) {
  const t = useT();
  return <ErrorScreen texts={errorTexts(error, t)} retry={retry} />;
}
