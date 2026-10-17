export function closeLanguageSelect(inside: Element): void {
  const details = inside.closest('details');
  if (details !== null) {
    details.open = false;
  }
}
