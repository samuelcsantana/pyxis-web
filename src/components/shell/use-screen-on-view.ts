'use client';

import { usePathname, useSelectedLayoutSegments } from 'next/navigation';
import { isScreenSlug, type ScreenSlug, screenSlugOf } from './screens';

export function screenOfSegments(segments: readonly string[]): ScreenSlug | undefined {
  return segments.find(isScreenSlug);
}

export function useScreenOnView(): ScreenSlug | undefined {
  const fromTheAddress = screenSlugOf(usePathname());
  const fromTheLayout = screenOfSegments(useSelectedLayoutSegments());
  return fromTheAddress ?? fromTheLayout;
}
