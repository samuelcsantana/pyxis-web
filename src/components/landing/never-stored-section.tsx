import type { I18n } from '@/i18n/i18n';
import { LandingSection } from './landing-section';

export interface NeverStoredSectionProps {
  readonly i18n: I18n;
}

export const NEVER_STORED_ID = 'never-stored';

const ROWS = ['address', 'ip', 'browser', 'property', 'visit'] as const;
type Row = (typeof ROWS)[number];
const DROPPED_ROWS: ReadonlySet<Row> = new Set(['property']);

const KEPT = 'border-accent/60 bg-accent/10 text-ink';
const DROPPED = 'border-dashed border-line-strong text-muted';

export function NeverStoredSection({ i18n }: NeverStoredSectionProps) {
  const { t } = i18n;
  return (
    <LandingSection
      id={NEVER_STORED_ID}
      eyebrow={t('landing.never.eyebrow')}
      title={t('landing.never.title')}
      lead={t('landing.never.lead')}
    >
      <ul className="grid gap-2.5">
        {ROWS.map((row) => (
          <li
            key={row}
            className="grid gap-x-5 gap-y-2.5 rounded-card border border-line bg-card px-4.5 py-4 lg:grid-cols-[11rem_minmax(0,1.25fr)_auto_minmax(0,1fr)] lg:items-center"
          >
            <p className="text-sm font-semibold">
              {t(`landing.never.rows.${row}.label`)}
              <span className="mt-0.5 block text-xs leading-snug font-normal text-muted">
                {t(`landing.never.rows.${row}.where`)}
              </span>
            </p>
            <p className="min-w-0 font-mono text-caption break-all text-muted line-through decoration-bad decoration-[1.5px]">
              <span className="sr-only">{t('landing.never.raw')}</span>
              {t(`landing.never.rows.${row}.raw`)}
            </p>
            <span aria-hidden="true" className="hidden text-muted lg:block">
              →
            </span>
            <p
              className={`min-w-0 justify-self-start rounded-control border px-2.5 py-1 font-mono text-caption font-semibold break-all ${DROPPED_ROWS.has(row) ? DROPPED : KEPT}`}
            >
              <span className="sr-only">{t('landing.never.kept')}</span>
              {t(`landing.never.rows.${row}.kept`)}
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted">{t('landing.never.foot')}</p>
    </LandingSection>
  );
}
