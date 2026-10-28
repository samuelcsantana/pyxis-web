import { MainContent, type MainContentProps } from './main-content';
import { RefreshWhenStale } from './refresh-when-stale';
import { ScreenRead } from './screen-read';

export const SCREEN_TOP_MARK = 'screen-top';

export interface ScreenContentProps extends MainContentProps {
  readonly readAt?: number;
  readonly filtered?: boolean;
}

export function ScreenContent({ readAt, filtered = false, ...props }: ScreenContentProps) {
  return (
    <>
      <span
        aria-hidden="true"
        data-testid={SCREEN_TOP_MARK}
        className="pointer-events-none absolute inset-x-0 top-0 block h-0"
      />
      {readAt === undefined ? null : (
        <>
          {filtered ? null : <ScreenRead readAt={readAt} />}
          <RefreshWhenStale readAt={readAt} />
        </>
      )}
      <MainContent {...props} />
    </>
  );
}
