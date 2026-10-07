import type { ReactNode } from 'react';
import { SCREENS, type ScreenSlug } from '@/components/shell/screens';
import { TopbarFrame } from '@/components/shell/topbar';
import {
  SkeletonCards,
  SkeletonChart,
  SkeletonControls,
  SkeletonForm,
  SkeletonPair,
  SkeletonRows,
  SkeletonSteps,
} from './screen-skeleton';

const SCREENS_WITHOUT_PERIOD: ReadonlySet<ScreenSlug> = new Set(['timeline']);

const SCREEN_SKELETONS: Readonly<Record<ScreenSlug, () => ReactNode>> = {
  overview: () => (
    <>
      <SkeletonCards count={4} />
      <SkeletonChart />
      <SkeletonPair />
    </>
  ),
  funnel: () => (
    <>
      <SkeletonControls />
      <SkeletonSteps />
    </>
  ),
  features: () => (
    <>
      <SkeletonControls />
      <SkeletonRows count={8} />
    </>
  ),
  requests: () => (
    <>
      <SkeletonCards count={3} />
      <SkeletonControls />
      <SkeletonRows count={6} />
    </>
  ),
  timeline: () => (
    <>
      <SkeletonForm fields={2} />
      <SkeletonRows count={5} />
    </>
  ),
  visits: () => (
    <>
      <SkeletonForm fields={6} />
      <SkeletonRows count={8} />
    </>
  ),
  devices: () => (
    <>
      <SkeletonPair />
      <SkeletonPair />
    </>
  ),
  acquisition: () => (
    <>
      <SkeletonCards count={2} />
      <SkeletonChart />
      <SkeletonRows count={6} />
    </>
  ),
};

function screenLabel(slug: ScreenSlug): string {
  return SCREENS.filter((screen) => screen.slug === slug)
    .map((screen) => screen.label)
    .join('');
}

function PeriodPlaceholder() {
  return (
    <span
      aria-hidden="true"
      className="h-9 w-72 max-w-full rounded-pill bg-grid motion-safe:animate-pulse"
    />
  );
}

function ThemeTogglePlaceholder() {
  return (
    <span
      aria-hidden="true"
      className="size-11 rounded-input border border-line bg-grid motion-safe:animate-pulse"
    />
  );
}

export interface ScreenLoadingProps {
  readonly screen: ScreenSlug;
}

export function ScreenLoading({ screen }: ScreenLoadingProps) {
  const label = screenLabel(screen);
  return (
    <>
      <TopbarFrame
        title={label}
        subtitle={
          <span
            aria-hidden="true"
            className="inline-block h-3 w-56 max-w-full rounded-chip bg-grid motion-safe:animate-pulse"
          />
        }
        controls={
          <>
            {SCREENS_WITHOUT_PERIOD.has(screen) ? null : <PeriodPlaceholder />}
            <ThemeTogglePlaceholder />
          </>
        }
      />
      <main
        aria-busy="true"
        className="flex w-full max-w-310 flex-col gap-3.5 p-4 sm:gap-5 sm:px-8 sm:pt-7 sm:pb-12"
      >
        <p role="status" className="text-sm text-muted">
          Loading {label}…
        </p>
        <div aria-hidden="true" className="flex flex-col gap-3.5 sm:gap-5">
          {SCREEN_SKELETONS[screen]()}
        </div>
      </main>
    </>
  );
}
