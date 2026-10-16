import { type ScreenSlug, screenHref, screenLabelKey } from '@/components/shell/screens';
import { CONTROL_TRANSITION, FOCUS_RING, TEXT_LINK } from '@/components/ui/control-classes';
import type { I18n } from '@/i18n/i18n';
import { rich } from '@/i18n/rich';
import { liveDemoUrlOf } from '@/lib/demo-canonical';
import { DEMO_STORE } from '@/services/demo/demo-projects';
import { REVEAL } from './landing-classes';
import { LANDING_LINKS } from './landing-links';
import { LandingSection } from './landing-section';
import { LANDING_EVENTS, trackAttributes } from './measurement/landing-events';
import { ScreenGlyph } from './screen-glyph';

export interface DashboardAnswersSectionProps {
  readonly i18n: I18n;
}

export const DASHBOARD_ANSWERS_ID = 'dashboard';

export const SCREENS_SHOWN = [
  'overview',
  'acquisition',
  'devices',
  'features',
  'funnel',
  'requests',
  'visits',
  'timeline',
] as const satisfies readonly ScreenSlug[];

export function demoScreenUrl(screen: ScreenSlug): string {
  return liveDemoUrlOf(screenHref(DEMO_STORE.id, screen));
}

export function DashboardAnswersSection({ i18n }: DashboardAnswersSectionProps) {
  const { t } = i18n;
  return (
    <LandingSection
      id={DASHBOARD_ANSWERS_ID}
      eyebrow={t('landing.answers.eyebrow')}
      title={t('landing.answers.title')}
      lead={t('landing.answers.lead')}
    >
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {SCREENS_SHOWN.map((screen) => (
          <li key={screen} className={`flex ${REVEAL}`}>
            <a
              href={demoScreenUrl(screen)}
              {...trackAttributes(LANDING_EVENTS.demoOpened, { from: 'screens', screen })}
              className={`flex grow flex-col gap-2.5 rounded-card border border-line bg-card p-4 hover:border-muted active:bg-soft ${FOCUS_RING} ${CONTROL_TRANSITION}`}
            >
              <ScreenGlyph screen={screen} />
              <h3 className="text-base font-semibold">{t(screenLabelKey(screen))}</h3>
              <p className="grow text-sm leading-normal text-muted">
                {t(`landing.answers.questions.${screen}`)}
              </p>
              <span className="text-caption font-semibold text-sky-ink">
                {t('landing.answers.open')}
                <span aria-hidden="true"> →</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
      <p className={`mt-6 text-sm text-muted ${REVEAL}`}>
        {rich(t('landing.answers.agent'), {
          link: (text) => (
            <a href={LANDING_LINKS.connectClaude} className={TEXT_LINK}>
              {text}
            </a>
          ),
        })}
      </p>
    </LandingSection>
  );
}
