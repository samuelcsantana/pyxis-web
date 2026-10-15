import Link from 'next/link';
import type { ReactNode } from 'react';
import { settingsHref } from '@/components/shell/screens';
import { Breakable } from '@/components/ui/breakable';
import { TEXT_LINK } from '@/components/ui/control-classes';
import { PANEL } from '@/components/ui/panel-classes';
import { CONNECTION_REQUEST_MINUTES, type ConnectionRequest } from '@/domain/connection-requests';
import type { I18n } from '@/i18n/i18n';
import { type AllowConnection, ConsentButtons, type DenyConnection } from './consent-buttons';

export const DASHBOARD_HOME = '/';

const HEADING = 'text-2xl font-bold tracking-tight';
const SUBHEADING = 'text-sm font-semibold';
const NOTE = 'text-xs leading-[18px] text-muted';

interface PartProps {
  readonly heading: string;
  readonly children: ReactNode;
}

function Part({ heading, children }: PartProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <h2 className={SUBHEADING}>{heading}</h2>
      {children}
    </div>
  );
}

export interface ConnectionRequestViewProps {
  readonly request: ConnectionRequest;
  readonly email: string;
  readonly i18n: I18n;
  readonly allow: AllowConnection;
  readonly deny: DenyConnection;
}

export function ConnectionRequestView({
  request,
  email,
  i18n,
  allow,
  deny,
}: ConnectionRequestViewProps) {
  const { t } = i18n;
  const app = request.client.name;
  const [firstProject] = request.projects;
  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className={HEADING}>{t('connect.heading', { app })}</h1>
        <p className="text-sm text-muted">
          <Breakable text={t('connect.signedInAs', { email })} />
        </p>
      </div>
      <section className={PANEL}>
        <p className="text-sm font-medium">
          {t('connect.asks', { app, host: request.client.host })}
        </p>
        <Part heading={t('connect.accessHeading')}>
          <p className="text-sm">{t('connect.access')}</p>
        </Part>
        <Part heading={t('connect.projectsHeading')}>
          {firstProject === undefined ? (
            <p className="text-sm">{t('connect.noProjects')}</p>
          ) : (
            <ul className="flex list-disc flex-col gap-1 pl-5 text-sm">
              {request.projects.map((project) => (
                <li key={project.id}>
                  <Breakable text={project.name} />
                </li>
              ))}
            </ul>
          )}
        </Part>
        <Part heading={t('connect.returnHeading')}>
          <p className="text-sm">{t('connect.returnTo', { host: request.redirect.host })}</p>
          {request.redirect.loopback ? (
            <p className="rounded-input bg-warn-soft px-3 py-2.5 text-sm text-ink">
              {t('connect.loopback', { app })}
            </p>
          ) : null}
        </Part>
        <p className="text-sm font-semibold">{t('connect.notYou', { app })}</p>
        <ConsentButtons
          app={app}
          allow={allow}
          deny={deny}
          limitReached={request.connectionLimitReached}
          settingsHref={firstProject === undefined ? null : settingsHref(firstProject.id)}
        />
        <p className={NOTE}>{t('connect.revokeLater')}</p>
      </section>
    </>
  );
}

export interface ConnectionRequestGoneProps {
  readonly i18n: I18n;
}

export function ConnectionRequestGone({ i18n }: ConnectionRequestGoneProps) {
  const { t } = i18n;
  return (
    <>
      <h1 className={HEADING}>{t('connect.goneHeading')}</h1>
      <section className={PANEL}>
        <p className="text-sm">
          {t('consent.gone', { minutes: String(CONNECTION_REQUEST_MINUTES) })}
        </p>
      </section>
      <Link href={DASHBOARD_HOME} className={`self-start text-sm ${TEXT_LINK}`}>
        {t('connect.back')}
      </Link>
    </>
  );
}
