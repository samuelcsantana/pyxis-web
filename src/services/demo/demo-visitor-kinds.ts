export type DemoVisitorKind = 'first_visit' | 'first_this_month' | 'first_today' | 'again_today';

const SLOT_DIGITS = 4;
const SLOTS = 100;
const HEXADECIMAL = 16;
const SHARES: readonly { readonly kind: DemoVisitorKind; readonly below: number }[] = [
  { kind: 'first_visit', below: 52 },
  { kind: 'first_this_month', below: 64 },
  { kind: 'first_today', below: 85 },
];
const SAME_DAY_VISITOR: DemoVisitorKind = 'again_today';

export function demoVisitorOf(sessionId: string): DemoVisitorKind {
  const slot = Number.parseInt(sessionId.slice(-SLOT_DIGITS), HEXADECIMAL) % SLOTS;
  return SHARES.find((share) => slot < share.below)?.kind ?? SAME_DAY_VISITOR;
}
