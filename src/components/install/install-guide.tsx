import Link from 'next/link';
import { type CopyCodeLabels, CopyCodeButton } from '@/components/landing/copy-code-button';
import { FIRST_SCREEN, screenHref } from '@/components/shell/screens';
import { BUTTON_PRIMARY } from '@/components/ui/control-classes';
import { PANEL, PANEL_TITLE } from '@/components/ui/panel-classes';
import { RefreshWhilePending } from '@/components/ui/refresh-while-pending';
import { installCommand, moduleSnippet, scriptSnippet } from '@/domain/install';
import { projectActivity, type ProjectSettings } from '@/domain/project-settings';
import type { I18n } from '@/i18n/i18n';

export interface InstallGuideProps {
  readonly settings: ProjectSettings;
  readonly endpoint: string;
  readonly i18n: I18n;
}

const NOTE = 'text-xs leading-[18px] text-muted';

interface CodeBlockProps {
  readonly id: string;
  readonly code: string;
  readonly labels: CopyCodeLabels;
}

function CodeBlock({ id, code, labels }: CodeBlockProps) {
  return (
    <div className="relative overflow-x-auto rounded-card bg-nav py-4 pr-24 pl-4 font-mono text-sm leading-6 text-nav-strong">
      <pre id={id} className="m-0">
        <code>{code}</code>
      </pre>
      <CopyCodeButton code={code} targetId={id} labels={labels} />
    </div>
  );
}

export function InstallGuide({ settings, endpoint, i18n }: InstallGuideProps) {
  const key = settings.publicKeys[0]?.key ?? '';
  const origin = settings.allowedOrigins[0] ?? '';
  const labels = {
    copy: i18n.t('install.copy'),
    copied: i18n.t('install.copied'),
    selected: i18n.t('install.selected'),
  };
  const receiving = projectActivity(settings).kind === 'receiving';
  return (
    <>
      <section aria-labelledby="install-step-1" className={PANEL}>
        <h2 id="install-step-1" className={PANEL_TITLE}>
          {i18n.t('install.step1')}
        </h2>
        <p className="text-sm">{i18n.t('install.npm')}</p>
        <CodeBlock id="install-command" code={installCommand()} labels={labels} />
        <CodeBlock id="install-module" code={moduleSnippet(key, endpoint)} labels={labels} />
        <p className="text-sm">{i18n.t('install.script')}</p>
        <CodeBlock id="install-script" code={scriptSnippet(key, endpoint)} labels={labels} />
        <p className={NOTE}>{i18n.t('install.privacy')}</p>
      </section>
      <section aria-labelledby="install-step-2" className={PANEL}>
        <h2 id="install-step-2" className={PANEL_TITLE}>
          {i18n.t('install.step2')}
        </h2>
        <p className="text-sm">{i18n.t('install.step2Note', { origin })}</p>
        {receiving ? (
          <div className="flex flex-col gap-3">
            <p role="status" className="text-sm font-semibold text-ok">
              {i18n.t('install.received')}
            </p>
            <Link
              href={screenHref(settings.id, FIRST_SCREEN)}
              className={`flex min-h-11 items-center self-start rounded-input px-4 text-sm ${BUTTON_PRIMARY}`}
            >
              {i18n.t('install.open')}
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <p role="status" className="text-sm font-semibold">
              {i18n.t('install.waiting')}
            </p>
            <p className={NOTE}>{i18n.t('install.waitingNote')}</p>
          </div>
        )}
        <RefreshWhilePending pending={!receiving} />
      </section>
    </>
  );
}
