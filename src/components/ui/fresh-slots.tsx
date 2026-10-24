export const FRESH_ITEM = 'data-fresh-item';
export const FRESH_VALUE = 'data-fresh-value';
export const FRESH_STARTED = 'data-fresh-started';
export const FRESH_ARRIVED = 'arrived';
export const FRESH_KEPT = 'kept';

export const FRESH_HIGHLIGHT = 'has-[[data-fresh-shown=arrived]]:motion-safe:animate-fresh';

const SLOT = 'empty:hidden';

export interface FreshCountProps {
  readonly item: string;
  readonly value: number;
  readonly className?: string;
}

export function FreshCount({ item, value, className = '' }: FreshCountProps) {
  return (
    <span data-fresh-item={item} data-fresh-value={value} className={`${SLOT} ${className}`} />
  );
}

export interface FreshVisitProps {
  readonly startedAt: number;
  readonly className?: string;
}

export function FreshVisit({ startedAt, className = '' }: FreshVisitProps) {
  return <span data-fresh-started={startedAt} className={`${SLOT} ${className}`} />;
}
