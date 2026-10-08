import type { ReactNode } from 'react';
import { MobileMenu } from '@/components/shell/mobile-menu';
import { Sidebar } from '@/components/shell/sidebar';
import { SkipLink } from '@/components/shell/skip-link';
import { DemoBanner } from '@/components/states/demo-banner';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { isDemoMode } from '@/lib/api-config';
import { projectOrNotFound } from '@/lib/current-admin';
import { chosenTheme } from '@/lib/theme-cookie';

export interface ProjectLayoutProps {
  readonly children: ReactNode;
  readonly params: Promise<{ readonly projectId: string }>;
}

export default async function ProjectLayout({ children, params }: ProjectLayoutProps) {
  const { admin, project } = await projectOrNotFound((await params).projectId);
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
      <SkipLink />
      <MobileMenu barActions={<ThemeToggle initialTheme={await chosenTheme()} surface="nav" />}>
        <Sidebar admin={admin} project={project} />
      </MobileMenu>
      <div className="flex min-w-0 flex-col">
        {isDemoMode() ? <DemoBanner /> : null}
        {children}
      </div>
    </div>
  );
}
