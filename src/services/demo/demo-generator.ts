import { CHANNELS, type Channel } from '@/domain/acquisition';
import { OTHER_VALUE } from '@/domain/devices';
import type {
  DemoEvent,
  DemoFailedRead,
  DemoPage,
  DemoProject,
  DemoRoute,
  DemoShare,
  DemoSource,
  DemoStatusShare,
} from './demo-catalog';
import {
  API_REQUEST,
  type DemoEventRecord,
  type DemoProperties,
  type DemoVisitRecord,
  localMidnight,
  PAGE_VIEW,
  requestProperties,
} from './demo-records';
import {
  between,
  itemAt,
  type Random,
  seededRandom,
  shuffled,
  standardNormal,
  weightedIndex,
  weightedPick,
  weightedSample,
} from './demo-random';
import { apportion, demoCount, textSalt } from './demo-series';
import type { DemoRequest } from './demo-visits';

type Screens = DemoRoute['screens'];
type Software = readonly [browser: string, os: string];

interface VisitProfile {
  readonly deviceType: string;
  readonly browser: string;
  readonly os: string;
  readonly country: string;
  readonly channel: Channel;
  readonly source: string;
  readonly medium: string | null;
  readonly campaign: string | null;
  readonly fromAdClick: boolean;
}

interface PlannedVisit {
  readonly profile: VisitProfile;
  readonly conversionWeight: number;
  readonly views: readonly TimedView[];
}

interface TimedView {
  readonly page: DemoPage;
  readonly second: number;
}

interface PlannedEvent {
  readonly second: number;
  readonly name: string;
  readonly path: string;
  readonly properties: DemoProperties;
  readonly request: DemoRequest | null;
}

interface ScreenPlace {
  readonly index: number;
  readonly path: string;
  readonly second: number;
}

const EMPTY_VISIT_WEIGHT = 4;
const JOURNEY_AFFINITY = 6;
const FOLLOW_UP_AFFINITY = 6;
const FIRST_VIEW_SECOND = 2;
const SHORTEST_VIEW_GAP = 40;
const LONGEST_VIEW_GAP = 210;
const SHORTEST_EVENT_DELAY = 5;
const LONGEST_EVENT_DELAY = 35;
const REPEATED_EVENT_STEP = 7;
const SHORTEST_FOLLOW_UP_DELAY = 3;
const LONGEST_FOLLOW_UP_DELAY = 15;
const REQUEST_LEAD = 1;
const SHORTEST_REQUEST_DELAY = 3;
const LONGEST_REQUEST_DELAY = 38;
const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 3600;
const LAST_SECOND_OF_DAY = 86_399;
const MILLISECONDS_PER_SECOND = 1000;
const HOUR_WEIGHTS = [2, 1, 1, 1, 1, 2, 3, 4, 5, 6, 7, 7, 8, 7, 6, 6, 6, 7, 8, 9, 9, 8, 6, 4];
const P95_OVER_MEDIAN = 2.6;
const P95_STANDARD_SCORE = 1.645;
const DURATION_SPREAD = Math.log(P95_OVER_MEDIAN) / P95_STANDARD_SCORE;
const NO_RESPONSE_STATUS = 0;
const NO_RESPONSE_DURATION_FACTOR = 6;
const WHOLE_SHARE = 1;
const GET = 'GET';
const DIRECT_SOURCE: DemoSource = {
  source: '(direct)',
  medium: null,
  channel: 'direct',
  share: 1,
  conversionWeight: 1,
  adClickShare: 0,
  campaigns: [],
};
const OTHER_COUNTRIES = ['ES', 'MX', 'CL', 'DE', 'FR', 'IT', 'GB', 'CO'];
const DESKTOP_SOFTWARE: readonly Software[] = [
  ['chrome', 'windows'],
  ['edge', 'windows'],
  ['firefox', 'windows'],
  ['opera', 'windows'],
  ['safari', 'macos'],
  ['chrome', 'macos'],
  ['firefox', 'linux'],
  ['chrome', 'linux'],
  ['chrome', 'chromeos'],
];
const SOFTWARE_OF_DEVICE: Readonly<Record<string, readonly Software[]>> = {
  mobile: [
    ['chrome', 'android'],
    ['samsung', 'android'],
    ['firefox', 'android'],
    ['opera', 'android'],
    ['safari', 'ios'],
    ['chrome', 'ios'],
  ],
  tablet: [
    ['safari', 'ios'],
    ['chrome', 'android'],
    ['samsung', 'android'],
  ],
  desktop: DESKTOP_SOFTWARE,
};
const HEX = 16;
const UINT32_RANGE = 2 ** 32;
const WORD_LENGTH = 8;
const WORDS_PER_ID = 4;
const UUID_GROUPS = [
  { from: 0, to: 8, prefix: '' },
  { from: 8, to: 12, prefix: '' },
  { from: 13, to: 16, prefix: '4' },
  { from: 17, to: 20, prefix: '8' },
  { from: 20, to: 32, prefix: '' },
] as const;
const PERSON_ID_PREFIX = 'u_';
const PERSON_ID_DIGITS = 4;
const PERSON_ID_SPACE = HEX ** PERSON_ID_DIGITS;

