import { FREE_PLAN_EVENTS_PER_MONTH, offersTheFreePlan, type SignUpOffer } from '@/domain/sign-up';
import type { I18n } from '@/i18n/i18n';

export function landingDescriptionOf(i18n: I18n, offer: SignUpOffer): string {
  return offersTheFreePlan(offer)
    ? i18n.t('landing.meta.descriptionFree', {
        events: i18n.format.count(FREE_PLAN_EVENTS_PER_MONTH),
      })
    : i18n.t('landing.meta.description');
}
