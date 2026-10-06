'use server';

import { z } from 'zod';
import {
  lookupOf,
  timelineFilterOf,
  type TimelineSearch,
  type VisitView,
  visitViews,
} from '@/domain/timeline';
import { projectOrNotFound, readOrSignIn } from '@/lib/current-admin';
import { createTimelineService } from '@/services/timeline/timeline-service.factory';

export interface OlderVisitsPage {
  readonly visits: readonly VisitView[];
  readonly nextBefore: string | null;
}

const cursorSchema = z.iso.datetime();

export async function loadOlderVisits(
  projectId: string,
  search: TimelineSearch,
  before: string,
): Promise<OlderVisitsPage> {
  const { project } = await projectOrNotFound(projectId);
  const lookup = lookupOf(search);
  if (lookup === null || !cursorSchema.safeParse(before).success) {
    throw new Error('Older visits need a valid lookup and cursor.');
  }
  const report = await readOrSignIn(() =>
    createTimelineService().timeline(project.id, lookup, before),
  );
  return {
    visits: visitViews(report.visits, project.timezone, timelineFilterOf(search)),
    nextBefore: report.nextBefore,
  };
}
