import type { VisitKindBadge } from '@/domain/visit-kind';

const CHIP = 'rounded-pill px-2 py-0.5 text-xs font-medium whitespace-normal';
const COUNTED = `${CHIP} bg-soft text-ink`;
const NOT_COUNTED = `${CHIP} border border-line text-muted`;

export interface VisitKindChipProps {
  readonly kind: VisitKindBadge | null;
  readonly className?: string;
}

export function VisitKindChip({ kind, className = '' }: VisitKindChipProps) {
  if (kind === null) {
    return null;
  }
  return (
    <span title={kind.note} className={`${kind.counted ? COUNTED : NOT_COUNTED} ${className}`}>
      {kind.label}
      <span className="sr-only">. {kind.note}</span>
    </span>
  );
}
