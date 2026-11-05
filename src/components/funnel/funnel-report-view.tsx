import type { ReactNode } from 'react';
import { FunnelSteps } from '@/components/funnel/funnel-steps';
import { StatCard } from '@/components/ui/stat-card';
import {
  biggestDropOff,
  countedSteps,
  type FunnelMode,
  funnelRows,
  overallConversion,
  timeToFinish,
} from '@/domain/funnel';
import { type FunnelDrill, type FunnelOutcome, withDrillLinks } from '@/domain/funnel-subjects';
import type { I18n } from '@/i18n/i18n';

export interface FunnelReportViewProps {
  readonly counted: ReturnType<typeof countedSteps>;
  readonly secondsToFinish: number | null;
  readonly currency: string;
  readonly mode: FunnelMode;
  readonly editor: ReactNode;
  readonly subjects: ReactNode;
  readonly drill: FunnelDrill | null;
  readonly drillHref: ((step: number, outcome: FunnelOutcome) => string) | null;
  readonly i18n: I18n;
}

export function FunnelReportView({
  counted,
  secondsToFinish,
  currency,
  mode,
  editor,
  subjects,
  drill,
  drillHref,
  i18n,
}: FunnelReportViewProps) {
  const overall = overallConversion(counted, mode, i18n);
  const drop = biggestDropOff(counted, i18n);
  const finish = timeToFinish(secondsToFinish, counted.length, i18n);
  return (
    <>
      {editor}
      <div className="grid gap-2.5 sm:grid-cols-[repeat(auto-fit,minmax(13.75rem,1fr))] sm:gap-4">
        <StatCard
          id="overall-conversion"
          label={i18n.t('funnel.page.overallConversion')}
          value={overall.value}
          note={overall.note}
        />
        <StatCard
          id="biggest-drop-off"
          label={i18n.t('funnel.page.biggestDropOff')}
          value={drop.value}
          note={drop.note}
        />
        {finish === null ? null : (
          <StatCard
            id="time-to-finish"
            label={i18n.t('funnel.timeToFinish')}
            value={finish.value}
            note={finish.note}
          />
        )}
      </div>
      <FunnelSteps
        rows={
          drillHref === null
            ? funnelRows(counted, currency, i18n)
            : withDrillLinks(
                funnelRows(counted, currency, i18n),
                counted.map((step) => step.count),
                drill,
                drillHref,
                i18n,
              )
        }
        mode={mode}
        i18n={i18n}
      />
      {subjects}
    </>
  );
}
