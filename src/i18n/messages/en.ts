import { APP_DESCRIPTION } from '@/lib/site';

export const en = {
  meta: {
    description: APP_DESCRIPTION,
  },
  units: {
    points: '{points} pt',
  },
  counts: {
    visit: { one: '{count} visit', other: '{count} visits' },
    person: { one: '{count} person', other: '{count} people' },
    day: { one: '{count} day', other: '{count} days' },
    page: { one: '{count} page', other: '{count} pages' },
    event: { one: '{count} event', other: '{count} events' },
    item: { one: '{count} item', other: '{count} items' },
    write: { one: '{count} write', other: '{count} writes' },
    request: { one: '{count} request', other: '{count} requests' },
    failure: { one: '{count} failure', other: '{count} failures' },
    failedRead: { one: '{count} failed read', other: '{count} failed reads' },
    failedRequest: { one: '{count} failed request', other: '{count} failed requests' },
    clientError: { one: '{count} client error (4xx)', other: '{count} client errors (4xx)' },
    serverError: { one: '{count} server error (5xx)', other: '{count} server errors (5xx)' },
    conversionEvent: { one: '{count} conversion event', other: '{count} conversion events' },
  },
} as const;
