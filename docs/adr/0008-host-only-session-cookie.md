# 8. Keep the session in a host-only cookie set by a Server Action

Date: 2026-10-10

## Status

Accepted. Pairs with pyxis-api ADR 0012, which has the API answer the session token in the body of
`POST /v1/auth/verify-code`.

## Context

The API used to set the session cookie, because the browser signs in by calling it directly. For
the dashboard's server on `app.pyxis-analytics.dev` to receive that cookie it had to be scoped to
`pyxis-analytics.dev`, so the browser also sent it to the live demo, the apex and any host added
under the domain later. Nothing there read it, but the scope would widen silently with every new
subdomain, and it was the one structural place a session could leak.

Only the dashboard can set a cookie that reaches the dashboard alone.

## Decision

- The browser still asks the API for a code and verifies it, so the API's per-address limits keep
  seeing the real browser. The sign-in calls send no credentials: the API keeps no cookie on the
  browser.
- `verifyCode` hands the `session_token` of the API's answer to the Server Action `keepSession`,
  which checks its shape (43 base64url characters) and sets `__Host-pyxis_session`: `HttpOnly`,
  `Secure`, `SameSite=Lax`, `Path=/`, no `Domain`, seven days. The `__Host-` prefix makes the
  browser refuse the cookie if any of that is missing.
- Server code forwards the token to the API as the `pyxis_session` cookie, as before. Sign-out is
  the Server Action `endSession`: it calls `POST /v1/auth/logout` with the token and the request's
  `Origin`, then clears the cookie; a refusal keeps the cookie and surfaces as an error.
- Server Actions carry Next's own Origin check, so a cross-site page cannot plant a session cookie
  or sign the admin out.

## Consequences

- No host other than the dashboard's receives a session token.
- The token is readable by the sign-in page's script for the instant between the API's answer and
  the action. A script injected at that moment could read it, which the nonce-based Content
  Security Policy ([ADR 0003](0003-csp-without-nonces.md), superseded by the nonce policy of
  2026-10-10) is there to prevent.
- One forced sign-in for every admin when this shipped: the old parent-domain cookie is ignored.
  Its session expires on the API after a day without use, so the dashboard does not clear it.
- The demo and the Playwright suite, which run without an API, keep the mock service and set no
  cookie; the real flow is verified against a local API in a real browser.
