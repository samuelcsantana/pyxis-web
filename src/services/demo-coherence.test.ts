import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { visitsTotal } from '@/domain/acquisition';
import { addDays, todayIn } from '@/domain/period';
import { MockAcquisitionService } from './acquisition/mock-acquisition-service';
import type { DateRange } from './date-range';
import { DEMO_PROJECTS, DEMO_STORE } from './demo/demo-projects';
import { MockDevicesService } from './devices/mock-devices-service';
import { MockFeaturesService } from './features/mock-features-service';
import { MockFunnelService } from './funnel/mock-funnel-service';
import { MockOverviewService } from './overview/mock-overview-service';
import { MockRequestsService } from './requests/mock-requests-service';

const NOW = new Date('2026-10-06T02:30:00.000Z');
const PERIOD_DAYS = { today: 1, '7d': 7, '30d': 30 } as const;
const TOP_ITEMS = 10;

function periodEnding(timeZone: string, days: number): DateRange {
  const today = todayIn(timeZone, NOW);
  return { from: addDays(today, 1 - days), to: today };
}

function sum(values: readonly number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

async function screensOf(projectId: string, range: DateRange) {
  const [overview, devices, acquisition, events, pages, requests] = await Promise.all([
    new MockOverviewService().overview(projectId, range),
    new MockDevicesService().devices(projectId, range),
    new MockAcquisitionService().acquisition(projectId, range),
    new MockFeaturesService().features(projectId, range, 'events'),
    new MockFeaturesService().features(projectId, range, 'screens'),
    new MockRequestsService().requests(projectId, range, null),
  ]);
  return { overview, devices, acquisition, events, pages, requests };
}

describe('the demo screens', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  for (const project of DEMO_PROJECTS) {
    for (const [period, days] of Object.entries(PERIOD_DAYS)) {
      describe(`of ${project.name}, ${period}`, () => {
        const range = periodEnding(project.timezone, days);

        it('count the same visits on Overview, Devices and Acquisition', async () => {
          const { overview, devices, acquisition } = await screensOf(project.id, range);
          const visits = overview.kpis.visits.current;

          expect(visits).toBeGreaterThan(0);
          expect(visitsTotal(acquisition.days)).toBe(visits);
          expect(sum(acquisition.sources.map((source) => source.visits))).toBe(visits);
          for (const breakdown of [
            devices.deviceTypes,
            devices.browsers,
            devices.operatingSystems,
            devices.countries,
          ]) {
            expect(sum(breakdown.map((share) => share.visits))).toBe(visits);
          }
        });

        it('count the same conversions on Overview, Devices, Acquisition and Features', async () => {
          const { overview, devices, acquisition, events } = await screensOf(project.id, range);
          const conversions = overview.kpis.conversions?.current ?? null;
          const eventCount =
            events.items.find((item) => item.name === project.conversionEvent)?.count ?? null;
          const breakdownTotals = [
            devices.deviceTypes,
            devices.browsers,
            devices.operatingSystems,
            devices.countries,
            acquisition.sources,
          ].map((breakdown) =>
            breakdown.reduce<number | null>(
              (total, share) =>
                share.conversions === null ? total : (total ?? 0) + share.conversions,
              null,
            ),
          );

          expect(conversions === null).toBe(project.conversionEvent === null);
          expect(eventCount).toBe(conversions);
          expect(breakdownTotals).toEqual(breakdownTotals.map(() => conversions));
        });

        it('never give a source fewer visits or conversions than its campaigns', async () => {
          const { acquisition } = await screensOf(project.id, range);

          for (const source of acquisition.sources) {
            const campaigns = acquisition.campaigns.filter(
              (campaign) =>
                campaign.source === source.source && campaign.channel === source.channel,
            );
            expect(sum(campaigns.map((campaign) => campaign.visits))).toBeLessThanOrEqual(
              source.visits,
            );
            expect(sum(campaigns.map((campaign) => campaign.conversions ?? 0))).toBeLessThanOrEqual(
              source.conversions ?? 0,
            );
          }
        });

        it('rank the same pages and events on Overview and Features', async () => {
          const { overview, events, pages } = await screensOf(project.id, range);

          expect(overview.topPages).toEqual(
            pages.items
              .slice(0, TOP_ITEMS)
              .map((item) => ({ path: item.name, views: item.count, visits: item.visits })),
          );
          expect(overview.topEvents).toEqual(
            events.items
              .slice(0, TOP_ITEMS)
              .map((item) => ({ name: item.name, count: item.count, visits: item.visits })),
          );
          expect(sum(overview.days.map((day) => day.pageViews))).toBe(
            sum(pages.items.map((item) => item.count)),
          );
          expect(sum(overview.days.map((day) => day.events))).toBe(
            sum(events.items.map((item) => item.count)),
          );
        });

        it('count the same writes and write errors on Overview and Requests', async () => {
          const { overview, requests } = await screensOf(project.id, range);
          const { current, daily } = overview.kpis.writeErrors;

          expect(sum(requests.routes.map((route) => route.total))).toBe(current.total);
          expect(sum(requests.routes.map((route) => route.failed))).toBe(current.failed);
          expect(sum(daily.map((day) => day.failed))).toBe(current.failed);
          for (const route of requests.routes) {
            expect(sum(route.statuses.map((status) => status.count))).toBe(route.total);
            expect(sum(route.screens.map((screen) => screen.failed))).toBe(route.failed);
          }
        });

        it('start the example funnel at the visits Features gives its first page', async () => {
          const { pages, events } = await screensOf(project.id, range);
          const funnel = await new MockFunnelService().funnel(
            project.id,
            range,
            'visit',
            project.exampleFunnel,
          );
          const visitsOf = (target: string) =>
            [...pages.items, ...events.items].find((item) => item.name === target)?.visits ?? 0;

          project.exampleFunnel.forEach((step, index) => {
            const reach = visitsOf(step.type === 'page' ? step.path : step.name);
            const count = funnel.steps[index]?.count;
            expect(count).toBe(index === 0 ? reach : Math.min(count ?? 0, reach));
            expect(count).toBeLessThanOrEqual(funnel.steps[index - 1]?.count ?? reach);
          });
        });
      });
    }
  }

  it('show the latest failures of the store only from visits the demo can open', async () => {
    const range = periodEnding(DEMO_STORE.timezone, PERIOD_DAYS['30d']);
    const requests = await new MockRequestsService().requests(DEMO_STORE.id, range, null);
    const visitIds = new Set(DEMO_STORE.visits.map((visit) => visit.sessionId));

    for (const failure of requests.routes.flatMap((route) => route.recentFailures)) {
      expect(visitIds.has(failure.sessionId)).toBe(true);
    }
  });
});
