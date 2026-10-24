export const SEEN_MARKS_PREFIX = 'pyxis:seen:';

export type SeenMarksStorage = Pick<
  Storage,
  'getItem' | 'setItem' | 'removeItem' | 'key' | 'length'
>;

export const browserSeenMarksStorage = (): SeenMarksStorage => window.localStorage;

export function seenMarksKey(projectId: string): string {
  return `${SEEN_MARKS_PREFIX}${projectId}`;
}

export function bestEffortForgetSeenMarks(
  storage: () => SeenMarksStorage = browserSeenMarksStorage,
): void {
  try {
    const store = storage();
    const keys = Array.from({ length: store.length }, (_, index) => store.key(index)).filter(
      (key): key is string => key?.startsWith(SEEN_MARKS_PREFIX) === true,
    );
    for (const key of keys) {
      store.removeItem(key);
    }
  } catch (error) {
    console.warn('seen marks: could not forget the marks on this device', error);
  }
}
