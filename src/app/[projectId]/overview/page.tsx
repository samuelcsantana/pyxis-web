import type { Metadata } from 'next';
import { ProjectPanel } from '@/components/project/project-panel';
import { screenHref } from '@/components/shell/screens';
import { Topbar } from '@/components/shell/topbar';
import { type PeriodSearch, resolvePeriod, todayIn } from '@/domain/period';
import { projectOrNotFound } from '@/lib/current-admin';
import { chosenTheme } from '@/lib/theme-cookie';

export const metadata: Metadata = { title: 'Overview · Pyxis' };

export interface OverviewPageProps {
  readonly params: Promise<{ readonly projectId: string }>;
  readonly searchParams: Promise<PeriodSearch>;
}

export default async function OverviewPage({ params, searchParams }: OverviewPageProps) {
  const { project } = await projectOrNotFound((await params).projectId);
  const now = new Date();
  return (
    <>
      <Topbar
        title="Overview"
        subtitle={`How ${project.name} was used in the period`}
        basePath={screenHref(project.id, 'overview')}
        period={resolvePeriod(await searchParams, project.timezone, now)}
        today={todayIn(project.timezone, now)}
        theme={await chosenTheme()}
      />
      <main className="flex flex-col gap-6 p-4 sm:p-8">
        <ProjectPanel project={project} />
      </main>
    </>
  );
}
