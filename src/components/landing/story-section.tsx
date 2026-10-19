import type { I18n } from '@/i18n/i18n';
import type { Locale } from '@/i18n/locales';
import { LANDING_WIDTH, LINK_SECONDARY, REVEAL } from './landing-classes';
import { Eyebrow } from './landing-section';
import { LANDING_EVENTS, trackAttributes } from './measurement/landing-events';

export interface StorySectionProps {
  readonly i18n: I18n;
}

export const STORY_ID = 'story';

const ENGLISH_INTRODUCTION_POST =
  'https://www.samuelsantana.dev/en/blog/pyxis-analytics-without-cookies-ip-or-personal-data';

export const INTRODUCTION_POSTS: Readonly<Record<Locale, string>> = {
  en: ENGLISH_INTRODUCTION_POST,
  'pt-BR': 'https://www.samuelsantana.dev/blog/pyxis-analytics-sem-cookie-sem-ip-sem-dado-pessoal',
  es: 'https://www.samuelsantana.dev/es/blog/pyxis-analytics-sin-cookies-sin-ip-sin-datos-personales',
  de: ENGLISH_INTRODUCTION_POST,
  fr: ENGLISH_INTRODUCTION_POST,
  it: ENGLISH_INTRODUCTION_POST,
  nl: ENGLISH_INTRODUCTION_POST,
};

const ARROW_ICON = 'M5 12h14 M13 6l6 6-6 6';

export function StorySection({ i18n }: StorySectionProps) {
  const { t, locale } = i18n;
  const titleId = `${STORY_ID}-title`;
  return (
    <section
      id={STORY_ID}
      aria-labelledby={titleId}
      className="scroll-mt-16 border-t border-line py-16 lg:py-22"
    >
      <div className={LANDING_WIDTH}>
        <div
          className={`flex flex-wrap items-center justify-between gap-5 rounded-panel border border-line-strong bg-card p-7 shadow-raised ${REVEAL}`}
        >
          <div className="flex max-w-xl flex-col gap-2">
            <Eyebrow>{t('landing.story.eyebrow')}</Eyebrow>
            <h2 id={titleId} className="text-2xl font-semibold tracking-tight">
              {t('landing.story.title')}
            </h2>
            <p className="text-base text-muted">{t('landing.story.body')}</p>
          </div>
          <a
            href={INTRODUCTION_POSTS[locale]}
            className={LINK_SECONDARY}
            {...trackAttributes(LANDING_EVENTS.postOpened)}
          >
            {t('landing.story.cta')}
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
        </div>
      </div>
    </section>
  );
}
