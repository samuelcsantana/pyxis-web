'use client';

import { usePathname, useSelectedLayoutSegments } from 'next/navigation';
import { lazy, type ReactNode, Suspense, useEffect } from 'react';
import { HELP_SEGMENT, SETTINGS_SEGMENT } from '@/components/shell/screens';
import type { FrameView } from './frame-view';

export const PROJECT_WINDOW_SEGMENT = '(.)settings';
export const ACCOUNT_WINDOW_SEGMENT = '(..)account';
export const HELP_WINDOW_SEGMENT = '(.)help';
const WINDOW_SEGMENTS: ReadonlySet<string> = new Set([
  PROJECT_WINDOW_SEGMENT,
  ACCOUNT_WINDOW_SEGMENT,
  HELP_WINDOW_SEGMENT,
]);
const PROJECT_WINDOW_ADDRESSES: ReadonlySet<string> = new Set([SETTINGS_SEGMENT, HELP_SEGMENT]);

const ACCOUNT_SEGMENT = 'account';

export function isWindowAddress(pathname: string): boolean {
  const [, first = '', second = ''] = pathname.split('/');
  return first === ACCOUNT_SEGMENT || PROJECT_WINDOW_ADDRESSES.has(second);
}

export function initialViewOf(segments: readonly string[]): FrameView {
  return segments.length === 1 && segments[0] === PROJECT_WINDOW_SEGMENT ? 'list' : 'section';
}

function loadTheDialog() {
  return import('./settings-dialog');
}

const SettingsDialog = lazy(() =>
  loadTheDialog().then((dialog) => ({ default: dialog.SettingsDialog })),
);

function bestEffortPreloadTheDialog() {
  loadTheDialog().catch((error: unknown) => {
    console.warn('settings window: could not preload the dialog', error);
  });
}

export interface SettingsWindowHostProps {
  readonly closeLabel: string;
  readonly children: ReactNode;
}

export function SettingsWindowHost({ closeLabel, children }: SettingsWindowHostProps) {
  const segments = useSelectedLayoutSegments();
  const pathname = usePathname();
  const [first = ''] = segments;
  useEffect(bestEffortPreloadTheDialog, []);
  if (!WINDOW_SEGMENTS.has(first)) {
    return children;
  }
  if (!isWindowAddress(pathname)) {
    return null;
  }
  return (
    <Suspense fallback={null}>
      <SettingsDialog closeLabel={closeLabel} initialView={initialViewOf(segments)}>
        {children}
      </SettingsDialog>
    </Suspense>
  );
}
