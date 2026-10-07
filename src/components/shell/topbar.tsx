import type { ReactNode } from 'react';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { formatPeriod, type Period } from '@/domain/period';
import type { Theme } from '@/lib/theme';
import { type KeptParameters, PeriodSelector } from './period-selector';

interface TopbarBase {
  readonly title: string;
  readonly subtitle: string;
  readonly theme?: Theme;
}

export interface TopbarWithPeriodProps extends TopbarBase {
  readonly basePath: string;
  readonly period: Period;
  readonly today: string;
  readonly keep?: KeptParameters;
}

interface WithoutPeriod extends TopbarBase {
  readonly period?: undefined;
}

export type TopbarProps = TopbarWithPeriodProps | WithoutPeriod;

const CALENDAR_ICON = 'M4 6h16v14H4z M4 10h16 M8 3v4 M16 3v4';

function PeriodControls({ basePath, period, today, keep }: TopbarWithPeriodProps) {
  return (
    <>
      <p className="flex items-center gap-2 text-[13px] text-muted">
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
        <span className="tabular-nums">{formatPeriod(period)}</span>
      </p>
      <PeriodSelector basePath={basePath} period={period} today={today} keep={keep} />
    </>
  );
}

export interface TopbarFrameProps {
  readonly title: string;
  readonly subtitle: ReactNode;
  readonly controls: ReactNode;
}

export function TopbarFrame({ title, subtitle, controls }: TopbarFrameProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line bg-card px-4 py-4.5 text-ink sm:px-8">
      <div className="flex min-w-0 flex-col gap-1">
        <h1 className="text-[22px] leading-7 font-semibold tracking-tight">{title}</h1>
        <p className="text-[13px] text-muted">{subtitle}</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">{controls}</div>
    </header>
  );
}

export function Topbar(props: TopbarProps) {
  return (
    <TopbarFrame
      title={props.title}
      subtitle={props.subtitle}
      controls={
        <>
          {props.period === undefined ? null : <PeriodControls {...props} />}
          <ThemeToggle initialTheme={props.theme} />
        </>
      }
    />
  );
}
