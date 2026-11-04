export function focusReturnTargetOf(element: HTMLElement): HTMLElement {
  return element.closest('details')?.querySelector<HTMLElement>(':scope > summary') ?? element;
}

export function closeTheMenuAround(element: Element) {
  const menu = element.closest('details');
  if (menu !== null) {
    menu.open = false;
  }
}

export function returnFocusTo(target: HTMLElement | null) {
  if (target?.isConnected === true) {
    target.focus();
  }
}
