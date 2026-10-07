'use client';

import { type ErrorBoundaryProps, ErrorScreen } from '@/components/states/error-screen';

export default function RootError(props: ErrorBoundaryProps) {
  return <ErrorScreen {...props} />;
}
