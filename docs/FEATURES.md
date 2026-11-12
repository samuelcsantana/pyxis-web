# Features

Every screen and flow of the dashboard and the home page, in full: the states, the edge cases and
the decision behind each rule. The [README](../README.md) has the short list, and every component
with its states is in the [Storybook](https://samuelcsantana.github.io/pyxis-web/).

- The approved brand and design tokens (light and dark), exposed to Tailwind CSS 4
- A strict Content Security Policy and hardening headers on every page
- Storybook with the design tokens page, a page of every control recipe (primary, strong,
  secondary and icon buttons, segmented options, tabs, pills, links, fields) at rest, hovered,
  pressed, focused, unavailable and busy, and stories for those states; the open, busy and failed
  states of the shell (project switcher, Custom period, phone menu, Sign out) and the app's own
  empty pages under "Pages/States"; every story is also an automated accessibility test
- Every control answers the pointer and a tap: hover and pressed states of at least 1.3:1 in both
  themes, the pointer cursor on enabled buttons, colour transitions that respect reduced motion
  (an e2e check fails on anything that still moves when the system asks for less motion)
- Landmarks kept for navigation: figures and stat cards are named groups, not regions; the
  selected period, tab or filter is `aria-current="page"`; the funnel editor's status is a live
  region; a shortened user id's link name starts with the text it shows
- Form fields with a 3:1 border and 16px text on phones (so iOS does not zoom on focus); links
  whose underline thickens on hover, and row links with a visible underline and a 24px target
- Text that follows the reader's default text size: every font size is a rem token (an ESLint
  rule rejects sizes in px); with the browser's text set to 32px every text doubles, no screen
  scrolls sideways at 390 or 1280px, and wide tables scroll inside their card
- Sign-in with a six-digit code sent by email; the page never tells whether an email can sign in.
  The code goes in six cells over one real field (so the phone can offer the code it received),
  is verified as soon as the sixth digit is in, and a refused code stays selected for retyping.
  A missing email, a malformed one or an incomplete code is explained right under its field, in
  the page's language, instead of by the browser's own bubble. The code step shows the address
  the code went to with a Change button, waits 30 seconds before another code can be asked for
  (each one replaces the last, and the API sends at most five an hour), and survives a reload of
  the tab for the ten minutes a code lives (the address and the time it was sent stay in
  `sessionStorage`, forgotten on sign-in or on Change). The page names Pyxis once, in its header,
  and starts the card right under it on a phone; outside the demo it links visitors without
  access to the plans and the live demo, and in the demo a button fills in the demo code. The
  sign-in page and the other standalone pages (page not found, the error screen, no projects yet) share the
  GitHub cover's backdrop, star dust and the faint brand mark, behind one raised card
- The app shell: sidebar with the screens (resting the pointer on one, or reaching it with the
  keyboard, fetches that screen ahead, so the click opens it without a skeleton even the first
  time; a tap on a phone, which has no hover, works as before), project switcher, period selector (today, 7 days,
  30 days or a custom range, kept in the URL across the screens and through Settings, Help and
  Install, together with the filters; a range it cannot use is named with the reason and
  reopened with its dates, never swapped silently), light and dark themes, sign-out, and a menu
  button on phones. The first Tab stop is a "Skip to content" link; below 1024px the menu sits in
  a slim bar that stays at the top while the page scrolls and names the project on screen (the
  Pyxis mark, the project's mark and its name, cut with an ellipsis when long, linking to its
  Overview and read as the Overview's title), and it closes with Escape (the focus
  goes back to its button), when a link in it is followed and when the address changes (Back,
  Forward, a period link); an open menu taller than the screen scrolls inside itself. On a
  computer the logo, the project and the account stay in place and only the list of screens
  scrolls when the window is short: nothing scrolls at 1440×800, and at 1366×650 the project and
  the account stay in view; the account menu scrolls inside itself when it is taller than the
  space above the account. In the sidebar the account email, project names and time zones wrap
  instead of being cut, the time zone only after a slash (`America/` above `Sao_Paulo`), never
  inside a word; the phone's bar, short of room, is the one place that ends a long project name
  with an ellipsis. The Pyxis logo in the sidebar, and the project in the phone's bar, open the
  Overview of the project on screen with the period and the filters of the page. The screens are listed in the order of the questions they answer
  (Overview, Acquisition, Devices, Features, Funnel, Visits, Timeline, Requests), then a labelled
  Project block with Install, tagged "Pending" until the project's first event arrives, which opens
  the install guide inside the settings dialog. The navigation marks the screen on view; the pages
  that open as settings (`/settings`, `/install`, `/help`, an export) mark none. The foot ends with
  the privacy note (a plain line, not a box) and the account: a small avatar with the initial, the
  name (the start of the e-mail, the account has no name) and the plan beside it ("· Pro",
  "· Hobby", "· Pro trial", "· Courtesy", "· No plan", or "· Member" for someone the owner added),
  a chevron, and a gear that opens the settings on General. Both are 44 px tall, and a long name
  wraps instead of being cut. The account menu opens above it: the e-mail, Settings, Language
  (a dialog with a search and the seven languages, each in its own words and in the language on
  screen; Enter takes the first match, Escape closes only the dialog, and the focus comes back to
  the account), Help and support, then, to the owner of the account that holds the project on
  screen, the month's usage: "103,075 of 250,000 events this month", the share, a thin bar gold
  below 80%, orange from 80%, red while the reception is paused, and the day the count resets
  (the 1st, in UTC) or, while paused, the day measuring comes back; it opens Plan and billing in
  the settings and is read as "Plan and billing: …". Then Sign out.
  Members, projects outside any account and an account not yet measured show no usage, and so does
  an API that does not yet name each project's account. Each project in the switcher shows the
  icon of its own site (the API fetches it daily from the project's first
  allowed origin, and this dashboard serves it from its own address, so the Content Security
  Policy needs no other image origin), or its initials when the site has none. The project switcher
  and the custom range form close on Escape (the focus goes back to their button), when the
  focus moves past them and on a click outside, so they never cover the control that has the
  focus; inside the phone menu, the first Escape closes the switcher and the second the menu.
  On phones the header stays compact: the theme toggle sits in the menu bar (every toggle on the
  page follows the same theme), the period presets and Custom are 44px targets on one row, and
  the content starts within 260px of the top of a 390×844 screen (budgets checked in
  `e2e/responsive.spec.ts`). The content is dense on phones too: figures stay on one line,
  cards share the panels' padding, a rate on the Sources table keeps its "6 converted" beside
  it, and routes, paths and event names break between their tokens (`/orders/` `:id`), never
  inside one. The Overview chart is 176px tall on a phone, and each Funnel editor step takes two
  rows of 44px controls; the Features search keeps its button beside the field, and the
  Timeline lookup fits in two rows. On tablets the KPI cards sit two by two and the last donut
  takes the whole row, so no card is left alone on a line; an open drawer holds the page behind
  it still
