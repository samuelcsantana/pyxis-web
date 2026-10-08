import Link from 'next/link';
import type { DrillLink, FunnelMode, FunnelRow, FunnelTone } from '@/domain/funnel';
import { TEXT_LINK } from '@/components/ui/control-classes';
import { PANEL, PANEL_TITLE } from '@/components/ui/panel-classes';
import type { I18n } from '@/i18n/i18n';

const TONE_CLASSES: Readonly<Record<FunnelTone, string>> = {
  start: 'text-muted',
  good: 'text-ok',
  bad: 'text-bad',
  neutral: 'text-muted',
};

function Drillable({ text, link }: { text: string; link: DrillLink | null }) {
  if (link === null) {
    return text;
  }
  return (
    <Link
      href={link.href}
      aria-label={link.label}
      aria-current={link.current ? 'true' : undefined}
      className={`${TEXT_LINK} aria-[current=true]:font-bold`}
    >
      {text}
    </Link>
  );
}

export interface FunnelStepsProps {
  readonly rows: readonly FunnelRow[];
  readonly mode: FunnelMode;
  readonly i18n: I18n;
}

export function FunnelSteps({ rows, mode, i18n }: FunnelStepsProps) {
  return (
    <section aria-labelledby="funnel-heading" className={PANEL}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="funnel-heading" className={PANEL_TITLE}>
          {i18n.t('funnel.page.stepsHeading')}
        </h2>
        <p className="text-caption text-muted">{i18n.t(`funnel.page.modeNotes.${mode}`)}</p>
      </div>
      <ol aria-labelledby="funnel-heading" className="flex flex-col">
        {rows.map((row) => (
          <li
            key={row.key}
            className="grid grid-cols-[1.75rem_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 border-b border-line py-3 sm:grid-cols-[1.75rem_minmax(0,16rem)_minmax(0,1fr)_5rem_9rem] sm:gap-x-4"
          >
            <span
              aria-hidden="true"
              className="flex size-7 items-center justify-center rounded-pill bg-soft text-caption font-semibold"
            >
              {row.position}
            </span>
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="text-sm font-semibold">{row.label}</span>
              <span className="font-mono text-xs text-muted wrap-anywhere">{row.target}</span>
            </span>
            <span aria-hidden="true" className="hidden h-7 rounded-control bg-soft sm:block">
              <span className="block h-7 rounded-control bg-sky" style={{ width: row.barWidth }} />
            </span>
            <span className="text-right text-base font-semibold tabular-nums">
              <Drillable text={row.count} link={row.reachedLink} />
            </span>
            <span className="col-start-2 flex flex-col text-xs tabular-nums sm:col-start-auto sm:text-right">
              <span className={`font-semibold ${TONE_CLASSES[row.tone]}`}>{row.continued}</span>
              <span className="text-muted">
                <Drillable text={row.dropped} link={row.droppedLink} />
              </span>
              {row.time === null ? null : <span className="text-muted">{row.time}</span>}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
