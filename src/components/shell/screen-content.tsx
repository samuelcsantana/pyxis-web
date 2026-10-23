import { MainContent, type MainContentProps } from './main-content';

export const SCREEN_TOP_MARK = 'screen-top';

export function ScreenContent(props: MainContentProps) {
  return (
    <>
      <span
        aria-hidden="true"
        data-testid={SCREEN_TOP_MARK}
        className="pointer-events-none absolute inset-x-0 top-0 block h-0"
      />
      <MainContent {...props} />
    </>
  );
}
