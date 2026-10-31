import type { ReactNode } from 'react';
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
    <header className="flex flex-col gap-2 border-b border-line bg-card px-4 py-2.5 text-ink sm:px-8 lg:sticky lg:top-0 lg:z-20">
      <div className="flex min-h-11 flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1">
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
          <div className="flex flex-wrap items-center gap-3">{controls}</div>
        )}
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
