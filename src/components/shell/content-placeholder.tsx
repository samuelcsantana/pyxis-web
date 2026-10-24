import {
  SKELETON_SCREEN,
  SKELETON_STACK,
  SkeletonCards,
  SkeletonRows,
} from '@/components/states/screen-skeleton';

export interface ContentPlaceholderProps {
  readonly label: string;
}

const HIDDEN_WHILE_CONTENT_FOLLOWS = '[&:has(~main)]:hidden';

export function ContentPlaceholder({ label }: ContentPlaceholderProps) {
  return (
    <div aria-busy="true" className={`${SKELETON_SCREEN} ${HIDDEN_WHILE_CONTENT_FOLLOWS}`}>
      <p role="status" className="text-sm text-muted">
        {label}
      </p>
      <div aria-hidden="true" className={SKELETON_STACK}>
        <SkeletonCards count={3} />
        <SkeletonRows count={6} />
      </div>
    </div>
  );
}
