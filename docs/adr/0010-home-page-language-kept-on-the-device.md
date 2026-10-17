# 10. Home page language kept on the device, and the browser's language at `/`

Date: 2026-10-17

## Status

Accepted. Changes the home page part of ADR 0007.

## Context

The home page (`pyxis-analytics.dev`) serves each language at its own address: English at `/`,
Brazilian Portuguese at `/pt-br`, Spanish at `/es`. Until now its language came only from the
address, never from a cookie or the browser, so crawlers and visitors read the same page, and the
page set no cookie.

Two things bothered visitors:

- A visitor who picked Portuguese and came back to `pyxis-analytics.dev` met the English page
  again, and a visitor whose browser asks for Portuguese or Spanish met English first.
- Switching language flashed. The theme chosen on the home page lives in `localStorage` and was
  applied by an effect after hydration, so every page drawn in the other language came up in the
  system theme first. And the preview card of the hero rose again from below, 650 ms, on top of
  the 180 ms view transition between the languages.

What the choice has to respect:

- The home page sets no cookie, and nothing it keeps identifies anyone.
- Search engines must keep reading English at `/`, with the canonical address and the `hreflang`
  alternates as they are.
- An address that names a language (`/pt-br`, `/es`) is a link someone chose; it must open in
  that language.

## Decision

- **The language chosen in the select is kept in `localStorage`** (`pyxis:locale`), next to the
  theme (`pyxis:theme`). No cookie.
- **Only `/` moves, and only before the first paint.** An inline script, the first element of the
  page and under the response's nonce (ADR 0009), runs before anything is drawn. At `/` it opens:
  1. the language kept on the device, when there is one;
  2. otherwise, the first language of `navigator.languages` the home page ships, matched like
     `Accept-Language` (the exact tag, then the same language from another region, so `pt-PT`
     opens `/pt-br` and `es-MX` opens `/es`), unless the visitor came from a Pyxis page (the
     dashboard, the demo or the home page itself), which already chose the language;
  3. otherwise it stays on `/`, in English.

  It keeps the query and the section (`location.replace`, so the back button skips `/`).
  `/pt-br` and `/es` never move.

- **The same script applies the theme kept on the device**, so the first paint has it, and marks
  a page reached through the language select (a `sessionStorage` flag set on the click) with
  `data-language-switched` on `<html>`. Under that attribute the hero's entrance animations do not
  run, so the page in the other language arrives still.
- **The language select is a dropdown** with each language's flag and its own name, built on the
  same dismissable `<details>` as the account menu. The home page's options are links (they keep
  the speculation rules, the carried section and the `language_switched` event); the sign-in and
  sign-up options post to the Server Action that sets `pyxis_locale`, as before.

## Consequences

- `/` now means "no language stated" rather than "English". A visitor whose browser asks for
  Portuguese, following a link to `/` from another site, lands on `/pt-br`. Choosing English in
  the select keeps `en` on the device, and that visitor is never moved again.
- Crawlers are unaffected: they keep nothing on the device and ask for English, so they read `/`
  in English, and every page keeps its canonical address and `hreflang` alternates.
- A browser that blocks storage gets the page the address names, in the system theme, with a
  warning in the console.
- The flags are inline SVG, not emoji: Windows draws flag emoji as two letters.
