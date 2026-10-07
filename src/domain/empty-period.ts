import type { Project } from './admin';
import type { Period, PeriodPreset } from './period';

export const WIDER_PERIOD: PeriodPreset = '30d';
export const WIDER_PERIOD_QUERY = new URLSearchParams({ range: WIDER_PERIOD }).toString();

export type EmptyPeriodView =
  | { readonly kind: 'first-run' }
  | {
      readonly kind: 'quiet';
      readonly latestEvent: string | null;
      readonly offersWiderPeriod: boolean;
    };

function eventTime(timeZone: string): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });
}

export function emptyPeriodView(project: Project, period: Period): EmptyPeriodView {
  if (typeof project.firstEventAt !== 'string') {
    return { kind: 'first-run' };
  }
  return {
    kind: 'quiet',
    latestEvent:
      typeof project.lastEventAt === 'string'
        ? eventTime(project.timezone).format(new Date(project.lastEventAt))
        : null,
    offersWiderPeriod: period.preset !== WIDER_PERIOD,
  };
}
