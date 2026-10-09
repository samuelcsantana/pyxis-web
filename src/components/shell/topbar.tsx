import type { ReactNode } from 'react';
import { formatPeriod, type Period, rejectedRangeNotice } from '@/domain/period';
import type { I18n } from '@/i18n/i18n';
import { type KeptParameters, PeriodSelector, RANGE_NOTICE_ID } from './period-selector';

interface TopbarBase {
  readonly title: string;
  readonly subtitle: string;
}

export interface TopbarWithPeriodProps extends TopbarBase {
  readonly basePath: string;
  readonly period: Period;
  readonly today: string;
  readonly keep?: KeptParameters;
  readonly i18n: I18n;
}

interface WithoutPeriod extends TopbarBase {
  readonly period?: undefined;
}

export type TopbarProps = TopbarWithPeriodProps | WithoutPeriod;

const CALENDAR_ICON = 'M4 6h16v14H4z M4 10h16 M8 3v4 M16 3v4';

function PeriodLabel({ period, i18n }: { readonly period: Period; readonly i18n: I18n }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5">
      <svg width={16} height={16} viewBox="0 0 24 24" aria-hidden="true">
        <path
          d={CALENDAR_ICON}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="tabular-nums">{formatPeriod(period, i18n)}</span>
    </span>
  );
}

export interface TopbarFrameProps {
  readonly title: string;
  readonly subtitle: ReactNode;
  readonly context?: ReactNode;
  readonly controls: ReactNode;
  readonly notice?: ReactNode;
}

export function TopbarFrame({ title, subtitle, context, controls, notice }: TopbarFrameProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-line bg-card px-4 py-3 text-ink sm:gap-y-4 sm:px-8 sm:py-4.5 lg:sticky lg:top-0 lg:z-20">
      <div className="flex min-w-0 flex-1 basis-64 flex-col gap-1">
        <h1 className="text-title leading-7 font-semibold tracking-tight">{title}</h1>
        {context === undefined ? (
          <p className="hidden text-caption text-muted sm:block">{subtitle}</p>
        ) : (
          <p className="flex min-w-0 items-center gap-x-3 text-caption text-muted">
            {context}
            <span className="hidden min-w-0 truncate sm:inline">{subtitle}</span>
          </p>
        )}
        {notice}
      </div>
      <div className="flex flex-wrap items-center gap-3">{controls}</div>
    </header>
  );
}

function RangeNotice(props: TopbarProps) {
  const rejected = props.period?.rejected;
  if (props.period === undefined || rejected === undefined) {
    return null;
  }
  return (
    <p
      id={RANGE_NOTICE_ID}
      role="status"
      className="mt-1 rounded-input bg-bad-soft px-3 py-2 text-caption text-bad"
    >
      {rejectedRangeNotice(rejected, props.i18n)}
    </p>
  );
}

export function Topbar(props: TopbarProps) {
  return (
    <TopbarFrame
      title={props.title}
      subtitle={props.subtitle}
      context={
        props.period === undefined ? undefined : (
          <PeriodLabel period={props.period} i18n={props.i18n} />
        )
      }
      notice={<RangeNotice {...props} />}
      controls={
        props.period === undefined ? null : (
          <PeriodSelector
            basePath={props.basePath}
            period={props.period}
            today={props.today}
            keep={props.keep}
            i18n={props.i18n}
          />
        )
      }
    />
  );
}
