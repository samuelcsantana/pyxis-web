# 13. A visited screen comes back from the client cache, and is read again quietly

Date: 2026-10-23

## Status

Accepted.

## Context

Every screen of the dashboard is a dynamic page: its numbers are read from the API for each
request. Next 16 keeps a dynamic page in the browser's client cache for 0 seconds by default
(`staleTimes.dynamic`), so going back to a screen visited a moment ago fetched it again and showed
its loading skeleton in the meantime, even when nothing had arrived since.

Two things follow from caching instead: a screen that comes back from the cache shows what was read
then, and a change made in Settings (the project's name, time zone or conversion event) must not
leave an old copy of the screens behind.

## Decision

- `experimental.staleTimes.dynamic` is 300 seconds (`VISITED_SCREEN_CACHE_SECONDS`): a screen visited
  in the last five minutes comes back at once, with no skeleton.
- Each screen page passes the moment it was read to `RefreshWhenStale`. When a screen is shown
  more than 20 seconds (`STALE_AFTER_MS`) after the server read it, it calls `router.refresh()` in a
  transition: the screen stays on view while it is read again, and its numbers change in place.
  The age is measured on the server's clock: the first screen shown in a page is always a fresh
  read, so its read moment against the device's clock gives the difference between the two clocks,
  and every later age uses it. A device whose clock is wrong therefore neither refreshes every
  screen (which, a refresh being a new read, would never stop) nor never refreshes one, and a screen
  fetched ahead of a click (prefetched) is aged from its read, not from when it was first shown.
- `updateProject` and `deleteProject` call `revalidatePath('/[projectId]', 'layout')` when the API
  saved the change. In a Server Action that drops the whole client cache, so every screen is read
  again on the next visit; `router.refresh()`, which their forms already call, drops only the
  current route. Choosing a language sets a cookie in a Server Action, which already drops the
  client cache.
- An end-to-end test goes from Overview to Funnel and back and fails if the content shows the
  skeleton on the way back. It fails with the cache off, so a version of Next that changes this
  experimental option turns it red.

## Consequences

- Going back to a screen within five minutes is instant; past 20 seconds it costs one read, as
  every navigation did before, without the skeleton. After five minutes a screen loads as before.
- `router.refresh()` reads the layout again too (the account notices and the project list).
- The option is experimental: a Next upgrade is checked by that test, not trusted.
- First-load JavaScript of the Overview went from 166.0 to 166.8 KiB (budget 167).
