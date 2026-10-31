import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { BrandBackdrop } from '@/components/brand/brand-backdrop';
import { LogoMark } from '@/components/brand/logo-mark';
import { RAISED_CARDS } from '@/components/brand/raised-cards';
import type { When } from '@/components/settings/part-pieces';
import type { FrameMode } from '@/components/settings-window/frame-view';
import {
  ACCOUNT_SECTIONS,
  type AccountSection,
  accountSectionHref,
  isOwnerOnly,
  type ProjectSection,
  projectSectionHref,
  projectSectionsFor,
  SECTION_LOOKS,
  type SettingsSection,
} from '@/components/settings-window/sections';
import {
  type FrameGroup,
  type FrameTitleLevel,
  SettingsFrame,
} from '@/components/settings-window/settings-frame';
import { MainContent } from '@/components/shell/main-content';
import { hrefKeepingView, type SearchReader } from '@/components/shell/screens';
import { Topbar } from '@/components/shell/topbar';
import { TEXT_LINK } from '@/components/ui/control-classes';
import type { Admin } from '@/domain/admin';
import { canManageProject, type ProjectSettings } from '@/domain/project-settings';
import { demoCanonical } from '@/lib/demo-canonical';
import type { I18n } from '@/i18n/i18n';
import { getI18n, getTranslator } from '@/i18n/get-messages';
import { currentAdmin, projectOrNotFound, readOrSignIn } from '@/lib/current-admin';
import { createProjectsService } from '@/services/projects/projects-service.factory';

export type PageSearch = Readonly<Record<string, string | readonly string[] | undefined>>;

export interface ProjectPageProps {
  readonly params: Promise<{ readonly projectId: string }>;
  readonly searchParams: Promise<PageSearch>;
}

export interface AccountPageProps {
  readonly searchParams: Promise<PageSearch>;
}

export interface ProjectBodyInput {
  readonly settings: ProjectSettings;
  readonly i18n: I18n;
  readonly when: When;
  readonly owner: boolean;
  readonly admin: Admin;
}

export type ProjectBody = (input: ProjectBodyInput) => ReactNode | Promise<ReactNode>;

export interface AccountBodyInput {
  readonly i18n: I18n;
  readonly when: When;
  readonly admin: Admin;
}

export type AccountBody = (input: AccountBodyInput) => Promise<ReactNode>;

export interface ProjectSectionProps extends ProjectPageProps {
  readonly section: ProjectSection;
  readonly body: ProjectBody;
}

export interface AccountSectionWindowProps extends ProjectPageProps {
  readonly section: AccountSection;
  readonly body: AccountBody;
}

export interface AccountSectionPageProps extends AccountPageProps {
  readonly section: AccountSection;
  readonly body: AccountBody;
}

export const DASHBOARD_HOME = '/';
const ACCOUNT_TIME_ZONE_FALLBACK = 'UTC';
const FULL_PAGE_FRAME =
  'flex overflow-hidden lg:min-h-[min(44rem,calc(100dvh-12rem))] lg:rounded-card lg:border lg:border-line';

const SUBTITLES = {
  owner: 'settings.subtitleOwner',
  member: 'settings.subtitleMember',
  operator: 'settings.subtitle',
} as const;

function subtitleOf(settings: ProjectSettings) {
  if (canManageProject(settings)) {
    return SUBTITLES.owner;
  }
  return settings.role === 'member' ? SUBTITLES.member : SUBTITLES.operator;
}

export function searchReaderOf(search: PageSearch): SearchReader {
  return {
    get: (name) => {
      const value = search[name];
      return typeof value === 'string' ? value : (value?.[0] ?? null);
    },
  };
}

function whenIn(i18n: I18n, timeZone: string): When {
  const format = i18n.format.dateTime('eventTime', timeZone);
  return (iso) => format(new Date(iso));
}

interface MenuProject {
  readonly id: string;
  readonly name: string;
  readonly owner: boolean;
}

function frameGroups(
  i18n: I18n,
  search: SearchReader,
  project: MenuProject | null,
): readonly FrameGroup[] {
  const row = (section: SettingsSection, href: string) => ({
    section,
    href: hrefKeepingView(href, search),
    label: i18n.t(SECTION_LOOKS[section].label),
    icon: SECTION_LOOKS[section].icon,
  });
  const you: FrameGroup = {
    label: i18n.t('settings.you'),
    rows: ACCOUNT_SECTIONS.map((section) => row(section, accountSectionHref(section))),
  };
  if (project === null) {
    return [you];
  }
  const projectGroup: FrameGroup = {
    label: project.name,
    rows: projectSectionsFor(project.owner).map((section) =>
      row(section, projectSectionHref(project.id, section)),
    ),
  };
  return [projectGroup, you];
}

interface FrameInput {
  readonly mode: FrameMode;
  readonly titleLevel: FrameTitleLevel;
  readonly i18n: I18n;
  readonly admin: Admin;
  readonly groups: readonly FrameGroup[];
  readonly section: SettingsSection;
  readonly body: ReactNode;
}

function framed({ mode, titleLevel, i18n, admin, groups, section, body }: FrameInput) {
  return (
    <SettingsFrame
      mode={mode}
      titleLevel={titleLevel}
      texts={{
        title: i18n.t('nav.settings'),
        sections: i18n.t('settings.sections'),
        backToList: i18n.t('nav.settings'),
      }}
      email={admin.email}
      groups={groups}
      section={{
        key: section,
        title: i18n.t(SECTION_LOOKS[section].label),
        titleId: SECTION_LOOKS[section].titleId,
      }}
    >
      {body}
    </SettingsFrame>
  );
}

