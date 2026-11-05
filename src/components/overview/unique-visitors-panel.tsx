import Link from 'next/link';
import type { ReactNode } from 'react';
import { valueAxis } from '@/domain/chart-scale';
import { formatCount } from '@/domain/metrics';
import { formatDay } from '@/domain/period';
import { stackedBars } from '@/domain/stacked-bars';
import {
  hasCountedVisits,
  headlineLabel,
  headlineNote,
  isWarmingUp,
  type UniqueVisitors,
  VISITOR_KINDS,
  type VisitorDayRow,
  type VisitorKind,
  type VisitorsHeadline,
  visitorDayRows,
  visitorDaysSummary,
  visitorKindLabel,
  visitorsHeadline,
} from '@/domain/unique-visitors';
import type { I18n } from '@/i18n/i18n';
import { ChartFrame } from '@/components/charts/chart-frame';
import { ChartHover, type HoverDay } from '@/components/charts/chart-hover';
import { ChartPanel } from '@/components/charts/chart-panel';
import { FOCUS_RING, TEXT_LINK } from '@/components/ui/control-classes';
import { BODY_CELL, HEADER_CELL, PANEL, PANEL_TITLE } from '@/components/ui/panel-classes';

const KIND_COLORS: Readonly<
  Record<VisitorKind, { readonly fill: string; readonly swatch: string }>
> = {
  newVisitors: { fill: 'var(--color-sky)', swatch: 'bg-sky' },
  returning: { fill: 'var(--color-violet)', swatch: 'bg-violet' },
};

const HEADING_ID = 'unique-visitors-heading';
const SEPARATOR_WIDTH = 1;
const MARKER = 'size-2 rounded-[2px]';
const FIGURE_VALUE =
  'text-title leading-7 font-semibold tracking-tight tabular-nums sm:text-figure sm:leading-8';
const SMALL_PRINT = 'text-xs leading-[18px] text-muted';

export interface UniqueVisitorsPanelProps {
  readonly visitors: UniqueVisitors;
  readonly endsToday: boolean;
  readonly periodLabel: string;
  readonly visitsHref: (span: 'day' | 'month') => string | null;
  readonly i18n: I18n;
}

function spanOf(headline: VisitorsHeadline): 'day' | 'month' {
  return headline.span === 'month' || headline.span === 'monthSoFar' ? 'month' : 'day';
}

function Figures({
  headline,
  href,
  i18n,
}: {
  readonly headline: VisitorsHeadline;
  readonly href: string | null;
  readonly i18n: I18n;
}) {
  return (
    <div className="flex flex-col gap-2">
      <HeadlineFigures headline={headline} i18n={i18n} />
      {href === null ? null : (
        <Link href={href} className={`self-start text-caption ${TEXT_LINK}`}>
          {i18n.t('uniqueVisitors.seeVisits')}
        </Link>
      )}
    </div>
  );
}

function HeadlineFigures({
  headline,
  i18n,
}: {
  readonly headline: VisitorsHeadline;
  readonly i18n: I18n;
}) {
  const note = headlineNote(headline, i18n);
  return (
    <div className="flex flex-col gap-2">
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:items-end sm:gap-4">
        <div className="col-span-2 flex flex-col gap-1 sm:col-span-1">
          <dt className="text-caption text-muted">{headlineLabel(headline, i18n)}</dt>
          <dd className={FIGURE_VALUE}>{formatCount(headline.unique, i18n)}</dd>
        </div>
        {VISITOR_KINDS.map((kind) => (
          <div key={kind} className="flex flex-col gap-1">
            <dt className="flex items-center gap-2 text-caption text-muted">
              <span
                aria-hidden="true"
                className={`size-2.5 rounded-[3px] ${KIND_COLORS[kind].swatch}`}
              />
              {visitorKindLabel(kind, i18n)}
            </dt>
            <dd className={FIGURE_VALUE}>{formatCount(headline[kind], i18n)}</dd>
          </div>
        ))}
      </dl>
      {note === null ? null : <p className="text-caption text-muted">{note}</p>}
    </div>
  );
}

function Footnote({
  headline,
  i18n,
}: {
  readonly headline: VisitorsHeadline;
  readonly i18n: I18n;
}) {
  return (
    <p className={SMALL_PRINT}>
      {isWarmingUp(headline)
        ? `${i18n.t('uniqueVisitors.footnote')} ${i18n.t('uniqueVisitors.warmingUp')}`
        : i18n.t('uniqueVisitors.footnote')}
    </p>
  );
}

function hoverDays(rows: readonly VisitorDayRow[], i18n: I18n): readonly HoverDay[] {
  return rows.map((row) => ({
    label: formatDay(row.date, i18n),
    rows: [
      ...VISITOR_KINDS.map((kind) => ({
        label: visitorKindLabel(kind, i18n),
        value: formatCount(row[kind], i18n),
        marker: `${MARKER} ${KIND_COLORS[kind].swatch}`,
      })),
      {
        label: i18n.t('uniqueVisitors.unique'),
        value: formatCount(row.unique, i18n),
        marker: MARKER,
      },
    ],
  }));
}

