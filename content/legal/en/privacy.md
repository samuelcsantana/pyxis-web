# Pyxis Privacy Policy

**Version {{terms.version}}, in force from {{terms.effectiveFrom}}.**

> This is a courtesy translation. The binding text is the Portuguese version
> ([Português](/privacidade)); if the two differ, the Portuguese version prevails.

This policy explains which personal data Pyxis processes **as controller**, for what purpose, on
what legal basis, with whom it shares the data, how long it keeps it and how you exercise your
rights, in accordance with the Lei Geral de Proteção de Dados Pessoais (Brazilian General Data Protection
Law, Lei nº 13.709/2018, the "LGPD").

It applies to:

1. **customers** who subscribe to hosted Pyxis, represented by the **account owner**, who registers
   and manages the account;
2. **people with access to the dashboard** (`app.pyxis-analytics.dev`): the account owner and the
   people the owner invites;
3. **people who write to us** at hello@pyxis-analytics.dev;
4. **visitors to the home page** `pyxis-analytics.dev`.

It does **not** cover the visitors to our customers' sites. On those sites, whoever decides on the
measurement is the site owner (the controller); we act as processor, under the rules of the Personal
Data Processing Agreement. If you visited a site that uses Pyxis, consult that site's privacy
policy.

---

## 1. Who the controller is and how to contact us

1.1. The controller is **{{seller.name}}**, an individual, holder of CPF (Brazilian individual
taxpayer number) no. **{{seller.taxId}}**, with address at **{{seller.address}}**, who offers the
service under the name **Pyxis**.

1.2. Channel for any privacy matter, including the exercise of your rights:
**hello@pyxis-analytics.dev**. Messages are read and answered by the controller personally.

1.3. As a small-scale processing agent, we do not appoint an encarregado (data protection officer
under the LGPD); this channel fulfills the role provided for in art. 41, § 2, I, of the LGPD (Resolução CD/ANPD
nº 2/2022, art. 11, and Resolução CD/ANPD nº 18/2024, art. 3, § 3, both resolutions of the Board of
Directors of the ANPD, the Brazilian National Data Protection Authority).

## 2. What data we process, for what purpose, on what legal basis and for how long

### 2.1. People with access to the dashboard

| Data | Purpose | Legal basis (LGPD) | Retention |
|---|---|---|---|
| Email, language of the emails (that of the screen where you signed in or registered), projects you have access to, whether you are the account owner or an invitee, choice about the weekly digest, registration date | Send the sign-in code and the service emails, show your projects and send the weekly digest in your language | Performance of the contract, for the account owner (art. 7, V); our and the customer's legitimate interest in giving access to the people the owner invited (art. 7, IX) | While you have access to any project or own an account. When the owner removes you from a project, access to it ends immediately; if you are left without access to any project, we delete your registration within 30 days. In any case, the registration is deleted together with the account (item 2.2) |
| Invitation: your email, the project name and the email of the person who invited you, in the invitation email | Inform you of the access and of who granted it | Our and the customer's legitimate interest (art. 7, IX) | The invitation itself is not kept in our database (only the registration in the row above); the record of the sending stays with the email provider for its retention period (item 3) |
| Sign-in and registration codes: email, code stored only as a hash, purpose (sign-in or registration), language, attempts, times | Allow passwordless sign-in and registration and prevent repeated attempts | Performance of the contract, preliminary procedures to it and legitimate interest in security (art. 7, V and IX) | Valid for 10 minutes; deleted by the daily routine after they expire |
| Sessions: value stored only as a hash, start and last-use dates, device category and browser and operating system family (without version) | Keep you signed in and show your sessions so you can end them | Performance of the contract and legitimate interest in security (art. 7, V and IX) | At most 7 days, or 24 hours without use; deleted by the daily routine after they end |
| Access tokens: name you gave, value stored only as a hash, dates of creation, last use, expiry and revocation | Allow programs and agents to read your figures | Performance of the contract (art. 7, V) | Until your registration is deleted (an expired or revoked token stops working immediately, but the record remains until then) |
| Connected apps (Claude connector): the app (Claude or Claude Code), the dates on which you connected, of last use (recorded at most every 5 minutes and at each renewal) and of revocation; connection credentials stored only as a hash | Let the app you connected read your figures and show the connections so you can revoke them | Performance of the contract, for the account owner (art. 7, V); our and the customer's legitimate interest in offering this feature to the people the owner invited (art. 7, IX) | While the connection is active. The daily routine deletes a connection revoked or idle for 90 days, expired credentials and renewal credentials exchanged more than 30 days ago |
| Connection requests: the app, the address the response goes back to, the technical data the app sends to protect the request, the times, your decision (allow or cancel), who decided and the single-use code stored only as a hash | Show the request on the consent page and deliver the response only to the app that requested it | Performance of the contract, for the account owner, and legitimate interest in security and in offering the feature to invitees (art. 7, V and IX) | The request is valid for 10 minutes, and the code for 5. The daily routine deletes the request 1 day after it expires; after that, only the connection in the row above remains |
| Weekly digest sending record (project, person, week, sending date) | Avoid sending the same digest twice | Performance of the contract (art. 7, V) | Until the deletion of the project or of your access |
| API technical logs with your internal identifier (for example, "signed in", "ended the session", "created a token", "connected an app") | Security and investigation of failures and incidents | Legitimate interest in security (art. 7, IX) | 14 days |

