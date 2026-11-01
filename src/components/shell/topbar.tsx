import type { ReactNode } from 'react';
import { BarAccount } from './bar-account';
import { RANGE_NOTICE_ID } from './kept-parameters';
import { ProjectSwitcher } from './project-switcher';

export interface TopbarProps {
  readonly title: string;
}

export interface TopbarFrameProps {
  readonly title: string;
  readonly controls: ReactNode;
  readonly notice?: ReactNode;
  readonly besideTitle?: ReactNode;
  readonly children?: ReactNode;
}

export function TopbarFrame({ title, controls, notice, besideTitle, children }: TopbarFrameProps) {
  return (
    <header className="flex flex-col gap-2 border-b border-line bg-card px-4 py-2.5 text-ink sm:px-8 md:py-1.5 lg:sticky lg:top-0 lg:z-20 lg:py-2.5">
      <div className="grid min-h-11 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2">
        <div className="contents md:flex md:min-w-0 md:flex-wrap md:items-center md:justify-between md:gap-x-4 md:gap-y-1.5 lg:gap-y-2">
          <div className="col-start-1 row-start-1 flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1">
            <ProjectSwitcher />
            <span aria-hidden="true" className="text-lg text-line-strong">
              /
            </span>
            <h1 className="min-w-0 text-title leading-7 font-semibold tracking-tight wrap-break-word">
              {title}
            </h1>
            {besideTitle}
          </div>
          {controls === null ? null : (
            <div className="col-span-2 row-start-2 flex flex-wrap items-center gap-3">
              {controls}
            </div>
          )}
        </div>
        <BarAccount className="col-start-2 row-start-1 md:self-start lg:mt-0.5" />
      </div>
      {notice}
      {children}
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
      className="rounded-input bg-bad-soft px-3 py-2 text-caption text-bad"
    >
      {text}
    </p>
  );
}

export function Topbar({ title }: TopbarProps) {
  return <TopbarFrame title={title} controls={null} />;
}
