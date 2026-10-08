import type { I18n } from '@/i18n/i18n';
import {
  formatCount,
  formatPercent,
  MIN_COMPARABLE_BASE,
  MIN_MEANINGFUL_CHANGE,
  MIN_MEANINGFUL_POINTS,
} from './metrics';

export function changeToneRule(i18n: I18n): string {
  return i18n.t('glossary.changeTone', {
    base: formatCount(MIN_COMPARABLE_BASE, i18n),
    change: formatPercent(MIN_MEANINGFUL_CHANGE, i18n),
    points: formatCount(MIN_MEANINGFUL_POINTS, i18n),
  });
}
