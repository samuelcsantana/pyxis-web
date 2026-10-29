import { type DevicesReport, type DevicesWire, OTHER_VALUE } from '@/domain/devices';
import { devicesResponseSchema } from '@/domain/devices.schema';
import { itemAt } from '../demo/demo-random';
import { demoProjectOf } from '../demo/demo-projects';
import type { DemoVisitRecord } from '../demo/demo-records';
import { demoContinentOf } from '../demo/demo-regions';
import {
  byKeys,
  countWhere,
  demoScopeOf,
  demoVisitsIn,
  groupedBy,
  hasPageView,
  type DemoReportRange,
} from '../demo/demo-scope';

export const TOP_DEVICE_VALUES = 5;
export const TOP_REGIONS = 10;
export const TOP_CITIES = 20;

type ShareWire = DevicesWire['device_types'][number];
type RegionShareWire = DevicesWire['regions'][number];
type CityShareWire = DevicesWire['cities'][number];
type ReachWire = DevicesWire['reach'];
type PlacedVisit = DemoVisitRecord & { readonly region: string; readonly city: string };

const PLACE_KEY_SEPARATOR = '|';

interface ValueCount {
  readonly value: string;
  readonly visits: number;
  readonly conversions: number;
  readonly convertingVisits: number;
}

function counted(
  value: string,
  visits: readonly DemoVisitRecord[],
  conversionEvent: string | null,
): ValueCount {
  const converts = (visit: DemoVisitRecord) =>
    countWhere(visit.events, (event) => event.name === conversionEvent);
  return {
    value,
    visits: countWhere(visits, hasPageView),
    conversions: visits.reduce((total, visit) => total + converts(visit), 0),
    convertingVisits: countWhere(visits, (visit) => converts(visit) > 0),
  };
}

function summed(value: string, counts: readonly ValueCount[]): ValueCount {
  return counts.reduce(
    (total, count) => ({
      value,
      visits: total.visits + count.visits,
      conversions: total.conversions + count.conversions,
      convertingVisits: total.convertingVisits + count.convertingVisits,
    }),
    { value, visits: 0, conversions: 0, convertingVisits: 0 },
  );
}

function shares(
  visits: readonly DemoVisitRecord[],
  valueOf: (visit: DemoVisitRecord) => string,
  conversionEvent: string | null,
): ShareWire[] {
  const ranked = [...groupedBy(visits, valueOf)]
    .map(([value, group]) => counted(value, group, conversionEvent))
    .toSorted(byKeys((count) => [-count.visits, count.value]));
  const rest = ranked.slice(TOP_DEVICE_VALUES);
  const shown =
    rest.length === 0 ? ranked : [...ranked.slice(0, TOP_DEVICE_VALUES), summed(OTHER_VALUE, rest)];
  const counts = conversionEvent !== null;
  return shown.map((share) => ({
    value: share.value,
    visits: share.visits,
    conversions: counts ? share.conversions : null,
    converting_visits: counts ? share.convertingVisits : null,
  }));
}

function regionShare(
  value: string | null,
  name: string | null,
  count: ValueCount,
  countsConversions: boolean,
): RegionShareWire {
  return {
    value,
    name,
    visits: count.visits,
    conversions: countsConversions ? count.conversions : null,
    converting_visits: countsConversions ? count.convertingVisits : null,
  };
}

function regionShares(
  visits: readonly DemoVisitRecord[],
  conversionEvent: string | null,
): RegionShareWire[] {
  const countsConversions = conversionEvent !== null;
  const located = visits.filter((visit) => visit.region !== null);
  const ranked = [...groupedBy(located, (visit) => String(visit.region))]
    .map(([region, group]) => ({
      name: itemAt(group, 0).regionName,
      count: counted(region, group, conversionEvent),
    }))
    .toSorted(byKeys(({ count }) => [-count.visits, count.value]));
  const rest = ranked.slice(TOP_REGIONS).map(({ count }) => count);
  const unlocated = visits.filter((visit) => visit.region === null);
  return [
    ...ranked
      .slice(0, TOP_REGIONS)
      .map(({ name, count }) => regionShare(count.value, name, count, countsConversions)),
    ...(rest.length === 0
      ? []
      : [regionShare(OTHER_VALUE, null, summed(OTHER_VALUE, rest), countsConversions)]),
    ...(unlocated.length === 0
      ? []
      : [
          regionShare(
            null,
            null,
            counted(OTHER_VALUE, unlocated, conversionEvent),
            countsConversions,
          ),
        ]),
  ];
}

