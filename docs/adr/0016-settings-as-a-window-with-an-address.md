# 16. Settings is a window with an address

Date: 2026-10-30

## Status

Accepted.

## Context

Settings was one long page: the e-mail switch, the sessions, the access tokens, the connected
apps, then the project's form, keys, people, export and deletion. Reaching the keys from a screen
took a click and about 2,650 px of scrolling on a laptop, and leaving the page lost the screen
behind it. The navigation redesign (product decision D52) asked for one window, "Settings", with a
menu in two groups: the project (Project, Keys, People, E-mail, Export events, Delete project) and
"You" (Sessions, Access tokens, Connected apps, and later the account, theme and language, help).
Each part needs an address of its own: Stripe's return, an e-mail link, a reload and a link sent to
someone else must land on the same part, and the browser's Back must close the window to the
screen it opened over, with the screen's period and filters intact.

## Decision

- **Intercepted routes in a modal slot.** `src/app/[projectId]/layout.tsx` takes a `@modal` slot.
  Inside it, `(.)settings/…` intercepts the project's parts and `(..)account/[[...section]]` the
  person's parts (Account and billing, Theme and language, Sessions, Access tokens and Connected
  apps are the person's, so their addresses are `/account`, `/account/preferences`,
  `/account/sessions`, `/account/tokens` and `/account/apps`, with no project); `(.)help`
  intercepts Help and support, the last part of You, whose address stays `/[projectId]/help`
  because its links need a project; `(.)install` opens Install as a window of its own, wider and
  without the menu, since it is a task with an end rather than a setting. A click inside the
  dashboard (a soft navigation) renders the
  part in the slot over the current screen; a direct visit or a reload (a hard navigation) renders
  the real page at the same address, with the same menu and pane. The person's parts are one
  dynamic route that checks the section: Next 16.4
  treats `/[projectId]/(..)account/sessions` as a static route, because its own address has no
  parameter, and the rewritten request then falls to the project's catch-all page and answers
  404 in a production build.
- **The window opens only on its own addresses.** The slot has a `default.tsx` that draws
  nothing and no catch-all: on a soft navigation a slot with no match keeps what it holds, so
  moving between screens never asks the server for the slot and keeps the screens' prefetched
  loading states. The host draws the dialog only while the address is a settings or account
  address, so a link inside the window to another page (an export) leaves no window behind, and
  Back to that address shows it again.
- **One dialog for every part.** The slot's own layout holds a client host that reads the slot's
  selected segment: under `(.)settings` or `(..)account` it draws a native `<dialog>` opened with
  `showModal()` (focus trap, Esc and the inert page come with it) and keeps it mounted while the
  parts change, so switching parts never closes and reopens the window. Each part is its own page
  and loads only its own data.
- **Parts switch in place; Back closes.** The menu's links replace the history entry, so Back, Esc,
  the close button and a click outside the window (a press that also started outside) all go back
  one entry, to the screen. Focus goes to the part's heading on open and when the new part
  arrives, and back to the control that opened the window on close; on a phone, where that control
  sat in the closed menu, back to the menu button. An error while a part loads shows inside the
  window, which keeps its name.
- **A full page switches parts as pages.** On a page opened directly, the menu's links are plain
  anchors: a soft navigation from a page under the project would be intercepted and open the window
  over the page itself. The sidebar's Settings item, when Settings is already on screen as a page,
  reloads it for the same reason. The interception matches any page whose address has one segment
  or more, so a link to a settings or account address from a page outside a project (the consent
  page) is a plain anchor too, or it would be read as a window over a project named after that
  page.
- **The screen behind keeps its header.** While the window is open the address is the part's, so
  the screen's header, its news and the arrivals watcher take the screen from the address when the
  address names one (while a screen loads, the destination) and otherwise from the layout's
  selected segments, and the window's links carry the period and the filters of the screen.

## Consequences

- Every project route renders the slot; when no window is open it renders nothing and loads no
  data. Every route carries a small host; the dialog itself is loaded on demand, after the page is
  shown, and each part is a route that loads only its own forms.
- Back closes the window rather than leaving the screen, and Forward opens it again.
- A part opened directly is a full page, so the same address serves a link from an e-mail and a
  click in the dashboard. Old links to `/[projectId]/settings#…` still open Settings, on the Project
  part.
- The person's parts outside a project (`/account/…` opened directly) show only the "You" group:
  there is no project in the address to list.
