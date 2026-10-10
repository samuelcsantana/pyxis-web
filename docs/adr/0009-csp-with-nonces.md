# 9. A Content Security Policy with a nonce per request

Date: 2026-10-10

## Status

Accepted. Supersedes [ADR 0003](0003-csp-without-nonces.md).

## Context

ADR 0003 chose a static policy with `script-src 'unsafe-inline'` so that pages could stay
prerendered: a nonce needs a request to be generated for, and in October 2026 the dashboard still
prerendered some pages. Since then every page renders on request, because the root layout reads
the theme cookie so the first paint has the right theme. The reason for the static policy was gone,
and `'unsafe-inline'` left any injected inline script free to run, which defeats most of what a
Content Security Policy is for. The security review of 2026-10-09 listed it as SEC-4.

## Decision

- `src/proxy.ts` creates a nonce per request (16 random bytes, base64) and writes the policy on the
  request headers, where Next reads the nonce and adds it to every script it renders, and on the
  response. Redirects carry no policy: they render nothing.
- `script-src 'self' 'nonce-…' 'strict-dynamic'`, plus `'unsafe-eval'` in development only, for
  React Refresh. A script runs only when it carries the nonce of its own response or is loaded by
  one that does.
- `style-src` keeps `'unsafe-inline'`: Tailwind and the server-drawn SVG charts set inline styles.
- The other hardening headers stay static in `next.config.ts`; only the policy moved to the proxy.

## Consequences

- An injected inline script, the usual payload of a cross-site scripting bug, no longer runs. The
  code has no `dangerouslySetInnerHTML` and React escapes by default, so this is defence in depth.
- The policy depends on the proxy running: a path the proxy's matcher excludes (static files, the
  app icons, the e-mail logo) gets no policy, which is right because none of them is a document.
- Verified on the built app in a real browser: every `<script>` of the demo and sign-in pages
  carries the nonce and no `securitypolicyviolation` fires; the Playwright suite and the axe checks
  pass unchanged.
- The host-only session cookie ([ADR 0008](0008-host-only-session-cookie.md)) relies on this: the
  token crosses the sign-in page's script once, and the nonce policy is what keeps an injected
  script from reading it.
