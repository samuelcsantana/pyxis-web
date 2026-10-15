import { SETTINGS_CONNECTIONS_PANEL } from '@/components/shell/screens';
import { PANEL, PANEL_TITLE } from '@/components/ui/panel-classes';
import { type ConnectedApp, type ConnectedApps, claudeCodeCommand } from '@/domain/connections';
import type { I18n } from '@/i18n/i18n';
import { CopyableCode } from './copyable-code';
import { type Revoke, RevokeButton } from './revoke-button';

export interface ConnectedAppsPanelProps {
  readonly apps: ConnectedApps;
  readonly i18n: I18n;
  readonly when: (iso: string) => string;
  readonly revoke: Revoke;
}

const ROW = 'flex flex-wrap items-start justify-between gap-x-4 gap-y-2 py-3 first:pt-0 last:pb-0';
const DETAIL = 'text-xs leading-[18px] text-muted';
const NOTE = 'text-xs leading-[18px] text-muted';

export function connectedAppNameId(connectionId: string): string {
  return `connected-app-name-${connectionId}`;
}

interface AppRowProps {
  readonly app: ConnectedApp;
  readonly i18n: I18n;
  readonly when: (iso: string) => string;
  readonly revoke: Revoke;
}

function AppRow({ app, i18n, when, revoke }: AppRowProps) {
  const nameId = connectedAppNameId(app.id);
  return (
    <li className={ROW}>
      <div className="flex min-w-0 flex-col gap-1">
        <p id={nameId} className="text-sm">
          <span className="font-semibold text-ink">{app.client.name}</span>{' '}
          <span className="text-muted">{app.client.host}</span>
        </p>
        <dl className="flex flex-wrap gap-x-4 gap-y-0.5">
          <div className="flex gap-1">
            <dt className={DETAIL}>{i18n.t('connectedApps.connected')}</dt>
            <dd className={DETAIL}>{when(app.createdAt)}</dd>
          </div>
          <div className="flex gap-1">
            <dt className={DETAIL}>{i18n.t('connectedApps.lastUsed')}</dt>
            <dd className={DETAIL}>{when(app.lastUsedAt)}</dd>
          </div>
        </dl>
      </div>
      <RevokeButton id={app.id} describedBy={nameId} revoke={revoke} texts="connections" />
    </li>
  );
}

interface ConnectToClaudeProps {
  readonly connectorUrl: string;
  readonly i18n: I18n;
}

function ConnectToClaude({ connectorUrl, i18n }: ConnectToClaudeProps) {
  const headingId = `${SETTINGS_CONNECTIONS_PANEL}-claude`;
  return (
    <div
      role="group"
      aria-labelledby={headingId}
      className="flex flex-col gap-3 rounded-input border border-line bg-soft p-3.5"
    >
      <h3 id={headingId} className="text-sm font-semibold">
        {i18n.t('connectedApps.connectHeading')}
      </h3>
      <ol className="flex list-decimal flex-col gap-2 pl-5 text-sm">
        <li>{i18n.t('connectedApps.stepOpen')}</li>
        <li>
          <div className="flex flex-col gap-2">
            {i18n.t('connectedApps.stepAddress')}
            <CopyableCode text={connectorUrl} what="connector address" />
          </div>
        </li>
        <li>{i18n.t('connectedApps.stepAllow')}</li>
      </ol>
      <p className={NOTE}>{i18n.t('connectedApps.everywhere')}</p>
      <div className="flex flex-col gap-2 border-t border-line pt-3">
        <p className={NOTE}>{i18n.t('connectedApps.claudeCode')}</p>
        <CopyableCode text={claudeCodeCommand(connectorUrl)} what="Claude Code command" />
      </div>
    </div>
  );
}

export function ConnectedAppsPanel({ apps, i18n, when, revoke }: ConnectedAppsPanelProps) {
  return (
    <section aria-labelledby={`${SETTINGS_CONNECTIONS_PANEL}-heading`} className={PANEL}>
      <h2 id={`${SETTINGS_CONNECTIONS_PANEL}-heading`} className={PANEL_TITLE}>
        {i18n.t('connectedApps.heading')}
      </h2>
      <p className={NOTE}>{i18n.t('connectedApps.note')}</p>
      {apps.connections.length === 0 ? (
        <p className="text-sm text-muted">{i18n.t('connectedApps.empty')}</p>
      ) : (
        <ul
          aria-labelledby={`${SETTINGS_CONNECTIONS_PANEL}-heading`}
          className="flex flex-col divide-y divide-line border-t border-line pt-3"
        >
          {apps.connections.map((app) => (
            <AppRow key={app.id} app={app} i18n={i18n} when={when} revoke={revoke} />
          ))}
        </ul>
      )}
      {apps.connectorUrl === null ? null : (
        <ConnectToClaude connectorUrl={apps.connectorUrl} i18n={i18n} />
      )}
    </section>
  );
}