**IP address:** when you request a code or sign in to the dashboard, the IP is used only in the
server's memory to limit attempts (up to 5 every 15 minutes) and disappears within 15 minutes at
most. **It is not recorded** in our database or in our logs. Vercel, which hosts the dashboard,
receives the IP and browser of whoever accesses it and keeps them in its technical logs for 1 day
(item 3).

### 2.2. Customers (account owners)

| Data | Purpose | Legal basis (LGPD) | Retention |
|---|---|---|---|
| Account: owner, plan (free or paid), subscription status, billing interval, Stripe customer and subscription identifiers (only on the paid plan), dates (end of the trial, of the period, of access, of notices sent), monthly event usage and notices sent about the quota and about an account without events | Provide the service, apply the plan's limits, turn access on and off according to the plan and the subscription, notify and delete a free plan account without events, give notice of the end of the account | Performance of the contract (art. 7, V) | Until the account is deleted: 30 days after the end of access or, for a free plan account without events, 7 days after the notice (Terms of Use, Clause 7.6) |
| Acceptance of the terms: accepted version, date and time, account and person who accepted (without IP) | Know which version applies to you and prove acceptance | Performance of the contract and regular exercise of rights (art. 7, V and VI) | Until the account is deleted. When you subscribe to the paid plan, Stripe keeps, as controller, the record of the acceptance given on its payment page |
| Billing data, only of those who subscribe to the paid plan, received through Stripe: name, email, billing address, CPF or CNPJ (Brazilian company taxpayer number), if provided, card brand, last digits and expiry date, history of payments, refunds and chargebacks | Charge the subscription, send receipts, handle withdrawals, refunds and chargebacks, comply with tax obligations | Performance of the contract (art. 7, V) and compliance with a legal obligation (art. 7, II) | During the agreement and for 5 years counted from the year following that of each charge (tax retention period) |
| Project configuration: name, site addresses, time zone, conversion event, public key, secret key stored only as a hash, icon copied from the site itself | Provide the service | Performance of the contract (art. 7, V) | Until the project is deleted by the owner or the account is deleted ("Account" row above) |
| Export requests: who requested, when, status and number of events | Generate and deliver the export file to the account owner | Performance of the contract (art. 7, V) | Until the project is deleted. The file itself is deleted 7 days after it is ready |

**On the free plan, we do not ask for a card or billing data.** On the paid plan, **we do not
receive or store the card number**: it stays with Stripe. We keep only the card fingerprint
described in item 2.7.

### 2.3. People who write to us

