# Pyxis Terms of Use

**Version {{terms.version}}, in force from {{terms.effectiveFrom}}.**

> This is a courtesy translation. The binding text is the Portuguese version
> ([Português](/termos)); if the two differ, the Portuguese version prevails.

These terms are the agreement between you and us for the use of **hosted Pyxis**: the website
usage analytics service that we operate at `pyxis-analytics.dev`, `app.pyxis-analytics.dev` and
`api.pyxis-analytics.dev`. Read them carefully, especially the passages marked **Important**, which
limit rights.

## Summary of the agreement

This summary does not replace the full text, but it shows what matters most before you subscribe.

1. **Who provides it:** {{seller.name}}, an individual, CPF (Brazilian individual taxpayer number)
   {{seller.taxId}} (Clause 1).
2. **Plans and price:** there are two plans. The **free plan** costs nothing and does not ask for a
   card. The **paid plan** costs R$ 39.00 per month or R$ 390.00 per year, by credit card, through
   Stripe, **charged at the time of subscription**, with **automatic renewal** until you cancel
   (Clauses 7 and 8).
3. **Free plan:** every registration starts on it, without a card and without a time limit, with one
   account on the free plan per person. **There is no longer a 14-day free trial:** to get the
   higher limits, you subscribe to the paid plan in the dashboard, whenever you wish (Clauses 6 and
   8.3). **Important: the free plan may change or end, with at least 30 days' notice by email**, and
   you can export your events beforehand (Clause 7.5).
4. **Limits:** on the free plan, up to 10 thousand events per month, 1 site and 1 person in the
   dashboard (only you); on the paid plan, up to 100 thousand events per month, up to 3 sites and up
   to 3 people in the dashboard (including you). Both have 13 months of history and all features.
   **Important: on the free plan, when the month reaches 10 thousand events, event intake pauses
   until the 1st day of the following month**: an account that reaches the limit on the 3rd receives
   nothing until the 1st. We notify you beforehand, at 80%. On the paid plan, we notify you at 80%
   and 100%, and **the pause comes at 150%**. Events sent during the pause are lost. Nothing is
   charged beyond the price (Clause 7).
5. **Withdrawal (paid plan):** full refund if you withdraw within 7 days after the first charge of
   each subscription. **Withdrawing from the paid plan does not close your account:** it goes back
   to the free plan, with your project, and you choose what to remove if it does not fit. If you
   want to leave for good, you can close the entire account (Clause 10).
6. **Cancellation:** at any time, in two ways. In the Stripe portal, the paid plan continues until
   the end of the paid period and, afterwards, **the account goes back to the free plan if it fits**
   (1 site and 1 person); if it does not fit, access ends. If you close the account in the
   dashboard, **access ends immediately**. **Important: after the 7 days of the right of
   withdrawal, there is no pro rata refund of the period already paid** in either case (Clause 11).
7. **Deletion of data:** **30 days after the end of access, the account, the projects and all
   events are permanently deleted.** Until then, you can export the events through the dashboard
   (Clause 11). **Important: an account on the free plan that receives no event in the 30 days after
   its creation, or that goes 90 consecutive days without events, is permanently deleted if it is
   still without events 7 days after a notice by email** (Clause 7.6).
8. **Availability:** **Important: there is no availability guarantee (SLA)**; we make our best
   efforts to keep the service running (Clause 15). On the paid plan, support by email, with a
   response within 2 business days. On the free plan, technical questions about use and installation
   are handled through the documentation and GitHub; complaints, questions about the agreement and
   billing, cancellation, withdrawal, personal data and the notices under the agreement continue by
   email, with a response within 5 days (Clause 16).
9. **Your main obligations:** **do not send personal data in events** (name, email, CPF, phone
   number, etc.), inform the visitors of your site about the measurement, and do not use the
   service abusively (Clause 12).
10. **Important: suspension and termination for abuse.** If there is abuse (for example, personal
    data in events, measuring people who asked not to be measured, forged traffic, attacks, fraud or
    several accounts on the free plan), we may suspend the affected part of the service and, in
    serious or repeated cases, terminate the agreement. As a rule, we notify you in advance and give
    you time to fix it; we always state the reason, and you may contest it (Clause 18).
11. **Personal data:** you are the controller of the data of your site's visitors; we are the
    processor (Clause 14 and the Data Processing Agreement). If a person with access connects
    Claude or Claude Code to Pyxis, the figures that person requests go to Anthropic, which is not
    our provider (Clause 13.10).

---

## Clause 1 — Who provides the service and how to contact us

1.1. Hosted Pyxis is provided by **{{seller.name}}**, an individual, holder of CPF no. **{{seller.taxId}}**, with address at **{{seller.address}}** ("we").
**Pyxis** is the name of the service.

1.2. Contact for any matter, including cancellation, withdrawal, support, contesting a suspension
and personal data: **hello@pyxis-analytics.dev**. On the free plan, technical questions about use
and installation go through the documentation and GitHub; everything else continues through this
email (Clause 16.5).

1.3. "You" means the individual or legal entity that subscribes to the service to measure one or
more sites.

## Clause 2 — Words used in these terms

2.1. **Service:** Pyxis as hosted by us: the API that receives and answers the data
(`api.pyxis-analytics.dev`), the dashboard (`app.pyxis-analytics.dev`), the weekly email digest and
access through tokens and connected apps, including through the MCP server.

2.2. **Tracker:** the `pyxis-analytics` package (open source) that you install on your site to
send events to the service.

2.3. **Project:** the configuration of one of your sites in the service (name, authorized
addresses, time zone, conversion event, the option to store the city, keys and events).

2.4. **Event:** each record sent by the tracker or by your integration, such as a page view or an
action you have marked.

2.5. **People with access:** the account owner and the people the owner invites into the dashboard.

2.6. **Period:** the paid month or year of your subscription.

2.7. **Consumer:** whoever subscribes to the service as the end user (final recipient), within the
meaning of art. 2 of the Código de Defesa do Consumidor (Brazilian Consumer Protection Code, Lei
nº 8.078/1990).

2.8. **Account:** the registration of the subscriber, to which the plan, the subscription to the
paid plan (when there is one), the projects and the people with access belong.

2.9. **Account owner:** the person who registered (or whom you designated when we created the
account at your request) and who, on your behalf, manages projects, keys, people, exports and
billing.

2.10. **End of access:** the date on which the account stops receiving events and can no longer
change its projects: the end of the paid period after a cancellation, when the account does not go
back to the free plan (Clause 11.2), the closure of the account (Clauses 11.6 and 18.7), the end of
the subscription for non-payment, when the account does not go back to the free plan (Clause 9.2),
or the end of the free plan for an account that has not subscribed to the paid plan (Clause 7.5).
The deletion of a free plan account without events is not an end of access: it follows only
Clause 7.6.

