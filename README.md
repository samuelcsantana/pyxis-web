<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset=".github/assets/cover-dark.png">
  <img alt="Pyxis — privacy-first product analytics" src=".github/assets/cover-light.png" width="100%">
</picture>

**The dashboard of Pyxis: the overview, funnels, features, request errors, devices, acquisition and
per-person timelines of a product, measured without cookies or personal data.**

[![CI](https://github.com/samuelcsantana/pyxis-web/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/samuelcsantana/pyxis-web/actions/workflows/ci.yml)
[![Coverage](https://codecov.io/gh/samuelcsantana/pyxis-web/graph/badge.svg)](https://codecov.io/gh/samuelcsantana/pyxis-web)
[![CodeQL](https://github.com/samuelcsantana/pyxis-web/actions/workflows/codeql.yml/badge.svg?branch=main)](https://github.com/samuelcsantana/pyxis-web/actions/workflows/codeql.yml)
<br>
[![License: MIT](https://img.shields.io/github/license/samuelcsantana/pyxis-web)](LICENSE)
[![TypeScript strict](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](tsconfig.json)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-FE5196?logo=conventionalcommits&logoColor=white)](https://www.conventionalcommits.org)
[![Playwright + axe](https://img.shields.io/badge/Playwright-axe%20WCAG%202.2-2EAD33?logo=playwright&logoColor=white)](e2e)
[![Storybook](https://img.shields.io/badge/Storybook-components-FF4785?logo=storybook&logoColor=white)](https://samuelcsantana.github.io/pyxis-web/)
[![Live demo](https://img.shields.io/badge/Live%20demo-invented%20data-F5B83D?logo=vercel&logoColor=white)](https://demo.pyxis.samuelsantana.dev)

**[Live demo](https://demo.pyxis.samuelsantana.dev)** ·
**[Storybook](https://samuelcsantana.github.io/pyxis-web/)** ·
**[API reference](https://samuelcsantana.github.io/pyxis-api/)** ·
**[SDK playground](https://samuelcsantana.github.io/pyxis-sdk/)**

</div>

<img alt="An 18-second tour of the live demo: the overview switches from 30 to 7 days, the Requests screen opens the details of POST /orders, its latest failure opens the visit that hit it (a 409, the retry and the order created), then an example sign-up funnel, which ends in the dark theme" src=".github/assets/demo-tour.gif" width="100%">

| Requests, with a route's details                                                                                                                                                                      | Funnel, dark theme                                                                                                                                 | Timeline of one person                                                                                                                           |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| <img alt="The routes of the demo store with the details of POST /orders open: status codes, the screens where it failed and its latest failures" src=".github/assets/screenshots/requests-light.png"> | <img alt="A six-step sign-up funnel with the share that continued and the drop-off at each step" src=".github/assets/screenshots/funnel-dark.png"> | <img alt="The timeline of the demo person: a failed order, its retry and the order created" src=".github/assets/screenshots/timeline-light.png"> |

The tour and the screenshots show invented demo data: the dashboard runs on it when no API is
configured. The tour was recorded from the [live demo](https://demo.pyxis.samuelsantana.dev).

> **Status:** early development, in production. Every screen works against the API, deployed at
> `pyxis.samuelsantana.dev` for the projects' admins, and against invented data in the public
> [live demo](https://demo.pyxis.samuelsantana.dev).

## Ecosystem

| Repository                                               | Role                                                         |
| -------------------------------------------------------- | ------------------------------------------------------------ |
| [pyxis-api](https://github.com/samuelcsantana/pyxis-api) | Ingestion, dashboard sign-in and queries, erasure, retention |
| [pyxis-sdk](https://github.com/samuelcsantana/pyxis-sdk) | Browser tracker published to npm as `pyxis-analytics`        |
| **pyxis-web** (this one)                                 | The dashboard                                                |

## Why it exists

A product team wants to know which features are used, where requests fail, where a sign-up funnel
loses people and what one person did, in order. Pyxis answers those questions from events that
carry no cookie, no IP address and no personal data. This dashboard is where the answers are read:
one admin, one email code to sign in, and a design that puts the number that matters first.

## Features

Shipping now:

- The approved brand and design tokens (light and dark), exposed to Tailwind CSS 4
- A strict Content Security Policy and hardening headers on every page
- Storybook with the design tokens page; every story is also an automated accessibility test
- Sign-in with a six-digit code sent by email; the page never tells whether an email can sign in
- The app shell: sidebar with the screens, project switcher, period selector (today, 7 days,
  30 days or a custom range, kept in the URL), light and dark themes, sign-out, and a menu button
  on phones
- The overview: visits, identified users, conversions and the write error rate, each with its
  change against the previous period and a sparkline; page views and named events per day as a
  chart or a table; the top pages and events. Every percentage sits next to the totals it comes
  from, and a division by zero shows a dash, never `NaN%`
- Devices: device type, browser and operating system as donuts whose legend is a table of every
  value with its visits and share, conversion by device, and the countries by name
- Acquisition: paid visits and the top channel with their share of every visit, visits per day
  stacked by channel (chart or table), and the sources with their conversion rate and the visits
  that came from an ad click
- Features: the most used events and the most visited screens, with count, visits, a daily trend
  and the share of the ranking; a search by name that lives in the URL; each event opens its
  property breakdown: per key, the ten most frequent values with their share, count and visits, and
  the rest as "Other values"
- Requests: every write by route with its success and error shares, status codes and median
  duration; a keyboard-accessible details panel with the screens where the route failed and its
  latest failures with their error code; "failing only" and screen filters kept in the URL
- Funnel: 2 to 8 steps (a page path with `*`, or an event name) counted per visit or per person,
  with the share that continued and the drop-off at each step; a keyboard-operable step editor,
  and the steps kept in the URL so a bookmark is a saved funnel
- Timeline: everything one person (by user id) or one visit did, in order, with each visit's
  device, channel and length, every page view, event and request with its properties and status,
  and filters for page views, events, requests and errors; older visits load on demand, and a
  failed request in the Requests screen links to its visit
- Loading, empty and error states shared by every screen; an empty period shows how to install
  the SDK
- A demo mode with invented data and a visible banner when no API is configured, published as
  the [live demo](https://demo.pyxis.samuelsantana.dev): no sign-in and no real API

## Architecture

```mermaid
flowchart LR
  Browser["Browser"] -- "sign-in, sign-out" --> API["pyxis-api"]
  Browser -- "pages" --> Next["Next.js 16<br>Server Components"]
  Next --> Factory["create*Service()"]
  Factory -- "API URL set" --> Http["Http*Service<br>(forwards the session cookie)"] --> API
  Factory -- "no API URL" --> Mock["Mock*Service<br>(demo, tests, Storybook)"]
```

Pages read data on the server through service interfaces; the browser calls the API only to sign
in and out ([ADR 0002](docs/adr/0002-server-components-and-services.md)).

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript 6 (strict) · Tailwind CSS 4 · Geist through
`next/font` · Zod for API answers · [rx-state-bridge](https://github.com/samuelcsantana/rx-state-bridge)
with RxJS for the few requests a Client Component starts · Recharts 3 for the charts, each with a table
view ([ADR 0005](docs/adr/0005-charts-with-recharts-and-a-table-view.md)) · Vitest
and Testing Library · Playwright with axe-core · Storybook 10 · Vercel · GitHub Actions with
CodeQL, Dependabot, Codecov and release-please.

## Getting started

Requirements: Node.js 24 and npm 11.

```bash
git clone git@github.com:samuelcsantana/pyxis-web.git
cd pyxis-web
npm ci
npm run dev          # http://localhost:3000
npm run storybook    # http://localhost:6006
```

| Variable                    | Meaning                                                                  |
| --------------------------- | ------------------------------------------------------------------------ |
| `NEXT_PUBLIC_PYXIS_API_URL` | The Pyxis API. Unset: Mock services with invented data and a demo banner |

Without the variable the dashboard runs in demo mode: no session is asked for, and the sign-in
page accepts the code `000000`.

To sign in against a real API, start the [pyxis-api](https://github.com/samuelcsantana/pyxis-api)
compose stack (it accepts sign-in calls from `http://localhost:3000`), grant yourself a project
with its `admin:grant` script, then run the dashboard on port 3000 exactly:

```bash
NEXT_PUBLIC_PYXIS_API_URL=http://localhost:3040 npx next dev -p 3000
```

Outside production the API logs the sign-in code instead of emailing it
(`docker compose logs api`). The session cookie is set by the API for `localhost`, and cookies
ignore ports, so the dashboard's server receives it and forwards it to the API.

### Routes

| Route                      | What it shows                                                            |
| -------------------------- | ------------------------------------------------------------------------ |
| `/`                        | Opens the first project the admin may read, or explains there is none    |
| `/sign-in`                 | Email, then code; `?expired=1` explains that the session ended           |
| `/[projectId]/overview`    | The overview of a project; `?range=today\|7d\|30d` or `?from=…&to=…`     |
| `/[projectId]/devices`     | Device types, browsers, systems, conversion by device and countries      |
| `/[projectId]/acquisition` | Visits by channel per day, paid visits, the sources and their conversion |
| `/[projectId]/features`    | Events (or `?kind=screens`) ranked by use; `?q=` searches by name        |
| `/[projectId]/requests`    | Writes by route; `?show=failing` and `?screen=/path` filter them         |
| `/[projectId]/funnel`      | `?steps=<json>` and `?mode=visit\|user`; no steps opens the editor       |
| `/[projectId]/timeline`    | `?user=<id>` or `?visit=<uuid>`, and `?show=` to filter the items        |

`src/proxy.ts` sends a visitor without a session cookie to `/sign-in`; the API still decides
whether the session is valid, and a rejected one lands on `/sign-in?expired=1`.

### Contract

`contract/openapi.json` is a copy of the API's published contract. `npm run contract:sync`
refreshes it; a unit test checks that the demo answers and the bodies the sign-in form sends
match it, and a daily workflow runs that test against the API's `main`.

### Deployment

Two Vercel projects build this repository, and every merge to `main` deploys both:

| Project      | Address                                                                                       | `NEXT_PUBLIC_PYXIS_API_URL`           |
| ------------ | --------------------------------------------------------------------------------------------- | ------------------------------------- |
| `pyxis-web`  | `https://pyxis.samuelsantana.dev`, the dashboard for the projects' admins                     | `https://api.pyxis.samuelsantana.dev` |
| `pyxis-demo` | [`https://demo.pyxis.samuelsantana.dev`](https://demo.pyxis.samuelsantana.dev), the live demo | unset                                 |

The variable is set for production only, so preview deployments run in demo mode. `vercel.json`
runs the functions in `gru1` (São Paulo), the city of the API, because every page reads it on
the server.

## Testing

```bash
npm run test:cov        # unit tests in jsdom, 100% coverage required
npm run test:e2e        # Playwright with axe, light and dark, desktop and phone
npm run test:storybook  # every story in headless Chromium, axe violations fail the run
npm run test:tooling    # the lint rule and the comment check
```

Coverage must stay at **100% of statements, branches, functions and lines** of `src/`; CI fails
below it. Excluded, and why:

| Excluded                    | Reason                                                  |
| --------------------------- | ------------------------------------------------------- |
| `src/**/*.stories.tsx`      | Documentation, run as browser tests by `test:storybook` |
| `eslint-rules/`, `scripts/` | Tooling outside `src/`, tested on Node's test runner    |

The root layout is covered too: its test calls the server component and checks the document it
returns.

## Project structure

```text
src/
├── app/            routes, the root layout, design tokens (globals.css), icons
├── components/     UI components, each with its stories (overview, shell, sign-in, states, theme)
├── design/         the design tokens page
├── domain/         pure types and rules: the admin and projects, periods, overview figures,
│                   rates and changes, sparklines, device and country labels, donuts,
│                   channels and sources, feature ranking, search and property breakdowns,
│                   routes and failures, funnel steps and counts, timeline items, errors
├── lib/            API configuration, theme, security headers, the current admin
├── services/       one interface per API area, with Http and Mock implementations
└── proxy.ts        sends a visitor without a session to sign in
contract/           the API contract copied from pyxis-api
e2e/                Playwright specs and the axe helper
.storybook/         Storybook configuration
eslint-rules/       the local no-comments ESLint rule
scripts/            the comment check for files ESLint does not read
docs/adr/           architecture decision records
```

## Privacy and security

- Content Security Policy without nonces, so pages stay prerendered: scripts, styles, images and
  fonts from this origin only, connections only to this origin and the Pyxis API, no plugins, no
  framing
- No secret in the browser bundle; data is read on the server
- The session is an `HttpOnly` cookie set by the API; the dashboard's JavaScript never reads it.
  The only cookie the dashboard writes is `pyxis_theme`, the light or dark choice, which the root
  layout reads so the first paint has the right theme (so every page renders on request)
- The sign-in screen says the same thing for every email, like the API it calls
- The live demo has no API configured at all, so it cannot reach real data
- Vulnerabilities: see [SECURITY.md](SECURITY.md)

## Architecture decisions

| ADR                                                                | Decision                                                |
| ------------------------------------------------------------------ | ------------------------------------------------------- |
| [0001](docs/adr/0001-record-architecture-decisions.md)             | Record architecture decisions                           |
| [0002](docs/adr/0002-server-components-and-services.md)            | Server Components reading through service interfaces    |
| [0003](docs/adr/0003-csp-without-nonces.md)                        | A Content Security Policy without nonces                |
| [0004](docs/adr/0004-client-request-state-with-rx-state-bridge.md) | Request state of Client Components with rx-state-bridge |
| [0005](docs/adr/0005-charts-with-recharts-and-a-table-view.md)     | Charts with Recharts, each with a table view            |

## Roadmap

- [x] App skeleton, design tokens, Storybook, quality gates
- [x] Sign-in, app shell, project and period selectors, loading, empty and error states
- [x] Overview
- [x] Devices
- [x] Acquisition
- [x] Features
- [x] Requests
- [x] Funnel
- [x] Timeline
- [x] Production domain
- [x] Live demo with invented data
- [x] Property breakdown of each event on Features

## Contributing and license

See [CONTRIBUTING.md](CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md). Released
under the [MIT License](LICENSE).