- The overview: visits, identified users, conversions and the write error rate, each with its
  change, the period that change is measured against ("vs. previous 30 days") and a sparkline;
  the Conversions card names the goal it counts and, for a project with more than one goal,
  picks another (`?goal=<id>`, kept in the address and in the CSV links; the first goal leaves the
  address bare, and a goal the project no longer has falls back to the first with a line saying
  so). Each card links to the list behind its figure, in the same period: the visits, the
  identified visits, the visits that reached the goal, and the failing routes on Requests (no link when the figure is zero). Page views and named events per day
  ("Activity per day") as lines or a table, with the same days of the previous period dashed
  behind them (a single day shows its two totals instead of a one-point chart). Each card is
  also a toggle that plots its own figure per day instead (`?metric=visits`,
  `identified-users`, `conversions` or `write-errors`, kept by the period links), the write error
  rate in percent with a gap on days without writes; pressing it again goes back to the activity.
  A pointer over the chart shows that day's values beside the previous period's; the table stays
  the accessible way to read them. The top pages (views and visits) and events (count and the visits that had
  them), each opening its visits; "When visits start", a week of hours (Monday first, in the
  project's time zone) shaded by the visits whose first page view happened then, named by its
  busiest hour and readable as a 7 × 24 table, adding up to the Visits figure; a footnote defining visit, identified user, conversion, write
  and failure, and when a change is coloured. Every percentage sits next to the totals it comes
  from, and a division by zero shows a dash, never `NaN%`
- Unique visitors on the Overview, for a project whose owner turns them on in Settings (off by
  default; the API counts them without an identifier,
  [pyxis-api ADR 0055](https://github.com/samuelcsantana/pyxis-api/blob/main/docs/adr/0055-unique-visitors-without-an-identifier.md)).
  A card after the figures and the chart shows a headline, the new and returning visitors of the
  same span (they add up to it), and stacked bars of new and returning visitors per day, also as a
  table, with the values of the hovered day; a single day shows only its figures. The headline is
  exact for one day (the day's first visits, first this month and first today) and for one
  calendar month held whole or up to today (the month's first visits and first this month, "so
  far" when the period ends today), and the month's card says its days do not add up to it. Any
  other period, the default 30 days included, shows the sum of the days, labelled "Sum of daily
  unique visitors" with "a visitor who came on two days counts twice", because no one can add up
  the unique visitors of different days. New is a browser's first visit (or its first since its
  data was cleared); returning is its first this month or its first today; another visit the same
  day never counts. With the option on and no visit counted yet, the card says the count starts
  with the next visits; with it off, the card is not there. The footnote says the count is per
  browser, not per person (another device, a private window or cleared data count again), and adds
  that almost everyone shows as new in the first weeks when nine in ten unique visitors or more are
  new, since the dashboard does not know when the option was turned on. Never "people": the card
  counts visitors and browsers. In the demo the store counts them and the docs site does not; each
  demo visit's kind comes from the last digits of its id, counted only on visits with a page view,
  so a day never has more unique visitors than visits
- One word per idea across screens: "Write error rate" on the Overview and on Requests, "Failing
  only" for the failed-requests filter of Requests and of the Timeline, "Anonymous" for a visit
  without a user id, "items" for everything the Timeline lists; Overview, Visits and Requests
  define visit and write with the same sentence. Event names read as words with their acronyms
  in capitals (`cta_clicked` is "CTA clicked"), and every percentage, change and point change
  has one decimal ("62.0%", "+10.0% (+40)", "+2.0 pt"), so a column never mixes precisions
- Honest comparisons: a range that ends today is compared with the previous period up to the same
  time of day, and the card says so ("vs. yesterday until 10:03"). A change shows its size next
  to the percentage ("+12.4% (+525)"), reads "no change" when nothing moved, and is coloured as
  good or bad news only above 20 in the previous period and beyond 1 % (0.5 points for the error
  rate); the colour is also said in words to screen readers. A day without writes is a gap in the
  error rate line, not 0 %
- Conversions counted as visits: a conversion rate is the share of visits that reached the goal
  at least once, by sending its event or opening a page its path matches (Overview, Devices,
  Acquisition), so it never passes 100 %; the Overview keeps the times it was reached beside it;
  without a goal, the Overview and Devices say so in one line with a link to the Goals settings.
  Devices and Acquisition count the first goal
- Goals: up to ten per project, each a named event the site sends or a page path where `*`
  matches any characters (the API's rules, checked before anything is sent). Under the Overview's
  figures a Goals table gives each goal its kind and target, the visits that reached it, the
  times it was reached and its conversion rate over the period and the active filters; each row
  opens the visits that reached it and filters every screen by it. In Settings › Goals the owner
  of the account adds, edits and deletes goals (deleting asks first), the first one marked as the
  one the reports count by default, with the count against the limit and the API's refusals (the
  limit, the plan, a goal deleted elsewhere) named in the panel; everyone else reads the list. The
  order is the order the API keeps; a deleted goal leaves its place empty. A project's former
  conversion event is its first goal, so nothing changed for a project that had one
- Reached goal: a visit filter like the others (`?reached_goal=<id>`), chosen in the Visits form
  among the project's goals, named on its chip by the goal's name, and carried to every screen
  that takes the filters; an id the project no longer has is left out with a note instead of
  failing the screen
- Revenue: a site sends it as a number in a `revenue` property of an event (from 0 up to, but not
  including, 1,000,000,000, in the project's currency; the API drops a text or a negative
  amount), and a goal on that event sums it. The Overview gets a Revenue card after Conversions
  for the goal counted, against the previous period with a sparkline and the average per
  conversion; it is a figure, not a toggle of the chart, because the API gives no revenue for the
  days of the previous period. The card stays away for a page goal (pages carry no revenue) and
  while the goal earned nothing in either period, so a site that never sends revenue sees no
  empty money card. The Goals table, the Acquisition sources and campaigns get a Revenue column
  once any row earned some (a dash for a page goal or a row that cannot earn), and each event
  step of the Funnel says what the event that completed it brought. Amounts follow the reader's
  language in the project's currency: exact in tables, whole (compact past 100,000) on the card
- Devices: a Reach card first, counting the continents (the five of UN M49, named under the
  count), countries, regions and, for a project that keeps the city or a period that holds one,
  cities the visits came from, then the region with most visits and its share of them (the
  country when no visit had a region); the place stands apart from the sentence, so no language
  needs an article for it, and a period where no visit has a known country says so instead of
  counting zeros. Then device type, browser and operating system as donuts whose legend is a
  table of every value with its visits and share, conversion by device, the countries by name and
  the regions
  (a state or a province: the ten with most visits by name, the rest, and the visits the edge
  network could not place, which includes every visit from before regions were recorded); with a
  goal, each browser, system, country and region also gives its conversion rate;
  each device type, country and region opens its visits. For a project that turned the visitor's
  city on in Settings, or a period that holds a named city, a Cities table follows: the twenty
  approximate cities with most visits, each with its region (and the country when they span
  several), the rest, and the visits without a city, with the conversion rate under a goal;
  each city opens its visits by its region and its name, since the same name exists in
  several regions
- Acquisition: paid visits and the top channel (the top unpaid one when Paid leads, so the two
  cards never repeat each other) with their share of every visit, visits per day
  stacked by channel (chart or table; a pointer over a day lists its channels and total), and the sources with their conversion rate and the visits
  that came from an ad click (an ad click that arrives with no campaign source and no referring
  site is a source of its own, "(ad click)"); each source opens its visits, and its channel the visits from
  that channel; the campaigns (`utm_campaign`) that brought the most visits, up to 20, each with
  the source that carried it, its conversion rate and its ad click visits, open the visits of
  that campaign from that source
- Features: the most used events and the most visited screens, with count, visits, a daily trend
  and the share of the ranking; a search by name that lives in the URL; each event opens its
  property breakdown: per key, the ten most frequent values with their share, count and visits, and
  the rest as "Other values". A key whose every value shown reads as a number (such as the
  `seconds` of `article_read_100`) also shows its median and its middle half (the 25th to the 75th
  percentile, from the API's `/features/properties/summary`), and a "Split by" select splits them
  by the value of another key of the event (the ten most carried values, then "Other values").
  Every event, screen and value opens the visits that had it, with the
  period kept; a link's name starts with the text it shows ("/pricing: see its visits"). The
  screens tab also shows where visits start (with how many left after that page) and end, and how
  long they last from their first to their last event: the median, the share that viewed one
  page, and seven length buckets — all from the visits the Overview counts
- Requests: the failures of each day stacked by what went wrong (client errors, server errors,
  no response; chart or table, a pointer over a day lists them), then every write by route with
  its success and error shares, status codes, median and 95th percentile duration; a
  keyboard-accessible details panel with the screens where the route failed, the route day by
  day (calls, failures, median and p95, read by a Server Action when the panel opens, so the
  table needs no navigation), its latest failures with their error code, and a link to every
  visit with a failed call to that route; "failing only" and screen filters kept in the URL. A
  "Failed reads" tab lists the GET calls that failed by route and per day, as counts only (a site
  may send its reads only when they fail, so there is no read error rate). The CSV of the routes
  carries the p95 too
- Funnel: 2 to 8 steps (a page path with `*`, or an event name) counted per visit or per person,
  with the share that continued and the drop-off at each step, the median time each step took
  after the one before and the median time to finish; each step's figure links to who reached
  it and each drop-off to who left before it, a list of the visits or people (newest first, 50 at
  a time) that opens each one in the Timeline; per visit, the same funnel split by device type or
  by channel (`?by=channel`), every segment on one scale with its overall conversion, adding up to
  the funnel; a keyboard-operable step editor, and the steps kept in the URL so a bookmark is a
  saved funnel
- Timeline: everything one person (by user id) or one visit did, in order, with each visit's
  device, channel and length, every page view, event and request with its properties and status
  (a request reads "164 ms · order_number_in_use", its status shown once, as the chip),
  and filters for page views, events, requests and failing requests only; older visits load on
  demand, and a failed request in the Requests screen links to its visit; a visit opened by its id
  links to every visit of the person it was identified as; an id it cannot look up stays in the
  field, marked invalid, with an example of what that kind of id looks like; for a project that
  counts unique visitors, each visit and each row of Visits carries a chip with its kind ("New
  visitor", "Returning, first this month", "Returning, first today", "Again today"), whose
  tooltip and accessible name say whether it counted in the day's unique visitors; nothing when
  the option is off or the visit carried no kind
- Unique visitors in Visits: for a project that counts them, a "Visitors" choice keeps only the
  visits that counted (unique visitors of each day, of each month, or new visitors only), so each
  browser shows once per day or per month; the total names what it counts and equals the
  Overview card for the same period and filters, and the card's "See these visits" opens that
  list. Visits are never merged: the row is the browser's first visit of the day or month
- Visits: every visit of the period, newest first, with its start, length, entry page, page
  count, first named events, failed requests (reads and writes), device and place (city, region
  and country, or as much of them as is known), channel and account; filters for the pages it viewed (up to
  three, `*` matching any characters), an event with an optional `key=value` property, the
  channel, the device, the browser, the system, identified or anonymous visitors, the country,
  the region (`BR-SP`), the city (its exact name, best sent with its region), the
  source and campaign (as Acquisition names them), a request it made (`POST /orders/:id`) and
  whether it had a failed request, all kept in the URL, with the number
  of matching visits above the list; on a phone the filters fold behind a "Filters · 2 active"
  button, open when some are in use or were left out, and each visit is a card with every
  column; each row opens its visit, and an identified one its person, in the Timeline
- Filters on every screen: the Visits filters but the request route, plus the browser and the
  system, kept in the URL and sent to every report but the Timeline, each one selecting whole
  visits (a visit that viewed `/pricing` counts with all its events); the sidebar, the period, the
  tabs, the searches, the drill-downs into Visits and the CSV files keep them, and the Timeline
  drops them. A filtered screen shows them as chips under the top bar ("Filters", each chip
  removable, "Remove filters"), sticking with the top bar from `lg`; its KPI changes compare with
  the previous period "same filters", its chart captions name the filters, an empty filtered
  period says "No visits match these filters" instead of the install guide, and the news bar and
  the "+N" and "New" marks pause while a filter is on ("N on the site now" and the menu counts
  stay). The chips are a parallel route slot (`@filters`) of the screens layout, drawn on the
  server, so they add no client code. Each named row (device types, browsers, systems, countries,
  regions, cities (by region and name), sources, channels, campaigns, events, screens, top pages and top events, never an
  aggregate such as "Other") has a filter button right after its name: it adds that value to the
  filters of every screen, shows a filled × once it is on and then removes it, while the name
  still opens the row's visits
- CSV export of what a screen shows, for the same period and filters: the Overview's activity
  per day (with every daily figure of its cards), top pages and top events; the routes of
  Requests (writes or failed reads); the Features ranking (events or screens, search kept); the
  Acquisition sources, campaigns and visits per day by channel; every Devices breakdown in one
  file, named in a `dimension` column; and the newest 1,000 visits matching the Visits filters, read page
  after page on the server. The file is named after the screen, the table and the dates
  (`pyxis-overview-pages-2026-09-08-2026-10-07.csv`, ending in `-filtered` under filters), starts
  with a UTF-8 byte order mark so
  spreadsheets read accents, and keeps a spreadsheet from running a cell as a formula: a text cell
  that starts with `=`, `+`, `-`, `@`, a tab or a carriage return gets a leading apostrophe
- News on the menu: each screen's item counts what arrived since that screen was last read on this
  device (visits on Overview, Visits, Devices and Acquisition; conversions on Funnel; named events
  on Features; failed requests on Requests, in red), never on the screen being shown, `99+` from
  100 on, with the words for a screen reader; on a phone the menu button gets a dot. The dashboard
  asks every 30 seconds while the tab is visible and the period includes today, and stops after
  30 idle minutes ([ADR 0014](adr/0014-arrivals-are-polled-not-streamed.md))
- News on the screen being shown: when something of its kind arrived after that screen was read,
  a "3 new visits · Refresh" button appears in its own row between the top bar and the content
  (never over the content, where it would cover the cards' buttons), and stays under the top bar
  while the page scrolls; it reads the screen again in place, without a skeleton and without
  touching the top bar, says "Refreshing…" until the new read lands, then goes away and hands the
  keyboard focus to the content if it had it
- Visits on the site now: beside the Overview title, while the period includes today, the visits
  with an event received in the last five minutes ("4 on the site now"), updated by every answer
  of the same 30-second question, with a green dot that pings only when someone is there and
  motion is welcome
- What went up since the last read: when a screen is read again for the same period and filters,
  each count that went up shows "+N" and each visit that started since shows "New", and their row
  or card is lit for five seconds when motion is welcome; the marks stay while only the display
  changes (the chart's metric, a step's list, a route's details) and nothing new arrives; the
  numbers each read showed are kept on the device
  ([ADR 0015](adr/0015-fresh-numbers-fill-server-drawn-slots.md))
- Loading, empty and error states shared by every screen; the top bar of the eight screens lives
  in their layout and stays in place between them (the same element, with its title, subtitle,
  period and selector updated: [ADR 0012](adr/0012-persistent-screen-topbar.md)), so while a
  screen loads only its content shows a skeleton shaped like it (or a generic one, drawn by the
  layout, when the tap came before the screen's prefetch); a screen visited in the last five
  minutes comes back at once from the browser's cache, and is read again in place when it is more
  than 20 seconds old ([ADR 0013](adr/0013-a-visited-screen-comes-back-from-the-client-cache.md));
  a change of period, tab, filter,
  screen or Overview chart figure marks the clicked link or KPI card with a bar from the first
  frame and the content busy
  (`aria-busy`, a thin bar along its top) until the server answers; the filter and search forms
  submit in place with `next/form` (no new document) and their button says "Applying…" or
  "Searching…" meanwhile, and they still work as plain GET forms without JavaScript; an empty
  period shows how to install
  the SDK until the project's first event, and afterwards "Nothing in this period" with the time
  of the latest event and a link to the last 30 days; when the API cannot be reached at all, a
  branded error page with "Try again" instead of the framework's default; a "Page not found"
  page, titled as such, for an unknown address or project, which keeps the project's navigation
  around an unknown screen of a known project
- A demo mode with invented data and a visible banner when no API is configured, published as
  the [live demo](https://demo.pyxis-analytics.dev): no sign-in and no real API. It holds
  two imaginary products, a store and a documentation site. A seeded generator draws every
  visit of each day from the product's catalog (about 90 a day, with devices, sources and
  campaigns, a journey through the pages, events, writes and failed requests), the same visits
  for the same day on every server, and each screen reduces those visits the way the API's
  queries do. So the screens agree by construction: Visits lists as many visits as Overview
  counts, every filter and drill-down link finds the visits behind its figure, every failure on
  Requests opens its visit, and the Funnel counts the visits or people that went through its
  steps. Today only shows what has happened by now. The Funnel opens on an example funnel, and
  the banner's "What is Pyxis?" links to the home page in the demo's language
- A public page for a share link (`/share/<token>`), without signing in: a "Made with Pyxis"
  strip linking to the home page, tabs for the five shared screens (Overview, Acquisition,
  Devices, Features, Funnel) that keep the period, the period selector, the goal picker and the
  row filters, never the identity or property filters. No account menu, no Visits, Timeline or
  Requests, no CSV, no link to Settings, and the Funnel never lists who stopped. The viewer's
  browser reads the card and the reports from the API (its rate limit counts each viewer), and
  two Server Functions plan the reads and draw the answers with the dashboard's own report
  views (ADR 0017). A closed, expired or unknown link, and an address that is not a token, show
  the same page that never says why; too many requests ask to wait a minute. A link with a
  password shows only a password form, without the project's name: the password goes to
  `/v1/shared/<token>/unlock`, the unlock it answers is kept in the tab's `sessionStorage` (never
  a cookie or `localStorage`) and sent as a Bearer on every read; a wrong password keeps what was
  typed and says so, too many attempts say how many minutes to wait (from `Retry-After`), and an
  unlock the API stops accepting (expired, or the password changed) brings the form back. The
  demo has one invented protected link whose password the form itself shows. Kept out of search engines by `X-Robots-Tag` and the robots meta tag. In the
  demo, `/v1/shared/<token>` on the dashboard serves the demo store's reports for the demo
  token, and never answers a report when an API is configured (404, or the sign-in redirect
  without a session)
- A settings dialog over every screen of a project, opened by the gear beside the account, the
  account menu and Install, at `#settings/<section>` in the address: the page under it is not read
  again, not drawn again and not scrolled, and the dialog's content is read once per opening by a
  server action. A fixed header with "Settings" and a close button; on the left the sections in
  three groups, Account (General, Plan and billing, Sessions, Access tokens, Connected apps),
  Project with its name (Install, Project, Goals, Public link for the owner, Privacy, Keys,
  People, E-mails, and Export and delete for the owner) and Support (Help and support); on the right the section, its parts one under
  the other, separated by a line, without the section's name repeated. General holds the e-mail,
  the appearance as three pictures (light, dark, the system's) and the language. Moving between
  sections replaces the address, so Back closes the dialog in one step, and Forward opens it
  again; Escape, the close button and a click outside close it too, and the focus goes back to
  what opened it. A link inside it to one of the pages it replaces (Install, Help, the Settings
  page and its keys or connected apps) opens that section instead. Choosing a language inside it
  keeps it open, in the new language. On a phone it fills the screen, first as the list of
  sections and then one section with a back arrow; in a window under 512 px tall it takes the
  whole height
- A Settings page per project (`/settings`, kept for the links in e-mails), with the same panels
  as the dialog. It opens with the person's own e-mail switches: the weekly digest (the Monday
  e-mail with the week that closed on Sunday) and, under "Alerts", the three e-mail alerts of the
  daily run (no events for 24 hours, failed writes above their usual rate, a drop of the first
  goal), each with one line saying when it fires. All four are on by default; each switch saves
  only its own e-mail through a server action that re-checks access, moving back with an alert
  when the API refuses. The alert e-mails link to `/settings`, and `#settings-email-heading`
  lands on the panel. For the project's owner, a Slack panel follows: the three alerts posted to
  one channel through a Slack Incoming Webhook. With none connected, three steps (create an app
  in Slack's own guide "Sending messages using incoming webhooks", linked; turn on Incoming
  Webhooks and pick the channel; paste the address) and a field whose address is checked
  against the API's pattern (`https://hooks.slack.com/services/…`, at most 256 characters)
  before Save. Once saved the page shows only the masked address (`hooks.slack.com/…/` and its
  last four characters), when it was connected, or that it broke and what Slack answered; "Send
  test" says plainly whether Slack accepted it, said the webhook is gone (marking it broken) or
  could not be reached, and too many tests ask to wait a few minutes; Replace opens the form
  again and Remove asks first. On Hobby the form gives way to "Available on Pro", and a stored
  webhook still shows with Remove. Other people see no Slack panel; the demo shows an invented
  connected webhook. Then the admin's sessions:
  every device where they are signed in, named by the browser and system classified at sign-in
  (never the user agent), this one marked, each with a button to end it, and "Sign out
  everywhere" below the list. Then the admin's access tokens, for an AI agent or a script that
  reads the same numbers: each with its name, creation, last use and expiry, and a button to
  revoke it; a form creates one with a name and a lifetime (30, 90 or 365 days) and shows the
  token once, with a copy button and how to send it, and offers no new one past ten. Then the
  apps the admin connected through the Claude connector (Claude, Claude Code): each with its
  host, when it was connected and last used, and a button to revoke it, after which the app asks
  to connect again. While the API keeps the connector open, a box shows how to connect Claude:
  the three steps in Claude, the connector's address and the Claude Code command, each with a copy
  button; while it is closed the box is hidden, so the page never shows an address that answers
  404, and the list still shows. For the owner, Public link: what a link opens (the summed
  reports, never visits, the timeline or requests) and a form with who it is for and when it
  expires (never, 7, 30, 90 days or a year) and an optional password (8 to 128 characters, kept
  as typed, checked before sending), which shows the address on this dashboard once, with
  a copy button, since only the link's fingerprint is kept; then each link with its creation and
  expiry (an expired one marked), a "Password" badge when it has one, "Set password" or "Change
  password" and "Remove password" (which asks first), and a Revoke button that asks first. On
  Hobby the form and the password buttons give way to "Available on Pro", and the list and Revoke
  stay. Below it,
  the project. The owner of its account edits it: name, up to five allowed origins (typed as
  `shop.example.com` or a full URL, saved as origins), time zone and currency (common ISO 4217
  codes, the real first, named in the reader's language; changing it converts nothing), each
  problem named under
  its field before anything is sent (the conversion event moved to the goals, so saving the
  project never touches the first goal); creates a public key or a secret key
  (shown once, with a copy button) and revokes any key but the only public one; and deletes the
  project with its name typed again. Two options of the project have a panel each, a switch for
  the owner and a sentence for everyone else: the visitor's city (turning it off asks first,
  because the cities already recorded are erased within 48 hours) and unique visitors (turning it
  off asks first too, but erases nothing: new visits stop being counted within a minute, each
  browser's marker is deleted the next time it sends events and gets an answer, and the visits
  already counted keep their kind until they are erased after 13 months). The People panel lists who opens the project; the owner
  adds an address (the person gets an invitation e-mail in the language of the page, and the
  account has room for ten people on the paid plan and one on the free plan, the owner
  included) and removes anyone but the owner. The
  owner also asks for an export of every event the project keeps: the API prepares a compressed
  CSV in a few minutes and e-mails a link to the export's page
  (`/[projectId]/exports/[exportId]`), which checks again on its own while the file is being
  prepared and downloads through a route that asks the API for a fresh five-minute link each time.
  Someone the owner added sees the same settings read-only,
  and the operator's own projects (no account) still change through the API's command line.
  Read-only for everyone: the live public keys (a public key ships in the site, so it is shown in
  full), when each live secret key was created (never the key, which the API keeps only as a
  hash), how many months events are kept, and whether the project still waits for its first
  event. Three states the operator sets show where they matter: a project with no live public
  key (the operator revoked it, or the account's access ended, and a revoked key never works
  again) says in Settings and on Install that it is not measuring and how the owner replaces the
  key; a project whose event reception Pyxis suspended carries a banner on every screen (since
  when, the reason for the owner, where to contest it) while its screens stay open; and a
  project whose deletion Pyxis holds says so in place of the delete form
- Sign-up for the hosted plan (`/sign-up`), shown only while the API keeps it open; otherwise a
  calm "not open yet" page with the live demo. A plan (monthly or yearly), an e-mail address and
  the terms of the version the API names, then the sign-in's code cells; the verified sign-up
  keeps its session through the same Server Action as signing in and goes straight to Stripe
  Checkout. Stripe returns to `/welcome?account=<id>`, which waits for the confirmation (checked
  every five seconds) and then offers the first project; leaving Checkout returns to
  `/sign-up?step=plan`, which asks the owner to finish the subscription, as the empty home does.
  The free plan follows the API's answer (`free_plan`), never a build flag: while it is closed
  the sign-up is the one above; while it is open the form says "Free: up to 10,000 events a month,
  on one site. No card.", has no plan to choose, and the verified owner, whose account is already
  free, goes to `/welcome?account=<id>` (the free plan's limits from the account, then the first
  project); while it is full the account is created and waits for a place, and the form offers to
  subscribe now, also on a later visit. Where a verified owner goes follows the account status
  the API answers, so a returning owner whose account runs goes to the dashboard, and the free
  place it answers (`free_place`): an address whose mailbox already has a free account
  (`taken_by_same_mailbox`, one free account per mailbox) goes to the dashboard to finish its
  subscription, never to the wait for a free place. When the API's daily cap of new sign-ups
  answers (`429 sign_up_busy`), the form says the day's limit of new sign-ups was reached, to try
  again in a few hours, and links the support address, with no number in the text; any other 429
  keeps "too many attempts from this address". The demo reaches the case with
  `busy@example.com`
- A first project for the owner of a hosted account: "Create your first project" on the empty
  home, or "New project" in the project switcher, opens `/new-project` (name, site address, the
  browser's time zone, an optional conversion event; ten projects on the paid plan, one on the
  free plan). The new project
  opens on `/[projectId]/install`. Step 1 has three keyboard tabs (`role="tablist"`, arrow keys,
  Home and End), opening on "Yourself": the npm and plain-HTML snippets with its public key and
  the API's address, each with a copy button. "With an AI agent" holds a ready request for Claude
  Code, Cursor or another coding agent, written in the dashboard's language with the project's
  real public key, the API's address and its first allowed origin; it points the agent at the
  home page's `llms.txt` and ends by asking for the list of files changed and events created, for
  review. Under it, the four steps (open the repository, paste, review, publish) and what the
  agent will change (`package.json`, the `init`, a `track` per important action, the CSP), with
  "it writes nothing to Pyxis". "Google Tag Manager" is for a site that already loads Tag
  Manager: five numbered steps (add the Pyxis Analytics template from the Community Template
  Gallery, or import `template.tpl` from `pyxis-gtm-template` while the gallery does not list it;
  a tag with the action Initialize and the project's public key, with a copy button, and the API's
  address for its Endpoint field; the trigger "Initialization - All Pages"; optional Track event
  tags sequenced after it; submit and publish), Tag Manager's own labels in bold, then one line on
  Consent Mode (by default, `analytics_storage` denied loads nothing) and one for Nuvemshop's paid plans.
  "Shopify" installs a store through its theme: four numbered steps (Online Store › ⋯ › Edit code;
  the module snippet with the project's key pasted before `</body>` in `layout/theme.liquid`, with a
  copy button; the store's own domain and, if it also opens there, its `myshopify.com` address
  among the allowed origins, linked to Settings; open a page of the store), then one line saying the
  checkout steps and the completed purchase are not measured (Shopify runs no theme code there) and
  one that a theme update or switch can drop the edit. "WordPress" installs a site through the free
  WPCode – Insert Headers and Footers plugin: four numbered steps (Plugins › Add Plugin, search
  WPCode, install and activate it, linked to its wordpress.org page; the classic snippet, which loads
  `dist/pyxis.global.js` from jsDelivr and calls `pyxis.init`, pasted in Code Snippets › Header &
  Footer › Header, with a copy button; the site's address from Settings › General among the allowed
  origins, linked to Settings; clear a cache plugin's cache and open a page), then four lines: a
  site with Google Tag Manager can use that tab, a plugin that delays or combines JavaScript must
  leave both scripts out, the snippet survives a theme update, and WordPress.com needs a plan that
  allows plugins. The plugin's and WordPress's own labels appear as their translations show them.
  The tabs wrap to a second row on a phone. Under the tabs, two optional blocks: how to record
  revenue, and "Automatic events": the npm snippet that imports `autoEvents` from
  `pyxis-analytics/auto` and switches on outbound links, file downloads and form submissions, what
  each event keeps (the link's domain; the file's extension and templated path; the form's id or
  name, never a typed value), and that the Tag Manager template and the Shopify and WordPress
  snippets do not record them. Every snippet pins the jsDelivr version to the `pyxis-analytics`
  range this dashboard installs. Step 2, shared by the tabs, waits for the first event, checked
  again every few seconds (the chosen tab survives each re-read); once it arrives, "Open the
  dashboard" and a ready question for Claude about the project. Step 3, optional, connects Claude
  through its connector directory or `claude mcp add` against the API's `/mcp`, read-only and
  revocable in Settings. Below the `md` breakpoint a notice says installing happens on a computer
  and copies this page's address to send it there. The plain-HTML snippet loads the exact
  `pyxis-analytics` version this repository depends on (read from `package.json`), so the weekly
  Dependabot update of the package moves the snippet with it
- A Help and support page (`/[projectId]/help`, from the foot of the sidebar): the support address with
  a copy button, the reply time of the reader's plan (2 business days on the paid plan, 5 days on
  the free plan, as the Terms of Use set), the installation links (the install guide, the Tag
  Manager template's instructions, the tracker's README, `llms.txt`), the GitHub question form and
  the private security report. Account and billing ends with the same address and reply time,
  and the code step of sign-in and sign-up names it for a code that does not arrive
- An Account and billing page (`/account`; the same account opens as Plan and billing in the
  settings dialog) for the owner of a hosted
  account: the plan and its state (free trial, active, payment failed, ending, ended with the
  deletion date, sign-up not finished), the events measured this month against the quota, the
  limits, and a button to Stripe: "Finish subscription" with a monthly or yearly plan, or
  "Manage billing" for the customer portal. The dashboard warns, under the demo banner's place,
  when an owned account's payment failed, its access ends or ended, measuring is paused, or the
  month reached 80% of its events; reading the accounts for that warning never blocks a page.
  The same page closes an account at once, with the owner's address typed again: the
  subscription is cancelled, the keys are revoked, a first payment of the last seven days is
  refunded, and the page says when everything is deleted (and keeps saying it after the page
  refreshes to the ended account). An account Pyxis suspended shows the date, the reason and the
  address to contest it, every dashboard screen of its owner carries a banner, and the screens of
  its projects open `/account-suspended` instead of failing; an account whose deletion Pyxis holds
  says so, names no deletion date, and its projects explain why they cannot be deleted. An
  ended account not deleted yet subscribes again from the same page (monthly or yearly, no new
  free trial, billing from that day, new keys to create), and the welcome page tells a returning
  subscriber that the subscription is active again; an account Pyxis exempted from the pause
  shows until when. The sign-up says the free trial is one per customer. On the free plan the
  page shows the month against the free plan's events and where measuring pauses, the paid plan
  with "Subscribe now" (monthly or yearly, charged that day, no trial), and, after a withdrawal
  that left the account with more projects or people than the free plan holds, the day it has
  to fit by and what to delete or remove; the banner of a paused free account says measuring
  comes back on the 1st or within a minute of subscribing, and the welcome page waits for the
  payment and then confirms the subscription (a cookie set when that Checkout opens tells this
  return from a new free account's welcome). While the API says the free plan is open or full,
  a subscribed account learns what cancelling does (back to the free plan with its projects and
  data when it holds one project and one person, otherwise what to remove or the account ends;
  only when the API says terms with the free plan bind the account, `bound_by_free_plan_terms`,
  and never when another free account belongs to the owner's mailbox, which the API answers as
  `mailbox_has_another_free_account`; an API that does not answer it leaves the check to the
  accounts the owner has),
  a paid one can withdraw within 7 days of its first payment (refunded, back on the free plan;
  the API answers when the 7 days are over), and the texts name no free trial. While the free
  plan is closed, or its state cannot be read, the page is as before
- A consent page for the Claude connector (`/connect?request=<id>`), where the API's OAuth
  server sends the browser when Claude or Claude Code asks to connect. A visitor without a session
  signs in first and comes back to the same request. The page names the app by the API's own name
  for it and the host of its client document, where the browser goes back to (with a warning when
  the answer goes to a program on this computer), what the app may do (read the numbers of every
  project the admin can open, never change anything) with the list of those projects, and the
  admin's address. Allow sends the browser back with a one-time code; Cancel sends it back with
  the refusal. A request that ended (answered, or older than ten minutes) says so, and an admin
  who already keeps ten connected apps is pointed to Settings. The demo has no such page
- The interface in English, Brazilian Portuguese, Spanish, German, French, Italian and Dutch (see
  [Internationalization](../README.md#internationalization))
- A home page for `pyxis-analytics.dev`, built by the live demo's deployment and served only on
  that host: English at `/`, Brazilian Portuguese at `/pt-br`, Spanish at `/es`, German at `/de`,
  French at `/fr`, Italian at `/it` and Dutch at `/nl`, each with its
  own title, canonical address, `hreflang` alternates, share image and `SoftwareApplication`
  structured data, plus its own `robots.txt`, `sitemap.xml` and an `llms.txt` that tells language
  models and coding agents what Pyxis is, how to install the tracker (with a bundler, through a
  coding agent, with the Google Tag Manager template, in a Shopify theme or with a WordPress header plugin), the rules an
  integration must follow and where to send a person who needs support (404 on the demo and
  the dashboard). The footer's Support column and the last FAQ answer give the support address
  and the reply times. Every address that names a
  language always opens in it; `/`, which names none, opens before any of its content paints the language
  chosen before in the header's language select, then the first language the browser asks for
  that the page ships (unless the visitor came from a Pyxis page), and otherwise stays in English,
  so crawlers read the same English page as before; the page it opens keeps the site the visitor
  came from as the visit's source ([ADR 0010](adr/0010-home-page-language-kept-on-the-device.md)).
  The page sets no cookie (the language and the theme chosen stay in `localStorage`, applied by
  an inline script before the first paint; the robot's dismissal, the section carried to another
  language, the mark that skips the hero's entrance after a switch and the referrer carried from
  `/` to the language it opens stay in `sessionStorage`, for the tab). The header keeps one row
  in every language on a 390px phone, on a tablet and from 1024px up (checked in
  `e2e/landing.spec.ts`): the demo and four section links sit in a row from 1024px and
  behind a menu button between 768 and 1023px (the menu closes once a link is chosen), and a
  phone shows only the brand, the language, the theme and Sign in. Its sections: what never gets stored, what
  the dashboard answers (each card opens that screen in the demo), how a site installs the
  tracker (the places it installs in, by name, WordPress among them, then four tabs: with code,
  with the Google Tag Manager template, in a Shopify theme and with the free WPCode plugin on
  WordPress (the classic snippet), the last three marked as needing no code and the Shopify one
  saying the checkout is not measured; while sign-up is open, also a highlighted card with a ready request to paste into a
  coding agent, the coding agents it works with by name, a large copy button and a second robot
  that cheers when the request is copied), the sites it measures, how it is built, the architecture, a comparison, the hosted
  plan's price (monthly or yearly, a CSS-only switch, and "Start your free trial" to `/sign-up`
  on the chosen interval while the API says sign-up is open, read on the server and cached for
  five minutes, or how to ask for access by e-mail while it is closed; on a page in another
  language than Portuguese, an approximate price in the reader's currency under the price in reais,
  euros or US dollars by the page's language and both in Spanish, in whole units, from the European
  Central Bank's daily reference rates, read on the server, cached for a day and left out when they
  cannot be read), a FAQ (including whether it works on a Shopify store, on WordPress and with Google Tag Manager) and the
  introduction post. Once the API says the free plan is open, the
  same status turns the page to it: the hero leads with "Start free" and "See the Pro plan",
  pricing shows a Hobby card (what it includes, the Tag Manager and Shopify install, and under its
  button the no-card and 10,000-event pause terms) and an outlined Pro card that lists only what
  it adds ("Everything in Hobby, plus:" 250,000 events with a "25×" mark, 10 sites, 10 people and
  e-mail support within 2 business days) and has no button: everyone starts on Hobby and subscribes
  in Account and billing. Both plans have the same analytics; the pricing lead charges nothing per
  visitor or per identified person, and the Pro numbers come from one set of constants beside the
  free plan's, so the cards, the FAQ, Account and billing and `llms.txt` never disagree. The
  integrations kept for Pro (pyxis-api ADR 0057) are listed on the Pro card only once each ships;
  until then the "Available on Pro" panel (Storybook, `Account/Available on Pro`) waits for them:
  it names the feature, sends the owner to Account and billing and tells an invited person that
  only the owner subscribes, and the dashboard recognizes the API's `plan_required` refusal. The yearly option carries its saving ("−17%") and shows its price per
  month with the yearly charge under it. The FAQ answers for two
  plans and asks what happens at 10,000 events instead of how the trial works, and the
  description, the structured data and `llms.txt` name the Hobby plan; while it is full, the hero
  and the free card say so. Every screen and e-mail names the plans Hobby and Pro. The address follows the section being read, and switching language opens the
  other page on that section, still from the copy the speculation rules fetched ahead. A robot
  points to the Claude connector section and flies off once the reader gets there or dismisses
  it. Motion is CSS (scroll-driven reveal, `::details-content`, a cross-document view transition
  between the languages, a glide to the section a link of the page points to) plus a count-up of
  the preview figures, and none of it runs under `prefers-reduced-motion`
- The home page measures itself with this project's own tracker (`pyxis-analytics` from npm),
  only when `NEXT_PUBLIC_LANDING_PYXIS_KEY` is set: clicks on elements carrying `data-track`
  become named events (`demo_opened`, `code_opened`, `docs_opened`, `post_opened`,
  `site_opened`, `snippet_copied`, `language_switched`, `install_opened`, `pricing_opened`,
  `access_requested`, `sign_up_opened`, `larger_plan_requested`, `ask_claude_opened`,
  `claude_directory_opened`, `nudge_dismissed`), a button lists what this visit sent, live
  (the SDK's `debug.onBatch`), with the visit's kind when the tracker sent one and, when this
  browser keeps the unique visitors marker (`pyxis:period` in `localStorage`), when the day and
  the month end in Brasília time, and the footer says the page is measured, with a switch to stop
  measuring in this browser. A browser driven by automation (`navigator.webdriver`) is not
  measured, so Playwright launches Chromium with `--disable-blink-features=AutomationControlled`
  and a test checks the flag reached it. The Content Security Policy lets the home page, and no other page,
  reach the ingestion API

## Privacy and security, in detail

- Content Security Policy set by the proxy on every rendered page, with a fresh nonce: scripts
  run only when they carry the nonce or are loaded by one that does (`'strict-dynamic'`), so an
  injected inline script never runs; styles, images and fonts from this origin only (inline
  styles stay allowed for Tailwind and the SVG charts), connections only to this origin and the
  Pyxis API, no plugins, no framing. Every page already renders on request (the layout reads the
  theme cookie), so the nonce costs no prerendering
- No secret in the browser bundle; data is read on the server
- An access token is created and revoked by Server Actions that re-check access and validate the
  name, the lifetime and the id; the new token travels to the browser once, in the action's answer,
  is kept only in the component's state until "Done", and is never written to a cookie, storage or
  the page's HTML. The list shows names and dates, never a token
- The consent page reads the request and answers it through Server Actions that validate the
  request id; the API decides everything else (the session, the dashboard's origin, the ten-app
  limit) and answers the address the browser goes to next, which the page follows only when it is
  an `http` or `https` address. The page cannot be framed (`frame-ancestors 'none'`), so another
  site cannot trick a click on Allow
- A project's settings, keys and deletion go through Server Actions that re-check access and
  validate what the browser sent; the API decides who owns the project and answers its refusals
  by code (no subscription, the last public key, the key limit, a name typed wrong), which the
  screens explain. A new secret key travels to the browser once, like an access token
- A connected app is revoked by a Server Action that re-checks access and validates the id. The
  panel shows the app's name, its host and two dates, never a token (the API keeps a
  connection's tokens only as hashes), and the connector's address only when it is an `http` or
  `https` address the API says is open
- A CSV export is a Route Handler next to its screen that reads through the same service, with
  the same session cookie, as the page: it holds nothing the screen does not show, answers
  `Cache-Control: private, no-store`, and a 404 for a table the screen does not have. The Visits
  file carries the pseudonymous user id a site passed to `identify()`, as the Visits list and the
  Timeline already show it: treat the file like the dashboard it came from. The Visits export
  follows the API's cursor, 50 visits a read, so it sets its own `maxDuration` of 60 seconds
  rather than lean on the project's default
- The session is a `__Host-pyxis_session` cookie set by a Server Action of this host from the
  token the API answers at sign-in: `HttpOnly`, `Secure`, `SameSite=Lax`, no `Domain`, so no other
  host under the domain ever receives it; the server forwards it to the API as `pyxis_session` and
  signs out by calling the API's logout with it before clearing it, or every session of the admin
  at once ("Sign out everywhere" in the sessions panel of Settings). The token crosses the sign-in
  page's script once, between the API's answer and the action, which is what the nonce CSP
  protects. The dashboard writes two preference cookies of its own: `pyxis_theme`, the light or dark choice,
  which the root layout reads so the first paint has the right theme (so every page renders on
  request), and `pyxis_locale`, the language chosen in the language menu, set by a Server Action
  as `HttpOnly` because only the server reads it. Neither identifies anyone
- The sign-in screen says the same thing for every email, like the API it calls
- The live demo has no API configured at all, so it cannot reach real data
- The home page's approximate price comes from the European Central Bank's daily reference rates,
  read by the server at the same address for every reader and cached for a day: nothing about the
  visitor goes into that request, and the browser connects to nothing new, so the Content Security
  Policy is unchanged
- Each read of the API writes one JSON line to the server log, `api_read` with the route template
  (`/v1/projects/:projectId/overview`), the status and the duration in milliseconds: no project
  id, no query value, no cookie, nothing about the person signed in
- Search engines may index the live demo: its `robots.txt` points at a sitemap of every screen
  of the demo projects, and each screen names its address without filters as the canonical one,
  so `?range=…&path=…` variants count as the same page. Its `robots.txt` also disallows every
  address with a query string and every CSV export, so a crawler stays on the screens the sitemap
  lists instead of walking each combination of filters. A dashboard with a real API is kept out of
  them (`robots.txt` disallows everything, the sitemap is empty and every page says `noindex`)
- Vulnerabilities: see [SECURITY.md](../SECURITY.md)