| Data | Purpose | Legal basis (LGPD) | Retention |
|---|---|---|---|
| Email, name, message content and attachments | Respond to access requests, questions, support, complaints and data subject requests | Preliminary procedures and performance of the contract (art. 7, V); regular exercise of rights (art. 7, VI); legitimate interest in responding to those who contact us (art. 7, IX) | If there is an agreement: up to 5 years after it ends (period for claiming damages, Código de Defesa do Consumidor (Brazilian Consumer Protection Code), art. 27). If there is none: 1 year after the last message |

### 2.4. Visitors to the home page (`pyxis-analytics.dev`)

The Pyxis home page is measured by Pyxis itself, with the same rules we offer customers.

| Data | Purpose | Legal basis (LGPD) | Retention |
|---|---|---|---|
| Page viewed (path, without parameters other than campaign ones), actions on the page (for example, opening the demo), referring site (domain only), campaign parameters, device category, browser and operating system family, country and state (never the city), random visit number | Understand how the page is used and improve the presentation of Pyxis | Legitimate interest (art. 7, IX, and art. 10) | 13 months |

The measurement **does not use cookies**, **does not store the IP** or the full browser string, and
**sends nothing** if your browser asks not to be tracked (Global Privacy Control or Do Not Track). On
the page itself, the "What this page recorded" panel shows each event sent and lets you turn off the
measurement in this browser. Vercel, which hosts the page, keeps the IP and browser of whoever
accesses it in its technical logs for 1 day.

### 2.5. Cookies and browser storage

| Where | Name | Type | Purpose | Duration |
|---|---|---|---|---|
| Dashboard (`app.`) | `__Host-pyxis_session` | Necessary cookie, `HttpOnly` and `Secure` | Keep you signed in | 7 days, or until you sign out |
| Dashboard and demo (`app.` and `demo.`) | `pyxis_locale` | Preference cookie | Remember the chosen language | 1 year |
| Dashboard and demo | `pyxis_theme` | Preference cookie | Remember the light or dark theme, when chosen | 1 year |
| Dashboard | `pyxis:pending-sign-in` | `sessionStorage` (tab only) | Remember the email entered while you wait for the code, even if you reload the page | 10 minutes, or until the tab is closed |
| Home page | `pyxis:session` | `sessionStorage` (tab only) | Random visit number | Until the tab is closed or 30 minutes of inactivity |
| Home page | `pyxis:opt-out` | `localStorage` | Remember that you turned off the measurement | Until you turn it back on or clear the browser data |
| Home page and dashboard sign-in screen | `pyxis:theme` | `localStorage` | Remember the theme chosen on this device | Until you change it or clear the browser data |

The home page does not create cookies. We do not use third-party, advertising or social media
cookies, and the dashboard does not measure the use of the people who sign in to it.

### 2.6. Emails we send

We send only emails related to the service: sign-in and registration codes; invitation to a
project; welcome, with the version of the terms accepted; usage notices at 80%, at 100% and of the
pause at 150%, on the paid plan, and at 80% and of the pause at 100%, on the free plan; notice of a
free plan account without events; notice of the end of access, reminder 7 days before deletion and
notice that deletion has been carried out; notice that an export is ready; the weekly digest (which
each person can turn off in Settings); and communications about the agreement, including notices of
abuse and suspension. Billing emails are sent by Stripe itself: reminder 7 days before the end of
the free trial (for trials started before version 1.3 of the Terms of Use), receipts for payments
and refunds, notice of a declined payment, request to confirm the payment (3D Secure)
and notice of a card about to expire. **Our emails have no open or click tracking.** We do not send
advertising.

### 2.7. Prevention of repeated free trials

**Since version 1.3 of the Terms of Use there has been no free trial** (Terms of Use, Clause 8.3),
and we do not record new card fingerprints. This item covers the records of the trials started
before then, which follow the retention period in the table below and disappear, at most, 12 months
after the start of the last of those trials.

The free trial was available once per customer (Terms of Use, Clause 8.3). To detect when the same
card starts a second trial in another account, when we record a subscription with a free trial (in
practice, when the trial starts) we read from Stripe the subscription's **card fingerprint**: a code that Stripe calculates from the card number and that repeats whenever the
same card number is used in our Stripe account. **The fingerprint is not the card number and cannot
be used to pay. We do not receive or store the card number.**

