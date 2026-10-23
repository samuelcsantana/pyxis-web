import { useMemo, useSyncExternalStore } from 'react';
import { todayIn } from '@/domain/period';

function subscribeToNothing(): () => void {
  return () => undefined;
}

export function anchoredClock(serverNow: number, deviceNow: () => number): () => number {
  let offset: number | undefined;
  return () => {
    const now = deviceNow();
    offset ??= serverNow - now;
    return now + offset;
  };
}

function deviceNow(): number {
  return Date.now();
}

export function useProjectToday(timeZone: string, serverNow: number): string {
  const now = useMemo(() => anchoredClock(serverNow, deviceNow), [serverNow]);
  return useSyncExternalStore(
    subscribeToNothing,
    () => todayIn(timeZone, new Date(now())),
    () => todayIn(timeZone, new Date(serverNow)),
  );
}
