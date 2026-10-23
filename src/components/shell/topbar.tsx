import type { ReactNode } from 'react';
import { formatDayRange, type Period } from '@/domain/period';
import type { DayFormats } from '@/i18n/day-formats';
import { RANGE_NOTICE_ID } from './kept-parameters';

export interface TopbarProps {
  readonly title: string;
  readonly subtitle: string;
}

const CALENDAR_ICON = 'M4 6h16v14H4z M4 10h16 M8 3v4 M16 3v4';

export interface PeriodLabelProps {
  readonly period: Period;
  readonly format: DayFormats;
}

export function PeriodLabel({ period, format }: PeriodLabelProps) {
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
      <span className="tabular-nums" suppressHydrationWarning>
        {formatDayRange(period.from, period.to, format)}
      </span>
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

export interface RangeNoticeProps {
  readonly text: string;
}

export function RangeNotice({ text }: RangeNoticeProps) {
  return (
    <p
      id={RANGE_NOTICE_ID}
      role="status"
      className="mt-1 rounded-input bg-bad-soft px-3 py-2 text-caption text-bad"
    >
      {text}
    </p>
  );
}

export function Topbar({ title, subtitle }: TopbarProps) {
  return <TopbarFrame title={title} subtitle={subtitle} controls={null} />;
}
