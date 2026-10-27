import { TEXT_LINK } from '@/components/ui/control-classes';
import { offersSignUp, offersTheFreePlan, type SignUpOffer } from '@/domain/sign-up';
import type { I18n } from '@/i18n/i18n';
import { rich } from '@/i18n/rich';
import { CheerOnCopy } from './cheer-on-copy';
import { type CopyCodeLabels, CopyCodeButton } from './copy-code-button';
import { REVEAL } from './landing-classes';
import { INSTALL_ID, LANDING_LINKS } from './landing-links';
import { LandingSection } from './landing-section';
import { LANDING_EVENTS, trackAttributes } from './measurement/landing-events';
import { NudgeRobot } from './nudge-robot';

export interface InstallSectionProps {
  readonly i18n: I18n;
  readonly offer: SignUpOffer;
}

type TokenKind = 'plain' | 'keyword' | 'string';

export interface CodeToken {
  readonly kind: TokenKind;
  readonly text: string;
}

const TOKEN_CLASSES: Readonly<Record<TokenKind, string>> = {
  plain: 'text-nav-strong',
  keyword: 'text-accent',
  string: 'text-nav-text',
};

export const plain = (text: string): CodeToken => ({ kind: 'plain', text });
export const keyword = (text: string): CodeToken => ({ kind: 'keyword', text });
export const quoted = (text: string): CodeToken => ({ kind: 'string', text: `'${text}'` });

export const INSTALL_COMMAND: readonly CodeToken[] = [plain('npm install pyxis-analytics')];

export const FIRST_EVENT: readonly CodeToken[] = [
  keyword('import'),
  plain(' { init, track } '),
  keyword('from'),
  plain(' '),
  quoted('pyxis-analytics'),
  plain(';\n\ninit({ key: '),
  quoted('pyxis_pk_…'),
  plain(', endpoint: '),
  quoted('https://api.pyxis-analytics.dev'),
  plain(' });\ntrack('),
  quoted('signup_completed'),
  plain(', { method: '),
  quoted('email_code'),
  plain(' });'),
];

export function codeTextOf(tokens: readonly CodeToken[]): string {
  return tokens.map((token) => token.text).join('');
}

export type CodeWrap = 'none' | 'anywhere' | 'words';

interface CodeLayout {
  readonly block: string;
  readonly text: string;
}

const BESIDE_THE_COPY_BUTTON = 'py-4.5 pr-24';
const BELOW_THE_COPY_BUTTON_ON_PHONES = 'pt-13 pb-4.5 pr-5 sm:pt-4.5 sm:pr-24';

const CODE_LAYOUTS: Readonly<Record<CodeWrap, CodeLayout>> = {
  none: { block: BESIDE_THE_COPY_BUTTON, text: 'm-0' },
  anywhere: { block: BESIDE_THE_COPY_BUTTON, text: 'm-0 break-all whitespace-pre-wrap' },
  words: { block: BELOW_THE_COPY_BUTTON_ON_PHONES, text: 'm-0 whitespace-pre-wrap wrap-anywhere' },
};

export interface CodeBlockProps {
  readonly id: string;
  readonly tokens: readonly CodeToken[];
  readonly labels: CopyCodeLabels;
  readonly wrap?: CodeWrap;
}

export function CodeBlock({ id, tokens, labels, wrap = 'none' }: CodeBlockProps) {
  const layout = CODE_LAYOUTS[wrap];
  return (
    <div
      className={`relative overflow-x-auto rounded-card bg-nav pl-5 font-mono text-sm leading-7 ${layout.block}`}
    >
      <pre id={id} className={layout.text}>
        <code>
          {tokens.map((token, index) => (
            <span key={`${String(index)}-${token.text}`} className={TOKEN_CLASSES[token.kind]}>
              {token.text}
            </span>
          ))}
        </code>
      </pre>
      <CopyCodeButton
        code={codeTextOf(tokens)}
        targetId={id}
        labels={labels}
        track={trackAttributes(LANDING_EVENTS.snippetCopied, { snippet: id })}
      />
    </div>
  );
}

const INFO_ICON = 'M12 3a9 9 0 1 1 0 18a9 9 0 1 1 0-18 M12 11v5.5 M12 7.5h.01';

export const START_STEPS = ['account', 'install', 'ask'] as const;

function stepBodyOf(step: (typeof START_STEPS)[number], free: boolean) {
  return free && step === 'account'
    ? 'landing.install.steps.account.bodyFree'
    : (`landing.install.steps.${step}.body` as const);
}