function VisitorBars({
  rows,
  i18n,
}: {
  readonly rows: readonly VisitorDayRow[];
  readonly i18n: I18n;
}) {
  const axis = valueAxis(rows.map((row) => row.unique));
  const bars = stackedBars(rows, VISITOR_KINDS, axis.top);
  return (
    <ChartFrame
      summary={visitorDaysSummary(rows, i18n)}
      heightClassName="h-40 sm:h-48"
      axis={axis}
      dates={rows.map((row) => row.date)}
      layout="bars"
      hover={<ChartHover days={hoverDays(rows, i18n)} layout="bars" />}
      i18n={i18n}
    >
      {bars.segments.map((segment) => (
        <rect
          key={`${segment.key}-${String(segment.day)}`}
          x={segment.x}
          y={segment.y}
          width={segment.width}
          height={segment.height}
          fill={KIND_COLORS[segment.key].fill}
        />
      ))}
      <path
        d={bars.separators}
        fill="none"
        stroke="var(--color-card)"
        strokeWidth={SEPARATOR_WIDTH}
        vectorEffect="non-scaling-stroke"
      />
    </ChartFrame>
  );
}

function VisitorTable({
  rows,
  periodLabel,
  i18n,
}: {
  readonly rows: readonly VisitorDayRow[];
  readonly periodLabel: string;
  readonly i18n: I18n;
}) {
  const caption = i18n.t('uniqueVisitors.caption', { period: periodLabel });
  return (
    <div
      className={`overflow-x-auto ${FOCUS_RING}`}
      role="region"
      aria-label={caption}
      tabIndex={0}
    >
      <table className="w-full border-collapse text-caption tabular-nums">
        <caption className="pb-2 text-left text-muted">{caption}</caption>
        <thead>
          <tr>
            <th scope="col" className={`${HEADER_CELL} text-left`}>
              {i18n.t('uniqueVisitors.day')}
            </th>
            <th scope="col" className={`${HEADER_CELL} text-right`}>
              {i18n.t('uniqueVisitors.unique')}
            </th>
            {VISITOR_KINDS.map((kind) => (
              <th key={kind} scope="col" className={`${HEADER_CELL} text-right`}>
                {visitorKindLabel(kind, i18n)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.date}>
              <th scope="row" className={`${BODY_CELL} text-left font-normal whitespace-nowrap`}>
                {formatDay(row.date, i18n)}
              </th>
              <td className={`${BODY_CELL} text-right font-semibold`}>
                {formatCount(row.unique, i18n)}
              </td>
              {VISITOR_KINDS.map((kind) => (
                <td key={kind} className={`${BODY_CELL} text-right`}>
                  {formatCount(row[kind], i18n)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PlainPanel({
  title,
  description,
  children,
}: {
  readonly title: string;
  readonly description: string | null;
  readonly children: ReactNode;
}) {
  return (
    <section aria-labelledby={HEADING_ID} className={`${PANEL} gap-4`}>
      <div className="flex flex-col gap-1">
        <h2 id={HEADING_ID} className={PANEL_TITLE}>
          {title}
        </h2>
        {description === null ? null : <p className="text-caption text-muted">{description}</p>}
      </div>
      {children}
    </section>
  );
}

export function UniqueVisitorsPanel({
  visitors,
  endsToday,
  periodLabel,
  visitsHref,
  i18n,
}: UniqueVisitorsPanelProps) {
  if (!visitors.enabled) {
    return null;
  }
  const title = i18n.t('uniqueVisitors.title');
  if (!hasCountedVisits(visitors)) {
    return (
      <PlainPanel title={title} description={null}>
        <p className="text-sm text-muted">{i18n.t('uniqueVisitors.empty')}</p>
      </PlainPanel>
    );
  }
  const headline = visitorsHeadline(visitors, endsToday);
  const href = visitsHref(spanOf(headline));
  if (headline.span === 'day') {
    return (
      <PlainPanel
        title={title}
        description={i18n.t('uniqueVisitors.dayDescription', { period: periodLabel })}
      >
        <Figures headline={headline} href={href} i18n={i18n} />
        <Footnote headline={headline} i18n={i18n} />
      </PlainPanel>
    );
  }
  const rows = visitorDayRows(visitors);
  return (
    <ChartPanel
      title={title}
      description={i18n.t('uniqueVisitors.description', { period: periodLabel })}
      legend={null}
      figures={<Figures headline={headline} href={href} i18n={i18n} />}
      chart={<VisitorBars rows={rows} i18n={i18n} />}
      table={<VisitorTable rows={rows} periodLabel={periodLabel} i18n={i18n} />}
      footnote={<Footnote headline={headline} i18n={i18n} />}
    />
  );
}
