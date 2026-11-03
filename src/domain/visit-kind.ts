import type { I18n } from '@/i18n/i18n';

export const VISIT_KINDS = [
  'first_visit',
  'first_this_month',
  'first_today',
  'again_today',
] as const;
export type VisitKind = (typeof VISIT_KINDS)[number];

export interface VisitKindBadge {
  readonly label: string;
  readonly note: string;
  readonly counted: boolean;
}

const LABEL_KEYS = {
  first_visit: 'visitKind.firstVisit',
  first_this_month: 'visitKind.firstThisMonth',
  first_today: 'visitKind.firstToday',
  again_today: 'visitKind.againToday',
} as const satisfies Readonly<Record<VisitKind, string>>;

export function countsAsUniqueToday(kind: VisitKind): boolean {
  return kind !== 'again_today';
}

export function visitKindBadge(kind: VisitKind | null, i18n: I18n): VisitKindBadge | null {
  if (kind === null) {
    return null;
  }
  const counted = countsAsUniqueToday(kind);
  return {
    label: i18n.t(LABEL_KEYS[kind]),
    note: i18n.t(counted ? 'visitKind.counted' : 'visitKind.notCounted'),
    counted,
  };
}
