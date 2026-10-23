import { type RangeProblem, rangeProblemNotice } from '@/domain/period';
import type { RequestKind } from '@/domain/request-kind';
import type { I18n } from '@/i18n/i18n';
import type { ScreenSlug } from './screens';

export interface ScreenTopbarTexts {
  readonly subtitles: Readonly<Record<Exclude<ScreenSlug, 'requests'>, string>>;
  readonly requestsSubtitles: Readonly<Record<RequestKind, string>>;
  readonly rangeNotices: Readonly<Record<RangeProblem, string>>;
}

export function screenTopbarTexts(projectName: string, i18n: I18n): ScreenTopbarTexts {
  const values = { project: projectName };
  return {
    subtitles: {
      overview: i18n.t('overview.subtitle', values),
      funnel: i18n.t('funnel.page.subtitle', values),
      features: i18n.t('features.subtitle', values),
      timeline: i18n.t('timeline.page.subtitle', values),
      visits: i18n.t('visits.page.subtitle', values),
      devices: i18n.t('devices.subtitle', values),
      acquisition: i18n.t('acquisition.subtitle', values),
    },
    requestsSubtitles: {
      writes: i18n.t('requests.page.subtitle.writes', values),
      reads: i18n.t('requests.page.subtitle.reads', values),
    },
    rangeNotices: {
      'not-a-date': rangeProblemNotice('not-a-date', i18n),
      inverted: rangeProblemNotice('inverted', i18n),
      future: rangeProblemNotice('future', i18n),
      'too-long': rangeProblemNotice('too-long', i18n),
    },
  };
}
