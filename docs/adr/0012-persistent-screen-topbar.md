# 12. The top bar of the eight screens lives in their layout and stays mounted between them

Date: 2026-10-23

## Status

Accepted.

## Context

Each of the eight screens of the menu (Overview, Funnel, Features, Requests, Timeline, Visits,
Devices, Acquisition) drew its own `<header>` inside its `page.tsx`: title, subtitle, the period
in words and the period selector. Next keeps a layout mounted across a navigation and swaps the
page, so for React the headers of two screens were two different trees, even when their HTML was
almost the same. Each screen's `loading.tsx` also drew a header, with the right title but a
pulsing placeholder in place of the subtitle, the period and the selector. A change of screen
went: old header, placeholder header, new header. The middle step is what the owner saw as the
header "reloading".

A layout cannot simply render the header on the server: it receives no `searchParams` and does
not render again on a navigation. Only a Client Component that reads the URL sees the current
screen and period, which is what the sidebar already does.

## Decision

- The eight screens move into a route group, `src/app/[projectId]/(screens)/`, whose layout
  renders `ScreenTopbar`, a Client Component, above the page. URLs do not change. Moving between
  the eight screens keeps that layout, so the header is the same DOM element before and after a
  change of screen or of period; only its texts and the selector's state change. Settings,
  Install, the export page and an unknown route are outside the group and keep their own header.
- `ScreenTopbar` derives the screen from `usePathname()` with the exact shape
  `/<project>/<screen>` (a path below a screen is the not-found route and draws no screen header,
  so there is never a second `h1`). Titles come from the client dictionary; the subtitles and the
  four "range not used" notices are translated by the layout on the server and passed as
  strings, so no server dictionary is added to what every route ships.
- The period is resolved in the browser with the same pure function the pages use, from a record
  of the URL that keeps the semantics of Next's `searchParams` (a repeated name becomes a list,
  which the period rules ignore). The project's "today" is anchored on the server: the layout
  passes the server time, the browser keeps the offset to its own clock and computes the day in
  the project's time zone through `useSyncExternalStore`, whose server snapshot is the server's
  day. Hydration therefore agrees with the server HTML, a device whose clock is wrong still shows
  the server's period, and the day moves at local midnight on the next navigation.
- The period in words is the only text formatted in both places. Its `<span>` carries
  `suppressHydrationWarning`, the use the React documentation gives for text that depends on the
  locale data of the runtime: if a browser's ICU formats a date differently from Node's, React
  keeps the server text until the period really changes, instead of throwing the server HTML away
  and rendering the whole layout again. It is the only such attribute besides the one on
  `<html>`.
- The selector carries a screen's filters to another period by name, with the non-empty value
  the URL has (`metric` on Overview; `mode`, `steps`, `by`, `step`, `outcome` on Funnel; `kind`, `q` on
  Features; `kind`, `show`, `screen` on Requests; every filter of Visits). The page still
  validates every value. A unit test ties each list to the search type the page reads, so a new
  filter fails the build until it is listed. The custom period panel closes on a change of screen.
- A screen's loading state is now only its content: the skeleton and `aria-busy` live in the
  `<main>`.
- Every screen's content (the page and its loading state, through `ScreenContent`) starts with a
  zero-height mark placed at the top of the region that holds the notices and the header. After a
  navigation, Next scrolls back to the top only when the top of the new segment's first element
  is outside the viewport. Without the mark that element would be the `<main>`, below the header:
  on a phone, a screen opened from far down the previous one kept the scroll with its header out
  of view whenever the server was slow enough for the skeleton to show first (measured with an
  800 ms delay). With the mark the check sees an edge at or above the header, as it did when the
  header belonged to the page; with a notice above the header, a small scroll now also brings the
  next screen back to the top.
- An error in a screen is still caught by the project's error boundary, which replaces the
  header and the content with the error panel, as before. A boundary inside the group would keep
  the header, but every boundary is its own client chunk with its own copy of the error panel:
  it measured 1.1 KiB more on every screen, which the Overview's budget did not have.

## Consequences

- No screen change rebuilds the header, and the header shows the real subtitle and period while
  the next screen loads. Choosing a period keeps the focus on the chosen preset.
- The period code and the header now run in the browser. Overview's first-load JavaScript went
  from 165.7 to 166.0 KiB (budget 167) and Requests from 168.7 to 168.8 (budget 170). The pages
  import `withKeptParameters` from a module of its own instead of the selector's module, so the
  routes without a period selector no longer pull its client components: Settings went from
  168.1 to 165.7 KiB.
- Carrying raw values has known, harmless differences from the pages' own links: a value the page
  would drop or normalise (an unknown `metric`, `kind=writes`) is carried as written, and the
  demo's Funnel without `steps` no longer carries the example steps (the page computes the same
  example again).
- Going from one of the eight screens to Settings still swaps the header once, when Settings
  arrives; Settings has no loading state, so there is no placeholder in between.
- Around midnight in the project's time zone, the header and the page compute "today" a few
  milliseconds apart and may disagree for that instant.
- A tap on a screen whose prefetch had only partly arrived (on a phone, right after opening the
  menu) let Next commit the new route with the page segment still missing and no loading boundary
  known for it. The header already showed the destination and the area below it stayed empty
  until the server answered (about a second on a slow connection); before this decision the old
  screen stayed, with its busy bar. Since 2026-10-24 the layout renders a busy placeholder (a
  status line and a generic skeleton) right before the page, hidden by a CSS rule whenever a
  `<main>` follows it, so only that empty state shows it. It is markup and a class, so no route
  ships more JavaScript. It is a `<div>`, not a second `<main>`: one would take the skip link's
  target and the busy probes; while it shows, the page has no main landmark, as it had none in
  the empty state before.
