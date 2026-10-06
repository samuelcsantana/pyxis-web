import type { Project } from '@/domain/admin';

export interface ProjectPanelProps {
  readonly project: Project;
}

export function ProjectPanel({ project }: ProjectPanelProps) {
  return (
    <section
      aria-labelledby="project-settings-heading"
      className="flex flex-col gap-4 rounded-card border border-line bg-card p-6 text-ink"
    >
      <div className="flex flex-col gap-1">
        <h2 id="project-settings-heading" className="text-lg font-semibold">
          Project settings
        </h2>
        <p className="text-sm leading-5 text-muted">
          The numbers for {project.name} are calculated in its time zone. The charts of this screen
          arrive with the overview queries.
        </p>
      </div>
      <dl className="grid gap-3 sm:grid-cols-3">
        <div className="flex flex-col gap-1 rounded-input border border-line p-3.5">
          <dt className="text-xs font-medium text-muted">Name</dt>
          <dd className="text-sm font-semibold">{project.name}</dd>
        </div>
        <div className="flex flex-col gap-1 rounded-input border border-line p-3.5">
          <dt className="text-xs font-medium text-muted">Time zone</dt>
          <dd className="font-mono text-sm">{project.timezone}</dd>
        </div>
        <div className="flex flex-col gap-1 rounded-input border border-line p-3.5">
          <dt className="text-xs font-medium text-muted">Conversion event</dt>
          <dd className="font-mono text-sm">{project.conversionEvent ?? 'Not set'}</dd>
        </div>
      </dl>
    </section>
  );
}
