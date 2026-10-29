import { PANEL, PANEL_TITLE } from '@/components/ui/panel-classes';
import { continentsNote, type ReachSummary } from '@/domain/devices';
import type { I18n } from '@/i18n/i18n';

export interface ReachCardProps {
  readonly summary: ReachSummary | null;
  readonly i18n: I18n;
}

function ReachFigures({ summary, i18n }: { readonly summary: ReachSummary; readonly i18n: I18n }) {
  const last = summary.counts.length - 1;
  return (
    <>
      <ul className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-lg leading-7 font-semibold tracking-tight tabular-nums sm:text-title sm:leading-8">
        {summary.counts.map((count, index) => (
          <li key={count} className="flex items-baseline gap-2">
            {count}
            {index === last ? null : (
              <span aria-hidden="true" className="font-normal text-muted">
                ·
              </span>
            )}
          </li>
        ))}
      </ul>
      {summary.leader === null ? null : <p className="text-sm leading-5">{summary.leader}</p>}
      <p className="text-xs leading-[18px] text-muted">{continentsNote(i18n)}</p>
    </>
  );
}

export function ReachCard({ summary, i18n }: ReachCardProps) {
  return (
    <section aria-labelledby="reach-heading" className={PANEL}>
      <h2 id="reach-heading" className={PANEL_TITLE}>
        {i18n.t('devices.reach.title')}
      </h2>
      {summary === null ? (
        <p className="text-sm leading-5 text-muted">{i18n.t('devices.reach.noKnownPlace')}</p>
      ) : (
        <ReachFigures summary={summary} i18n={i18n} />
      )}
    </section>
  );
}
