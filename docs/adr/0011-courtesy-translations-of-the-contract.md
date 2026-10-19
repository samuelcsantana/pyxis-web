# 11. Courtesy translations of the contract, with the Portuguese text prevailing

Date: 2026-10-18

## Status

Accepted.

## Context

The contract of the hosted service (terms of use, privacy policy and data processing agreement)
is written in Brazilian Portuguese. The seller is in Brazil, the documents follow Brazilian law
(the LGPD, the consumer code, Decreto 7.962/2013), and clause 24.4 of the terms says the contract
is made in Portuguese. Until now every language of the interface linked those Portuguese texts,
with a note saying so.

The interface ships in seven languages (English, Brazilian Portuguese, Spanish, German, French,
Italian and Dutch). A reader who cannot read Portuguese could not read what they were asked to
accept.

## Decision

- Each of the three documents is also served in the six other languages, as a courtesy
  translation: `/en/terms`, `/en/privacy`, `/en/dpa`, and the same under `/es`, `/de`, `/fr`,
  `/it` and `/nl`. The Portuguese addresses (`/termos`, `/privacidade`, `/acordo-de-tratamento`)
  do not change.
- The Portuguese text is the binding one. Each translation opens with a notice that says so and
  links the Portuguese document; clause 24.4 is translated as written, and still true.
- Translating does not change the contract: the version stays the same, so nobody is asked to
  accept the terms again, and sign-up still records the acceptance of that version.
- A translated page renders in its language: the header, the footer, the effective date
  (`Intl` in the document's language) and the label of each table. Every document page lists its
  versions in all seven languages, each named in itself, and the pages name each other as
  `hreflang` alternates, in the page head and in the sitemap.
- The home page footer, its questions and the sign-up page link the documents in the language
  the reader is using; the footer says the translations are a courtesy and that the Portuguese
  text prevails.
- The translations are Markdown files in `content/legal/<language>/`, with the same placeholders
  as the Portuguese ones (seller, version, effective date). A test checks that every one of them
  fills every placeholder, carries the courtesy notice with the link to the Portuguese text, and
  links the other documents in its own language.

## Consequences

- Seven texts of each document to keep in step. A change to the contract changes the Portuguese
  text first; the translations follow in the same pull request, or the pull request says which
  ones still read the previous wording. The courtesy notice is what keeps the Portuguese version
  the reference meanwhile.
- The translations were made without a native legal reviewer; any reader's correction is a small
  pull request against one file.
- The documents remain written for Brazilian law. Translating them makes them readable to customers
  elsewhere; it does not adapt them to another law.
