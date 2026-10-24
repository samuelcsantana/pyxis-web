import { CONTROL_TRANSITION, FOCUS_RING, TEXT_LINK } from '@/components/ui/control-classes';
import type { I18n } from '@/i18n/i18n';
import { rich } from '@/i18n/rich';
import { DASHBOARD_ANSWERS_ID, demoScreenUrl } from './dashboard-answers-section';
import { REVEAL } from './landing-classes';
import { INSTALL_ID, PRICING_ID } from './landing-links';
import { LandingSection } from './landing-section';
import { LANDING_EVENTS, trackAttributes } from './measurement/landing-events';

export interface WhoItIsForSectionProps {
  readonly i18n: I18n;
}

export const WHO_IT_IS_FOR_ID = 'for-whom';

export const AUDIENCES = ['store', 'agency', 'product'] as const;

type Audience = (typeof AUDIENCES)[number];

interface AudienceLink {
  readonly href: string;
  readonly track: Readonly<Record<string, string>>;
}

const FROM = { from: WHO_IT_IS_FOR_ID } as const;

const LINKS: Readonly<Record<Audience, AudienceLink>> = {
  store: {
    href: demoScreenUrl('funnel'),
    track: trackAttributes(LANDING_EVENTS.demoOpened, { ...FROM, screen: 'funnel' }),
  },
  agency: { href: `#${PRICING_ID}`, track: trackAttributes(LANDING_EVENTS.pricingOpened, FROM) },
  product: { href: `#${DASHBOARD_ANSWERS_ID}`, track: {} },
};

const ICONS: Readonly<Record<Audience, readonly string[]>> = {
  store: [
    'M2 2h2l2.7 12.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 1.9-1.6L22 7H5.1',
    'M8 21h.01',
    'M19 21h.01',
  ],
  agency: ['m16 18 6-6-6-6', 'm8 6-6 6 6 6'],
  product: [
    'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z',
    'M3 9h18',
    'M9 21V9',
  ],
};

function AudienceIcon({ audience }: { readonly audience: Audience }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-8 rounded-input bg-soft p-1.5 text-sky-ink"
    >
      {ICONS[audience].map((path) => (
        <path
          key={path}
          d={path}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}

export function WhoItIsForSection({ i18n }: WhoItIsForSectionProps) {
  const { t } = i18n;
  return (
    <LandingSection
      id={WHO_IT_IS_FOR_ID}
      eyebrow={t('landing.forWhom.eyebrow')}
      title={t('landing.forWhom.title')}
      lead={t('landing.forWhom.lead')}
    >
      <ul className="grid gap-3 md:grid-cols-3">
        {AUDIENCES.map((audience) => (
          <li key={audience} className={`flex ${REVEAL}`}>
            <a
              href={LINKS[audience].href}
              {...LINKS[audience].track}
              className={`flex grow flex-col gap-2.5 rounded-card border border-line bg-card p-4 hover:border-muted active:bg-soft ${FOCUS_RING} ${CONTROL_TRANSITION}`}
            >
              <AudienceIcon audience={audience} />
              <h3 className="text-base font-semibold">{t(`landing.forWhom.${audience}.title`)}</h3>
              <p className="grow text-sm leading-normal text-muted">
                {t(`landing.forWhom.${audience}.body`)}
              </p>
              <span className="text-caption font-semibold text-sky-ink">
                {t(`landing.forWhom.${audience}.link`)}
                <span aria-hidden="true"> →</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
      <p className={`mt-5 text-sm leading-relaxed text-muted ${REVEAL}`}>
        {rich(t('landing.forWhom.install'), {
          link: (text) => (
            <a href={`#${INSTALL_ID}`} className={TEXT_LINK}>
              {text}
            </a>
          ),
        })}
      </p>
    </LandingSection>
  );
}
