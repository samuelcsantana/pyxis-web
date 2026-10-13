import type { I18n } from '@/i18n/i18n';

export const ID_PLACEHOLDER = '{id}';
export const HOST_PLACEHOLDER = '{host}';

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
    close: t('landing.recorded.close'),
  };
}
