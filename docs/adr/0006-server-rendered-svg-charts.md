# 6. Charts drawn as SVG on the server, each with a table view

Date: 2026-10-08

## Status

Accepted. Supersedes [ADR 0005](0005-charts-with-recharts-and-a-table-view.md).

## Context

ADR 0005 drew the two charts with axes, the daily activity of the overview and the visits per day
by channel of acquisition, with Recharts 3 inside Client Components. It already turned off
everything interactive in Recharts: the tooltips, the animations and its keyboard layer, because
the summary sentence and the table view are the accessible way to read a chart. What remained of
the library was scales, ticks and layout, and it cost:

- **About 103 KB gzip of first-load JavaScript** on each chart screen: 91.4 KB shared by both
  (Recharts 201 KB raw, d3 modules about 45 KB, decimal.js-light 12.8 KB, Redux Toolkit 10.2 KB,
  Immer 9.3 KB) plus 10.5–11.3 KB per route. With Zod out of the browser, a chart screen loaded
  about 256 KiB gzip against about 155 KiB for any other screen.
- **About 190 ms of main thread** on a phone (Pixel 7 emulation, 4× CPU slowdown, Fast 4G, median
  of 3): Total Blocking Time was 233 ms on the overview and 338 ms on acquisition, against 58–104 ms
  on the screens without a chart.
- **A late chart:** the server HTML held an empty Recharts placeholder and no `<svg>`; the chart
  painted at about 1.5 s (1477 and 1556 ms) while the rest of the page was painted at about 0.8 s
  (largest contentful paint 840 and 816 ms).
- **A page wider than the phone:** the placeholder was 960 px wide until Recharts measured its
  container, so a 412 px phone page was 991 px wide for about half a second and could be panned
  sideways.

The sparklines of the overview figures and the donuts of the devices screen were already plain SVG
computed by pure functions and rendered on the server.

## Decision

- Both charts are **Server Components** that render an `<svg>` into the HTML. The page reads the
  data, and the shapes are computed by pure, unit-tested functions in `src/domain/`:
  `chart-scale.ts` (a value axis rounded up to steps of 1, 2 or 5 times a power of ten),
  `chart-days.ts` (the position of each day and which days get a label), `area-chart.ts` (a line
  and the area under it) and `stacked-bars.ts` (the stacked segments of each day and the
  separators between them).
- **One render fits every width.** The shapes live in a 1000 × 1000 `viewBox` stretched to the plot
  (`preserveAspectRatio="none"`); every stroke is `vector-effect: non-scaling-stroke`, so lines
  keep their width in pixels. Text never goes into the stretched SVG: the value labels and the day
  labels are HTML placed by percentage around it.
- **Day labels never overlap.** Labels are picked every n-th day back from the last one, with the
  smallest n that keeps 40 px labels 8 px apart; one set is computed for a 200 px plot (the plot
  of a 320 px phone) and one for 448 px, and a container query on the label row shows the set
  that fits. A label at an edge is aligned with the edge of its point or bar, so none leaves the
  chart.
- **Stacked segments are separated** by a 1 px line in the card colour, so neighbouring channels
  stay apart even where their colours are close.
- Colours are the design tokens as CSS variables (`var(--color-sky)`), so the charts follow the
  light and dark themes without JavaScript. Nothing animates.
- The rest of ADR 0005 stands: each chart sits in a `<figure role="img">` whose accessible name is
  a summary sentence, and a **Chart / Table switch** shows the same numbers as a table with a
  caption. The switch is the only client code; it receives the drawing and the table as
  server-rendered nodes.
- Charts without axes (sparklines, donuts) stay as they were.

## Consequences

- Overview and Acquisition load **154.1 KiB gzip** of first-load JavaScript, down from 256.6 and
  255.9 KiB, inside the 162 KiB budget of their route class. `recharts` and its peer `react-is`
  are no longer dependencies.
- The chart is part of the first paint and works with JavaScript disabled, and a phone page is
  never wider than the screen before hydration.
- There are **no tooltips or hover states**: the table view is the way to read an exact value, and
  the summary sentence the way to hear the chart.
- The project owns its scale and label logic. It is small and covered by unit tests, including a
  check over every period up to 400 days that no two labels overlap; the end-to-end suite measures
  the real labels at 320 px.
- The HTML of a chart screen carries the drawing and, in the React Server Components payload, the
  table too: a few kilobytes more per chart, compressed.
- A new chart with axes reuses `ChartFrame` and the domain functions, and still ships with its
  table view and summary sentence in the same pull request.
