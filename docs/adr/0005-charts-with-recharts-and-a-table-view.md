# 5. Charts with Recharts, each with a table view

Date: 2026-10-06

## Status

Accepted

## Context

The screens of the dashboard are mostly charts: events per day on the overview, visits per day by
channel on acquisition, donuts on devices, bars on features and requests. Drawing each one by hand
in SVG means re-implementing scales, ticks, stacking and resizing several times. A chart is also,
on its own, unreadable to a screen reader and hard to check with axe.

## Decision

- Charts are drawn with **Recharts 3**, inside Client Components. The Server Component page reads
  the data and passes it as plain serializable props; Recharts is never imported on the server.
- Every chart has a **"View as table" toggle** (`aria-pressed`) that swaps the drawing for a table
  of the same numbers, with a caption. The drawing sits in a `<figure role="img">` whose accessible
  name is a sentence built from the data ("Area chart of 30 days. Page views: 4,758 in total,
  between 107 and 191 a day. ..."), so the summary and the table are what assistive technology
  reads.
- Recharts' own keyboard layer is turned off (`accessibilityLayer={false}`) and so are its
  animations: the table is the interactive alternative, and an image with focusable parts inside
  would be announced twice.
- Colors come from the design tokens as CSS variables (`var(--color-sky)`), so the charts follow
  the light and dark themes without re-rendering.
- Small decorative charts that need no axes or interaction, such as the sparklines of the KPI
  cards, are plain SVG polylines computed by a pure function in `src/domain/` and rendered on the
  server.

## Consequences

- The client JavaScript of a screen with a chart grows by about **100 KB gzip** (the imports of the
  overview, measured with esbuild: Recharts 3 brings Redux Toolkit, Immer and parts of d3). Next.js
  loads it only on the routes that render a chart; the sign-in page does not pay for it.
- Recharts and its dependencies are MIT or ISC licensed.
- `ResponsiveContainer` needs `ResizeObserver`, which jsdom lacks: `vitest.setup.ts` installs a
  no-op one, and the container starts from an initial size so tests render the chart.
- Each new chart ships with its table view and its summary sentence in the same pull request; the
  Playwright suite checks that the table adds up to the totals shown beside the chart.
