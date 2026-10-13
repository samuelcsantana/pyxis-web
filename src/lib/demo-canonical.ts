import type { Metadata } from 'next';
import { isDemoMode } from './api-config';
import { LIVE_DEMO_URL } from './site';

export function liveDemoUrlOf(path: string): string {
  return new URL(path, LIVE_DEMO_URL).toString();
}

export function demoCanonical(path: string): Pick<Metadata, 'alternates'> {
  return isDemoMode() ? { alternates: { canonical: liveDemoUrlOf(path) } } : {};
}