| Data | Purpose | Legal basis (LGPD) | Retention |
|---|---|---|---|
| Card fingerprint, internal account identifier and date on which we recorded the card in the trial (in practice, the start of the trial) | Detect the same card starting a second free trial in another account | Legitimate interest in preventing abuse of the free trial (art. 7, IX, and art. 10) | **12 months counted from that date, including after the account is deleted**; at the end of the period, the daily routine deletes the record |

1. **What happens when there is a match.** If the same fingerprint has already started a trial in
   another account in the previous 12 months, the service records the fact in the technical logs,
   only with the accounts' internal identifiers and never with the fingerprint (they disappear in 14
   days), and an alarm notifies us by email.
   **Nothing happens automatically**: no charge and no cancellation. The controller examines the
   case, may ask the account owner for an explanation and decides under the rules of Clause 18.11 of
   the Terms of Use, which guarantee notice, a reason and the right to contest. It is therefore not a
   decision made solely by automated means (art. 20).
2. **Why we keep it after the account is deleted.** The purpose is precisely to recognize a new
   account opened after the old one was closed. We keep only the minimum needed for this (no name,
   email or card number) and for the period that covers this use (art. 10, § 1).
3. **Limits.** A card used through a digital wallet (such as Apple Pay or Google Pay) may have a
   fingerprint different from that of the physical card, and the same card may be used legitimately
   by different people in a company. Trials older than 12 months have already been deleted and are
   not part of the comparison. A match is an indication, never proof on its own.
4. **Your rights.** You may request confirmation of and access to this record and object to it
   (item 6), and we examine the objection taking into account the reason you give.

### 2.8. Abuse checks

When we check a suspicion of abuse (Terms of Use, Clauses 12 and 18), we use only what the service
already stores: the security alerts, the API's technical logs (which state when an event or a
property was refused and under which rule, without the refused value, and disappear in 14 days), the
account and billing data, the record in item 2.7, the project's events (consulted only to the extent
necessary, as stated in the Data Processing Agreement) and what is reported to us. **We do not keep
IPs or full browser strings for this, because the service does not keep them.**

| Data | Purpose | Legal basis (LGPD) | Retention |
|---|---|---|---|
| Record of the check: what was seen, the notices sent, your response, the measure taken and the reason | Apply the measures of Clause 18 of the Terms fairly and be able to demonstrate them | Legitimate interest (art. 7, IX) and regular exercise of rights (art. 7, VI) | In the mailbox, for the periods in item 2.3 (up to 5 years after the end of the agreement) |

We keep other data beyond the periods in this policy only if a law, a court order or a request from a
competent authority requires it, or if the data is needed for judicial, administrative or arbitral
proceedings, and only the data covered, for the time required (art. 7, VI, and art. 16, I).

## 3. With whom we share data

3.1. **We do not sell personal data** and do not share it for advertising.

3.2. We use the providers below, which process data on our behalf (processors) or, where indicated,
on their own behalf:

| Provider | What it does | What data it receives | Where |
|---|---|---|---|
| **Vercel Inc.** (USA) | Hosts the dashboard and the home page | Everything you see and send in the dashboard; IP and browser of whoever accesses it (logs for 1 day) | Functions in São Paulo; main processing in the USA |
| **Amazon Web Services (AWS)** | API, automatic routines, technical logs (14 days), secrets storage, export files (7 days) | Data in items 2.1, 2.2 and 2.7, in transit; technical logs without email or IP | São Paulo (sa-east-1); worldwide content delivery network in front of the API, without storing requests |
| **Neon** (Databricks, Inc., USA) | Database | The data in items 2.1, 2.2 (account, acceptance, configuration, usage and exports), 2.4 and 2.7 | Servers in São Paulo; company in the USA; backups for up to 30 days |
| **Amazon SES** (AWS) | Sends the service emails (item 2.6), without open or click tracking | Recipient's email and email content. Addresses that bounce the email or mark it as spam go on our AWS account's suppression list, so that they receive no more emails, until they are removed | São Paulo (sa-east-1) |
| **Stripe** (Stripe Brasil Soluções de Pagamento – Instituição de Pagamento Ltda. and Stripe, LLC, USA) | Billing, payment page, subscription portal and billing emails | Billing and card data (item 2.2); Stripe calculates the card fingerprint (item 2.7) | Brazil and USA. Stripe also processes data **as controller**, for fraud prevention and compliance with its own legal obligations, in accordance with Stripe's privacy policy |
| **ImprovMX** (ImprovMX Incorporated, USA) | Forwards the emails sent to hello@pyxis-analytics.dev | Message in transit; record of sender and subject for 7 days | Transient reception in France; company in the USA |
| **Google** (Google LLC, USA) | Mailbox where the messages sent to hello@pyxis-analytics.dev are kept | Messages received and sent | USA and other countries. It is a personal account, without a processor agreement: Google processes the messages **as controller**, in accordance with Google's privacy policy |