interface CityPlace {
  readonly value: string | null;
  readonly region: string | null;
  readonly regionName: string | null;
}

const NO_CITY_PLACE: CityPlace = { value: null, region: null, regionName: null };

function cityShare(place: CityPlace, count: ValueCount, countsConversions: boolean): CityShareWire {
  return {
    value: place.value,
    region: place.region,
    region_name: place.regionName,
    visits: count.visits,
    conversions: countsConversions ? count.conversions : null,
    converting_visits: countsConversions ? count.convertingVisits : null,
  };
}

function isPlaced(visit: DemoVisitRecord): visit is PlacedVisit {
  return visit.city !== null && visit.region !== null;
}

function placeKey(visit: PlacedVisit): string {
  return `${visit.region}${PLACE_KEY_SEPARATOR}${visit.city}`;
}

function cityShares(
  visits: readonly DemoVisitRecord[],
  conversionEvent: string | null,
): CityShareWire[] {
  const countsConversions = conversionEvent !== null;
  const ranked = [...groupedBy(visits.filter(isPlaced), placeKey)]
    .map(([key, group]) => {
      const first = itemAt(group, 0);
      return { first, count: counted(key, group, conversionEvent) };
    })
    .toSorted(byKeys(({ first, count }) => [-count.visits, first.city, first.region]));
  const rest = ranked.slice(TOP_CITIES).map(({ count }) => count);
  const unplaced = visits.filter((visit) => !isPlaced(visit));
  return [
    ...ranked
      .slice(0, TOP_CITIES)
      .map(({ first, count }) =>
        cityShare(
          { value: first.city, region: first.region, regionName: first.regionName },
          count,
          countsConversions,
        ),
      ),
    ...(rest.length === 0
      ? []
      : [
          cityShare(
            { ...NO_CITY_PLACE, value: OTHER_VALUE },
            summed(OTHER_VALUE, rest),
            countsConversions,
          ),
        ]),
    ...(unplaced.length === 0
      ? []
      : [
          cityShare(
            NO_CITY_PLACE,
            counted(OTHER_VALUE, unplaced, conversionEvent),
            countsConversions,
          ),
        ]),
  ];
}

function distinct(values: readonly (string | null)[]): number {
  return new Set(values.filter((value) => value !== null)).size;
}

function leading<Visit extends DemoVisitRecord>(
  visits: readonly Visit[],
  valueOf: (visit: Visit) => string,
): { readonly first: Visit; readonly count: ValueCount } | undefined {
  return [...groupedBy(visits, valueOf)]
    .map(([value, group]) => ({ first: itemAt(group, 0), count: counted(value, group, null) }))
    .toSorted(byKeys(({ count }) => [-count.visits, count.value]))[0];
}

function reachOf(visits: readonly DemoVisitRecord[]): ReachWire {
  const countries = visits.map((visit) => visit.country);
  const regioned = visits.filter(
    (visit): visit is DemoVisitRecord & { readonly region: string } => visit.region !== null,
  );
  const topCountry = leading(visits, (visit) => visit.country);
  const topRegion = leading(regioned, (visit) => visit.region);
  return {
    visits: countWhere(visits, hasPageView),
    continents: distinct(countries.map(demoContinentOf)),
    countries: distinct(countries),
    regions: distinct(regioned.map((visit) => visit.region)),
    cities: distinct(visits.filter(isPlaced).map(placeKey)),
    top_country:
      topCountry === undefined
        ? null
        : { value: topCountry.count.value, visits: topCountry.count.visits },
    top_region:
      topRegion === undefined
        ? null
        : {
            value: topRegion.count.value,
            name: topRegion.first.regionName,
            visits: topRegion.count.visits,
          },
  };
}

export function demoDevicesWire(projectId: string, range: DemoReportRange, now: Date): DevicesWire {
  const project = demoProjectOf(projectId);
  const visits = demoVisitsIn(project, demoScopeOf(range, now, range.filters));
  const of = (valueOf: (visit: DemoVisitRecord) => string) =>
    shares(visits, valueOf, project.conversionEvent);
  return {
    device_types: of((visit) => visit.deviceType),
    browsers: of((visit) => visit.browser),
    operating_systems: of((visit) => visit.os),
    countries: of((visit) => visit.country),
    regions: regionShares(visits, project.conversionEvent),
    cities: cityShares(visits, project.conversionEvent),
    reach: reachOf(visits),
  };
}

export function demoDevicesReport(
  projectId: string,
  range: DemoReportRange,
  now: Date,
): DevicesReport {
  return devicesResponseSchema.parse(demoDevicesWire(projectId, range, now));
}
