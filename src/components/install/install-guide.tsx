import Link from 'next/link';
import type { ReactNode } from 'react';
import { type CopyCodeLabels, CopyCodeButton } from '@/components/landing/copy-code-button';
import { NoLiveKeyNotice } from '@/components/settings/no-live-key-notice';
import { FIRST_SCREEN, screenHref, settingsKeysHref } from '@/components/shell/screens';
import { BUTTON_PRIMARY } from '@/components/ui/control-classes';
import { PANEL, PANEL_TITLE } from '@/components/ui/panel-classes';
import { RefreshWhilePending } from '@/components/ui/refresh-while-pending';
import { agentPrompt, installCommand, moduleSnippet, scriptSnippet } from '@/domain/install';
import { canManageProject, projectActivity, type ProjectSettings } from '@/domain/project-settings';
import type { I18n } from '@/i18n/i18n';
import { rich } from '@/i18n/rich';
import { InstallTabs } from './install-tabs';

export interface InstallGuideProps {
  readonly settings: ProjectSettings;
  readonly endpoint: string;
  readonly i18n: I18n;
}

const NOTE = 'text-xs leading-[18px] text-muted';
const INLINE_CODE = 'rounded-chip border border-line bg-soft px-1 font-mono text-[0.85em]';
const AGENT_STEPS = ['open', 'paste', 'review', 'publish'] as const;
const AGENT_CHANGES = ['package', 'init', 'track', 'csp'] as const;
const TAB_ICON_PATHS = {
  yourself: 'm16 18 6-6-6-6 M8 6l-6 6 6 6',
  withAgent:
    'M12 3v4 M12 17v4 M3 12h4 M17 12h4 M6 6l2.5 2.5 M15.5 15.5 18 18 M6 18l2.5-2.5 M15.5 8.5 18 6',
} as const;

export const INSTALL_TABS = {
  yourself: 'install-yourself',
  withAgent: 'install-with-agent',
} as const;

function codeText(text: string): ReactNode {
  return <code className={INLINE_CODE}>{text}</code>;
}

type CodeWrap = 'none' | 'words';

const CODE_BLOCK_LAYOUTS: Readonly<Record<CodeWrap, { block: string; text: string }>> = {
  none: { block: 'overflow-x-auto py-4 pr-24', text: 'm-0' },
  words: {
    block: 'pt-13 pr-4 pb-4 sm:pt-4 sm:pr-24',
    text: 'm-0 whitespace-pre-wrap wrap-anywhere',
  },
};

interface CodeBlockProps {
  readonly id: string;
  readonly code: string;
  readonly labels: CopyCodeLabels;
  readonly wrap?: CodeWrap;
}

function CodeBlock({ id, code, labels, wrap = 'none' }: CodeBlockProps) {
  const layout = CODE_BLOCK_LAYOUTS[wrap];
  return (
    <div
      className={`relative rounded-card bg-nav pl-4 font-mono text-sm leading-6 text-nav-strong ${layout.block}`}
    >
      <pre id={id} className={layout.text}>
        <code>{code}</code>
      </pre>
      <CopyCodeButton code={code} targetId={id} labels={labels} />
    </div>
  );
}

function TabLabel({
  icon,
  text,
}: {
  readonly icon: keyof typeof TAB_ICON_PATHS;
  readonly text: string;
}) {
  return (
    <>
      <svg width={16} height={16} viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
        <path
          d={TAB_ICON_PATHS[icon]}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {text}
    </>
  );
}

interface StepProps {
  readonly publicKey: string;
  readonly endpoint: string;
  readonly labels: CopyCodeLabels;
  readonly i18n: I18n;
}

function Yourself({ publicKey, endpoint, labels, i18n }: StepProps) {
  return (
    <>
      <p className="text-sm">{i18n.t('install.npm')}</p>
      <CodeBlock id="install-command" code={installCommand()} labels={labels} />
      <CodeBlock id="install-module" code={moduleSnippet(publicKey, endpoint)} labels={labels} />
      <p className="text-sm">{i18n.t('install.script')}</p>
      <CodeBlock id="install-script" code={scriptSnippet(publicKey, endpoint)} labels={labels} />
    </>
  );
}

interface WithAgentProps extends StepProps {
  readonly origin: string | undefined;
}

