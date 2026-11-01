import { SignOutButton } from '@/components/shell/sign-out-button';
import { PANEL, PANEL_TITLE } from '@/components/ui/panel-classes';
import { type AdminSession, describeDevice } from '@/domain/sessions';
import type { I18n } from '@/i18n/i18n';
import { type EndSession, EndSessionButton } from './end-session-button';

export interface SessionsPanelProps {
  readonly sessions: readonly AdminSession[];
  readonly i18n: I18n;
  readonly when: (iso: string) => string;
  readonly end: EndSession;
}

const ROW = 'flex flex-wrap items-start justify-between gap-x-4 gap-y-2 py-3 first:pt-0 last:pb-0';
const DEVICE = 'text-sm font-semibold text-ink';
const BADGE =
  'rounded-pill bg-soft px-2 py-0.5 text-micro font-semibold tracking-[0.04em] text-muted uppercase';
const DETAIL = 'text-xs leading-[18px] text-muted';
const NOTE = 'text-xs leading-[18px] text-muted';

interface SessionRowProps {
  readonly session: AdminSession;
  readonly i18n: I18n;
  readonly when: (iso: string) => string;
  readonly end: EndSession;
}

function SessionRow({ session, i18n, when, end }: SessionRowProps) {
  return (
    <li className={ROW}>
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className={DEVICE}>{describeDevice(session, i18n)}</span>
          {session.current ? <span className={BADGE}>{i18n.t('sessions.thisDevice')}</span> : null}
        </div>
        <dl className="flex flex-wrap gap-x-4 gap-y-0.5">
          <div className="flex gap-1">
            <dt className={DETAIL}>{i18n.t('sessions.signedIn')}</dt>
            <dd className={DETAIL}>{when(session.createdAt)}</dd>
          </div>
          <div className="flex gap-1">
            <dt className={DETAIL}>{i18n.t('sessions.lastUsed')}</dt>
            <dd className={DETAIL}>{when(session.lastUsedAt)}</dd>
          </div>
        </dl>
      </div>
      <EndSessionButton sessionId={session.id} end={end} />
    </li>
  );
}

export function SessionsPanel({ sessions, i18n, when, end }: SessionsPanelProps) {
  return (
    <section aria-labelledby="settings-sessions-heading" className={PANEL}>
      <h2 id="settings-sessions-heading" className={PANEL_TITLE}>
        {i18n.t('sessions.heading')}
      </h2>
      <p className={NOTE}>{i18n.t('sessions.note')}</p>
      <ul className="flex flex-col divide-y divide-line">
        {sessions.map((session) => (
          <SessionRow key={session.id} session={session} i18n={i18n} when={when} end={end} />
        ))}
      </ul>
      <SignOutButton scope="everywhere" variant="page" />
    </section>
  );
}
