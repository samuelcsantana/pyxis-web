# 17. A shared report is read by the viewer's browser and drawn by the server

Date: 2026-11-05

## Status

Accepted. Builds on pyxis-api ADR 0060 (a public share link opens only aggregate reports).

## Context

A public share link (`/share/<token>`) opens a project's summed reports to anyone who holds it,
without signing in. The API serves them under `/v1/shared/{token}` and limits each client address
to 120 requests a minute, read from `CloudFront-Viewer-Address`, before it looks at the token
(pyxis-api ADR 0060 §6). Its CORS answers allow the dashboard's origin so that each viewer is
counted by their own address.

Every other screen of the dashboard reads the API on the dashboard's server. Doing the same here
would send every viewer of every link, and anyone guessing tokens at `/share/<guess>`, through the
few addresses the dashboard's functions leave from. One person could then spend the limit of
everyone, and a popular link would refuse itself.

Reading in the browser has its own cost. The screens are Server Components fed by the server's
translations and formats. Drawing them in the browser would mean shipping every translation the
reports use and composing each screen a second time on the client.

## Decision

- **The viewer's browser reads the API.** The page renders a small client component. It reads the
  card (`/v1/shared/{token}`, kept per token in memory, so moving between screens reads it once),
  then the reports.
- **The server decides what to read and draws what was read.** Two Server Functions do the work:
  - The first takes the card and the address's parameters and answers the API paths a screen
    needs. Period, filters, goal, funnel steps and feature kind are read by the same domain code
    as the dashboard; the identity and property filters are dropped, since the API refuses them.
  - The second validates the answers with the same Zod schemas as the HTTP services and returns
    the screen drawn on the server, with the same report views as the dashboard.
- **The report views are shared with the dashboard**, extracted from the pages. Their links to
  Visits, to CSV exports and to Settings take `null` on the shared page. Row filters point to the
  shared page itself, so a shared figure is always the dashboard's figure for the same query.
- **The page passes both Server Functions as props** from the server component. The client
  components inside the returned tree then belong to the route, and the production build lists
  them in its client manifest; a function imported only by the client component left them out.
- **One answer for every closed link.** A token of the wrong shape answers the route's not-found
  page before anything is read. A 404 from the API shows the same page in the browser, and it
  never says whether the link was revoked or expired. A 429 asks the viewer to wait a minute.
- **The demo serves the same paths.** With no API configured, `/v1/shared/{token}/…` on the
  dashboard answers the demo store's invented reports for the demo token. With an API configured,
  that route answers 404 (or the sign-in redirect, without a session), so it can never become a
  proxy.
- **Kept out of search engines** by `X-Robots-Tag: noindex, nofollow` from the proxy and the
  robots meta tag. The proxy lets `/share/` through without a session.

## Consequences

- The API's rate limit protects each viewer separately, as ADR 0060 intended.
- A viewer's browser uploads the answers it read to the dashboard's function, which draws them.
  The largest answer (a year of the Overview, its time of day and the goals summary) stays well
  under the 1 MB limit of a Server Function body.
- The shared page shows a loading line before its first screen, where the dashboard renders on
  the first byte.
- A report added to the shared page is a screen definition (its reads and its view). The API's
  allowlist still decides what can be read.
