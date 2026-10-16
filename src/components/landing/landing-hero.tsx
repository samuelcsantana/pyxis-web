import { BrandBackdrop } from '@/components/brand/brand-backdrop';
import type { LandingPreviewView } from '@/domain/landing-preview';
import { FOCUS_RING, CONTROL_TRANSITION } from '@/components/ui/control-classes';
import type { I18n } from '@/i18n/i18n';
import { ASK_CLAUDE_ID } from './ask-claude-section';
import { LANDING_WIDTH, LINK_PRIMARY, LINK_SECONDARY } from './landing-classes';
import { LANDING_LINKS } from './landing-links';
import { LANDING_EVENTS, trackAttributes } from './measurement/landing-events';
import { LandingPreview } from './landing-preview';
import { LandingProof } from './landing-proof';
import { Eyebrow } from './landing-section';
import { PRICING_ID } from './pricing-section';

export interface LandingHeroProps {
  readonly i18n: I18n;
  readonly preview: LandingPreviewView;
}

export const HERO_TITLE_ID = 'landing-title';
const ARROW_ICON = 'M5 12h14 M13 6l6 6-6 6';

export function LandingHero({ i18n, preview }: LandingHeroProps) {
  const { t } = i18n;
  return (
    <section aria-labelledby={HERO_TITLE_ID} className="relative isolate overflow-hidden">
      <BrandBackdrop />
      <div className={`${LANDING_WIDTH} py-10 sm:py-16 lg:py-20`}>
        <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14">
          <div className="flex max-w-2xl flex-col gap-5">
            <Eyebrow>{t('landing.hero.eyebrow')}</Eyebrow>
            <h1
              id={HERO_TITLE_ID}
              className="text-4xl leading-[1.08] font-semibold tracking-[-0.03em] text-balance sm:text-5xl"
            >
              {t('landing.hero.title')}
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-pretty text-muted">
              {t('landing.hero.lead')}
            </p>
            <div className="mt-1 flex flex-wrap gap-2.5">
              <a
                href={LANDING_LINKS.demo}
                className={LINK_PRIMARY}
                {...trackAttributes(LANDING_EVENTS.demoOpened, { from: 'hero' })}
              >
                {t('landing.hero.openDemo')}
                <svg width={18} height={18} viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d={ARROW_ICON}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <a
                href={`#${PRICING_ID}`}
                className={LINK_SECONDARY}
                {...trackAttributes(LANDING_EVENTS.pricingOpened, { from: 'hero' })}
              >
                {t('landing.hero.seePricing')}
              </a>
            </div>
            <p className="text-caption text-muted">{t('landing.hero.note')}</p>
            <a
              href={`#${ASK_CLAUDE_ID}`}
              className={`mt-1 inline-flex w-fit max-w-full items-center gap-2.5 rounded-pill border border-line-strong bg-card py-1.5 pr-4 pl-1.5 text-sm text-ink hover:border-muted hover:bg-soft active:bg-line ${FOCUS_RING} ${CONTROL_TRANSITION}`}
              {...trackAttributes(LANDING_EVENTS.askClaudeOpened, { from: 'hero' })}
            >
              <span className="shrink-0 rounded-pill bg-accent px-2 py-0.5 text-caption font-semibold text-accent-ink">
                {t('landing.hero.claudeTag')}
              </span>{' '}
              <span className="min-w-0">
                {t('landing.hero.claude')}
                <span aria-hidden="true">{'\u00a0→'}</span>
              </span>
            </a>
          </div>
          <LandingPreview view={preview} i18n={i18n} />
        </div>
        <div className="mt-12">
          <LandingProof i18n={i18n} />
        </div>
      </div>
    </section>
  );
}