2.11. **Free plan and paid plan:** the two plans of the service, with the limits of Clause 7.1. The
free plan has no price and no subscription; the paid plan is the monthly or annual subscription of
Clause 8.

## Clause 3 — Acceptance, who may subscribe and contract documents

3.1. You accept these terms in one of these ways:

1. **when registering through the dashboard** (`app.pyxis-analytics.dev/sign-up`), by ticking the
   box accepting the Terms of Use, the Data Processing Agreement and the Privacy Policy, which shows
   the version number. We keep the accepted version and the date and time of acceptance (without
   keeping your IP). When you subscribe to the paid plan, the Stripe payment page asks for
   acceptance again before the subscription;
2. **when we create the account at your request** (Clause 6.2), by replying to our email confirming
   acceptance of the version stated in it, before we grant access.

If you do not agree, do not register or subscribe.

3.2. To subscribe, you must be 18 years of age or older and have legal capacity. If you subscribe on
behalf of a company, you represent that you have the authority to do so, and the company becomes
"you".

3.3. The service is offered to customers in Brazil, priced in reais.

3.4. The agreement consists of these terms and two annexes:

1. **Annex 1 — Personal Data Processing Agreement**, which governs the data of the visitors to
   your sites;
2. **Annex 2 — Pyxis Privacy Policy**, which explains the data we process about you and about the
   people with access.

In matters of personal data, Annex 1 prevails over these terms.

3.5. After you subscribe, the welcome email states the accepted version and the permanent address
of that version, where you can save or print the full text. On request, we send the text as a
file. Previous versions are available on request.

## Clause 4 — What the service does

4.1. The tracker installed on your site sends the service the page views and the events you mark.
The service stores those events and shows the analysis in the dashboard, only to the people with
access: overview, visits, the timeline of each visit, funnel, features used, failures of the calls
to your site's API, acquisition, devices and times of day.

4.2. What the service does **not** do, by design:

1. it does not create cookies on your site;
2. it does not store the visitor's IP address: the IP is used only in the server's memory, for a few
   minutes, to limit abuse, and by the AWS network, at the time of the request, to provide the
   country, the state and, if you turn it on, the city;
3. it does not store the full browser string (user agent), only the device category and the browser
   and operating system family;
4. it does not store the city, unless the account owner turns on that option in the project
   (Clause 4.5); we never turn it on without their request. It does store the country and the
   state;
5. it does not store the full page address: only the path in template form, without parameters,
   except the campaign ones (`utm_source`, `utm_medium`, `utm_campaign`);
6. it sends nothing when the visitor's browser asks not to be tracked (Global Privacy Control or
   Do Not Track);
7. it does not recognize the anonymous visitor on another visit: each visit has a random number that
   disappears when the tab is closed or after 30 minutes of inactivity.

4.3. **Important:** the dashboard figures are a measurement, not an exact count. Visits from people
who block the tracker, who ask not to be tracked, from bots and from people who were offline do not
appear, and events sent while the service is down or while intake is paused (Clauses 7.2, 15 and
18) are lost (the tracker retries for a few seconds while the page is open, but not when intake is
paused).

4.4. Both plans also include (Clause 7.1):

1. a **weekly email digest**, every Monday, which each person with access can turn off in
   Settings;
2. **read-only access tokens**, created in Settings, so that programs and artificial intelligence
   agents can query the same figures as the dashboard;
3. the **MCP server**, in two ways: the open-source program `pyxis-mcp`, which runs on your
   computer and uses an access token; or the address `https://api.pyxis-analytics.dev/mcp`, which
   Claude and Claude Code use as a connector after a person with access allows the connection
   (Clause 13.10) and which other programs use with an access token;
4. the API routes to **delete or copy the data of an identified person**, with the project's
   secret key;
5. the **export of all events of a project** to a file, through the dashboard (Clause 11.5).

4.5. **Visitor's city, only if you turn it on.** Each project has, in its settings, an option to
store the approximate city of each visit. The city is inferred from the IP address by the AWS
network, at the time of the request, and is only stored when the state is also provided; the IP
is still not stored. The option comes **turned off** in every project, new or existing, and only
the account owner turns it on or off.

Before turning it on, update your site's privacy notice to say that the city is recorded
(Schedule IV of the Data Processing Agreement explains how to adapt the template). **Important:**
together with the time, the device and the page, the city makes a visit easier to associate with
a person, especially on sites with few visits and in small cities. In a project that uses the
`identify` function, turning on the city starts recording the approximate city of each visit by
identified people. It is up to you, as controller, to assess whether you need the city and to
inform the visitors (Clause 6.1 of the Agreement).

When it is turned off, the city stops being read within one minute, and the cities already stored
in the project are deleted within 48 hours, if the option is still off by then, as stated in
Clause 12.8 of the Agreement. Postal codes (CEP), coordinates and the IP address are never stored.

## Clause 5 — Open source and hosted service

5.1. The Pyxis code is open source, under the MIT license, in the public repositories `pyxis-api`,
`pyxis-sdk`, `pyxis-web` and `pyxis-mcp`. Anyone may read, copy, modify and run the code on their
own, under the terms of that license.

5.2. These terms cover only the **service hosted by us**. Nothing here restricts what the MIT
license permits. If you run Pyxis on your own infrastructure, these terms do not apply to that
installation.

## Clause 6 — How it starts: registration in the dashboard or an account created on request

6.1. **Registration through the dashboard.**

1. At `app.pyxis-analytics.dev/sign-up`, you enter your email, accept the terms (Clause 3.1) and
   confirm the email with a 6-digit code sent to it. **Registration does not ask for a card.**
2. Once the code is confirmed, the account is created on the **free plan** (Clause 7.1), except when
   registration on the free plan is closed (Clause 6.5), and is ready: you create your project in
   the dashboard, with the site address, the time zone and, if you wish, the conversion event, and
   you receive the public key and the installation snippet. The person who registered is the
   account owner.
3. To get the limits of the paid plan, the account owner subscribes to the paid plan in the
   dashboard, whenever they wish (Clause 8.3).

6.2. **Account created on request.** We may also create the account for you, upon a request sent to
hello@pyxis-analytics.dev, for example when it is not possible to complete registration through the
dashboard or for a free account that we offer. In that case, we agree by email on the plan and the
payment method, acceptance follows Clause 3.1, item 2, and we grant access within 2 business days
after acceptance and, if there is a charge, after the subscription. A free account has no charge;
the rest of these terms applies equally, and we may end the free status with 30 days' notice, after
which you may subscribe to the paid plan or leave. This free account, agreed case by case by email,
is different from the free plan of Clause 7.1.