function StartSteps({ i18n, free }: { readonly i18n: I18n; readonly free: boolean }) {
  const { t } = i18n;
  return (
    <ol aria-label={t('landing.install.steps.label')} className="mb-7 grid gap-3 md:grid-cols-3">
      {START_STEPS.map((step, index) => (
        <li
          key={step}
          className={`flex gap-3.5 rounded-card border border-line bg-card p-4 ${REVEAL}`}
        >
          <span
            aria-hidden="true"
            className="flex size-8 shrink-0 items-center justify-center rounded-pill bg-accent font-mono font-semibold text-accent-ink"
          >
            {index + 1}
          </span>
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-semibold">{t(`landing.install.steps.${step}.title`)}</h3>
            <p className="text-sm leading-normal text-muted">{t(stepBodyOf(step, free))}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export const AGENT_PROMPT_ID = 'install-agent-prompt';

interface AgentPromptProps {
  readonly i18n: I18n;
  readonly labels: CopyCodeLabels;
}

export const AGENT_ROBOT_ID_PREFIX = 'install-robot';

const SPARKLE_ICON =
  'M12 3v4 M12 17v4 M3 12h4 M17 12h4 M6 6l2.5 2.5 M15.5 15.5 18 18 M6 18l2.5-2.5 M15.5 8.5 18 6';

export const CODING_AGENTS = [
  'Claude Code',
  'Cursor',
  'Codex',
  'GitHub Copilot',
  'Gemini CLI',
  'Windsurf',
] as const;

const AGENT_CHIP = 'rounded-pill border border-line bg-bg px-2.75 py-1.25 text-caption';

function AgentChips({ i18n }: { readonly i18n: I18n }) {
  const { t } = i18n;
  return (
    <ul aria-label={t('landing.install.agent.agents')} className="flex flex-wrap gap-1.5">
      {CODING_AGENTS.map((agent) => (
        <li key={agent} className={`${AGENT_CHIP} font-medium text-ink`}>
          {agent}
        </li>
      ))}
      <li className={`${AGENT_CHIP} border-dashed text-muted`}>
        {t('landing.install.agent.others')}
      </li>
    </ul>
  );
}

function AgentPrompt({ i18n, labels }: AgentPromptProps) {
  const { t } = i18n;
  const prompt = t('landing.install.agent.prompt');
  return (
    <div
      aria-labelledby="install-agent-title"
      role="group"
      className={`landing-agent-card relative mt-7 flex flex-col gap-3 rounded-card border py-7 pr-26 pl-5 sm:pr-36 sm:pl-8 ${REVEAL}`}
    >
      <div aria-hidden="true" className="landing-agent-robot">
        <CheerOnCopy codeId={AGENT_PROMPT_ID}>
          <NudgeRobot idPrefix={AGENT_ROBOT_ID_PREFIX} />
        </CheerOnCopy>
      </div>
      <p className="landing-agent-badge">
        <svg width={13} height={13} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d={SPARKLE_ICON}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
          />
        </svg>
        {t('landing.install.agent.badge')}
      </p>
      <h3
        id="install-agent-title"
        className="text-[1.6rem] leading-[1.2] font-semibold tracking-[-0.02em] sm:text-[2rem]"
      >
        {t('landing.install.agent.title')}
      </h3>
      <p className="text-base leading-relaxed text-muted">{t('landing.install.agent.lead')}</p>
      <AgentChips i18n={i18n} />
      <div className="-mr-20 flex flex-col gap-3 sm:-mr-28">
        <CodeBlock id={AGENT_PROMPT_ID} tokens={[plain(prompt)]} labels={labels} wrap="words" />
        <CopyCodeButton
          code={prompt}
          targetId={AGENT_PROMPT_ID}
          labels={{
            copy: t('landing.install.agent.copyRequest'),
            copied: t('landing.install.agent.requestCopied'),
            selected: labels.selected,
          }}
          track={trackAttributes(LANDING_EVENTS.snippetCopied, {
            snippet: AGENT_PROMPT_ID,
            button: 'prominent',
          })}
          placement="inline"
          appearance="prominent"
        />
      </div>
      <p className="text-sm leading-relaxed text-ink">
        {rich(t('landing.install.agent.ready'), {
          code: (text) => <code className="font-mono text-sm">{text}</code>,
        })}
      </p>
      <p className="text-sm leading-relaxed text-muted">
        {rich(t('landing.install.agent.foot'), {
          code: (text) => <code className="font-mono text-sm text-ink">{text}</code>,
        })}
      </p>
    </div>
  );
}

function installNote({ t }: I18n, offer: SignUpOffer): string {
  if (offersTheFreePlan(offer)) {
    return t('landing.install.noteFree');
  }
  return offersSignUp(offer) ? t('landing.install.noteOpen') : t('landing.install.note');
}

export function InstallSection({ i18n, offer }: InstallSectionProps) {
  const { t } = i18n;
  const signUpOpen = offersSignUp(offer);
  const free = offersTheFreePlan(offer);
  const labels = {
    copy: t('landing.install.copy'),
    copied: t('landing.install.copied'),
    selected: t('landing.install.selected'),
  };
  return (
    <LandingSection
      id={INSTALL_ID}
      eyebrow={t('landing.install.eyebrow')}
      title={t('landing.install.title')}
      lead={t('landing.install.lead')}
    >
      {signUpOpen ? <StartSteps i18n={i18n} free={free} /> : null}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-start lg:gap-8">
        <div className={`flex min-w-0 flex-col gap-2.5 ${REVEAL}`}>
          <CodeBlock id="install-command" tokens={INSTALL_COMMAND} labels={labels} />
          <CodeBlock id="install-first-event" tokens={FIRST_EVENT} labels={labels} />
          <p className="text-sm leading-relaxed text-muted">
            {rich(t('landing.install.requests'), {
              code: (text) => <code className="font-mono text-sm text-ink">{text}</code>,
              link: (text) => (
                <a
                  href={LANDING_LINKS.sdkApi}
                  className={TEXT_LINK}
                  {...trackAttributes(LANDING_EVENTS.docsOpened, { doc: 'track_request' })}
                >
                  {text}
                </a>
              ),
            })}
          </p>
        </div>
        <p
          className={`flex gap-2.5 rounded-card border border-line bg-card px-4.5 py-4 text-sm leading-relaxed text-muted ${REVEAL}`}
        >
          <svg
            width={18}
            height={18}
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-ink"
          >
            <path
              d={INFO_ICON}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {installNote(i18n, offer)}
        </p>
      </div>
      {signUpOpen ? <AgentPrompt i18n={i18n} labels={labels} /> : null}
    </LandingSection>
  );
}