function sum(values: readonly number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

function saltOf(project: DemoProject, ...parts: readonly (string | number)[]): number {
  return textSalt([project.id, ...parts].join(' '));
}

function spread<Item>(
  count: number,
  items: readonly Item[],
  weightOf: (item: Item) => number,
): readonly Item[] {
  return apportion(count, items, weightOf).flatMap(({ item, count: copies }) =>
    Array.from({ length: copies }, () => item),
  );
}

function roundedAtRandom(expected: number, random: Random): number {
  const whole = Math.floor(expected);
  return whole + (random() < expected - whole ? 1 : 0);
}

function sessionIdFrom(random: Random): string {
  const hex = Array.from({ length: WORDS_PER_ID }, () =>
    Math.floor(random() * UINT32_RANGE)
      .toString(HEX)
      .padStart(WORD_LENGTH, '0'),
  ).join('');
  return UUID_GROUPS.map(({ from, to, prefix }) => `${prefix}${hex.slice(from, to)}`).join('-');
}

export function demoShareOf(shares: readonly DemoShare[], value: string): number {
  return (
    shares.find((share) => share.value === value)?.share ??
    shares.find((share) => share.value === OTHER_VALUE)?.share ??
    0
  );
}

function softwareFor(project: DemoProject, deviceType: string, random: Random): Software {
  const choices = SOFTWARE_OF_DEVICE[deviceType] ?? DESKTOP_SOFTWARE;
  const weights = choices.map(
    ([browser, os]) =>
      demoShareOf(project.browsers, browser) * demoShareOf(project.operatingSystems, os),
  );
  return itemAt(choices, weightedIndex(weights, random));
}

function countryFor(share: DemoShare, random: Random): string {
  return share.value === OTHER_VALUE
    ? itemAt(OTHER_COUNTRIES, Math.floor(random() * OTHER_COUNTRIES.length))
    : share.value;
}

function sourceFor(project: DemoProject, channel: Channel, random: Random): DemoSource {
  const sources = project.sources.filter((source) => source.channel === channel);
  return weightedPick(sources, (source) => source.share, random) ?? DIRECT_SOURCE;
}

function campaignFor(source: DemoSource, random: Random): string | null {
  const tagged = sum(source.campaigns.map(([, share]) => share));
  const choices = [...source.campaigns, [null, Math.max(0, WHOLE_SHARE - tagged)] as const];
  return itemAt(
    choices,
    weightedIndex(
      choices.map(([, share]) => share),
      random,
    ),
  )[0];
}

interface Profiled {
  readonly profile: VisitProfile;
  readonly conversionWeight: number;
}

function profilesOf(project: DemoProject, count: number, random: Random): readonly Profiled[] {
  const devices = shuffled(
    spread(count, project.deviceTypes, (share) => share.share),
    random,
  );
  const countries = shuffled(
    spread(count, project.countries, (share) => share.share),
    random,
  );
  const channels = shuffled(
    spread(count, CHANNELS, (channel) => project.channels[channel]),
    random,
  );
  return devices.map((device, index) => {
    const channel = itemAt(channels, index);
    const source = sourceFor(project, channel, random);
    const [browser, os] = softwareFor(project, device.value, random);
    return {
      profile: {
        deviceType: device.value,
        browser,
        os,
        country: countryFor(itemAt(countries, index), random),
        channel,
        source: source.source,
        medium: source.medium,
        campaign: campaignFor(source, random),
        fromAdClick: random() < source.adClickShare,
      },
      conversionWeight: device.conversionWeight * source.conversionWeight,
    };
  });
}

function pageViewsOn(project: DemoProject, page: DemoPage, date: string): number {
  return demoCount(date, page.perDay, saltOf(project, 'page', page.path));
}

function pageWeight(pages: readonly DemoPage[], page: DemoPage): number {
  const emptiness = pages.length === 0 ? EMPTY_VISIT_WEIGHT : 1;
  const continues = pages.some((visited) => visited.stage === page.stage - 1);
  return emptiness * (continues ? 1 + JOURNEY_AFFINITY : 1);
}

function byStage(pages: readonly DemoPage[]): readonly DemoPage[] {
  return pages
    .map((page, order) => ({ page, order }))
    .toSorted((first, second) => first.page.stage - second.page.stage || first.order - second.order)
    .map(({ page }) => page);
}

function landingPage(project: DemoProject): DemoPage {
  return itemAt(
    project.pages.toSorted(
      (first, second) => first.stage - second.stage || second.visitsPerView - first.visitsPerView,
    ),
    0,
  );
}

function pagesOfVisits(
  project: DemoProject,
  date: string,
  count: number,
  random: Random,
): readonly (readonly DemoPage[])[] {
  const visited: DemoPage[][] = Array.from({ length: count }, () => []);
  const indexes = visited.map((_, index) => index);
  for (const page of byStage(project.pages)) {
    const views = pageViewsOn(project, page, date);
    const reach = Math.min(count, views, Math.max(1, Math.round(views * page.visitsPerView)));
    const chosen = weightedSample(
      indexes,
      reach,
      (index) => pageWeight(itemAt(visited, index), page),
      random,
    );
    const repeats = Array.from({ length: reach === 0 ? 0 : views - reach }, () =>
      itemAt(chosen, Math.floor(random() * chosen.length)),
    );
    for (const index of [...chosen, ...repeats]) {
      itemAt(visited, index).push(page);
    }
  }
  return visited.map((pages) => (pages.length === 0 ? [landingPage(project)] : byStage(pages)));
}

function startSecond(duration: number, random: Random): number {
  const hour = weightedIndex(HOUR_WEIGHTS, random);
  const second = hour * SECONDS_PER_HOUR + Math.floor(random() * SECONDS_PER_HOUR);
  return Math.min(second, LAST_SECOND_OF_DAY - duration);
}

function timedViews(pages: readonly DemoPage[], random: Random): readonly TimedView[] {
  const offsets = [FIRST_VIEW_SECOND];
  for (let index = 1; index < pages.length; index += 1) {
    offsets.push(itemAt(offsets, index - 1) + between(random, SHORTEST_VIEW_GAP, LONGEST_VIEW_GAP));
  }
  const start = startSecond(itemAt(offsets, offsets.length - 1) + LONGEST_VIEW_GAP, random);
  return pages.map((page, index) => ({ page, second: start + itemAt(offsets, index) }));
}

function propertyAssignments(
  event: DemoEvent,
  occurrences: number,
  random: Random,
): readonly DemoProperties[] {
  return Array.from({ length: occurrences }, () =>
    Object.fromEntries(
      event.properties.flatMap((property) => {
        if (random() >= property.carriedShare) {
          return [];
        }
        const weights = property.values.map(([, share]) => share);
        return [[property.key, itemAt(property.values, weightedIndex(weights, random))[0]]];
      }),
    ),
  );
}

function followUpOrder(events: readonly DemoEvent[]): readonly DemoEvent[] {
  return [
    ...events.filter((event) => event.after === undefined),
    ...events.filter((event) => event.after !== undefined),
  ];
}

function eventSecond(
  views: readonly TimedView[],
  done: readonly PlannedEvent[],
  event: DemoEvent,
  repeat: number,
  random: Random,
): number {
  const ofPage = views.filter((view) => view.page.path === event.page);
  const view = itemAt(ofPage, repeat % ofPage.length);
  const second =
    view.second +
    between(random, SHORTEST_EVENT_DELAY, LONGEST_EVENT_DELAY) +
    repeat * REPEATED_EVENT_STEP;
  const before = done.find((planned) => planned.name === event.after);
  return before === undefined
    ? second
    : Math.max(
        second,
        before.second + between(random, SHORTEST_FOLLOW_UP_DELAY, LONGEST_FOLLOW_UP_DELAY),
      );
}

function eventWeight(
  project: DemoProject,
  event: DemoEvent,
  visit: PlannedVisit,
  done: readonly PlannedEvent[],
): number {
  const followsUp = done.some((planned) => planned.name === event.after);
  const conversion = event.name === project.conversionEvent ? visit.conversionWeight : 1;
  return (followsUp ? 1 + FOLLOW_UP_AFFINITY : 1) * conversion;
}

function hasView(visit: PlannedVisit, path: string): boolean {
  return visit.views.some((view) => view.page.path === path);
}

function eventsOfVisits(
  project: DemoProject,
  date: string,
  visits: readonly PlannedVisit[],
  random: Random,
): readonly (readonly PlannedEvent[])[] {
  const planned: PlannedEvent[][] = visits.map(() => []);
  for (const event of followUpOrder(project.events)) {
    const occurrences = demoCount(date, event.perDay, saltOf(project, 'event', event.name));
    const candidates = visits.flatMap((visit, index) =>
      hasView(visit, event.page) ? [index] : [],
    );
    const reach = Math.min(
      candidates.length,
      occurrences,
      Math.max(1, Math.round(occurrences * event.visitsPerCount)),
    );
    const chosen = weightedSample(
      candidates,
      reach,
      (index) => eventWeight(project, event, itemAt(visits, index), itemAt(planned, index)),
      random,
    );
    const owners = [
      ...chosen,
      ...Array.from({ length: reach === 0 ? 0 : occurrences - reach }, () =>
        itemAt(chosen, Math.floor(random() * chosen.length)),
      ),
    ];
    const properties = propertyAssignments(event, owners.length, random);
    owners.forEach((index, occurrence) => {
      const done = itemAt(planned, index);
      const repeat = done.filter((other) => other.name === event.name).length;
      done.push({
        second: eventSecond(itemAt(visits, index).views, done, event, repeat, random),
        name: event.name,
        path: event.page,
        properties: itemAt(properties, occurrence),
        request: null,
      });
    });
  }
  return planned;
}

function durationOf(medianDurationMs: number, status: number, random: Random): number {
  const factor = status === NO_RESPONSE_STATUS ? NO_RESPONSE_DURATION_FACTOR : 1;
  return Math.max(
    1,
    Math.round(medianDurationMs * factor * Math.exp(DURATION_SPREAD * standardNormal(random))),
  );
}

function requestOf(
  method: string,
  route: string,
  [status, , errorCode]: DemoStatusShare,
  medianDurationMs: number,
  random: Random,
): DemoRequest {
  return {
    method,
    route,
    status,
    durationMs: durationOf(medianDurationMs, status, random),
    ...(errorCode === undefined ? {} : { errorCode }),
  };
}

function requestEvent(second: number, path: string, request: DemoRequest): PlannedEvent {
  return { second, name: API_REQUEST, path, properties: requestProperties(request), request };
}

function screenPlace(
  visits: readonly PlannedVisit[],
  screens: Screens,
  random: Random,
): ScreenPlace | undefined {
  const reachable = screens.filter(([path]) => visits.some((visit) => hasView(visit, path)));
  const screen = weightedPick(reachable, ([, share]) => share, random);
  if (screen === undefined) {
    return undefined;
  }
  const [path] = screen;
  const holders = visits.flatMap((visit, index) => (hasView(visit, path) ? [index] : []));
  const index = itemAt(holders, Math.floor(random() * holders.length));
  const view = itemAt(
    itemAt(visits, index).views.filter((candidate) => candidate.page.path === path),
    0,
  );
  return { index, path, second: view.second };
}

function placeOnScreen(
  requests: readonly PlannedEvent[][],
  visits: readonly PlannedVisit[],
  screens: Screens,
  makeRequest: () => DemoRequest,
  random: Random,
): void {
  const place = screenPlace(visits, screens, random);
  if (place === undefined) {
    return;
  }
  const delay = between(random, SHORTEST_REQUEST_DELAY, LONGEST_REQUEST_DELAY);
  itemAt(requests, place.index).push(requestEvent(place.second + delay, place.path, makeRequest()));
}

function pairedSuccesses(
  route: DemoRoute,
  events: readonly (readonly PlannedEvent[])[],
  random: Random,
): PlannedEvent[][] {
  const success: DemoStatusShare = [route.successStatus, WHOLE_SHARE];
  return events.map((planned) =>
    planned
      .filter((event) => event.name === route.event)
      .map((event) =>
        requestEvent(
          event.second - REQUEST_LEAD,
          event.path,
          requestOf(route.method, route.route, success, route.medianDurationMs, random),
        ),
      ),
  );
}

function writesOf(
  project: DemoProject,
  date: string,
  route: DemoRoute,
  visits: readonly PlannedVisit[],
  events: readonly (readonly PlannedEvent[])[],
  random: Random,
): readonly (readonly PlannedEvent[])[] {
  const paired = route.event !== undefined;
  const requests = paired ? pairedSuccesses(route, events, random) : visits.map(() => []);
  const make = (status: DemoStatusShare) => () =>
    requestOf(route.method, route.route, status, route.medianDurationMs, random);
  const successes = paired
    ? sum(requests.map((placed) => placed.length))
    : demoCount(date, route.perDay, saltOf(project, 'route', route.method, route.route));
  const unpaired = paired ? 0 : successes;
  for (let placed = 0; placed < unpaired; placed += 1) {
    placeOnScreen(
      requests,
      visits,
      route.screens,
      make([route.successStatus, WHOLE_SHARE]),
      random,
    );
  }
  for (const failure of route.failures) {
    const failures = roundedAtRandom(successes * failure[1], random);
    for (let placed = 0; placed < failures; placed += 1) {
      placeOnScreen(requests, visits, route.screens, make(failure), random);
    }
  }
  return requests;
}

function failedReadsOf(
  project: DemoProject,
  date: string,
  read: DemoFailedRead,
  visits: readonly PlannedVisit[],
  random: Random,
): readonly (readonly PlannedEvent[])[] {
  const requests: PlannedEvent[][] = visits.map(() => []);
  const failures = demoCount(date, read.perDay, saltOf(project, 'read', read.route));
  const weights = read.statuses.map(([, share]) => share);
  for (let placed = 0; placed < failures; placed += 1) {
    const status = itemAt(read.statuses, weightedIndex(weights, random));
    placeOnScreen(
      requests,
      visits,
      read.screens,
      () => requestOf(GET, read.route, status, read.medianDurationMs, random),
      random,
    );
  }
  return requests;
}

function requestsOfVisits(
  project: DemoProject,
  date: string,
  visits: readonly PlannedVisit[],
  events: readonly (readonly PlannedEvent[])[],
  random: Random,
): readonly (readonly PlannedEvent[])[] {
  const perSource = [
    ...project.routes.map((route) => writesOf(project, date, route, visits, events, random)),
    ...project.failedReads.map((read) => failedReadsOf(project, date, read, visits, random)),
  ];
  return visits.map((_, index) => perSource.flatMap((requests) => itemAt(requests, index)));
}

const peopleOfProject = new Map<string, readonly string[]>();

export function demoPeople(project: DemoProject): readonly string[] {
  const cached = peopleOfProject.get(project.id);
  if (cached !== undefined) {
    return cached;
  }
  const taken = new Set(project.showcase.flatMap((visit) => visit.userId ?? []));
  const people: string[] = [];
  for (let index = 0; people.length < project.people; index += 1) {
    const digits = (saltOf(project, 'person', index) % PERSON_ID_SPACE)
      .toString(HEX)
      .padStart(PERSON_ID_DIGITS, '0');
    const id = `${PERSON_ID_PREFIX}${digits}`;
    if (!taken.has(id)) {
      taken.add(id);
      people.push(id);
    }
  }
  peopleOfProject.set(project.id, people);
  return people;
}

function isSignedIn(
  project: DemoProject,
  views: readonly TimedView[],
  events: readonly PlannedEvent[],
): boolean {
  const { signedInStage } = project;
  const insideTheApp =
    signedInStage !== null && views.some((view) => view.page.stage >= signedInStage);
  return insideTheApp || events.some((event) => event.name === project.conversionEvent);
}

function personFor(project: DemoProject, random: Random): string | null {
  const people = demoPeople(project);
  return people[Math.floor(random() * random() * people.length)] ?? null;
}

function twoDigits(value: number): string {
  return String(value).padStart(2, '0');
}

export function clockOf(second: number): string {
  const hours = Math.floor(second / SECONDS_PER_HOUR);
  const minutes = Math.floor((second % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE);
  return `${twoDigits(hours)}:${twoDigits(minutes)}:${twoDigits(second % SECONDS_PER_MINUTE)}.000`;
}

function recordOf(
  visit: PlannedVisit,
  sessionId: string,
  userId: string | null,
  events: readonly PlannedEvent[],
  date: string,
  midnight: number,
): DemoVisitRecord {
  const pageViews = visit.views.map((view): PlannedEvent => ({
    second: view.second,
    name: PAGE_VIEW,
    path: view.page.path,
    properties: {},
    request: null,
  }));
  const ordered = [...pageViews, ...events].toSorted(
    (first, second) => first.second - second.second,
  );
  return {
    sessionId,
    userId,
    ...visit.profile,
    events: ordered.map((event): DemoEventRecord => ({
      at: midnight + event.second * MILLISECONDS_PER_SECOND,
      date,
      time: clockOf(event.second),
      name: event.name,
      path: event.path,
      properties: event.properties,
      request: event.request,
    })),
  };
}

export function demoGeneratedVisits(
  project: DemoProject,
  date: string,
): readonly DemoVisitRecord[] {
  const random = seededRandom(saltOf(project, 'day', date));
  const pageViews = sum(project.pages.map((page) => pageViewsOn(project, page, date)));
  const count = Math.round(pageViews * project.visitsPerPageView);
  const profiles = profilesOf(project, count, random);
  const visits = pagesOfVisits(project, date, count, random).map((pages, index): PlannedVisit => ({
    ...itemAt(profiles, index),
    views: timedViews(pages, random),
  }));
  const events = eventsOfVisits(project, date, visits, random);
  const requests = requestsOfVisits(project, date, visits, events, random);
  const midnight = localMidnight(project.timezone, date);
  return visits.map((visit, index) => {
    const planned = [...itemAt(events, index), ...itemAt(requests, index)];
    const userId = isSignedIn(project, visit.views, planned) ? personFor(project, random) : null;
    return recordOf(visit, sessionIdFrom(random), userId, planned, date, midnight);
  });
}