6.3. We may refuse a registration or an account request only for an objective reason: (a) the site
is not compatible with acceptable use (Clause 12); (b) the expected volume greatly exceeds the plan
limits; (c) the same person or company had an account closed for serious abuse (Clause 18.7) in the
previous 12 months; (d) in a registration on the free plan, the same person or company already
having an account on the free plan (Clause 6.4); or (e) registration on the free plan being closed
(Clause 6.5). If we refuse after a charge, we refund the full amount.

6.4. **One account on the free plan per person:** each person or company may have only one account
on the free plan, and the service does not let the same owner open another. Creating another
account, with another person or another email, to have more than one on the free plan or to add up
its limits is abuse (Clause 12.1, item 14).

6.5. **Places on the free plan.** We may limit the number of accounts on the free plan and close,
at any time, new registrations on the free plan, for example to protect the capacity of the
service. While it is closed, registration may offer a waiting list and the paid plan. Closing new
registrations changes nothing for the accounts already on the free plan; changing or ending their
plan follows Clause 7.5.

## Clause 7 — Plan and limits

7.1. The service has two plans (Clause 2.11):

| Item | Free plan | Paid plan |
|---|---|---|
| Price | none, without a card | R$ 39.00 per month or R$ 390.00 per year (Clause 8) |
| Events received per month, adding up all the account's projects | up to 10,000 | up to 100,000 |
| Sites (projects) | 1 | up to 3 |
| People with access to the dashboard | 1, only the account owner | up to 3, including the account owner |
| History | 13 months (older events are deleted every day) | 13 months (older events are deleted every day) |
| Pause of intake due to the quota (Clause 7.2) | upon reaching 100% of the limit | upon reaching 150% of the limit |
| Weekly email digest | included | included |
| Access tokens, MCP server and Claude connector | included | included |
| Export of a project's events | through the dashboard, up to 3 per project per day | through the dashboard, up to 3 per project per day |
| Support | through the documentation and GitHub; email only in the cases of Clause 16.5 | by email, response within 2 business days |

Both plans have all the screens and features of the service; what changes between them is the
volume.

7.2. **Important: usage above the limit.**

1. The month's usage is the sum of the events stored in all of the account's projects dated in that
   month. The month is the calendar month counted in UTC (Coordinated Universal Time), which in
   Brasília time begins at 9 p.m. on the last day of the previous month.
2. The service measures usage once a day, in the early morning. The measured usage appears in
   Account and billing, in the dashboard.
3. On the paid plan, when the daily measurement finds 80% and, later, 100% of the limit (80 thousand
   and 100 thousand events), we notify the account owner by email, once per level each month. **Up
   to 150%, nothing is cut off.**
4. **On the paid plan, when the daily measurement finds 150% of the limit (150 thousand events),
   event intake for all of the account's projects pauses until the 1st day of the following
   month**, and we notify you by email. During the pause, the service refuses the events (response
   `403 quota_exceeded`), which **are not stored and cannot be recovered**. The dashboard keeps
   showing the data already stored. Intake resumes on its own at the beginning of the following
   month. Because the measurement is daily, the account may go somewhat over 150% before the pause
   begins.
5. **We charge nothing beyond the price of the plan** for usage above the limit.
6. If the account frequently exceeds the limit, we may propose by email a plan or a price suited to
   the volume. Accepting is optional.
7. **On the free plan, the pause comes at 100% of the limit.** When the daily measurement finds 80%
   of the limit (8 thousand events), we notify the account owner by email. **When the daily
   measurement finds 100% of the limit (10 thousand events), event intake pauses until the 1st day
   of the following month**, under the same conditions as item 4, and we notify you by email.
   Because the measurement is daily, the account may go somewhat over 10 thousand events on the day
   it reaches the limit, and those events remain stored. **Important: the pause lasts until the 1st
   day of the following month, whatever the day on which it began: an account that reaches the
   limit on the 3rd receives no event until the 1st**, and the events sent during the pause are not
   stored and cannot be recovered.
8. **Subscribing lifts the pause.** If the account owner subscribes to the paid plan during the
   pause of the free plan (Clause 8.3), intake resumes about one minute after the subscription is
   confirmed, already with the limits of the paid plan.

7.3. The service has technical limits against abuse, such as the number of event batches per minute
per address and per project and the size of each batch. These limits may change to protect the
service, without reducing your plan's monthly event limit.

7.4. The deletion of events older than 13 months is automatic and part of the service: **we do not
keep older history**.

7.5. **Important: change or end of the free plan.** We may increase the limits of the free plan or
add features to it at any time. Any other change to the free plan, including reducing the limits or
ending the plan, only takes effect after a notice by email to the owner of each account on the free
plan given **at least 30 days in advance**, explaining what changes (Clause 21.1). Because the free
plan has no renewal, the change applies to your account at the end of that period. During the
period, you may export all events (Clause 11.5), subscribe to the paid plan (Clause 8.3) or close
the account (Clause 11.6). If the free plan ends and your account has not moved to the paid plan,
the end of the period is the end of access (Clause 2.10), and the data follows Clauses 11.4 and
11.5.

7.6. **Important: free plan account without events.** We send a notice by email to the owner of an
account on the free plan that **receives no event in the 30 days after the account is created** or
that **goes 90 consecutive days without receiving any event**. **If, 7 days after the notice, the
account is still without events, it is permanently deleted**: the account, the projects and all
events, without the 30-day period of Clause 11.4, as described in Clause 12.7 of Annex 1; we send
an email confirming the deletion. During those 7 days, you may export the events (Clause 11.5), and
nothing is deleted if the account receives any event or moves to the paid plan: paid plan accounts
are never deleted for lack of events. After deletion, the data cannot be recovered; only the records
that Clause 11.4 excepts remain stored.

## Clause 8 — Price, subscription and billing

8.1. **Price of the paid plan:** R$ 39.00 per month or R$ 390.00 per year. The free plan has no
price and does not ask for a card. There is no setup fee and there are no other charges.

8.2. **Payment method:** credit card, processed by Stripe. **We do not see or store your card
number.** We do not currently accept Pix or boleto.

8.3. **Subscription, without a free trial.** The account owner subscribes to the paid plan in
Account and billing, in the dashboard, by choosing the monthly or the annual plan and entering the
card on the Stripe payment page. **There is no free trial: the first charge takes place at the time
of subscription** and, from then on, at each new period. Once the subscription is confirmed, the
account moves immediately to the limits of the paid plan, and a pause of the free plan ends as
stated in Clause 7.2, item 8. If you leave the payment page without completing it, nothing is
charged and the account remains on the free plan. Subscribing again, after a previous subscription,
is also charged immediately.

**Trials that have already started.** Up to version 1.2 of these terms, the subscription began with
a 14-day free trial, with the card entered at the start, once per customer. An account that started
that trial before version 1.3 finishes it as it was contracted: nothing is charged during the trial,
Stripe sends an email reminder 7 days before the end, and, **if you do not cancel by the end of the
trial (through the Stripe portal or by closing the account in the dashboard), the first charge takes
place on the 15th day**; on your card statement, it is indicated as the end of the trial. A repeated
trial follows Clause 18.11.

