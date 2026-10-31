import { type Project, projectIconHref, projectInitials } from '@/domain/admin';

export interface ProjectMarkProps {
  readonly project: Project;
  readonly iconHref?: string | null;
}

const INITIALS =
  'flex size-6 shrink-0 items-center justify-center rounded-chip bg-nav-border text-micro font-bold text-nav-strong';

const ICON_TILE =
  'size-6 shrink-0 rounded-chip bg-white bg-contain bg-center bg-no-repeat bg-origin-content p-0.5';

export function ProjectMark({ project, iconHref = projectIconHref(project) }: ProjectMarkProps) {
  if (iconHref === null) {
    return (
      <span aria-hidden="true" className={INITIALS}>
        {projectInitials(project.name)}
      </span>
    );
  }
  return (
    <span
      aria-hidden="true"
      data-testid="project-icon"
      className={ICON_TILE}
      style={{ backgroundImage: `url("${iconHref}")` }}
    />
  );
}
