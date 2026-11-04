import { PRO_PLAN_EVENTS_PER_MONTH, PRO_PLAN_PEOPLE, PRO_PLAN_PROJECTS } from '@/domain/sign-up';
import type { I18n } from '@/i18n/i18n';

export interface ProPlanValues {
  readonly proEvents: string;
  readonly proSites: string;
  readonly proPeople: string;
}

export function proPlanValuesOf(i18n: I18n): ProPlanValues {
  return {
    proEvents: i18n.format.count(PRO_PLAN_EVENTS_PER_MONTH),
    proSites: i18n.format.count(PRO_PLAN_PROJECTS),
    proPeople: i18n.format.count(PRO_PLAN_PEOPLE),
  };
}
