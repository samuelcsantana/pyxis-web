import { CHANNELS, channelLabel } from '@/domain/acquisition';
import {
  BROWSER_FAMILIES,
  COUNTRY_CODE_PATTERN,
  MAX_CAMPAIGN_LENGTH,
  MAX_CITY_LENGTH,
  MAX_SOURCE_LENGTH,
  OS_FAMILIES,
  VISIT_DEVICE_TYPES,
} from '@/domain/dashboard-filters';
import type { RowFilterField } from '@/domain/dashboard-filter-parameters';
import { browserLabel, deviceTypeLabel, operatingSystemLabel, REGION_CODE } from '@/domain/devices';
import { EVENT_NAME_PATTERN, MAX_PATH_LENGTH } from '@/domain/funnel';
import { type RangeProblem, rangeProblemNotice } from '@/domain/period';
import type { I18n } from '@/i18n/i18n';

export interface FilterFieldOption {
  readonly value: string;
  readonly label: string;
}

export type FilterFieldOptions = readonly [FilterFieldOption, ...FilterFieldOption[]];

export interface FilterFieldText {
  readonly field: RowFilterField;
  readonly label: string;
  readonly hint?: string;
  readonly placeholder?: string;
  readonly pattern?: string;
  readonly maxLength?: number;
  readonly upperCase?: boolean;
  readonly options?: FilterFieldOptions;
}

export type FilterFieldTexts = readonly [FilterFieldText, ...FilterFieldText[]];

export interface ScreenTopbarTexts {
  readonly rangeNotices: Readonly<Record<RangeProblem, string>>;
  readonly waitingForTheFirstEvent: string;
  readonly filterFields: FilterFieldTexts;
}

const ANCHORS = /^\^|\$$/g;
const PATH_PATTERN = '/.*';

function inputPattern(rule: RegExp): string {
  return rule.source.replace(ANCHORS, '');
}

function optionsOf<Value extends string>(
  values: readonly [Value, ...Value[]],
  label: (value: Value) => string,
): FilterFieldOptions {
  const [first, ...rest] = values;
  return [
    { value: first, label: label(first) },
    ...rest.map((value) => ({ value, label: label(value) })),
  ];
}

function filterFields(i18n: I18n): FilterFieldTexts {
  const t = i18n.t;
  return [
    {
      field: 'country',
      label: t('visits.filters.country'),
      hint: t('visits.filters.countryHint'),
      placeholder: t('visits.filters.placeholders.country'),
      pattern: inputPattern(COUNTRY_CODE_PATTERN),
      upperCase: true,
    },
    {
      field: 'region',
      label: t('visits.filters.region'),
      hint: t('visits.filters.regionHint'),
      placeholder: t('visits.filters.placeholders.region'),
      pattern: inputPattern(REGION_CODE),
      upperCase: true,
    },
    {
      field: 'city',
      label: t('visits.filters.city'),
      hint: t('visits.filters.cityHint'),
      placeholder: t('visits.filters.placeholders.city'),
      maxLength: MAX_CITY_LENGTH,
    },
    {
      field: 'device',
      label: t('visits.filters.device'),
      options: optionsOf(VISIT_DEVICE_TYPES, (value) => deviceTypeLabel(value, i18n)),
    },
    {
      field: 'browser',
      label: t('visits.filters.browser'),
      options: optionsOf(BROWSER_FAMILIES, (value) => browserLabel(value, i18n)),
    },
    {
      field: 'os',
      label: t('visits.filters.os'),
      options: optionsOf(OS_FAMILIES, (value) => operatingSystemLabel(value, i18n)),
    },
    {
      field: 'channel',
      label: t('visits.filters.channel'),
      options: optionsOf(CHANNELS, (channel) => channelLabel(channel, i18n)),
    },
    {
      field: 'source',
      label: t('visits.filters.source'),
      hint: t('visits.filters.sourceHint'),
      placeholder: t('visits.filters.placeholders.source'),
      maxLength: MAX_SOURCE_LENGTH,
    },
    {
      field: 'campaign',
      label: t('visits.filters.campaign'),
      placeholder: t('visits.filters.placeholders.campaign'),
      maxLength: MAX_CAMPAIGN_LENGTH,
    },
    {
      field: 'path',
      label: t('visits.filters.pages.path'),
      hint: t('visits.filters.pages.hint'),
      placeholder: t('visits.filters.placeholders.path'),
      pattern: PATH_PATTERN,
      maxLength: MAX_PATH_LENGTH,
    },
    {
      field: 'event',
      label: t('visits.filters.event'),
      placeholder: t('visits.filters.placeholders.event'),
      pattern: inputPattern(EVENT_NAME_PATTERN),
    },
  ];
}

export function screenTopbarTexts(i18n: I18n): ScreenTopbarTexts {
  return {
    rangeNotices: {
      'not-a-date': rangeProblemNotice('not-a-date', i18n),
      inverted: rangeProblemNotice('inverted', i18n),
      future: rangeProblemNotice('future', i18n),
      'too-long': rangeProblemNotice('too-long', i18n),
    },
    waitingForTheFirstEvent: i18n.t('settings.activity.waiting'),
    filterFields: filterFields(i18n),
  };
}
