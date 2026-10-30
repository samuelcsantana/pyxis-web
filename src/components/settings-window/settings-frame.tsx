import type { ReactNode } from 'react';
import { SignOutButton, type SignOutLook } from '@/components/shell/sign-out-button';
import { CONTROL_TRANSITION, FOCUS_RING } from '@/components/ui/control-classes';
import {
  FrameRoot,
  type FrameMode,
  FrameViewProvider,
  SectionLink,
  ShowListButton,
  WINDOW_TITLE_ID,
} from './frame-view';
import type { SettingsSection } from './sections';

export interface FrameRow {
  readonly section: SettingsSection;
  readonly href: string;
  readonly label: string;
  readonly icon: string;
}

export interface FrameGroup {
  readonly label: string;
  readonly rows: readonly FrameRow[];
}

export interface FrameSection {
  readonly key: SettingsSection;
  readonly title: string;
  readonly titleId: string;
}

export interface FrameTexts {
  readonly title: string;
  readonly sections: string;
  readonly backToList: string;
}

export type FrameTitleLevel = 2 | null;

export interface SettingsFrameProps {
  readonly mode: FrameMode;
  readonly titleLevel: FrameTitleLevel;
  readonly texts: FrameTexts;
  readonly email: string;
  readonly groups: readonly FrameGroup[];
  readonly section: FrameSection;
  readonly children: ReactNode;
}

const BACK_ICON = 'M15 6l-6 6 6 6';
const SIGN_OUT_LOOK: SignOutLook = {
  frame: 'flex flex-col gap-1',
  button: `w-full gap-2.5 px-2 text-sm font-medium text-muted hover:bg-card/65 hover:text-ink max-lg:min-h-12 max-lg:justify-center max-lg:border max-lg:border-line-strong max-lg:font-semibold max-lg:text-ink max-lg:hover:bg-soft ${FOCUS_RING} ${CONTROL_TRANSITION}`,
  error: 'px-2 text-bad',
  withIcon: true,
};
const NEXT_ICON = 'M9 6l6 6-6 6';
const ON_A_PHONE_LIST = 'max-lg:group-data-[view=section]/frame:hidden';
const ON_A_PHONE_SECTION = 'max-lg:group-data-[view=list]/frame:hidden';
const ROW_LOOK = `group/row relative flex w-full items-center gap-2.5 text-left text-sm font-medium text-ink ${FOCUS_RING} ${CONTROL_TRANSITION}`;
const ROW_ON_A_PHONE =
  'max-lg:focus-visible:-outline-offset-2 max-lg:min-h-13 max-lg:px-3 max-lg:py-1.5 max-lg:hover:bg-soft max-lg:[&+&]:border-t max-lg:[&+&]:border-line';
const ROW_ON_A_LAPTOP =
  'lg:min-h-10 lg:rounded-control lg:px-2 lg:py-1 lg:hover:bg-card/65 lg:aria-[current=page]:bg-card lg:aria-[current=page]:font-semibold lg:aria-[current=page]:shadow-[0_0_0_1px_var(--pyx-line),0_1px_2px_rgba(14,26,43,0.06)]';
const ROW_ICON =
  'inline-flex size-7 shrink-0 items-center justify-center rounded-lg text-muted max-lg:size-8 max-lg:bg-soft max-lg:text-ink lg:group-aria-[current=page]/row:bg-accent lg:group-aria-[current=page]/row:text-accent-ink';
const GROUP_LABEL =
  'text-micro font-semibold tracking-[0.08em] text-muted uppercase max-lg:border-t max-lg:border-line max-lg:bg-soft max-lg:px-3 max-lg:pt-2 max-lg:pb-1.5 max-lg:first:border-t-0 lg:mx-2 lg:mt-2 lg:mb-0.5 lg:first:mt-0';

interface IconProps {
  readonly path: string;
  readonly size: number;
}

