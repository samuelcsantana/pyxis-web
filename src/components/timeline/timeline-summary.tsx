import type { TimelineTotals } from '@/domain/timeline';

export interface TimelineSummaryProps {
  readonly title: string;
  readonly totals: TimelineTotals;
}

export function TimelineSummary({ title, totals }: TimelineSummaryProps) {
  return (
    <section
      aria-labelledby="timeline-summary-heading"
      className="flex flex-wrap items-center justify-between gap-4 rounded-card border border-line bg-card px-5.5 py-5 text-ink"
    >
      <h2 id="timeline-summary-heading" className="font-mono text-lg font-semibold">
        {title}
      </h2>
      <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm tabular-nums">
        <li>{totals.visits}</li>
        <li>{totals.events}</li>
        <li className={totals.hasFailures ? 'font-semibold text-bad' : 'text-muted'}>
          {totals.failedRequests}
        </li>
      </ul>
    </section>
  );
}
