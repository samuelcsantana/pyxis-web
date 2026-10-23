import { MainContent, type MainContentProps } from './main-content';
import { RefreshWhenStale } from './refresh-when-stale';

export const SCREEN_TOP_MARK = 'screen-top';

export interface ScreenContentProps extends MainContentProps {
  readonly readAt?: number;
}

export function ScreenContent({ readAt, ...props }: ScreenContentProps) {
  return (
    <>
      <span
        aria-hidden="true"
        data-testid={SCREEN_TOP_MARK}
        className="pointer-events-none absolute inset-x-0 top-0 block h-0"
      />
      {readAt === undefined ? null : <RefreshWhenStale readAt={readAt} />}
      <MainContent {...props} />
    </>
  );
}
