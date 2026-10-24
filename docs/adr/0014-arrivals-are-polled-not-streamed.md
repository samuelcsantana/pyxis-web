# 14. Arrivals are polled, not streamed, and counted on the device

Date: 2026-10-24

## Status

Accepted.

## Context

A screen shows what was read when it was opened. Data keeps arriving while the dashboard is open:
visits, conversions, events, failed requests. Someone looking at Overview has no way to know that
Funnel got a conversion a minute ago without opening it.

The API answers, per project and period, the reception times of what arrived since a moment
(`GET /v1/projects/{id}/arrivals`, newest first, at most 100 per kind, plus the visits active in
the last five minutes). Four screens count the same kind (Overview, Visits, Devices and
Acquisition all count visits), and each screen was opened at a different moment.

## Decision

- **Polling.** A watcher asks the dashboard's own route, `GET /[projectId]/arrivals`, which reads
  the API with the session on the server. It asks at once, then every 30 seconds, only while the
  tab is visible; at once again when the tab shows or the screen or period changes, never closer
  than five seconds; after 30 minutes without a pointer, key, touch or scroll it stops, and asks at
  once on the next one. A refusal or a failure doubles the wait up to five minutes and is logged; a
  lost session stops it. It asks only while the selected period includes today.
- **Not a stream.** Server-sent events or a WebSocket were set aside: the API runs as a function
  whose response is sent whole at the end and is cut after 30 seconds, an open connection would
  hold one of the instances that also receive the sites' events, the database does not push
  changes so the API would poll it anyway, and the browser cannot open an `EventSource` on the
  API without exposing the session. For a count that changes from minute to minute, none of that
  pays.
- **Marks on the device.** Each screen's mark is the moment it was last read, kept per project in
  `localStorage`; it never moves back (a screen shown again from the client cache changes nothing),
  starts over after seven days, follows other tabs through the `storage` event, lives in memory
  when storage is blocked, and is forgotten when the admin signs out. A screen without a mark takes
  the moment of the first answer, so the first visit on a device shows no count.
- **Counting in the dashboard.** The API returns times, not counts per screen: each screen counts
  the times of its kind newer than its own mark, so the API knows nothing of the screens, and
  opening Visits does not clear Acquisition. A count of 100 or more shows `99+`.
- **Loaded on demand.** The watcher, the marks and the counting are loaded after the page is shown.
  What every screen loads is only what draws the counts and the phone's dot, the note each page
  takes of its read moment, and the loader. Nothing of it is drawn on the server. The loader
  imports the watcher's module in an effect and renders it once it is there, in a transition,
  with no `Suspense` boundary: a lazy component suspending in the layout while the page was still
  hydrating made React lose a choice made in a form before hydration (the Timeline's "Look up"
  select went back to its server value), which a plain import does not.

## Consequences

- An open, visible tab asks twice a minute. The API keeps the database awake while someone looks
  at the dashboard; the idle stop keeps a forgotten tab from doing so.
- The read moment is the dashboard server's clock and the reception time is the API's, so an item
  that arrives while a screen is being read can be counted once more: counting it twice is
  preferred to missing it.
- A project without a conversion event has no count on Funnel; Timeline has none.
- The always-loaded part costs about 0.8 KiB on the first load of each screen.