function WithAgent({ publicKey, endpoint, origin, labels, i18n }: WithAgentProps) {
  const { t } = i18n;
  return (
    <>
      <p className="text-sm">{t('install.agent.lead')}</p>
      <CodeBlock
        id="install-agent-prompt"
        code={agentPrompt({ key: publicKey, endpoint, origin }, i18n)}
        labels={labels}
        wrap="words"
      />
      <ol className="flex flex-col gap-2.5">
        {AGENT_STEPS.map((step, index) => (
          <li key={step} className="grid grid-cols-[1.625rem_minmax(0,1fr)] items-start gap-2.5">
            <span
              aria-hidden="true"
              className="flex size-6.5 items-center justify-center rounded-pill border border-line bg-soft text-caption font-semibold"
            >
              {index + 1}
            </span>
            <span className="text-sm leading-relaxed">
              {rich(t(`install.agent.steps.${step}`), { code: codeText })}
            </span>
          </li>
        ))}
      </ol>
      <div
        role="group"
        aria-labelledby="install-agent-changes"
        className="flex flex-col gap-2 rounded-card border border-dashed border-line-strong px-3.5 py-3"
      >
        <h3 id="install-agent-changes" className="text-sm font-semibold">
          {t('install.agent.changes.title')}
        </h3>
        <ul className="flex list-disc flex-col gap-1 pl-5 text-sm">
          {AGENT_CHANGES.map((change) => (
            <li key={change}>{rich(t(`install.agent.changes.${change}`), { code: codeText })}</li>
          ))}
        </ul>
        <p className={NOTE}>{t('install.agent.changes.only')}</p>
      </div>
      <p className={NOTE}>{rich(t('install.agent.rules'), { code: codeText })}</p>
    </>
  );
}

export function InstallGuide({ settings, endpoint, i18n }: InstallGuideProps) {
  const { t } = i18n;
  const key = settings.publicKeys[0]?.key;
  const firstOrigin = settings.allowedOrigins[0];
  const labels = {
    copy: t('install.copy'),
    copied: t('install.copied'),
    selected: t('install.selected'),
  };
  const receiving = projectActivity(settings).kind === 'receiving';
  return (
    <>
      <section aria-labelledby="install-step-1" className={PANEL}>
        <h2 id="install-step-1" className={PANEL_TITLE}>
          {t('install.step1')}
        </h2>
        {key === undefined ? (
          <NoLiveKeyNotice
            step={
              canManageProject(settings)
                ? { kind: 'createInSettings', keysHref: settingsKeysHref(settings.id) }
                : { kind: 'ownerOnly' }
            }
            i18n={i18n}
          />
        ) : (
          <InstallTabs
            label={t('install.how')}
            tabs={[
              {
                id: INSTALL_TABS.yourself,
                label: <TabLabel icon="yourself" text={t('install.yourself')} />,
                panel: <Yourself publicKey={key} endpoint={endpoint} labels={labels} i18n={i18n} />,
              },
              {
                id: INSTALL_TABS.withAgent,
                label: <TabLabel icon="withAgent" text={t('install.withAgent')} />,
                panel: (
                  <WithAgent
                    publicKey={key}
                    endpoint={endpoint}
                    origin={firstOrigin}
                    labels={labels}
                    i18n={i18n}
                  />
                ),
              },
            ]}
          />
        )}
        <p className={NOTE}>{t('install.privacy')}</p>
      </section>
      <section aria-labelledby="install-step-2" className={PANEL}>
        <h2 id="install-step-2" className={PANEL_TITLE}>
          {t('install.step2')}
        </h2>
        <p className="text-sm">{t('install.step2Note', { origin: firstOrigin ?? '' })}</p>
        {receiving ? (
          <div className="flex flex-col gap-3">
            <p role="status" className="text-sm font-semibold text-ok">
              {t('install.received')}
            </p>
            <Link
              href={screenHref(settings.id, FIRST_SCREEN)}
              className={`flex min-h-11 items-center self-start rounded-input px-4 text-sm ${BUTTON_PRIMARY}`}
            >
              {t('install.open')}
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <p role="status" className="text-sm font-semibold">
              {t('install.waiting')}
            </p>
            <p className={NOTE}>{t('install.waitingNote')}</p>
          </div>
        )}
        <RefreshWhilePending pending={!receiving} />
      </section>
    </>
  );
}
