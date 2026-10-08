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
  period: {
    presets: {
      today: 'today',
      '7d': 'last 7 days',
      '30d': 'last 30 days',
    },
    rangeProblems: {
      notADate: 'one of its dates is not a calendar date',
      inverted: 'it ends before it starts',
      future: 'it ends after today',
      tooLong: 'it is longer than {days} days',
    },
    rejectedRange: 'That range was not used: {problem}. Showing the last {days} days instead.',
  },
  glossary: {
    visit:
      'A visit is one browser tab, from its first event to its last; two tabs are never linked.',
    identifiedUser:
      'An identified user is a distinct user id the site passed to identify(), usually when someone signs in; a visit without one is anonymous.',
    conversion:
      "A conversion is a visit that sent the project's conversion event at least once; the conversion events count every time it was sent.",
    write: 'A write is a POST, PUT, PATCH or DELETE sent with trackRequest().',
    failure: 'A failure is a status of 400 or above, or no response at all.',
    changeTone:
      'A change is green or red only when the previous period counted at least {base} and it moved by {change} or more ({points} points for the write error rate).',
  },
  metrics: {
    noChange: 'no change',
  },
  overview: {
    kpis: {
      visits: 'Visits',
      identifiedUsers: 'Identified users',
      conversions: 'Conversions',
      writeErrorRate: 'Write error rate',
    },
    notes: {
      identifiedUsers: 'signed in at least once',
      writeErrors: '{failed} of {writes} failed',
      shareOfVisits: '{share} of {visits}',
      conversionEvents: '{event} · {share}',
      convertingVisits: '{share} sent {event} · {events}',
    },
    drillDowns: {
      visits: 'See the visits',
      identifiedVisits: 'See identified visits',
      convertingVisits: 'See converting visits',
      failingRoutes: 'See failing routes',
    },
    spoken: {
      change: 'change',
      better: 'better',
      worse: 'worse',
    },
    comparison: {
      dayBefore: 'vs. the day before',
      previousDays: 'vs. previous {days} days',
      soFarToday: 'so far today vs. all of yesterday',
      previousFullDays: 'vs. previous {days} full days',
      yesterdayUntil: 'vs. yesterday until {time}',
      previousDaysUntil: 'vs. previous {days} days, until {time}',
    },
  },
  overviewChart: {
    activityTitle: 'Activity per day',
    activitySubject: 'Page views and named events',
    pageViews: 'Page views',
    namedEvents: 'Named events',
    metricTitle: '{metric} per day',
    gaps: {
      noValue: 'no value',
      noWrites: 'no writes',
    },
    statistics: {
      noneOnAnyDay: '{gap} on any day',
      total: '{total} in total',
      range: 'between {lowest} and {highest} a day',
      gapDays: '{gap} on {days}',
    },
    summary: {
      lineChart: 'Line chart of {days}.',
      series: '{series}: {statistics}.',
      previous: 'Dashed, the previous period.',
    },
    caption: '{subject} per day, {period}',
    captionWithPrevious: '{caption}, with the previous period',
    columns: {
      comparedWith: 'Compared with',
      previous: '{series} then',
    },
    point: '{series}, {day}',
  },
  exports: {
    overview: {
      daily: 'Activity per day',
      pages: 'Top pages',
      events: 'Top events',
    },
  },
} as const;