interface ProjectContext {
  readonly admin: Admin;
  readonly settings: ProjectSettings;
  readonly owner: boolean;
  readonly i18n: I18n;
}

async function projectContextOf(projectId: string): Promise<ProjectContext> {
  const { admin, project } = await projectOrNotFound(projectId);
  const [settings, i18n] = await Promise.all([
    readOrSignIn(() => createProjectsService().settings(project.id)),
    getI18n(),
  ]);
  return { admin, settings, owner: canManageProject(settings), i18n };
}

function menuProjectOf({ settings, owner }: ProjectContext): MenuProject {
  return { id: settings.id, name: settings.name, owner };
}

async function projectSectionFrame(
  context: ProjectContext,
  { section, body: bodyOf }: Pick<ProjectSectionProps, 'section' | 'body'>,
  mode: FrameMode,
  search: SearchReader,
): Promise<ReactNode> {
  const { admin, settings, owner, i18n } = context;
  if (isOwnerOnly(section) && !owner) {
    notFound();
  }
  const body = await bodyOf({
    settings,
    i18n,
    when: whenIn(i18n, settings.timezone),
    owner,
    admin,
  });
  return framed({
    mode,
    titleLevel: mode === 'window' ? 2 : null,
    i18n,
    admin,
    groups: frameGroups(i18n, search, menuProjectOf(context)),
    section,
    body,
  });
}

export async function ProjectSectionWindow({
  params,
  searchParams,
  section,
  body,
}: ProjectSectionProps) {
  const [{ projectId }, search] = await Promise.all([params, searchParams]);
  const context = await projectContextOf(projectId);
  return projectSectionFrame(context, { section, body }, 'window', searchReaderOf(search));
}

export async function ProjectSectionPage({
  params,
  searchParams,
  section,
  body,
}: ProjectSectionProps) {
  const [{ projectId }, search] = await Promise.all([params, searchParams]);
  const context = await projectContextOf(projectId);
  const frame = await projectSectionFrame(
    context,
    { section, body },
    'page',
    searchReaderOf(search),
  );
  const { i18n, settings } = context;
  return (
    <>
      <Topbar
        title={i18n.t('nav.settings')}
        subtitle={i18n.t(subtitleOf(settings), { project: settings.name })}
      />
      <MainContent className="flex w-full max-w-310 flex-col p-0 sm:px-8 sm:pt-7 sm:pb-12">
        <div className={FULL_PAGE_FRAME}>{frame}</div>
      </MainContent>
    </>
  );
}

export async function AccountSectionWindow({
  params,
  searchParams,
  section,
  body,
}: AccountSectionWindowProps) {
  const [{ projectId }, search] = await Promise.all([params, searchParams]);
  const context = await projectContextOf(projectId);
  const { admin, i18n, settings } = context;
  return framed({
    mode: 'window',
    titleLevel: 2,
    i18n,
    admin,
    groups: frameGroups(i18n, searchReaderOf(search), menuProjectOf(context)),
    section,
    body: await body({ i18n, when: whenIn(i18n, settings.timezone), admin }),
  });
}

export async function AccountSectionPage({ searchParams, section, body }: AccountSectionPageProps) {
  const [admin, search, i18n] = await Promise.all([currentAdmin(), searchParams, getI18n()]);
  const timeZone = admin.projects[0]?.timezone ?? ACCOUNT_TIME_ZONE_FALLBACK;
  const frame = framed({
    mode: 'page',
    titleLevel: null,
    i18n,
    admin,
    groups: frameGroups(i18n, searchReaderOf(search), null),
    section,
    body: await body({ i18n, when: whenIn(i18n, timeZone), admin }),
  });
  return (
    <div className="relative isolate">
      <BrandBackdrop />
      <MainContent
        className={`mx-auto flex min-h-dvh w-full max-w-4xl flex-col justify-center gap-6 px-4 py-16 text-ink ${RAISED_CARDS}`}
      >
        <p className="flex items-center gap-2.5 text-xl font-bold tracking-tight">
          <LogoMark size={32} />
          Pyxis
        </p>
        <h1 className="text-2xl font-bold tracking-tight">{i18n.t('nav.settings')}</h1>
        <div className={`${FULL_PAGE_FRAME} bg-card`}>{frame}</div>
        <Link href={DASHBOARD_HOME} className={`self-start text-sm ${TEXT_LINK}`}>
          {i18n.t('account.back')}
        </Link>
      </MainContent>
    </div>
  );
}

export async function projectSectionMetadata(
  props: Pick<ProjectPageProps, 'params'>,
  section: ProjectSection,
): Promise<Metadata> {
  const { project } = await projectOrNotFound((await props.params).projectId);
  const t = await getTranslator();
  return {
    title: t('meta.screenTitle', {
      screen: t(SECTION_LOOKS[section].label),
      project: project.name,
    }),
    ...demoCanonical(projectSectionHref(project.id, section)),
  };
}

export async function accountWindowMetadata(
  props: Pick<ProjectPageProps, 'params'>,
  section: AccountSection,
): Promise<Metadata> {
  const { project } = await projectOrNotFound((await props.params).projectId);
  const t = await getTranslator();
  return {
    title: t('meta.screenTitle', {
      screen: t(SECTION_LOOKS[section].label),
      project: project.name,
    }),
  };
}

export async function accountSectionMetadata(section: AccountSection): Promise<Metadata> {
  const t = await getTranslator();
  return { title: t(SECTION_LOOKS[section].label) };
}