8.4. **Automatic renewal:** the subscription renews automatically at the end of each period, with a
charge to the same card, until you cancel (Clause 11). The date of the next charge appears in
Account and billing, in the dashboard, and Stripe sends the receipt for each charge by email.

8.5. **Price change:** we notify you by email **at least 30 days in advance**. The new price applies
only from the renewal following the end of that period; **the price of the period already paid does
not change**. If you do not agree, cancel before the renewal, at no cost.

8.6. **Invoice (nota fiscal):** the receipt for each charge is sent by Stripe. Issuing a nota fiscal
(Brazilian tax invoice) depends on our tax classification; if you need a nota fiscal, ask before
subscribing.

## Clause 9 — Non-payment

9.1. If the charge for a renewal fails, Stripe notifies you by email, with a link to update the
card, and tries again up to 8 times over the following 2 weeks; the dashboard also shows a notice
(Account and billing → Manage billing). If the bank asks you to confirm the payment (3D Secure),
Stripe sends the confirmation link by email. Stripe also notifies you by email when the card on
file is about to expire. During this period, the service keeps working.

9.2. If payment is not made after these attempts (up to 2 weeks from the first failure), or if the
confirmation requested by the bank is not completed within 15 days, Stripe ends the subscription.
If the account fits in the free plan (1 project and 1 person with access), it goes back to the free
plan, as in Clause 11.2, item 1. If it does not fit, that is the end of access: by the following
day, the projects' keys are revoked and the sites stop sending events; the dashboard remains
available only for viewing and export until deletion.

9.3. When there is an end of access, the data is deleted 30 days after it (Clause 11.4). Until
then, you can come back as provided in Clause 11.5, item 3, without losing data.

## Clause 10 — Right of withdrawal

10.1. Because the agreement is entered into over the internet, the consumer may withdraw from the
agreement within 7 days of entering into it (Código de Defesa do Consumidor, art. 49). On the free
plan, nothing is charged: just close the account (Clause 11.6). The refund under this clause applies
to the paid plan.

10.2. **We extend this right to all customers:** if you withdraw within **7 days after the first
charge** (of the monthly or the annual plan), we refund **the full amount** of that charge, without
you having to give a reason.

10.3. To exercise it, use any of these means:

1. **in the dashboard**, in Account and billing → Withdraw from the subscription, the same place
   where you subscribed: the subscription is cancelled immediately, the refund of the full amount is
   requested from Stripe automatically, and the screen shows the amount refunded;
2. by email to hello@pyxis-analytics.dev, from the account owner's email address, with the word
   "arrependimento" (withdrawal);
3. if you also want to leave the service, by **closing the account in the dashboard** (Account and
   billing → Close the account), with the automatic refund of Clause 11.6, item 5.

Cancelling the subscription in the Stripe portal, by itself, does not trigger the refund: use one of
the means above.

10.4. Through the dashboard, the confirmation appears immediately on the screen and also by email.
Through email, we acknowledge receipt by the same channel and request the refund from Stripe within
2 business days. If the automatic refund fails, we request it manually within 2 business days and
notify you. Stripe communicates the refund to the card issuer; the time for it to appear on the
statement depends on the card issuer.

10.5. With the withdrawal through means 1 and 2 of Clause 10.3, the subscription is cancelled
immediately and the account **goes back to the free plan**, with the project and the data it has, if
it fits in it (1 project and 1 person with access, Clause 7.1). If it does not fit, the dashboard
shows what to remove, and you have 30 days to choose, exporting beforehand whatever you wish
(Clause 11.5); if within that period the account does not come to fit in the free plan, it follows
Clause 11.2, item 2. The refund does not depend on that choice. If the month has already gone over
10 thousand events, the pause of Clause 7.2, item 7, applies. Through means 3, the account is closed
as in Clause 11.6.

## Clause 11 — Cancellation and closure of the account by you

11.1. You can leave at any time, in two ways, with different effects:

1. **cancel the subscription in the Stripe portal** (Account and billing → Manage billing, or
   through the link in Stripe's emails): takes effect at the end of the paid period, and the account
   goes back to the free plan if it fits in it (Clause 11.2);
2. **close the account in the dashboard** (Account and billing → Close the account): takes effect
   immediately (Clause 11.6).

On the free plan there is no subscription to cancel: to leave, close the account in the dashboard
(item 2).

If you prefer, ask by email to hello@pyxis-analytics.dev, from the account owner's email address,
stating which of the two you want. Without that indication, we carry out the cancellation in item 1
(on the free plan, the closure in item 2). We acknowledge receipt by the same channel.

11.2. **Cancellation in the Stripe portal:** the paid plan continues until the end of the paid
period and **there is no further charge**. At the end of the period:

1. **if the account fits in the free plan** (1 project and 1 person with access, Clause 7.1), **it
   goes back to the free plan**, with the project and the data it has, and keeps receiving events,
   with the limits of the free plan; if the month has already reached 10 thousand events, intake
   pauses until the 1st day of the following month, as on the free plan (Clause 7.2, item 7). If you
   prefer the account to end, close it in the dashboard (Clause 11.6);
2. if the account does not fit in the free plan, that is the end of access: by the following day,
   the projects' keys are revoked and the sites stop sending events; the dashboard remains available
   only for viewing and export until deletion.

The dashboard, in Account and billing, states what to remove (projects or people) for the account
to fit in the free plan before the end of the period. **Important:** deleting a project immediately
deletes its events (Clause 12.2 of Annex 1); export them first (Clause 11.5).

11.3. **Important: outside the right of withdrawal (Clause 10), there is no pro rata refund of the
period already paid,** on either the monthly or the annual plan, in either way of leaving. There is a
refund only in the cases these terms expressly provide for: Clauses 6.3, 15.7, 18.9, 18.10, 18.13,
20.2, 21.3 and 22.1 and Clauses 9.2 and 16.2 of Annex 1.

11.4. **Important: deletion of data.** **30 days after the end of access** (Clause 2.10), an
automatic routine permanently deletes the account, the projects and everything belonging to them,
as described in Clause 12 of Annex 1. We notify the account owner by email at the end of access, 7
days before deletion and when it is done. After that, **the data cannot be recovered**. Only the
billing records the law requires us to keep, the record for preventing repeated free trials
(Privacy Policy, items 2.2 and 2.7) and whatever a law or an order of an authority requires to be
preserved (Clause 12.6 of Annex 1) remain stored. A free plan account deleted for lack of events
follows Clause 7.6, without this 30-day period.

11.5. **Exporting the events and coming back.**

1. The account owner exports all events of a project in the project's Settings. The file (compressed CSV)
   is ready within a few minutes, the notice arrives by email, and the file can be downloaded in the
   dashboard for **7 days**, with a new link for each download, valid for 5 minutes; after that, the
   file is deleted. There are up to 3 exports per project per day. Export works during the agreement
   and for the 30 days after the end of access.
2. If the export through the dashboard does not work, request the copy at
   hello@pyxis-analytics.dev: we send the file within 10 business days of the request and, if the
   request arrives close to the deletion date, we postpone deletion until we deliver the copy.
3. Before deletion, you can **come back** without losing data: in Account and billing, choose
   "Subscribe again", or write to hello@pyxis-analytics.dev and we reactivate the subscription. In
   either case, billing starts upon reactivation, without a free trial. Revoked keys do not come
   back: you create new keys in the dashboard and replace them on your site.

11.6. **Closing the account through the dashboard.** Only the account owner can close it, in Account
and billing, by typing their email to confirm. **Important: closure takes effect immediately and
cannot be undone through the dashboard** (to withdraw only from the paid plan and stay on the free
plan, use Clause 10.3):

1. the subscription to the paid plan, if there is one, is cancelled in Stripe immediately, with no
   further charges;
2. the keys of all projects are revoked immediately, and the sites stop sending events;
3. the dashboard remains available only for viewing and export (Clause 11.5) until deletion;
4. the data is deleted 30 days after closure (Clause 11.4);
5. if closure takes place within 7 days of the first charge, the amount of that charge is refunded
   in full (Clause 10); otherwise, **there is no pro rata refund of the paid period**
   (Clause 11.3);
6. the screen confirms the closure, the deletion date and the amount refunded, and we send the
   confirmation by email.

Closing an account on the free plan does not generate a charge. If Stripe cannot cancel the subscription,
nothing is closed and the screen tells you so. If you change your mind before deletion, Clause 11.5,
item 3, applies.

## Clause 12 — Acceptable use, abuse and your responsibilities

12.1. You undertake to use the service in good faith, only to measure the use of your sites. **Any
of the conduct below is abuse**, whether engaged in by you, by the people with access to your
account or by anyone using your keys, tokens or connections with your permission:

*Personal data and privacy*

1. sending **direct personal data** in events: name, email, phone number, CPF, address, document
   number, text typed by the visitor or any data that identifies a person on its own;
2. sending **sensitive personal data** (health, racial or ethnic origin, religion, political
   opinion, trade union membership, sex life, genetic or biometric data);
3. attempting to **circumvent the server's personal data barrier** (Clause 12.2), for example by
   splitting, encoding or disguising an email, a document or a phone number so that it gets past
   the barrier;
4. using in the `identify` function anything other than an **internal, opaque identifier** of the
   account in your system, such as the email, the CPF or the phone number;
5. **measuring people who asked not to be measured**: disabling, circumventing or altering the
   tracker's respect for the Global Privacy Control and Do Not Track signals and for the option not
   to be measured (`optOut`), or sending events from those people by another route;
6. using the service together with browser fingerprinting techniques or other means of recognizing
   anonymous visitors;

*Traffic and security*

7. sending **forged or automated events** to inflate, distort or overload the figures or the
   service (reasonable testing of your own installation is not abuse);
8. sending events from **sites that are not yours** and do not belong to someone who authorized you, or
   registering someone else's site as the origin of a project;
9. using **another customer's public key, secret key, token or connection**;
10. **attacking the service**, attempting to access other customers' data or parts of the service
    that are not yours, or testing for vulnerabilities without our written authorization
    (reporting a security flaw in good faith to hello@pyxis-analytics.dev is not abuse);
11. **circumventing** the rate limits, the monthly quota (Clause 7.2) or the plan limits
    (Clause 7.1), for example by splitting the sending from a single site across several accounts or
    keys;
12. **publishing or sharing** the secret key or an access token deliberately or repeatedly (in a
    public code repository, on a web page, in a forum or in code that runs in the browser); an
    accidental leak is not abuse, but the leaked key or token is revoked as provided in
    Clause 13.9;

*Account, plan and payment*

13. reselling, renting or passing on access to the hosted service to third parties, or sharing the
    account to exceed the plan's limits on people and projects, without a written agreement with us
    (measuring, as an agency, the sites of your clients who have authorized it, within the plan
    limits, is not reselling; Clause 3.2 of Annex 1);
14. creating more than one account, or using another person, another email or another card, to
    **have more than one account on the free plan** (Clause 6.4) or to evade a limit or a charge;
15. **payment fraud**: using a card without the cardholder's authorization or false billing data,
    or disputing a charge in bad faith with the card issuer, for example by claiming not to
    recognize a charge that you authorized and whose service you used, without first having asked
    us for cancellation or a refund (disputing an improper charge is your right; Clause 18.12);

*Law and third parties*

16. using the service for illegal activity, to measure sites with illegal content or to violate the
    rights of third parties (privacy, intellectual property, image);
17. any other use contrary to the law or to these terms that causes, or creates a concrete and
    demonstrable risk of causing, harm to other customers, to the service's infrastructure, to the
    data subjects or to us, including legal liability.

12.2. The server automatically discards values shaped like an email address and sequences of 10 or
more digits (such as CPF and CNPJ, the Brazilian individual and company taxpayer numbers, and phone numbers). **Important:** this barrier is a second layer and
does not recognize names, addresses or free text. **You are responsible for what your site sends.**

12.3. You also undertake to:

1. publish on your site a privacy notice describing the measurement (there is a template in
   Schedule IV of the Data Processing Agreement) and keep that notice in line with what your site
   sends and with the options of your projects (such as the city, Clause 4.5);
2. if your site is directed at children or adolescents, assess the measurement beforehand in light
   of art. 14 of the Lei Geral de Proteção de Dados Pessoais (LGPD; Brazilian General Data
   Protection Law);
3. keep the secret key and the access tokens confidential (Clause 13);
4. keep the email addresses of the account owner and of the people with access up to date
   (Clause 23);
5. respond to our notices about abuse within the stated period (Clause 18).

12.4. **How we detect abuse.** We do not continuously monitor the content of your projects. We
detect abuse through what the service already stores or receives: the automatic security alerts
(Schedule II of the Agreement, item 10); the API's technical logs, which state when an event or a
property was refused and under which rule, without the refused value, and which disappear in 14
days; the events stored in the project, consulted only when necessary (Clause 7.2 of the
Agreement); Stripe's billing data; the free trial record (Privacy Policy, item 2.7); and what
another person or an authority reports to us. **The service does not store IPs or full browser
strings, and does not start storing them to investigate abuse.**

## Clause 13 — People with access, keys and tokens

13.1. **People with access.** On the paid plan, the account has up to 3 people with access to the
dashboard, including the owner; on the free plan, only the owner, who does not invite other people
(Clause 7.1). The owner invites a person by their email, to one or more of the account's
projects, in Settings → People. The person receives an invitation email and signs in to the
dashboard with a code sent to their email, without a password. The owner removes a person on the
same screen, at any time.

13.2. Invited people see the figures, the settings and the list of people of the projects they were
invited to, and manage their own sessions, tokens, connected apps and weekly digest. Only the owner
changes projects, keys, people and billing, and only the owner exports events or closes the
account.

13.3. When the owner removes a person from a project, that person's access to the project ends
immediately, including through the access tokens they created and the apps they connected. Whatever
they have already seen or taken to another program through a token or a connected app is beyond our
reach. Their registration follows the Privacy Policy (item 2.1).

13.4. You are responsible for keeping the list of people up to date (for example, removing someone
who has left your team) and for what the people with access do in the service. By inviting a
person, you confirm that they know they will receive emails from Pyxis (invitation, sign-in codes
and the weekly digest) and that they are aware of these terms.

13.5. Each person sees and ends their own sessions in Settings, including "Sign out everywhere". Signing out everywhere does not revoke tokens or disconnect apps: each one is revoked
in its own list (Clauses 13.8 and 13.10).

13.6. **Public key:** goes on your site and only identifies the project. The service only accepts
events with this key coming from the addresses registered in the project. The owner replaces the
public key in Settings.

13.7. **Secret key:** needed only if you are going to use the data deletion and copy routes. The
owner creates it in Settings, and it is shown only once. Keep it only on your server, never in the
browser or in a code repository. We store it only as a hash: if you lose it, revoke it and create
another.

13.8. **Access tokens:** they only read the dashboard figures and are valid for 30, 90 or 365 days.
Whoever creates a token is responsible for keeping it safe and may revoke it at any time in
Settings. The data a token reads goes to the program in which it was used (for example, an
artificial intelligence tool with the MCP server, on your computer or through the address in
Clause 4.4, item 3); **the choice and use of that tool are your responsibility**.

13.9. If a key leaks, the owner revokes it and creates another immediately, in Settings; if unable
to, let us know: we revoke the key within 1 business day. A leaked token can be revoked immediately,
by whoever created it, in Settings. If we find a published secret key or token, we revoke it
immediately, to protect you, even without abuse, and notify you right afterwards (Clause 18.4,
item 4).

13.10. **Connected apps (Claude connector).**

1. **Which apps.** Currently, only **Claude** and **Claude Code**, by Anthropic, connect to Pyxis
   without a token, through the address `https://api.pyxis-analytics.dev/mcp`. We recognize each
   of them by the identification document that Anthropic publishes, and we do not accept other apps
   through this route. Other programs use the same address with an access token (Clause 13.8).
2. **Who connects.** Any person with access, in their own name. When the app requests the
   connection, the person signs in to the dashboard and sees, on a Pyxis page, the app, where the
   response goes back to (with a warning when it goes to a program on the person's own computer),
   what it will be able to read and the list of projects. The connection exists only if the person
   chooses **Allow**; the request is valid for 10 minutes.
3. **What the app reads.** It **only reads**, and only what that person sees in the dashboard, from
   all the projects the person can open: the figures, the visit lists and the timeline of each
   visit, with the internal identifier your site sent through the `identify` function, and the
   person's own sign-in email. It never changes anything and never reads secret keys, tokens,
   sessions, the list of people with access or billing.
4. **Where the data goes.** The data the app requests leaves Pyxis for **Anthropic**, in the United
   States: with Claude, directly to its servers; with Claude Code, first to the person's computer
   and from there to Anthropic. The consent page warns of this before **Allow**. **Anthropic is
   neither our provider nor our sub-processor**: the one who chooses to connect is the person with
   access, and Anthropic processes this data under the terms and the privacy policy that apply
   between it and whoever uses Claude. **The choice and use of this app are your responsibility**,
   as in Clause 13.8.
5. **How long it lasts.** The connection uses credentials that the app renews on its own (the access
   one is valid for 1 hour) and that we store only as a hash. It ends when the person revokes it in
   Settings → Connected apps; after 90 days without use; when the person loses access (Clause 13.3)
   or has their access suspended (Clause 18.2); when the account is deleted (Clauses 7.6 and 11.4);
   or on its own, when a credential that has already been exchanged is used again, a sign that it
   may have been copied. After that, the app asks to connect again.
6. **Limits.** Up to 10 connected apps at the same time per person, and the per-minute query limits
   of Schedule II of the Data Processing Agreement.

## Clause 14 — Personal data

14.1. With regard to the data of the visitors to your sites, **you are the controller** and **we are
the processor** (Lei nº 13.709/2018, the LGPD, art. 5, VI and VII). The full rules are in **Annex 1 — Personal Data Processing Agreement**, which is part of this
agreement: purpose, instructions, security, sub-processors, international transfer, data subject
requests, incidents, suspension of processing and deletion.

14.2. With regard to your data and that of the people with access (emails, account, acceptance of
these terms, sessions, connected apps, billing, prevention of repeated trials and support), **we are
the controller**, as explained in **Annex 2 — Pyxis Privacy Policy**.

## Clause 15 — Availability, interruptions and changes to the service

15.1. **Important: there is no availability guarantee (SLA).** We make our best efforts to keep the
service running and to fix failures as soon as possible. The service is operated by a single person
and depends on providers (AWS, which also sends the emails, Neon, Vercel and Stripe); there may be
interruptions.

15.2. **Maintenance.** We notify you by email, in advance whenever possible, of maintenance that may
take the service offline, and we preferably carry it out outside business hours.

15.3. **Interruptions beyond our control.** The service may stop, in whole or in part, due to a
failure or suspension of a provider, an attack by third parties on the service, or unforeseeable
circumstances or force majeure (Código Civil (Brazilian Civil Code), art. 393). We work to restore
the service as soon as possible and, if the interruption lasts more than 24 hours, we notify you by
email.

15.4. **Legal order.** We interrupt or limit the service, in whole or in part, when a law, a court
order or a determination of the ANPD (Brazilian National Data Protection Authority) or another
competent authority requires it (for example, the blocking of data or the suspension of processing,
LGPD, art. 52). We comply only with what is required and notify you, unless the order prohibits the
notice.

15.5. **Pause due to the quota.** The pause in event intake upon reaching 150% of the monthly limit
on the paid plan, or 100% on the free plan, follows Clause 7.2.

15.6. If you are a consumer, your rights under art. 20 of the Código de Defesa do Consumidor remain
in force: in the event of a failure of the service, including a suspension that proves to be
improper (Clause 18.9), you may request that the service be performed again, where applicable, a
proportional reduction of the price or a refund of the amount paid.

15.7. We may improve the service, change screens and add features. During the paid period, we do
not remove the features listed in Clause 7.1 or weaken the privacy commitments of Clause 4.2. If a
change of this kind is unavoidable (for example, because of a law or because a provider stopped
offering something), we notify you 30 days in advance, and you may terminate with a pro rata refund
of the paid and unused period. Changes to the free plan follow Clause 7.5.

## Clause 16 — Support and customer service

16.1. Customer service is by email, at hello@pyxis-analytics.dev, for questions, complaints, support,
contesting a suspension, suspension and cancellation. On the free plan, technical questions about
use and installation follow Clause 16.5.

16.2. We acknowledge receipt of your message by the same email and respond **within 2 business
days** (business days are Monday to Friday, excluding national holidays).

16.3. Support covers the use of the hosted service and the installation of the tracker. It does not
include development on your site or support for self-hosted installations of the open-source code.

16.4. Do not send visitors' personal data in your messages. To show a case, use the visit or user
identifier.

16.5. **Support on the free plan.** On the free plan, technical questions about use and
installation (Clause 16.3) are handled through the public Pyxis documentation and through the
issues of the public repositories on GitHub (Clause 5.1), without the deadline of Clause 16.2.
Issues are public: do not post keys, tokens or personal data in them. The email
hello@pyxis-analytics.dev remains available on the free plan, with acknowledgment of receipt by the
same channel and a response by email **within 5 days**, for:

1. information and questions about the agreement, the plan, the limits and billing, including about
   subscribing to the paid plan;
2. complaints about the service, including failures (Clause 15.6);
3. suspension, cancellation, closure of the account and withdrawal (Clauses 10, 11 and 18),
   including responding to a notice or contesting a measure (Clause 18.6);
4. requests about personal data: yours and those of the people with access, within the deadlines of
   the Privacy Policy (item 6), and your requests as controller, within the deadlines of Annex 1
   (Clause 10);
5. the other matters that these terms direct to be handled by email, such as reporting a leaked key
   (Clause 13.9), reporting a security flaw (Clause 12.1, item 10) and requesting the copy of the
   events when export through the dashboard fails (Clause 11.5, item 2).

If you are a consumer and cannot or do not wish to use GitHub, you may also send your question about
use by email; we respond within 5 days, and the response may point to the part of the documentation
that solves the case.

## Clause 17 — Intellectual property and your data

17.1. **The data of your projects is yours.** We process it only to provide the service, as stated
in the Data Processing Agreement. We do not sell it, use it for advertising or use it to train
artificial intelligence models.

17.2. The Pyxis code follows the MIT license (Clause 5). The Pyxis name, logo and visual identity are
ours; you may not use them in a way that suggests your product is ours or that we have a
partnership, without our authorization.

17.3. If you send us suggestions, we may use them freely to improve Pyxis, without any obligation to
you.

## Clause 18 — Abuse: suspension and termination by us

18.1. **Principles.** When faced with abuse (Clause 12.1), we act on the basis of facts we can show
you, in proportion to the seriousness and only on the affected part of the service. A stronger
measure is used only when a milder one is not enough, and every measure comes with the reason in
writing.

18.2. **Possible measures**, from mildest to strongest:

1. a notice by email, with a deadline to fix the issue;
2. partial suspension: revoking a key, a token or an app's connection; pausing event intake for a
   project;
   suspending a person's access to the dashboard;
3. suspension of the entire account: event intake for all projects, dashboard, keys, tokens and
   connected apps;
4. termination of the agreement (Clause 18.7).

18.3. **Notice and deadline to fix.** Except in the cases of Clause 18.4, before suspending we notify
the account owner by email, stating what we saw, which rule was breached, what needs to be done and
which measure we will take if it is not fixed, and we give **5 business days** to fix or explain.
If you fix it within the deadline, nothing is suspended.

18.4. **Important: immediate suspension.** We may suspend without prior notice only in these cases,
and only to the extent necessary to contain the problem:

1. an attack on the service or on other customers, or forged or automated traffic that threatens the
   stability of the service (Clause 12.1, items 7, 10 and 11);
2. sending sensitive personal data in events, or direct personal data in a way that exposes visitors
   to significant risk (Clause 12.1, items 1 to 3);
3. apparently illegal activity or content (Clause 12.1, item 16);
4. a published secret key or token, for any reason, even accidental (Clause 13.9): the measure is
   only to revoke them, to protect you and the data subjects;
5. objective evidence of payment fraud, such as a card used without the cardholder's authorization
   or false billing data (Clause 12.1, item 15);
6. a concrete and immediate risk to other customers, to the data subjects or to the infrastructure;
7. a law, a court order or a determination of a competent authority (Clause 15.4).

In these cases, we notify the account owner by email **within 1 business day** after the
suspension, stating the reason, what was suspended, what to do to restore it and how to contest it,
unless a law or an order prohibits the notice.

18.5. **Duration and restoration.** The suspension lasts only as long as necessary. When the problem
is fixed or the challenge is accepted, we fully restore what was suspended within 1 business day.
Revoked keys, tokens and connections do not come back: you create new keys and tokens in the
dashboard and connect the app again.

18.6. **Right to respond and to contest.** You may respond to any notice and contest any measure by
email to hello@pyxis-analytics.dev, from the account owner's email address, within **10 business
days** of the notice, sending your explanation and whatever evidence you have. We acknowledge
receipt by the same channel and respond with a reasoned decision **within 5 days**; in the case of
an immediate suspension, we examine the challenge with priority. This channel neither replaces nor
conditions your right to turn to Procon (consumer protection agency), the other consumer protection
bodies or the courts.

18.7. **Termination for abuse.** We may terminate the agreement, by email and stating the reason,
only after giving you the chance to respond (Clause 18.6), unless a law or an order prevents it and
except for a repeated free trial, which follows the specific deadlines of Clause 18.11, and only
when:

1. the abuse is **serious**: a deliberate attack on the service or on other customers; payment
   fraud; illegal activity or content; deliberate sending of sensitive personal data; or a deliberate
   attempt to circumvent the personal data barrier or the respect for people who asked not to be
   measured;
2. the same abuse is **repeated** after being fixed, within 12 months of the first notice; or
3. the abuse is **not fixed** within 30 days of a suspension.

Termination has the effects of Clause 11.6, items 1 to 4: the subscription is cancelled, the keys are
revoked, the dashboard remains available for viewing and export for 30 days, unless legally
prevented, and the data is deleted afterwards (Clause 11.4).

18.8. **Data during suspension and after termination.**

1. During the suspension, the data already stored remains stored and protected, the deletion of
   events older than 13 months continues, and no new event is received in the suspended part.
2. You can still export the events (Clause 11.5), except when access itself is the risk (for
   example, an attack carried out by the account) or a law or an order prevents it; in that case, we
   deliver the copy on request as soon as the impediment ends, and deletion waits for it.
3. After termination, Clauses 11.4 and 11.5 apply: 30 days to export, unless legally prevented, and
   deletion afterwards.
4. If a law, a court order or a request from a competent authority requires data to be preserved, or
   if the data is needed for judicial, administrative or arbitral proceedings, we preserve only that
   data, for no other use, for the time required, and then delete it (Clause 12.6 of Annex 1).
5. To investigate abuse, we use only what the service already stores (Clause 12.4).

18.9. **Billing during suspension.** A partial suspension does not change billing. If a suspension
proves to be improper, we refund the amount proportional to the days the account was suspended, in
addition to your rights under Clause 15.6.

18.10. **Refund on termination for abuse.**

1. We refund the amount proportional to the paid and unused period, counted from the start of the
   suspension of the entire account or, if there was none, from termination. If termination takes
   place within the 7 days of Clause 10, we refund the full amount of the first charge.
2. We do not refund the period already used up to the suspension of the entire account, nor amounts
   that have already been returned to you by a refund or by a chargeback accepted by the card
   issuer.
3. **Important: only if you are not a consumer**, we may deduct from that amount the losses that the
   abuse has demonstrably caused us, showing the calculation in writing (Código Civil, arts. 368 and
   369); any shortfall or surplus is settled under Clause 19.
4. The refund goes, through Stripe, to the card used for payment, within 5 business days of
   termination.

18.11. **Repeated free trial.** The free trial ended with version 1.3 of these terms (Clause 8.3).
A suspicion that a trial started before it repeated an earlier trial (Privacy Policy, item 2.7)
follows Clause 18.11 of the version under which that trial started: nothing happens automatically,
you are notified with the reason and heard before any measure, you may contest it (Clause 18.6) and
**you are never charged before the date shown on the Stripe payment page**.

18.12. **Card chargebacks.** Disputing a charge with the card issuer is your right; we ask that you
talk to us first (Clauses 10 and 16). If the chargeback is accepted and the amount is returned to
you, the disputed period is left unpaid and we may treat it as non-payment, cancelling the
subscription with notice (Clause 9.2). Only a chargeback in bad faith (Clause 12.1, item 15) is
treated as abuse.

18.13. **Termination without abuse.** Apart from abuse, we only terminate the agreement in the cases
of Clauses 6.2 (end of a free account), 7.5 (end of the free plan), 7.6 (free plan account without
events), 20 (end of the hosted service), 21.3 (a change required by law that you do not accept) and
22.1 (an assignment that you do not accept), and, when there is a paid period, we always refund the
amount proportional to the paid and unused period; the data follows Clauses 11.4 and 11.5, except
under Clause 7.6, which has its own deadlines.

## Clause 19 — Liability

19.1. We are liable for providing the service as described in these terms, with diligence, and for
complying with the Data Processing Agreement.

19.2. The service shows usage statistics. We do not guarantee business results from them, and the
decisions you make based on the figures are yours.

19.3. **If you are a consumer**, nothing in these terms limits the rights that the Código de Defesa
do Consumidor guarantees you, including the right to compensation for damage caused by a failure of
the service.

19.4. **Important: limitation of liability for those who are not consumers.** If you subscribe to
the service for your professional or business activity, outside a consumer relationship, and, in the
justifiable situations allowed by art. 51, I, of the Código de Defesa do Consumidor, if you are a
consumer that is a legal entity:

1. our total liability for damages related to this agreement is limited to the amount you paid us
   in the 12 months preceding the event that caused the damage;
2. we are not liable for lost profits, loss of business opportunity or other indirect damages.

This limit takes into account the low price of the plan and the size of the service, operated by a
single person. It **does not apply** to damage caused by our willful misconduct or gross negligence,
nor to obligations that the law does not allow to be limited, nor does it reduce the rights of data
subjects against us (LGPD, art. 42).

19.5. You are liable for the damage you cause to us or to third parties by breaching these terms,
for example by sending personal data in events, by failing to inform the visitors of your site about
the measurement or by any other abuse under Clause 12.1.

19.6. Neither party is liable for delay or failure caused by unforeseeable circumstances or force
majeure (Código Civil, art. 393).

## Clause 20 — Discontinuation of the hosted service

20.1. If we decide to discontinue the hosted service, we will notify you by email at least **30
days in advance**.

20.2. In that case, we refund the amount proportional to the paid and unused period, keep event
export (Clause 11.5) available until the end of the service and delete the data in accordance with
Clause 12 of Annex 1.

20.3. Because the code is open source, you can keep using Pyxis on your own infrastructure.

## Clause 21 — Changes to these terms

21.1. We may change these terms. We notify you by email **at least 30 days in advance**, explaining
what changes, and we publish the new version with its effective date. Previous versions are
available on request.

21.2. **Changes that reduce your rights or increase your obligations only apply to you from your
next renewal after that period.** If you do not agree, cancel before the renewal, at no cost.

21.3. Changes that only improve the service or clarify the text take effect on the date stated in
the notice. Changes required by law, by a court decision or by the ANPD may take effect before the
renewal; if one of them is not acceptable to you, you may terminate the agreement with a pro rata
refund of the paid and unused period.

## Clause 22 — Assignment of the agreement

22.1. We may transfer this agreement to a company set up or controlled by {{seller.name}} (for
example, so that the service comes to be provided under a CNPJ)
or to whoever takes over the service, with all the conditions of these terms and of the Data
Processing Agreement maintained. We notify you by email at least 30 days in advance; if you do not
agree, you may terminate the agreement with a pro rata refund of the paid and unused period.

22.2. You may not transfer this agreement without our written consent.

## Clause 23 — Communications

23.1. We send the communications under this agreement, including notices of abuse and suspension, to
the account owner's email and, when the matter is a person's use of the dashboard, the suspension of
their access or a security incident, also to the people with access involved. Keep these email
addresses up to date.

23.2. Your communications to us go to hello@pyxis-analytics.dev.

## Clause 24 — General provisions

24.1. If a clause is held invalid, the others remain in force.

24.2. If either party fails to enforce a right, this does not mean that it has waived it.

24.3. This agreement does not create a partnership, an employment relationship or agency between the
parties.

24.4. This agreement is entered into in Portuguese, by electronic means, and is valid as a written
agreement.

## Clause 25 — Governing law and venue

25.1. This agreement is governed by Brazilian law.

25.2. Before going to court, contact us at hello@pyxis-analytics.dev: we want to resolve the matter.
This is an invitation, not a condition. If you are a consumer, you may also turn to Procon and the
other consumer protection bodies.

25.3. **If you are a consumer**, you may bring an action in the courts of your domicile (Código de
Defesa do Consumidor, art. 101, I).

25.4. In all other cases, the courts of the judicial district (comarca) of **Salvador/BA**, the domicile of the service provider, are chosen.

---

[Annex 1 — Personal Data Processing Agreement](/en/dpa).

[Annex 2 — Pyxis Privacy Policy](/en/privacy).
