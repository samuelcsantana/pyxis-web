import Link from 'next/link';
import { settingsHref } from '@/components/shell/screens';
import { BUTTON_PRIMARY, TEXT_LINK } from '@/components/ui/control-classes';
import { PANEL } from '@/components/ui/panel-classes';
import { exportDownloadHref, isDownloadable, type ProjectExport } from '@/domain/exports';
import type { I18n } from '@/i18n/i18n';
import { RefreshWhilePending } from './refresh-while-pending';

export interface ExportViewProps {
  readonly projectId: string;
  readonly found: ProjectExport;
  readonly i18n: I18n;
  readonly now: Date;
}

const NOTE = 'text-xs leading-[18px] text-muted';

function Body({ projectId, found, i18n, now }: ExportViewProps) {
  const day = (iso: string) => i18n.format.dayWithYear(new Date(iso));
  const settings = (
    <Link href={settingsHref(projectId)} className={`self-start text-sm ${TEXT_LINK}`}>
      {i18n.t('exportPage.settings')}
    </Link>
  );
  if (found.status === 'pending') {
    return (
      <>
        <p role="status" className="text-sm font-semibold">
          {i18n.t('exportPage.pending')}
        </p>
        <p className={NOTE}>{i18n.t('exportPage.pendingNote')}</p>
      </>
    );
  }
  if (found.status === 'failed') {
    return (
      <>
        <p className="text-sm font-semibold text-bad">{i18n.t('exportPage.failed')}</p>
        {settings}
      </>
    );
  }
  if (found.availableUntil === null) {
    return (
      <>
        <p className="text-sm">{i18n.t('exportPage.gone')}</p>
        {settings}
      </>
    );
  }
  if (!isDownloadable(found, now)) {
    return (
      <>
        <p className="text-sm">
          {i18n.t('exportPage.expired', { date: day(found.availableUntil) })}
        </p>
        {settings}
      </>
    );
  }
  return (
    <>
      <p className="text-sm font-semibold">
        {i18n.t('exportPage.done', {
          count: i18n.format.count(found.eventCount ?? 0),
          date: day(found.availableUntil),
        })}
      </p>
      <a
        href={exportDownloadHref(projectId, found.id)}
        className={`flex min-h-11 items-center self-start rounded-input px-4 text-sm ${BUTTON_PRIMARY}`}
      >
        {i18n.t('exportPage.download')}
      </a>
      <p className={NOTE}>{i18n.t('exportPage.downloadNote')}</p>
    </>
  );
}

export function ExportView(props: ExportViewProps) {
  return (
    <section aria-label={props.i18n.t('exportPage.title')} className={PANEL}>
      <p className={NOTE}>
        {props.i18n.t('exportPage.requestedAt', {
          date: props.i18n.format.dayWithYear(new Date(props.found.requestedAt)),
        })}
      </p>
      <Body {...props} />
      <RefreshWhilePending pending={props.found.status === 'pending'} />
    </section>
  );
}
