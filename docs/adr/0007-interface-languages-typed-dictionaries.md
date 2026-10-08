# 7. Interface languages: typed dictionaries, a functional cookie and Intl

Date: 2026-10-08

## Status

Accepted.

## Context

The dashboard is written in English, and Brazilian Portuguese is the first translation planned.
Today every page says `<html lang="en">`, every number and date is formatted with a hard-coded
`en-US`, and plurals are chosen with `count === 1`, which is wrong for Portuguese (zero takes the
singular, and millions have a form of their own). About 320 distinct texts, some 1,470 English
words, live in 64 files, and 80 of them are built inside `src/domain/`.

What the choice has to respect:

- Server Components by default, and a Content Security Policy without nonces (ADR 0003), so no
  inline script may pick the language in the browser.
- Every page is already rendered per request and served `private, no-store`, because of the
  session and theme cookies. Reading one more cookie or the `Accept-Language` header costs nothing
  and cannot poison a shared cache.
- As few dependencies as possible, and 100% test coverage.

Options considered:

- **(a) Typed dictionaries written by hand, plus `Intl`.** The language comes from a functional
  cookie, then from `Accept-Language`, then defaults to English. URLs do not change. No dependency.
- **(b) A language segment in the URL** (`/pt-BR/<project>/overview`). It would allow static pages
  per language, which a signed-in dashboard cannot use, and it changes every link, redirect,
  bookmark and README link. Server Actions cannot read the segment, so they would need the
  language passed in and validated again.
- **(c) next-intl.** Typed keys and ICU messages, but it declares ten runtime dependencies,
  including native binaries for its message extractor, and adds its message formatter to the
  browser bundle. That is a heavy install for about 320 texts with no gender or select messages.

## Decision

Option (a).

- **Dictionaries** live in `src/i18n/messages/`, one module per language. `en.ts` is the source:
  an `as const` object of namespaces, whose keys become typed dotted paths (`t('meta.description')`).
  A message is a string with `{named}` placeholders, and each call must pass exactly those values.
  A plural message is an object keyed by CLDR category (`one`, `many`, `other`, ...), with an
  optional `zero` tried first for exactly zero. It takes a numeric `count`, which is written with
  the language's digit grouping.
- **Every other language is checked against English** by a parity type. A translation that misses
  or adds a key, or drops or invents a placeholder, fails the type check. With 320 messages the
  check adds about 0.05 s to `tsc`.
- **Choosing the language:** the `pyxis_locale` cookie, set from a language menu, wins. Without
  it, the `Accept-Language` header is matched in weight order: the exact tag first, then the same
  language from another region (`pt-PT` finds `pt-BR`). Otherwise the page is in English. The URL
  never changes. The "no cookies" promise is about the visitors of the sites that use the SDK.
  The dashboard's own admins already get a session cookie and a theme cookie, and the language
  cookie is a preference of the same kind.
- **`currentLocale()` is the only code that reads the request for the language.** Tests replace
  it with English in the Vitest setup file, so the many tests that mock `next/headers` for cookies
  stay as they are.
- **Server Components translate with `getTranslator()`.** Client components get a translator
  from `MessagesProvider` in the root layout, through `useT()` and `useLocale()`. Only the
  namespaces listed in `CLIENT_NAMESPACES` are sent to the browser. A server-only key is not a
  valid argument of `useT()`, and ESLint reports any other import of a dictionary.
- **Formatting goes through `Intl`** with the request's language, always in the project's time
  zone. Machine formats such as `YYYY-MM-DD` stay fixed.
- **Customer data is never translated.** Event names, paths, routes, HTTP methods, status and
  error codes, property keys and values, project names, browser and OS names, time-zone ids and SDK
  function names appear exactly as they were sent. Only the sentence around them is translated.

## Consequences

- English stays the default and the source language. The texts move into the dictionaries one area
  of the dashboard at a time, with the English output unchanged, before a second language ships.
- No new dependency. The dictionaries stay on the server, and a client component receives only the
  messages it renders, in one language.
- Domain functions that write text receive the language as an argument, so `src/domain/` stays
  pure.
- A visitor who never chose a language gets the one their browser asks for, and the menu is one
  click away. Native date inputs follow the browser's own language, which the page cannot change.
- `app/global-error.tsx` replaces the root layout when it renders, so it sits outside the provider
  and has to resolve its texts without it.
- next-intl is worth revisiting if the dashboard grows past three languages or adopts a
  translation tool that works with ICU message files.
