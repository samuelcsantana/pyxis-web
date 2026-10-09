export function subscribeToNothing(): () => void {
  return () => undefined;
}
