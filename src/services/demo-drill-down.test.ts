import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { addDays, todayIn } from '@/domain/period';
import { propertyFilterOf } from '@/domain/visit-property';
import {
  countryFilterOf,
  deviceFilterOf,
  NO_VISIT_FILTERS,
  type VisitFilters,
} from '@/domain/visits';
import { MockAcquisitionService } from './acquisition/mock-acquisition-service';
import type { DateRange } from './date-range';
import { DEMO_PROJECTS } from './demo/demo-projects';
import { MockDevicesService } from './devices/mock-devices-service';
import { MockFeaturesService } from './features/mock-features-service';
import { MockOverviewService } from './overview/mock-overview-service';
import { MockRequestsService } from './requests/mock-requests-service';
import { MockVisitsService } from './visits/mock-visits-service';

const NOW = new Date('2026-10-06T02:30:00.000Z');
const DEFAULT_PERIOD_DAYS = 30;

function defaultPeriod(timeZone: string): DateRange {
  const today = todayIn(timeZone, NOW);
  return { from: addDays(today, 1 - DEFAULT_PERIOD_DAYS), to: today };
}

describe('the demo visits behind every link into Visits', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  for (const project of DEMO_PROJECTS) {
    describe(`of ${project.name}, in the default period`, () => {
      const range = defaultPeriod(project.timezone);
      const visitsFound = async (filters: Partial<VisitFilters>) => {
        const report = await new MockVisitsService().visits(
          project.id,
          range,
          { ...NO_VISIT_FILTERS, ...filters },
          null,
        );
        return report.visits.length;
      };

      it('include a visit for every page and event the Overview ranks', async () => {
        const overview = await new MockOverviewService().overview(project.id, range);

        for (const page of overview.topPages) {
          expect(await visitsFound({ paths: [page.path] }), page.path).toBeGreaterThan(0);
        }
        for (const event of overview.topEvents) {
          expect(await visitsFound({ event: event.name }), event.name).toBeGreaterThan(0);
        }
      });

      it('include a visit for every screen and event Features lists', async () => {
        const features = new MockFeaturesService();
        const [events, screens] = await Promise.all([
          features.features(project.id, range, 'events'),
          features.features(project.id, range, 'screens'),
        ]);

        for (const screen of screens.items) {
          expect(await visitsFound({ paths: [screen.name] }), screen.name).toBeGreaterThan(0);
        }
        for (const event of events.items) {
          expect(await visitsFound({ event: event.name }), event.name).toBeGreaterThan(0);
        }
      });

      it('include a visit for every property value Features shows', async () => {
        const features = new MockFeaturesService();
        const events = await features.features(project.id, range, 'events');

        for (const event of events.items) {
          const breakdown = await features.properties(project.id, range, event.name);
          for (const key of breakdown.keys) {
            for (const { value } of key.values) {
              const property = propertyFilterOf(key.key, value);
              const shown = `${event.name} ${key.key}=${value}`;
              expect(property, shown).not.toBeNull();
              expect(await visitsFound({ event: event.name, property }), shown).toBeGreaterThan(0);
            }
          }
        }
      });

      it('include a visit for every device type Devices lists', async () => {
        const devices = await new MockDevicesService().devices(project.id, range);

        for (const share of devices.deviceTypes) {
          const device = deviceFilterOf(share.value);
          expect(device, share.value).not.toBeNull();
          expect(await visitsFound({ device }), share.value).toBeGreaterThan(0);
        }
      });

      it('include a visit for the channel of every source Acquisition lists', async () => {
        const acquisition = await new MockAcquisitionService().acquisition(project.id, range);

        for (const source of acquisition.sources) {
          expect(await visitsFound({ channel: source.channel }), source.source).toBeGreaterThan(0);
        }
      });

      it('include a visit for every source Acquisition lists', async () => {
        const acquisition = await new MockAcquisitionService().acquisition(project.id, range);

        for (const { source } of acquisition.sources) {
          expect(await visitsFound({ source }), source).toBeGreaterThan(0);
        }
      });

      it('include a visit for every country Devices lists by its code', async () => {
        const devices = await new MockDevicesService().devices(project.id, range);

        for (const share of devices.countries) {
          const country = countryFilterOf(share.value);
          if (country !== null) {
            expect(await visitsFound({ country }), country).toBeGreaterThan(0);
          }
        }
      });

      it('include a visit for every route that failed in Requests', async () => {
        const requests = await new MockRequestsService().requests(project.id, range, null);

        for (const route of requests.routes.filter((row) => row.failed > 0)) {
          const shown = `${route.method} ${route.route}`;
          expect(await visitsFound({ route: shown, failed: true }), shown).toBeGreaterThan(0);
        }
      });

      it('include identified visits exactly when the Overview counts identified users', async () => {
        const overview = await new MockOverviewService().overview(project.id, range);

        expect((await visitsFound({ identity: 'identified' })) > 0).toBe(
          overview.kpis.identifiedUsers.current > 0,
        );
      });
    });
  }

  it('include a converting visit for every project with a conversion event', async () => {
    for (const project of DEMO_PROJECTS.filter((candidate) => candidate.conversionEvent !== null)) {
      const report = await new MockVisitsService().visits(
        project.id,
        defaultPeriod(project.timezone),
        { ...NO_VISIT_FILTERS, event: project.conversionEvent },
        null,
      );
      expect(report.visits.length, project.name).toBeGreaterThan(0);
    }
  });
});
