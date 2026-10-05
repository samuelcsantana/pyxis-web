# 3. A Content Security Policy without nonces

Date: 2026-10-05

## Status

Accepted

## Context

Next.js supports a nonce-based Content Security Policy, generated per request in `proxy.ts`. A
nonce, however, forces every page into dynamic rendering: a prerendered page has no request to
take a nonce from. Next.js documents a second recipe without nonces, set once in
`next.config.ts`, where inline scripts stay allowed because Next.js's own bootstrap is inline.

## Decision

The dashboard uses the recipe without nonces, built by `src/lib/security-headers.ts`:

- `script-src 'self' 'unsafe-inline'` (plus `'unsafe-eval'` only under `next dev`, for React
  Refresh), `style-src 'self' 'unsafe-inline'`, `img-src 'self' data: blob:`, `font-src 'self'`;
- `connect-src` limited to this origin and the Pyxis API's origin;
- `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'`;
- with X-Frame-Options, nosniff, a strict referrer policy, a restrictive Permissions-Policy and
  HSTS alongside.

A theme preference is applied from a cookie read by the root layout rather than an inline script,
so no page needs an exception of its own.

## Consequences

- Pages that can be prerendered stay prerendered.
- Inline script injection is not blocked by the CSP; the defense against it is React's escaping,
  the absence of `dangerouslySetInnerHTML`, and the closed `connect-src`, which stops an injected
  script from sending data anywhere but the API.
- Moving to nonces later is a change to `proxy.ts` and this policy, recorded in a new ADR.