3.3. **Authorities.** We only hand over data to authorities when there is a court order or a request
from someone with the legal authority to make it, and only what is required.

3.4. **Customers and people with access.** The people with access to a project, including the
account owner, see in Settings the list of emails of those who have access to it. Sessions, tokens,
connected apps and the choice about the weekly digest are individual: no one sees another person's.
The people with access can see the account status and the month's usage (for example, to understand
a pause due to the quota); only the account owner opens the Stripe billing portal.

3.5. **Succession.** If the service comes to be provided by a company set up by the controller or by
whoever takes over the service, the data passes to it, under the same rules as this policy, and we
notify you in advance.

3.6. **Apps you connect.** If you connect Claude or Claude Code to Pyxis (Terms of Use,
Clause 13.10), or use an access token in a program, the data the app requests leaves Pyxis for it,
at your request. Through the Claude connector, it goes to **Anthropic** (Anthropic, PBC, USA): the
figures of the projects you can open and, because the app reads who is connected, **your sign-in
email**. Anthropic **is not our processor**: it processes this data under the terms and the privacy
policy that apply between it and you. The consent page states, before **Allow**, that this data goes
to Anthropic, in the United States (item 4.4). To recognize Claude and Claude Code, Pyxis reads the
public document that Anthropic publishes about each of them; this reading carries none of your data.
You see and revoke your connections in Settings → Connected apps.

## 4. International transfer

4.1. Our databases are in São Paulo, but several providers in item 3 are United States companies and
process or store part of the data there: Vercel (dashboard and home page), Stripe (billing),
ImprovMX (email forwarding, with transient reception in France) and Google (mailbox). The emails the
service sends go out through AWS in São Paulo. Neon (Databricks) stores the data in São Paulo, but is
a US company whose teams can access it from there. If you connect Claude or Claude Code (item 3.6),
the data the app requests also goes to the United States, to Anthropic, by your choice.

4.2. **Form, purpose and duration:** the data goes to these providers so that they can provide the
service described in item 3, for the periods in item 2, or for the log periods of each provider
stated in item 3.

