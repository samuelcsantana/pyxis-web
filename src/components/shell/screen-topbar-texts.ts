import { type RangeProblem, rangeProblemNotice } from '@/domain/period';
import type { I18n } from '@/i18n/i18n';

export interface ScreenTopbarTexts {
  readonly rangeNotices: Readonly<Record<RangeProblem, string>>;
}

export function screenTopbarTexts(i18n: I18n): ScreenTopbarTexts {
  return {
    rangeNotices: {
      'not-a-date': rangeProblemNotice('not-a-date', i18n),
      inverted: rangeProblemNotice('inverted', i18n),
      future: rangeProblemNotice('future', i18n),
      'too-long': rangeProblemNotice('too-long', i18n),
    },
  };
}
