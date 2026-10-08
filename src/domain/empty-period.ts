import type { I18n } from '@/i18n/i18n';
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

export function emptyPeriodView(project: Project, period: Period, i18n: I18n): EmptyPeriodView {
  if (typeof project.firstEventAt !== 'string') {
    return { kind: 'first-run' };
  }
  return {
    kind: 'quiet',
    latestEvent:
      typeof project.lastEventAt === 'string'
        ? i18n.format.dateTime('eventTime', project.timezone)(new Date(project.lastEventAt))
        : null,
    offersWiderPeriod: period.preset !== WIDER_PERIOD,
  };
}
