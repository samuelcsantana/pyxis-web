# 2. Server Components reading through service interfaces

Date: 2026-10-05

## Status

Accepted

## Context

The dashboard shows analytics that belong to one admin and are reached with a session cookie. The
same screens must also run with invented data: in the live demo, in Playwright, and in Storybook.
And a page that fetches in the browser has to show a loading state for data the server could have
rendered directly.

## Decision

- Pages are Server Components by default. A Client Component is used only where interaction needs
  it: charts, toggles, the sign-in form, the funnel editor.
- Data is read on the server. The API sets the session cookie for a domain that covers the
  dashboard host, so the Next.js server receives it and forwards it to the API.
- Sign-in and sign-out run in the browser, straight to the API, so the API's per-address rate
  limit sees the admin's address rather than the hosting provider's.
- Every API area has an interface in `src/services/` with two implementations: `Http*`, which
  calls the API, and `Mock*`, which serves invented data. A `create*Service()` factory picks one:
  with `NEXT_PUBLIC_PYXIS_API_URL` set, Http; without it, Mock. Pages and components depend on the
  interfaces only.

## Consequences

- The demo, the end-to-end tests and Storybook run the real screens without any API.
- No API credential or data request exists in the browser bundle beyond sign-in and sign-out.
- Server Components that await data are tested by calling them and rendering the result, since
  Testing Library cannot await them itself.
