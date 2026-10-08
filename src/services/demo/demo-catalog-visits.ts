import { CHANNELS } from '@/domain/acquisition';
import { OTHER_VALUE } from '@/domain/devices';
import type { DemoEvent, DemoProject } from './demo-catalog';
import type { DemoNamedEvent, DemoVisit } from './demo-visits';

export type DemoVisitCatalog = Omit<DemoProject, 'visits'>;

interface VisitPlan {
  readonly page: string;
  readonly event: Omit<DemoNamedEvent, 'second' | 'path'> | null;
}

interface DeviceSoftware {
  readonly browser: string;
  readonly os: string;
}

const PAGE_VIEW = 'page_view';
const FIRST_DAY_AGO = 15;
const DAYS_SPANNED = 13;
const FIRST_HOUR = 6;
const HOURS_SPANNED = 4;
const MINUTE_STEP = 7;
const MINUTES_PER_HOUR = 60;
const PAGE_VIEW_SECOND = 3;
const EVENT_SECOND = 41;
const FALLBACK_DEVICE_TYPE = 'desktop';
const FALLBACK_CHANNEL = 'direct';
const FALLBACK_COUNTRY = 'BR';
const DESKTOP_SOFTWARE: DeviceSoftware = { browser: 'chrome', os: 'windows' };
const DEVICE_SOFTWARE: Readonly<Record<string, DeviceSoftware>> = {
  mobile: { browser: 'chrome', os: 'android' },
  tablet: { browser: 'safari', os: 'ios' },
};

const HASH_INCREMENT = 0x6d2b79f5;
const HASH_SHIFTS = [15, 7, 14] as const;
const HASH_ODD_BIT = 1;
const HASH_MIX = 61;
const HEX = 16;
const HEX_WORD_LENGTH = 8;
const HASH_WORDS_PER_ID = 4;
const UUID_GROUPS = [
  { from: 0, to: 8, prefix: '' },
  { from: 8, to: 12, prefix: '' },
  { from: 13, to: 16, prefix: '4' },
  { from: 17, to: 20, prefix: '8' },
  { from: 20, to: 32, prefix: '' },
] as const;

export function pick<Item>(items: readonly Item[], index: number, fallback: Item): Item {
  return items[index % items.length] ?? fallback;
}

function hashWord(seed: number): string {
  const [first, second, third] = HASH_SHIFTS;
  let value = (seed + HASH_INCREMENT) | 0;
  value = Math.imul(value ^ (value >>> first), value | HASH_ODD_BIT);
  value ^= value + Math.imul(value ^ (value >>> second), value | HASH_MIX);
  return ((value ^ (value >>> third)) >>> 0).toString(HEX).padStart(HEX_WORD_LENGTH, '0');
}

export function demoSessionId(seed: number): string {
  const hex = Array.from({ length: HASH_WORDS_PER_ID }, (_, word) =>
    hashWord(seed * HASH_WORDS_PER_ID + word),
  ).join('');
  return UUID_GROUPS.map(({ from, to, prefix }) => `${prefix}${hex.slice(from, to)}`).join('-');
}

function eventPlans(event: DemoEvent): readonly VisitPlan[] {
  const combinations = Math.max(1, ...event.properties.map((property) => property.values.length));
  return Array.from({ length: combinations }, (_, combination) => ({
    page: event.page,
    event: {
      name: event.name,
      properties: Object.fromEntries(
        event.properties.flatMap((property) =>
          property.values
            .filter((_value, index) => index === combination % property.values.length)
            .map(([value]) => [property.key, value] as const),
        ),
      ),
    },
  }));
}

function visitPlans(catalog: DemoVisitCatalog): readonly VisitPlan[] {
  const withEvents = catalog.events.flatMap(eventPlans);
  const reached = new Set(withEvents.map((plan) => plan.page));
  const pageOnly = catalog.pages
    .filter((page) => !reached.has(page.path))
    .map((page) => ({ page: page.path, event: null }));
  return [...withEvents, ...pageOnly];
}

function visitEvents(plan: VisitPlan): DemoVisit['events'] {
  const pageView = { second: PAGE_VIEW_SECOND, name: PAGE_VIEW, path: plan.page };
  return plan.event === null
    ? [pageView]
    : [pageView, { ...plan.event, second: EVENT_SECOND, path: plan.page }];
}

export function demoCatalogVisits(catalog: DemoVisitCatalog, seed: number): readonly DemoVisit[] {
  const deviceTypes = catalog.deviceTypes.map((share) => share.value);
  const channels = CHANNELS.filter((channel) => catalog.channels[channel] > 0);
  const countries = catalog.countries
    .map((share) => share.value)
    .filter((country) => country !== OTHER_VALUE);
  return visitPlans(catalog).map((plan, index) => {
    const deviceType = pick(deviceTypes, index, FALLBACK_DEVICE_TYPE);
    const software = DEVICE_SOFTWARE[deviceType] ?? DESKTOP_SOFTWARE;
    return {
      sessionId: demoSessionId(seed + index),
      daysAgo: FIRST_DAY_AGO + (index % DAYS_SPANNED),
      startHour: FIRST_HOUR + (index % HOURS_SPANNED),
      startMinute: (index * MINUTE_STEP) % MINUTES_PER_HOUR,
      deviceType,
      ...software,
      country: pick(countries, index, FALLBACK_COUNTRY),
      channel: pick(channels, index, FALLBACK_CHANNEL),
      events: visitEvents(plan),
    };
  });
}
