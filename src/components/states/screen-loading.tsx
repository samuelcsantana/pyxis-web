import type { ReactNode } from 'react';
import { ScreenContent } from '@/components/shell/screen-content';
import { type ScreenSlug, screenLabelKey } from '@/components/shell/screens';
import type { I18n } from '@/i18n/i18n';
import {
  SkeletonCards,
  SkeletonChart,
  SkeletonControls,
  SkeletonForm,
  SkeletonPair,
  SkeletonRows,
  SkeletonSteps,
} from './screen-skeleton';

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

export interface ScreenLoadingProps {
  readonly screen: ScreenSlug;
  readonly i18n: I18n;
}

export function ScreenLoading({ screen, i18n }: ScreenLoadingProps) {
  const label = i18n.t(screenLabelKey(screen));
  return (
    <ScreenContent
      aria-busy="true"
      className="flex w-full max-w-310 flex-col gap-3.5 p-4 sm:gap-5 sm:px-8 sm:pt-7 sm:pb-12"
    >
      <p role="status" className="text-sm text-muted">
        {i18n.t('screens.loading', { screen: label })}
      </p>
      <div aria-hidden="true" className="flex flex-col gap-3.5 sm:gap-5">
        {SCREEN_SKELETONS[screen]()}
      </div>
    </ScreenContent>
  );
}