function Icon({ path, size }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const FRAME_TITLE = 'text-base leading-[22px] font-bold tracking-tight focus:outline-none';

interface FrameTitleProps {
  readonly title: string;
  readonly level: FrameTitleLevel;
}

function FrameTitle({ title, level }: FrameTitleProps) {
  if (level === 2) {
    return (
      <h2 id={WINDOW_TITLE_ID} tabIndex={-1} className={FRAME_TITLE}>
        {title}
      </h2>
    );
  }
  return null;
}

interface WhoProps {
  readonly email: string;
  readonly title: string;
  readonly level: FrameTitleLevel;
}

function Who({ email, title, level }: WhoProps) {
  return (
    <div className="flex min-h-11 items-center gap-3 px-1.5 max-lg:pr-14">
      <span
        aria-hidden="true"
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-semibold text-card"
      >
        {email.charAt(0).toUpperCase()}
      </span>
      <div className="min-w-0">
        <FrameTitle title={title} level={level} />
        <p className="text-xs leading-[18px] wrap-anywhere text-muted">{email}</p>
      </div>
    </div>
  );
}

interface GroupProps {
  readonly group: FrameGroup;
  readonly mode: FrameMode;
  readonly current: SettingsSection;
}

function Group({ group, mode, current }: GroupProps) {
  return (
    <>
      <p className={GROUP_LABEL}>{group.label}</p>
      {group.rows.map((row) => (
        <SectionLink
          key={row.section}
          href={row.href}
          mode={mode}
          current={row.section === current}
          className={`${ROW_LOOK} ${ROW_ON_A_PHONE} ${ROW_ON_A_LAPTOP}`}
        >
          <span className={ROW_ICON}>
            <Icon path={row.icon} size={17} />
          </span>
          <span className="min-w-0 flex-1">{row.label}</span>
          <span className="text-muted lg:hidden">
            <Icon path={NEXT_ICON} size={16} />
          </span>
        </SectionLink>
      ))}
    </>
  );
}

export function SettingsFrame({
  mode,
  titleLevel,
  texts,
  email,
  groups,
  section,
  children,
}: SettingsFrameProps) {
  const frame = (
    <FrameRoot className="flex min-h-0 flex-1 bg-card text-ink">
      <nav
        aria-label={texts.sections}
        data-frame-nav=""
        className={`flex shrink-0 flex-col gap-4.5 overflow-y-auto overscroll-contain max-lg:w-full max-lg:flex-1 max-lg:gap-4 max-lg:px-4 max-lg:pt-3.5 max-lg:pb-4 lg:w-62 lg:border-r lg:border-line lg:bg-soft lg:px-3 lg:pt-4.5 lg:pb-3 ${ON_A_PHONE_LIST}`}
      >
        <Who email={email} title={texts.title} level={titleLevel} />
        <div className="flex flex-col gap-0.5 max-lg:gap-0 max-lg:overflow-hidden max-lg:rounded-[0.875rem] max-lg:border max-lg:border-line">
          {groups.map((group) => (
            <Group key={group.label} group={group} mode={mode} current={section.key} />
          ))}
        </div>
        <div className="mt-auto border-t border-line pt-2 max-lg:mt-0 max-lg:border-t-0 max-lg:pt-0">
          <SignOutButton variant={SIGN_OUT_LOOK} />
        </div>
      </nav>
      <section
        aria-labelledby={section.titleId}
        className={`flex min-w-0 flex-1 flex-col overflow-y-auto overscroll-contain px-4 pt-3.5 pb-6 lg:px-6 ${ON_A_PHONE_SECTION}`}
      >
        <div className="flex min-h-11 flex-col justify-center gap-2 pr-13 max-lg:pr-12">
          <ShowListButton
            className={`-ml-2 flex min-h-11 items-center gap-1 self-start rounded-control px-2 text-sm font-medium text-muted hover:text-ink lg:hidden ${FOCUS_RING} ${CONTROL_TRANSITION}`}
          >
            <Icon path={BACK_ICON} size={18} />
            <span>{texts.backToList}</span>
          </ShowListButton>
          <h2
            id={section.titleId}
            tabIndex={-1}
            data-section-title=""
            className="text-2xl font-bold tracking-tight focus:outline-none lg:sr-only"
          >
            {section.title}
          </h2>
        </div>
        <div className="mt-4 flex flex-col gap-4 lg:mt-1">{children}</div>
      </section>
    </FrameRoot>
  );
  return mode === 'page' ? <FrameViewProvider initial="section">{frame}</FrameViewProvider> : frame;
}
