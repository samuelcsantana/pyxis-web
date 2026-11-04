# 16. The settings open in a dialog named by the address's hash

Date: 2026-11-04

## Status

Accepted.

## Context

The settings, the install guide, help, the plan and the language lived on pages of their own
(`/settings`, `/install`, `/help`, `/account`) and in a long account menu. Opening any of them left
the screen the admin was reading: the next screen was rendered, the period and the scroll were
lost, and coming back drew the screen again. The product owner asked for one place that opens
over the screen, the way chat applications show their settings, with the section in the address
so it can be linked and the browser's Back closes it, and with one firm rule: opening it must not
change anything on the screen under it.

Three ways were weighed:

- **A route** (`/settings/keys`, or an intercepting route over the screen). The App Router would
  render the new segment, and an intercepted route still changes the path the screens read their
  view from; every screen would need a slot for it.
- **The panels in the layout from the start**, hidden until asked for. Every load and every
  refresh of every screen would read the six services the settings need.
- **A dialog named by the hash**, its content read on demand.

## Decision

- **The address names the dialog with its hash**: `#settings` is the list of sections (what a phone
  shows first), `#settings/<section>` one section, anything else closed. A small store reads it
  with `useSyncExternalStore`; opening pushes one history entry and moving between sections
  replaces it, so Back closes the dialog in one step.
- **The router never sees those steps.** The store writes the history with the router's own state
  object, which the App Router's patched `pushState` and `replaceState` pass through untouched,
  and a `popstate` listener in the capture phase stops the event when only the settings hash moved,
  so the router does not restore the tree (which would mount the screen again). A navigation to
  another page closes the dialog. When a server action re-renders the screen (choosing a language
  sets a cookie) and the router writes the address without the hash, the dialog puts the hash back
  and closes later in place instead of stepping back to a history entry of the old language.
- **The data comes from a server action; the panels are drawn in the browser.** The project layout
  mounts only a small client component that loads the dialog's code the first time the settings
  are asked for (or as soon as a control that opens them is pointed at or focused). Opening asks
  `loadSettingsDialog`, which reads the services and answers with plain data (the project's
  settings, the admin's sessions, tokens and connected apps, the people, the accounts); the dialog
  loads the full dictionary of the language on screen and draws the same panels the Settings page
  draws on the server. The answer is kept until the dialog closes or the language changes.
  Answering with React elements was tried first: a client component in such an answer has to be
  known to the route's client manifest, and making it known put every panel's code on the first
  load of every screen, 13 KiB over the budget.
- **The pages stay** for the links already sent in e-mails and for the redirect after a new
  project; links inside the dialog to those pages open the matching section instead.
- **Accessibility**: a native modal `<dialog>` (focus kept inside, the page inert), Escape and a
  click outside close it, the focus goes back to the control that opened it (to the account button
  when that control sat in the closed account menu), a nested language dialog keeps its Escape and
  its cancel to itself, and every target is at least 44 px.

## Consequences

- Opening, moving between sections, Back and Forward neither read the screen again nor mount it
  again (an end-to-end test keeps the same `<main>` element and the scroll position).
- The first load of a screen changes by −0.4 to +0.2 KiB against the version before: the account
  menu lost its theme and language lists, and gained the gear, the language dialog's button and the
  settings store. The dialog, its panels and the dictionary (about 32 KiB gzip) load on demand.
- The settings cost one server action call per opening; a link pointed at starts it early.
- A change saved inside the dialog revalidates the screen as before, but the dialog's own lists
  are read again only on the next opening.
- The panels are shared by the Settings page (drawn on the server) and the dialog (drawn in the
  browser), so they must stay free of server-only code.
- The hash is the dialog's: a screen can no longer use `#settings…` anchors of its own.
