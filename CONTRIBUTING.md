# Contributing to pyxis-web

Thanks for your interest. This document explains how the repository is organized and what a pull
request needs before it can be merged.

## Prerequisites

- Node.js 24 (`.nvmrc`) and npm 11
- Chromium for Playwright and the Storybook tests: `npx playwright install chromium`

## Setup

```bash
npm ci
npm run dev        # http://localhost:3000
npm run storybook  # http://localhost:6006
```

Without `NEXT_PUBLIC_PYXIS_API_URL` the dashboard runs on its Mock services with invented data; set
it in `.env.local` to talk to a local pyxis-api. `npm ci` also installs the Git hooks (Husky).

## Scripts

| Script                            | What it does                                                         |
| --------------------------------- | -------------------------------------------------------------------- |
| `npm run lint`                    | ESLint (Next.js and typescript-eslint rules), then the comment check |
| `npm run format` / `format:check` | Prettier                                                             |
| `npm run typecheck`               | TypeScript in strict mode                                            |
| `npm test` / `npm run test:cov`   | Unit tests in jsdom; `test:cov` enforces 100% coverage               |
| `npm run test:e2e`                | Playwright in a real browser, with axe, in both themes               |
| `npm run test:storybook`          | Every story as a browser test, axe violations included               |
| `npm run test:tooling`            | Tests of the lint rule and the comment check                         |
| `npm run build`                   | Production build                                                     |

## Rules

- **Next.js 16** differs from older versions: read `node_modules/next/dist/docs/` before touching
  routing, layouts, `proxy.ts`, caching or metadata.
- Server Components by default; a Client Component only where interaction needs it. No secret may
  reach the browser bundle.
- Components depend on service interfaces (`src/services/`), never on a concrete `Http*` or
  `Mock*` class.
- Colors, radii and type come from the design tokens in `src/app/globals.css`; a component never
  carries a raw hex value.
- **Every new component ships its stories** (default, loading, empty, error, dark) in the same pull
  request, and they pass the accessibility checks.
- **No comments in code**, in any file. The _why_ goes in the commit body, the pull request, an
  [ADR](docs/adr/) or the README. An ESLint rule and a script enforce it.
- Never silence a check: no `eslint-disable`, `@ts-ignore`, `@ts-expect-error` or coverage ignore
  comments.
- New dependencies must be MIT, Apache-2.0, BSD or ISC licensed, and justified in the pull request.

## Workflow

- `main` is the only long-lived branch and is protected. Cut a branch from an up-to-date `main`
  (`feat/…`, `fix/…`, `refactor/…`, `test/…`, `docs/…`, `ci/…`, `build/…`, `chore/…`) and open a
  pull request into `main`. **A merge into `main` is a production deploy** (Vercel).
- Pull requests are merged with **Rebase and merge**. Keep commits atomic: each builds and passes
  the tests on its own.
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/); a hook and a
  CI job check them.

## Tests

- Coverage stays at **100%** of statements, branches, functions and lines.
- Every branch a change introduces has a test for each side; a bug fix starts with a failing test.
- Every screen passes axe (WCAG 2.2 A and AA) in light and dark, at desktop and phone widths.
- Test and demo data are invented. Never use real data.

## Security

Report vulnerabilities privately, as described in [SECURITY.md](SECURITY.md), never in a public
issue.
