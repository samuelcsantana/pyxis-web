import { TEXT_LINK } from '@/components/ui/control-classes';
import type { I18n } from '@/i18n/i18n';
import { rich } from '@/i18n/rich';
import { CodeBlock, type CodeToken, keyword, plain } from './install-section';
import { REVEAL } from './landing-classes';
import { HOSTED_CONNECTOR_URL, LANDING_LINKS } from './landing-links';
import { LandingSection } from './landing-section';
import { LANDING_EVENTS, trackAttributes } from './measurement/landing-events';

export interface AskClaudeSectionProps {
  readonly i18n: I18n;
}

export const ASK_CLAUDE_ID = 'ask-claude';

export const CONVERSATION_TOOLS = ['overview', 'funnel', 'funnel_segments'] as const;

export const PROMISES = ['reads', 'revoke', 'personal'] as const;

export const CONNECTOR_ADDRESS: readonly CodeToken[] = [plain(HOSTED_CONNECTOR_URL)];

export const CLAUDE_CODE_COMMAND: readonly CodeToken[] = [
  keyword('claude'),
  plain(` mcp add --transport http pyxis ${HOSTED_CONNECTOR_URL}`),
];

const CHECK_ICON = 'm5 12.5 4.5 4.5L19 7.5';
const BUBBLE = 'max-w-[92%] rounded-card px-4 py-3 text-sm leading-relaxed';

function Conversation({ i18n }: AskClaudeSectionProps) {
  const { t } = i18n;
  return (
    <figure
      aria-labelledby="ask-claude-example"
      className={`flex flex-col gap-3 rounded-panel border border-line-strong bg-card p-4 shadow-sm sm:p-5 ${REVEAL}`}
    >
      <figcaption id="ask-claude-example" className="text-caption font-semibold text-muted">
        {t('landing.askClaude.example.label')}
      </figcaption>
      <ol className="flex flex-col gap-3">
        <li className={`${BUBBLE} self-end bg-soft text-ink`}>
          <span className="sr-only">{t('landing.askClaude.example.you')}: </span>
          {t('landing.askClaude.example.question')}
        </li>
        <li className="flex flex-col gap-2">
          <p className="flex flex-wrap items-center gap-1.5 text-caption text-muted">
            {t('landing.askClaude.example.used')}
            {CONVERSATION_TOOLS.map((tool) => (
              <code
                key={tool}
                className="rounded-chip border border-line bg-bg px-1.5 py-0.5 font-mono text-micro text-ink"
              >
                {tool}
              </code>
            ))}
          </p>
          <p className={`${BUBBLE} border border-line bg-bg text-ink`}>
            <span className="sr-only">{t('landing.askClaude.example.claude')}: </span>
            {t('landing.askClaude.example.answer')}
          </p>
        </li>
      </ol>
      <p className="text-caption text-muted">{t('landing.askClaude.example.invented')}</p>
    </figure>
  );
}

export function AskClaudeSection({ i18n }: AskClaudeSectionProps) {
  const { t } = i18n;
  const labels = {
    copy: t('landing.install.copy'),
    copied: t('landing.install.copied'),
    selected: t('landing.install.selected'),
  };
  return (
    <LandingSection
      id={ASK_CLAUDE_ID}
      eyebrow={t('landing.askClaude.eyebrow')}
      title={t('landing.askClaude.title')}
      lead={t('landing.askClaude.lead')}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start lg:gap-10">
        <Conversation i18n={i18n} />
        <div className={`flex min-w-0 flex-col gap-4 ${REVEAL}`}>
          <h3 className="text-lg font-semibold">{t('landing.askClaude.connect')}</h3>
          <ol className="flex list-decimal flex-col gap-3 pl-5 text-sm leading-relaxed text-muted marker:font-mono marker:text-ink">
            <li>{t('connectedApps.stepOpen')}</li>
            <li>
              <div className="flex flex-col gap-2.5">
                {t('connectedApps.stepAddress')}
                <CodeBlock
                  id="ask-claude-address"
                  tokens={CONNECTOR_ADDRESS}
                  labels={labels}
                  wrap
                />
              </div>
            </li>
            <li>{t('connectedApps.stepAllow')}</li>
          </ol>
          <p className="text-sm text-muted">{t('connectedApps.everywhere')}</p>
          <p className="text-sm text-muted">{t('connectedApps.claudeCode')}</p>
          <CodeBlock id="ask-claude-command" tokens={CLAUDE_CODE_COMMAND} labels={labels} wrap />
        </div>
      </div>
      <ul className="mt-8 grid gap-3 md:grid-cols-3">
        {PROMISES.map((promise) => (
          <li
            key={promise}
            className={`flex gap-3 rounded-card border border-line bg-card px-4.5 py-4 ${REVEAL}`}
          >
            <svg
              width={18}
              height={18}
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-ok"
            >
              <path
                d={CHECK_ICON}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-semibold">
                {t(`landing.askClaude.promises.${promise}.title`)}
              </h3>
              <p className="text-sm leading-relaxed text-muted">
                {t(`landing.askClaude.promises.${promise}.body`)}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <p className={`mt-6 max-w-3xl text-sm leading-relaxed text-muted ${REVEAL}`}>
        {rich(t('landing.askClaude.foot'), {
          link: (text) => (
            <a
              href={LANDING_LINKS.connectClaude}
              className={TEXT_LINK}
              {...trackAttributes(LANDING_EVENTS.docsOpened, { doc: 'mcp' })}
            >
              {text}
            </a>
          ),
        })}
      </p>
    </LandingSection>
  );
}
