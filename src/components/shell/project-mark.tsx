import { type Project, projectIconHref, projectInitials } from '@/domain/admin';

export type ProjectMarkSize = 'large' | 'small';

export interface ProjectMarkProps {
  readonly project: Project;
  readonly size: ProjectMarkSize;
  readonly iconHref?: string | null;
}

const INITIALS: Readonly<Record<ProjectMarkSize, string>> = {
  large:
    'flex size-8 shrink-0 items-center justify-center rounded-control bg-accent text-caption font-bold text-accent-ink',
  small:
    'flex size-6 shrink-0 items-center justify-center rounded-chip bg-nav-border text-micro font-bold text-nav-strong',
};

const ICON: Readonly<Record<ProjectMarkSize, string>> = {
  large: 'size-8 rounded-control p-1',
  small: 'size-6 rounded-chip p-0.5',
};

const ICON_TILE = 'shrink-0 bg-white bg-contain bg-center bg-no-repeat bg-origin-content';

export function ProjectMark({
  project,
  size,
  iconHref = projectIconHref(project),
}: ProjectMarkProps) {
  if (iconHref === null) {
    return (
      <span aria-hidden="true" className={INITIALS[size]}>
        {projectInitials(project.name)}
      </span>
    );
  }
  return (
    <span
      aria-hidden="true"
      data-testid="project-icon"
      className={`${ICON[size]} ${ICON_TILE}`}
      style={{ backgroundImage: `url("${iconHref}")` }}
    />
  );
}
