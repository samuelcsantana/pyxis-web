import type { ReactNode } from 'react';
import { installHref } from '@/components/shell/screens';
import { ViewKeepingLink } from '@/components/shell/view-keeping-link';
import { SupportAddress } from '@/components/support/support-address';
import { SupportReplies } from '@/components/support/support-replies';
import { TEXT_LINK } from '@/components/ui/control-classes';
import { PANEL, PANEL_TITLE, SECTION_STACK } from '@/components/ui/panel-classes';
import { AGENT_RECIPE_URL } from '@/domain/install';
import {
  QUESTION_FORM_URL,
  SECURITY_REPORT_URL,
  type SupportPlan,
  TRACKER_DOCS_URL,
} from '@/domain/support';
import type { I18n } from '@/i18n/i18n';

export interface HelpViewProps {
  readonly projectId: string;
  readonly email: string;
  readonly plan: SupportPlan | null;
  readonly i18n: I18n;
}

const NOTE = 'text-sm text-muted';

interface HelpPanelProps {
  readonly id: string;
  readonly title: string;
  readonly children: ReactNode;
}

function HelpPanel({ id, title, children }: HelpPanelProps) {
  return (
    <section aria-labelledby={`${id}-heading`} className={PANEL}>
      <h2 id={`${id}-heading`} className={PANEL_TITLE}>
        {title}
      </h2>
      {children}
    </section>
  );
}

interface HelpLinkProps {
  readonly href: string;
  readonly label: string;
  readonly body: string;
}

function HelpLink({ href, label, body }: HelpLinkProps) {
  const external = href.startsWith('https://');
  return (
    <li className="flex flex-col gap-0.5">
      {external ? (
        <a href={href} className={`self-start text-sm ${TEXT_LINK}`}>
          {label}
        </a>
      ) : (
        <ViewKeepingLink href={href} className={`self-start text-sm ${TEXT_LINK}`}>
          {label}
        </ViewKeepingLink>
      )}
      <span className={NOTE}>{body}</span>
    </li>
  );
}

export function HelpView({ projectId, email, plan, i18n }: HelpViewProps) {
  const t = i18n.t;
  return (
    <div className={SECTION_STACK}>
      <HelpPanel id="help-write" title={t('support.writeHeading')}>
        <SupportAddress
          id="help-support-address"
          labels={{
            copy: t('support.copy'),
            copied: t('support.copied'),
            selected: t('support.selected'),
          }}
        />
        <p className="text-sm">{t('support.fromAccount', { email })}</p>
        <SupportReplies plan={plan} i18n={i18n} />
        <p className={NOTE}>{t('support.noPersonalData')}</p>
      </HelpPanel>
      <HelpPanel id="help-docs" title={t('support.docsHeading')}>
        <ul className="flex flex-col gap-3">
          <HelpLink
            href={installHref(projectId)}
            label={t('support.install')}
            body={t('support.installBody')}
          />
          <HelpLink
            href={TRACKER_DOCS_URL}
            label={t('support.code')}
            body={t('support.codeBody')}
          />
          <HelpLink
            href={AGENT_RECIPE_URL}
            label={t('support.agents')}
            body={t('support.agentsBody')}
          />
          <HelpLink
            href={QUESTION_FORM_URL}
            label={t('support.question')}
            body={t('support.questionBody')}
          />
        </ul>
      </HelpPanel>
      <HelpPanel id="help-security" title={t('support.securityHeading')}>
        <p className="text-sm">{t('support.securityBody')}</p>
        <a href={SECURITY_REPORT_URL} className={`self-start text-sm ${TEXT_LINK}`}>
          {t('support.securityLink')}
        </a>
      </HelpPanel>
    </div>
  );
}
