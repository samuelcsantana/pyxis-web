export const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function wrappedFocus(
  focusable: readonly HTMLElement[],
  current: Element | null,
  backwards: boolean,
): HTMLElement | undefined {
  const first = focusable[0];
  const last = focusable.at(-1);
  if (backwards) {
    return current === first ? last : undefined;
  }
  return current === last ? first : undefined;
}