4.3. **Destination countries:** United States; France (only ImprovMX's transient reception); and
other countries where Google has operations.

4.4. **Basis:** the transfer to Anthropic when you connect Claude or Claude Code (item 3.6) relies on
your **specific and highlighted consent** (art. 33, VIII): the consent page states, before **Allow**,
that the data the app requests, including your email, goes to Anthropic, in the United States, and
the connection exists only if you allow it; you withdraw consent at any time by revoking the
connection in Settings → Connected apps. When the transfer is necessary to perform the contract with
you (billing, sign-in to the dashboard and replies to your messages), it relies on art. 33, IX,
combined with art. 7, V, of the LGPD. France is part of the European Union, recognized by the ANPD as
having an adequate level of protection (Resolução CD/ANPD nº 32/2026). In the other cases, the
providers undertake, in their data processing agreements, to protect the data and to process it only
to provide the service; these agreements **do not yet include the standard clauses approved by the
ANPD** (Resolução CD/ANPD nº 19/2024). We monitor the providers' adoption of them and will change
provider or mechanism when necessary.

4.5. **Responsibilities and security:** each provider is responsible for security in its own
environment; we are responsible to you for the processing as a whole. The measures we adopt are in
item 5.

4.6. You may request the full text of each provider's contractual clauses, which we answer within 15
days, and exercise your rights through the channel in item 1, including the right to petition the
ANPD against us.

## 5. Security

5.1. Among the measures we adopt:

1. encrypted connections (HTTPS with TLS 1.2 or higher) all the way, including to the database, with
   certificate verification;
2. database data encrypted at rest by the provider;
3. passwordless sign-in, with a single-use code valid for 10 minutes, with an attempt limit;
4. codes, sessions, secret keys, tokens and connected app credentials stored only as a hash;
5. sessions with a maximum duration and termination after 24 hours without use; you see and end your
   sessions in Settings;
6. technical logs without email, IP, token or key, kept for 14 days;
7. alarms for suspicious sign-in attempts and service errors;
8. open-source code, with automated security and dependency review.

5.2. No system is perfectly secure. If a security incident occurs that may bring significant risk or
harm to you, we notify you and the ANPD within the periods set by regulation (Resolução CD/ANPD
nº 15/2024).

## 6. Your rights

6.1. You may request, at any time (LGPD, art. 18):

1. confirmation that we process your data;
2. access to it;
3. correction of incomplete, inaccurate or outdated data (for example, changing the sign-in
   email);
4. anonymization, blocking or deletion of unnecessary or excessive data or of data processed in
   breach of the LGPD;
5. portability, under the ANPD's regulations; while these do not exist, we deliver your data in an
   open-format file (JSON);
6. information about with whom we share your data (item 3);
7. review of decisions made solely by automated means (item 7);
8. objection to processing based on legitimate interest, if you believe it breaches the LGPD;
9. deletion of the data, in the cases provided for by law. Some data must be kept even so, because of
   a legal obligation (for example, billing data) or for defense in proceedings (LGPD, art. 16).

6.2. **How to request:** write to hello@pyxis-analytics.dev, preferably from the registered email.
If it is not possible to confirm that the request is yours, we will ask for a simple confirmation
before fulfilling it.

6.3. **Deadline:** we acknowledge receipt and respond **within 15 days**.

6.4. **People with access to a project:** access to the dashboard exists because an account owner
invited you. If you request the deletion of your email, your access ends; we notify the account
owner. If you are the account owner, deleting your registration requires closing the account (Terms
of Use, Clause 11.6), and the billing data remains stored for the legal period (item 2.2).

6.5. **Visitors to the home page:** since we do not store IPs, cookies or persistent identifiers, we
have no way to locate your anonymous visits. You can turn off the measurement on the page itself or
turn on the Global Privacy Control signal in your browser.

6.6. You may also petition the **Agência Nacional de Proteção de Dados (ANPD)**, at `gov.br/anpd`,
and the consumer protection bodies.

## 7. Automated decisions

We do not make decisions about you based solely on automated processing that affect your interests,
nor do we create profiles of you. The automatic effects of the service are rules that are the same
for everyone and do not assess you as a person:

1. security: after too many attempts, a code or sign-in request is refused for a few minutes;
2. contractual: event intake pauses when the account reaches 150% of the monthly limit on the paid
   plan, or 100% on the free plan; access follows the plan and the status of the subscription in
   Stripe; and a free plan account without events is deleted after the notice (Terms of Use,
   Clauses 7.2, 7.6 and 9).

A card fingerprint match (item 2.7) and measures for abuse (Terms of Use, Clause 18) are always
decided by a person. If any of this gets in your way, contact us.

## 8. Children and adolescents

Only people aged 18 or older can subscribe to the service, and the home page is not directed at children or
adolescents. If we learn that we are processing a child's data without a legal basis, we delete it.

## 9. Changes to this policy

9.1. We publish each new version with its effective date. If a change affects the way we process
your data, we notify customers and people with access by email at least 30 days in advance, unless
the change is required by law, in which case it may take effect earlier.

9.2. Previous versions are available on request.

## 10. Contact

**{{seller.name}}**, controller. **hello@pyxis-analytics.dev**. **{{seller.address}}**.
