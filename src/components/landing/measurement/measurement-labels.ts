import type { I18n } from '@/i18n/i18n';
import type { VisitorKind } from './visitor-period';

export const ID_PLACEHOLDER = '{id}';
export const HOST_PLACEHOLDER = '{host}';
export const DAY_PLACEHOLDER = '{day}';
export const MONTH_PLACEHOLDER = '{month}';
export const KIND_PLACEHOLDER = '{kind}';

export interface MeasurementLabels {
  readonly measured: string;
  readonly see: string;
  readonly optOut: string;
  readonly off: string;
  readonly optIn: string;
  readonly blocked: string;
}

export interface RecordedLabels {
  readonly button: string;
  readonly title: string;
  readonly subtitle: string;
  readonly visit: string;
  readonly referrer: string;
  readonly noReferrer: string;
  readonly empty: string;
  readonly never: string;
  readonly kept: string;
  readonly visitorKind: string;
  readonly kinds: Readonly<Record<VisitorKind, string>>;
  readonly close: string;
}

export function measurementLabelsOf({ t }: I18n): MeasurementLabels {
  return {
    measured: t('landing.measurement.measured'),
    see: t('landing.measurement.see'),
    optOut: t('landing.measurement.optOut'),
    off: t('landing.measurement.off'),
    optIn: t('landing.measurement.optIn'),
    blocked: t('landing.measurement.blocked'),
  };
}

export function recordedLabelsOf({ t }: I18n): RecordedLabels {
  return {
    button: t('landing.recorded.button'),
    title: t('landing.recorded.title'),
    subtitle: t('landing.recorded.subtitle'),
    visit: t('landing.recorded.visit', { id: ID_PLACEHOLDER }),
    referrer: t('landing.recorded.referrer', { host: HOST_PLACEHOLDER }),
    noReferrer: t('landing.recorded.noReferrer'),
    empty: t('landing.recorded.empty'),
    never: t('landing.recorded.never'),
    kept: t('landing.recorded.kept', { day: DAY_PLACEHOLDER, month: MONTH_PLACEHOLDER }),
    visitorKind: t('landing.recorded.visitorKind', { kind: KIND_PLACEHOLDER }),
    kinds: {
      first_visit: t('landing.recorded.kinds.firstVisit'),
      first_this_month: t('landing.recorded.kinds.firstThisMonth'),
      first_today: t('landing.recorded.kinds.firstToday'),
      again_today: t('landing.recorded.kinds.againToday'),
    },
    close: t('landing.recorded.close'),
  };
}
