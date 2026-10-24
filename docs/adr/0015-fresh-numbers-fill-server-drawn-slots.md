# 15. What went up since the last read fills slots the server drew

Date: 2026-10-24

## Status

Accepted.

## Context

A screen read again (a refresh, the "N new · Refresh" bar, a screen back from the client cache
read again after 20 seconds) shows new numbers in the same places, and nothing says which ones
moved. The dashboard should mark a count that went up since the last read of the same screen
("+3") and a visit that started since then ("New"), with a short highlight, without any change to
the API: the previous numbers are only on the device that saw them.

Every screen's numbers are drawn by Server Components, two tables are Client Components, and the
first-load budget had about 0.5 KiB left on Overview. A Client Component around every number (the
plan's `FreshNumber`) would have put its code, and the record's, on the first load of every screen.

## Decision

- **Slots drawn by the server.** Next to a count, a screen draws an empty `<span>` with the
  item's domain key and the raw number (`data-fresh-item="page:/pricing"`,
  `data-fresh-value="100"`); next to a visit, one with its start moment (`data-fresh-started`).
  Keys are ids, never labels (labels are translated): `kpi:<id>`, `page:<path>`, `event:<name>`,
  `step:<step key>`, `feature:<name>`, `route:<method> <route>`, `browser:<value>`,
  `country:<code>`, `region:<key>`, `source:<key>`, `campaign:<key>`. Rates get no slot. An empty
  slot is `display: none`.
- **Filled from the watcher's chunk.** The arrivals watcher (ADR 0014) is already loaded on demand.
  Every page notes its read (moment, path and search); the watcher hands each note of the address
  being shown to a manager that reads the slots inside the main content, asks the record for a
  comparison and renders the marks into the slots with `createPortal`. React never manages the
  children of a slot (its props have none), so a refresh updates the slot's attributes and leaves
  the portal alone until the next note replaces it.
- **The record.** Per project, under the `pyxis:seen:` prefix (so signing out forgets it with the
  marks), keyed by the screen, the period's days and every parameter of the address (a funnel's
  steps, Requests' kind and the visit filters change the numbers as much as the period). Each key
  keeps the current read and the one before it: a first read compares with nothing; a newer read
  rotates them and compares with the old current read, as an arrival; the same read shown again
  compares with the previous one without an arrival; an older read (another tab read later)
  compares with nothing. Reads of periods that ended are dropped on every write, and at most 50 are
  kept. Best effort, in memory when storage refuses.
- **What is marked.** A count is marked with the difference when both reads showed the item and
  it went up; an item new to a top list is not marked with its whole value, and a decrease is not
  marked. A visit is "New" when it started after the compared read: by moment, not by id, so it
  holds when more pages of visits are loaded.
- **The highlight.** A row or card that holds an arrival's mark is lit for five seconds by CSS
  (`:has()` on the mark's `data-fresh-shown="arrived"`), and only when motion is welcome. A mark
  shown again from the cache is not lit again.

## Consequences

- The marks cost the first load nothing on screens drawn by the server; the visits and requests
  tables, drawn in the browser, carry the slot's tiny component (about 0.2 KiB each).
- Marks appear after the watcher's chunk is loaded and the read is noted, a moment after the
  screen; nothing of them is in the server's HTML.
- The record is per device: another computer, or a private window, shows no marks on its first
  read.
- A new screen or a new count needs its slot and a domain key; without one it is simply never
  marked.
