import { CONTROL_TRANSITION, FOCUS_RING } from '@/components/ui/control-classes';
import type { I18n } from '@/i18n/i18n';
import { REVEAL } from './landing-classes';
import { LandingSection } from './landing-section';
import { LANDING_EVENTS, trackAttributes } from './measurement/landing-events';
import { LANDING_LINKS, PROPER_NAMES } from './landing-links';

export interface InProductionSectionProps {
  readonly i18n: I18n;
}

export const IN_PRODUCTION_ID = 'in-production';

const SITES = [
  { domain: PROPER_NAMES.bolsoverde, href: LANDING_LINKS.bolsoverde, note: 'bolsoverde' },
  { domain: PROPER_NAMES.author, href: LANDING_LINKS.author, note: 'blog' },
] as const;

export function InProductionSection({ i18n }: InProductionSectionProps) {
  const { t } = i18n;
  return (
    <LandingSection
      id={IN_PRODUCTION_ID}
      eyebrow={t('landing.production.eyebrow')}
      title={t('landing.production.title')}
    >
      <ul className="grid gap-3 md:grid-cols-2">
        {SITES.map((site) => (
          <li key={site.domain} className={`flex min-w-0 ${REVEAL}`}>
            <a
              href={site.href}
              {...trackAttributes(LANDING_EVENTS.siteOpened, { site: site.domain })}
              className={`flex min-w-0 grow flex-col gap-1 rounded-card border border-line bg-card px-5 py-4.5 hover:border-muted active:bg-soft ${FOCUS_RING} ${CONTROL_TRANSITION}`}
            >
              <span className="font-mono text-lg font-semibold wrap-anywhere">{site.domain}</span>
              <span className="text-sm text-muted">{t(`landing.production.${site.note}`)}</span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-muted">{t('landing.production.foot')}</p>
    </LandingSection>
  );
}
