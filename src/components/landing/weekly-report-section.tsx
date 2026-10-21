import { barHeight, type DigestPreviewView } from '@/domain/digest-preview';
import type { Tone } from '@/domain/metrics';
import type { I18n } from '@/i18n/i18n';
import { APP_NAME } from '@/lib/site';
import { REVEAL } from './landing-classes';
import { LandingSection } from './landing-section';

export interface WeeklyReportSectionProps {
  readonly i18n: I18n;
  readonly digest: DigestPreviewView;
}

export const WEEKLY_REPORT_ID = 'weekly-report';

export const REPORT_ITEMS = ['digest', 'csv', 'export'] as const;

const MAIL_LABEL = 'font-mono text-micro font-medium tracking-[0.08em] text-muted uppercase';

const TONE_TEXT: Readonly<Record<Tone, string>> = {
  good: 'text-ok',
  bad: 'text-bad',
  neutral: 'text-muted',
};

function DigestMail({ digest, i18n }: WeeklyReportSectionProps) {
  const { t } = i18n;
  return (
    <figure
      aria-label={t('landing.report.mail.label')}
      className="m-0 overflow-hidden rounded-panel border border-line-strong bg-card text-ink shadow-raised"
    >
      <div className="grid gap-1 border-b border-line bg-soft px-4 py-3">
        <p className="flex items-center gap-2 text-caption font-semibold">
          <span aria-hidden="true" className="size-2 rounded-pill bg-accent" />
          {APP_NAME}
          <span className="ml-auto font-normal text-muted">{digest.sentOn}</span>
        </p>
        <p className="text-callout font-semibold wrap-anywhere">{digest.subject}</p>
      </div>
      <div className="grid gap-3 px-4 pt-4.5 pb-5">
        <div className="grid gap-0.5">
          <p className={MAIL_LABEL}>{t('landing.report.mail.kicker')}</p>
          <p className="text-2xl font-semibold tracking-tight">{digest.project}</p>
          <p className="text-caption text-muted">{digest.weekLine}</p>
        </div>
        <dl className="grid grid-cols-2 gap-2">
          {digest.tiles.map((tile) => (
            <div key={tile.id} className="rounded-input border border-line px-3 py-2">
              <dt className="text-xs text-muted">{tile.label}</dt>
              <dd className="font-mono text-xl font-semibold tabular-nums">{tile.value}</dd>
              <dd className={`text-micro leading-snug ${TONE_TEXT[tile.tone]}`}>{tile.line}</dd>
            </div>
          ))}
        </dl>
        <p className={MAIL_LABEL}>{t('landing.report.mail.visitsPerDay')}</p>
        <ol className="grid grid-cols-7 gap-1.5">
          {digest.days.map((day) => (
            <li key={day.date} className="flex flex-col items-center gap-1 text-micro">
              <span className="tabular-nums">{day.visits}</span>
              <span aria-hidden="true" className="flex h-12 w-full items-end">
                <span
                  className="w-full rounded-t-chip bg-accent"
                  style={{ height: barHeight(day.share) }}
                />
              </span>
              <span className="text-muted">{day.label}</span>
            </li>
          ))}
        </ol>
        {digest.failingRoutes.length === 0 ? null : (
          <>
            <p className={MAIL_LABEL}>{t('landing.report.mail.failingRoutes')}</p>
            <ul className="grid gap-1 text-caption">
              {digest.failingRoutes.map((route) => (
                <li
                  key={route.route}
                  className="flex justify-between gap-3 border-b border-line pb-1 last:border-b-0"
                >
                  <code className="font-mono wrap-anywhere">{route.route}</code>
                  <span className="whitespace-nowrap text-muted">{route.count}</span>
                </li>
              ))}
            </ul>
          </>
        )}
        <span className="mt-1 justify-self-start rounded-input bg-accent px-3.5 py-2 text-caption font-semibold text-accent-ink">
          {t('landing.report.mail.openWeek')}
        </span>
      </div>
    </figure>
  );
}

export function WeeklyReportSection({ i18n, digest }: WeeklyReportSectionProps) {
  const { t } = i18n;
  return (
    <LandingSection
      id={WEEKLY_REPORT_ID}
      eyebrow={t('landing.report.eyebrow')}
      title={t('landing.report.title')}
      lead={t('landing.report.lead')}
    >
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,27rem)_minmax(0,1fr)] lg:gap-10">
        <div className={`min-w-0 ${REVEAL}`}>
          <DigestMail digest={digest} i18n={i18n} />
        </div>
        <ul className="grid gap-5">
          {REPORT_ITEMS.map((item) => (
            <li key={item} className={`border-l-2 border-accent pl-4 ${REVEAL}`}>
              <h3 className="text-lg font-semibold">{t(`landing.report.items.${item}.title`)}</h3>
              <p className="mt-1.5 text-base leading-relaxed text-muted">
                {t(`landing.report.items.${item}.body`)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </LandingSection>
  );
}
