# Pyxis Personal Data Processing Agreement

**Version {{terms.version}}, in force from {{terms.effectiveFrom}}.**

> This is a courtesy translation. The binding text is the Portuguese version
> ([Português](/acordo-de-tratamento)); if the two differ, the Portuguese version prevails.

This agreement is **Annex 1 to the Pyxis Terms of Use** and forms part of the agreement between you
and us. It explains how we process the personal data that reaches Pyxis from your sites, in
accordance with the Lei Geral de Proteção de Dados Pessoais (Brazilian General Data Protection Law,
Lei nº 13.709/2018, the "LGPD"). If anything here conflicts with the Terms of Use, this agreement
prevails with regard to personal data.

---

## Clause 1 — Who the parties are

1.1. **We:** {{seller.name}}, an individual, holder of CPF (Brazilian individual taxpayer number)
no. {{seller.taxId}}, with address at {{seller.address}}, who offers the service under the name
**Pyxis**. Contact: **hello@pyxis-analytics.dev**.

1.2. **You:** the person or company that subscribed to hosted Pyxis by accepting the Terms of Use,
represented in the dashboard by the account owner (Terms of Use, Clause 2.9). This agreement
applies in the same way on the free plan and on the paid plan (Terms of Use, Clause 7.1).

## Clause 2 — Words used in this agreement

2.1. The words **personal data**, **processing**, **data subject**, **controller**, **processor**,
**anonymization**, **deletion**, **international transfer** and **security incident** have the
meaning given to them by the LGPD (art. 5) and by the resolutions of the Agência Nacional de Proteção
de Dados (ANPD; Brazilian National Data Protection Authority).

2.2. **Visitor** is the person who accesses a site or app of yours on which the Pyxis tracker is
installed.

2.3. **Event** is each record that the tracker sends to Pyxis, such as a page view or an action you
have marked.

2.4. **Project** is the configuration of one of your sites in Pyxis: name, authorized addresses
(origins), time zone, conversion event, the option to store the city, keys and events.

2.5. **Sub-processor** is the provider we engage and that processes, on our behalf, personal data
covered by this agreement.

## Clause 3 — Roles of each party

3.1. With regard to the data of the visitors to your sites, **you are the controller** and **we are
the processor** (LGPD, art. 5, VI and VII). You decide whether and how to measure; we process the
data to provide the service you subscribed to.

3.2. If you use Pyxis to measure third-party sites (for example, as an agency), you represent that
you have the authorization of the controller of those sites to engage us and to give the
instructions of this agreement. In that case, we act as sub-processor, and you pass on to the
controller the information in this agreement that it needs.

3.3. With regard to the data of your account (the emails of those who access the dashboard, the
account and the subscription, the acceptance of the terms, the billing history, the prevention of
repeated free trials, the records of app connections and the support messages), **we are the
controller**. That processing is covered by the **Pyxis Privacy Policy** (Annex 2 to the Terms of
Use), not by this agreement.

## Clause 4 — What we process, for what purpose and for how long

4.1. **Schedule I** to this agreement describes the processing: purposes, data subjects, categories
of data, what is **not** stored, where the data is kept and for how long.

4.2. We process the visitors' data **solely** to:

1. receive the events sent by the tracker and store them in your project;
2. show the analysis to you and to the people you have authorized, in the dashboard, in the query
   API, in the MCP server (including to the apps they connect; Schedule I, item 10) and in the
   weekly email digest;
3. handle data subjects' requests for deletion and copies of data (Clause 10);
4. keep the service secure and running (limits against abuse, fixing failures, providers'
   backups);
5. comply with a legal obligation or an order of a competent authority (Clause 15);
6. generate, at the request of the account owner, the export file of a project's events
   (Schedule I, item 11);
7. check and contain a suspicion of abuse or of use contrary to the Terms of Use (Clauses 12 and 18
   of the Terms), only with the data the service already stores and only to the extent necessary
   (Clause 7.2).

4.3. **We do not use the data of your projects for any other purpose.** We do not sell it, rent it,
use it for advertising, use it to train artificial intelligence models or combine it with other
customers' data. The only figures we take from your projects for our own use are operational
counts, such as the number of events per month of each account and the size of the database, used
to apply the plan's monthly limit (Terms of Use, Clause 7.2), to know whether a free plan account
has gone without receiving events (Terms of Use, Clause 7.6) and to check the capacity of the
service.

## Clause 5 — Your instructions

5.1. Your instructions for the processing are, taken together:

1. the Terms of Use and this agreement;
2. the configuration of your projects (authorized origins, time zone, conversion event, the option
   to store the city, keys and people with access), made by the account owner in the dashboard or,
   on request, by us;
3. what the tracker installed on your site sends (which events and properties, and whether you use
   the `identify` function);
4. the actions of the account owner in the dashboard (for example, exporting the events, deleting a
   project or closing the account), the calls you make to the API with your secret key or with an
   access token, and the app connections that the people with access allow in the dashboard
   (Schedule I, item 10);
5. the requests you send us in writing, by email to hello@pyxis-analytics.dev.

5.2. If an instruction of yours appears to us to be contrary to the LGPD or another law, we notify
you in writing and do not follow it until the matter is resolved: a processor that follows an
unlawful instruction is jointly liable with the controller (LGPD, art. 42, § 1, I).

5.3. An instruction that would require changing how the service works for all customers (for
example, storing a piece of data that Pyxis does not store) is not binding on us; in that case, you
may terminate the agreement under the Terms of Use.

5.4. **Suspension of processing.** We may suspend, in whole or in part, the processing of a project
(normally, the intake of new events), under the procedure of Clause 18 of the Terms of Use, when:

1. the project sends direct or sensitive personal data, contrary to Clause 6.1, items 3 and 4;
2. the project sends events from people who asked not to be measured, contrary to Clause 6.1,
   item 5;
3. an instruction of yours is unlawful (Clause 5.2);
4. it is necessary to contain a security incident (Clause 11.6); or
5. a law or a competent authority so orders (Clause 15).

During the suspension, the data already received remains stored, with the same security measures
(Schedule II); no new data is received in the suspended part; the retention and deletion periods of
Clause 12 continue to apply; and the data received in breach of this agreement is deleted on your
instruction (Clause 10.6). The suspension does not change your duties as controller towards the data
subjects.

## Clause 6 — What you guarantee as controller

6.1. You guarantee that you:

1. have a valid legal basis (LGPD, art. 7) to measure the use of your sites with Pyxis. For the
   measurement without cookies and without direct personal data that Pyxis performs, the most common
   basis is legitimate interest (art. 7, IX, and art. 10), which requires transparency and respect
   for the visitor's expectations; the assessment is yours;
2. inform visitors about the measurement, in your site's privacy notice, clearly. **Schedule IV**
   provides a template;
3. **do not send Pyxis direct personal data or sensitive personal data**: no name, email, phone
   number, CPF, address, document number, text typed by the visitor, health data, racial origin,
   religion, political opinion, sex life, genetic or biometric data, or any data that identifies a
   person on its own;
4. if you use the `identify` function, send only an **internal, opaque identifier** of the account
   in your system (for example, a random record number), never the email, the CPF, the phone number
   or other data that identifies the person directly;
5. do not disable or circumvent the respect for the browser's "do not track" signals (Global Privacy
   Control and Do Not Track) or the option not to be measured (`optOut`) that the tracker offers, nor
   send by another route events from people who asked not to be measured;
6. if your site is directed at children or adolescents, have assessed the processing in light of
   art. 14 of the LGPD and of their best interests before installing the tracker;
7. respond to the requests of the data subjects of your sites, with our support (Clause 10);
8. publish, where applicable, the information on international transfer required by art. 17, § 2,
   of the Regulation approved by Resolução CD/ANPD nº 19/2024 (resolution of the ANPD Board of
   Directors), using the information in Clause 9 and Schedule III;
9. install the tracker and register as the origin of a project only sites that are yours or belong
   to someone who authorized you (Clause 3.2);
10. if you turn on the city in a project (Terms of Use, Clause 4.5), have first assessed whether it
    is necessary for the purpose of the measurement and whether it fits the legal basis of item 1;
    have first updated the notice of item 2, highlighting the change; and, if the project uses the
    `identify` function, know that it starts recording the approximate city of each visit by
    identified people, and state this in the notice.

6.2. The Pyxis server automatically discards values shaped like an email address or sequences of 10
or more digits (such as CPF and CNPJ, the Brazilian individual and company taxpayer numbers, and phone numbers) in event properties, in campaign parameters and
in the user identifier. This barrier is a **second layer**: it does not recognize names, addresses
or free text. **You are responsible for what your site sends.**

6.3. If you notice that you have sent direct personal data to Pyxis, let us know. We help delete it
(Clause 10.6). If we notice it, through the barrier's refusal logs or otherwise, we notify you.

## Clause 7 — Confidentiality

7.1. Pyxis is currently operated by a single person: the individual identified in Clause 1.1. That
person is the only one with administrative access to the systems and the database.

7.2. We only access a project's data when necessary to: (a) provide support you requested;
(b) investigate or fix a failure or a security incident; (c) maintain the service; (d) comply with
a legal obligation or an order of an authority; or (e) check a concrete suspicion of abuse
(Clause 18 of the Terms of Use), looking only at what is necessary to confirm or dismiss it.

7.3. If, in the future, another person comes to operate the service with us, that person will only
have access after undertaking in writing the same duty of confidentiality as in this agreement, and
we will notify you.

7.4. The duty of confidentiality and security continues to apply after the end of the agreement
(LGPD, art. 47).

## Clause 8 — Security

8.1. We adopt technical and administrative measures to protect the data against unauthorized access
and against destruction, loss, alteration, disclosure or any improper or unlawful processing (LGPD,
art. 46). The measures in force are in **Schedule II**.

8.2. We may replace a measure with an equivalent or better one. We do not reduce the overall level
of protection described in Schedule II during the agreement.

8.3. The Pyxis source code is public (MIT license). You can check how the service processes data in
the `pyxis-api`, `pyxis-sdk`, `pyxis-web` and `pyxis-mcp` repositories, on GitHub.

## Clause 9 — Sub-processors and international transfer

9.1. **Authorization.** You authorize us to use the sub-processors listed in **Schedule III**. Each
one processes only what is necessary for the part of the service it provides.

9.2. **Changes.** Before adding or replacing a sub-processor that processes visitors' data, we
notify you by email **at least 30 days in advance**, stating who it is, what it will do and where.
If you do not agree, you may terminate the agreement before the change and receive back the amount
proportional to the paid and unused period. In an emergency (for example, a provider that stopped
working or became insecure), the replacement may be immediate; we notify you within 5 business days,
and you have the same right to terminate with a pro rata refund.

9.3. **Agreements with sub-processors.** The providers in Schedule III are large companies that
contract on standard terms, which we do not negotiate. We choose providers whose terms include
commitments on security, confidentiality and processing in accordance with our instructions.
Schedule III states each one's agreement.

9.4. **Where the data is kept.** The events of your projects are **stored in Brazil**: in Neon's
database, which runs in the AWS São Paulo region, and processed by the API in the AWS São Paulo
region (sa-east-1).

9.5. **Where there is a foreign element.** Even with the data stored in Brazil, there are four
situations you should be aware of:

1. **AWS content delivery network (CloudFront).** Requests from the visitor's browser reach the AWS
   point of presence closest to the visitor, which may be outside Brazil when the visitor is outside
   Brazil. That point only forwards the request to São Paulo: caching is turned off and we do not
   keep CloudFront access logs.
2. **Companies headquartered in the United States.** Neon is part of Databricks, Inc.; Vercel Inc.
   hosts the dashboard. Both are US companies, and their teams and systems may access data from
   outside Brazil to operate, provide support and make backups.
3. **Dashboard.** The dashboard pages are built in Vercel functions in the São Paulo region (gru1),
   but Vercel states that its main processing takes place in the USA. The technical logs of requests
   to the dashboard stay with Vercel for 1 day.
4. **Connected apps.** If a person with access connects Claude or Claude Code, the data that person
   requests from the app goes to Anthropic, in the USA, on your instruction (Clause 5.1, item 4, and
   Schedule I, item 10). Anthropic is not our sub-processor.

The service emails, including the weekly digest (which carries only aggregate figures for the
project, without data on identifiable visitors; Schedule I, item 6), go out through Amazon SES, in
the AWS São Paulo region (Schedule III).

9.6. **Transfer mechanism.** As of the date of this version, the data processing agreements (DPAs)
of AWS, Databricks (Neon) and Vercel provide for European Union standard clauses and security
commitments, but **do not incorporate the standard contractual clauses approved by the ANPD**
(Resolução CD/ANPD nº 19/2024). To reduce to a minimum what leaves Brazil (art. 9, sole paragraph,
of the Regulation), Pyxis does not store IPs, does not store the full browser string, does not use
cookies on your sites and reduces page addresses to templates (Schedule II). We undertake to:
(a) adopt the ANPD standard clauses or another valid mechanism under art. 33 of the LGPD as soon as
any of these providers offers it, or change provider if necessary; (b) notify you of any change on
this point; and (c) give you, on request, the information you need to assess the transfer (art. 4,
§ 1, of the Regulation).

## Clause 10 — Data subject requests

10.1. **Who responds.** As controller, you respond to the visitors and users of your sites who
request confirmation, access, correction, deletion or any other measure under art. 18 of the LGPD.
We help as described below.

10.2. **Only those who were identified can be found.** Pyxis does not store cookies, IPs or a
persistent identifier of the anonymous visitor. The visit identifier is random, stays only in the
browser tab and is replaced when the tab is closed or after 30 minutes of inactivity. Therefore,
**there is no way to find a person's anonymous visits**. It is only possible to locate the events of
someone your site identified with the `identify` function, through the internal identifier you sent.

10.3. **Deleting a person's data (yourself, through the API).** Call
`DELETE https://api.pyxis-analytics.dev/v1/subjects/{userId}` with the project's secret key
(`Authorization: Bearer` header). Pyxis deletes **all events with that identifier and also the visits
in which the person was identified**, including the anonymous events of that same visit that came
before the identification (for example, the landing page and the source of the visit). The response
states how many events were deleted. Calling again returns zero; it is safe to repeat.

10.4. **Copying a person's data (yourself, through the API).** Call
`GET https://api.pyxis-analytics.dev/v1/subjects/{userId}/events` with the secret key. The response
returns the same events that the deletion would delete, in order, up to 1,000 per page, in JSON. If
there are more, the response gives the next cursor (`next_after`), which you pass as `?after=` to
fetch the next page. Each event comes with its name, date and time, visit identifier, page, source,
device, country, state, city (empty in projects with the option turned off; Terms of Use,
Clause 4.5) and properties.

10.5. **Limits on these routes.** Both routes accept up to 60 calls per minute per key and per
source address. The secret key must only be used on your server, never in the browser.

10.6. **Asking us.** If you prefer, send the request to hello@pyxis-analytics.dev, from the email of
a person with access to the project, with the user identifier and what you want (deletion or copy).
We do it **within 5 business days** and reply with the result (the number of events deleted or the
file with the copy). The same applies if you sent personal data by mistake and need to delete it.

10.7. **A request that comes directly to us.** If a data subject of your sites contacts us, we do
not respond on the merits on your behalf: **within 2 business days**, we forward the request to you
and inform the data subject that you are the controller and what your channel is, when we know it.

10.8. **Legal deadlines.** The deadlines for responding to the data subject are yours, as controller
(for example, up to 15 days for the complete statement under art. 19, II, of the LGPD, or the
differentiated deadline for small-scale processing agents, if you qualify). Our deadlines above were
designed to fit within them.

## Clause 11 — Security incidents

11.1. If we become aware of a security incident that has affected or may have affected personal data
of one of your projects, we notify you **without undue delay and within 48 hours** of becoming
aware, by email to the people with access to the project.

11.2. The notice states what we know at that point, and we supplement it later, as soon as we have
more information:

1. what happened, when it happened (if it can be known) and when we found out;
2. the nature and categories of the data affected and, when it can be estimated, how many data
   subjects;
3. the security measures that protected the data before the incident;
4. the possible risks and impacts for the data subjects;
5. what we have already done and what we will do to contain the incident and mitigate its effects;
6. a contact to follow up on the case.

11.3. This deadline was chosen so that you can meet yours: the controller must notify the ANPD and
the data subjects of an incident that may cause significant risk or harm within 3 business days of
becoming aware of it (Resolução CD/ANPD nº 15/2024, arts. 6 and 9), a deadline that is doubled for
small-scale processing agents.

11.4. Notifying the ANPD and the data subjects of your sites is your responsibility, as controller
(LGPD, art. 48). We cooperate with the information we have and do not make any public statement
about your project's data without talking to you first, unless legally required.

11.5. We keep a record of every security incident involving personal data, including those that did
not need to be notified, for **at least 5 years**.

11.6. To contain an ongoing incident or attack, we may immediately suspend parts of the service (for
example, revoking a key or pausing event intake for a project), to the extent necessary. We notify
you as in Clause 11.1, when personal data is involved, or as in Clause 18.4 of the Terms of Use, and
we restore them as soon as the risk has passed.

## Clause 12 — Retention and deletion

12.1. **During the agreement.** Events are stored for **13 months**. A daily routine deletes events
older than 13 months, from all projects.

12.2. **End of the agreement.** **30 days after the end of access** (the end of the paid period after
a cancellation or the end of the subscription for non-payment, when the account does not go back to
the free plan; the closure of the account through the dashboard; the end of the free plan; or
termination by us; Terms of Use, Clauses 2.10 and 11.4), a daily routine permanently deletes the account, the projects and everything belonging to them: events,
keys, settings, site icon, weekly digest sending records, export requests and people's access to the
projects. We also delete the registration (email, sessions, tokens and connected apps) of the
account owner and of the people who only had access to projects of your account. If you delete a
project through the dashboard before then, its events and everything belonging to it are deleted
immediately.

12.3. **Copy before deletion.** Until the deletion date, the account owner can export the events of
each project through the dashboard, in a compressed CSV file that remains available for 7 days
(Terms of Use, Clause 11.5; Schedule I, item 11). If the export through the dashboard does not work,
we send the file **within 10 business days** of the request made by email; if the request arrives
close to the deletion date, we postpone deletion until we deliver the copy.

12.4. **Providers' copies.** After deletion, the data may still exist for a limited time in the
database provider's automatic backups: Neon's point-in-time recovery history keeps changes for up to
7 days, and Neon's backups are kept for up to 30 days. These copies are not used for anything other
than disaster recovery and disappear on their own within those periods. An export file that has not
yet expired disappears, at most, 7 days after it becomes ready. The API's technical logs (which do
not contain visitors' data; Schedule II, item 9) disappear in 14 days.

12.5. **Confirmation.** The account owner receives an email when deletion is carried out. If you
ask, we also confirm the date and what was deleted.

12.6. **Exception: preservation by law or order.** We only keep data from your projects beyond these
periods when a law, a court order or a request from a competent authority obliges us to, or when the
data is needed for judicial, administrative or arbitral proceedings (LGPD, arts. 7, VI, and 16, I).
In that case, we preserve only the data covered, without any other use, for the time required, and
delete it afterwards; we notify you, unless the law or the order prohibits the notice.

12.7. **Free plan account without events.** A free plan account that receives no event in the 30
days after its creation, or that goes 90 consecutive days without receiving events, is deleted as
stated in Clause 7.6 of the Terms of Use: the account owner receives a notice by email and, if the
account is still without events 7 days later, a daily routine deletes the account, the projects and
everything belonging to them, as in item 12.2, without the 30-day period of that item. Until then,
the account owner can export the events (item 12.3). Items 12.4 (providers' copies), 12.5
(confirmation by email) and 12.6 (preservation by law or order) also apply.

12.8. **City turned off.** When the account owner turns off the city in a project (Terms of Use,
Clause 4.5), intake stops reading the city within one minute. The next daily routine deletes the
city from all events already stored in the project, and this finishes within 48 hours after the
option is turned off, provided that the option is still off by then. Items 12.4 (the provider's
backups and the export files that have not yet expired disappear within the periods of that item)
and 12.6 (in a project with data preserved by law or order, the cities remain for the duration of
the preservation) apply. The files you have already downloaded and what the people with access have
already taken to connected apps (Schedule I, item 10) are your responsibility.

## Clause 13 — Information and audit

13.1. If you ask in writing, we provide the information needed to show that we comply with this
agreement, **within 15 days**. This includes answering a reasonable security and privacy
questionnaire, free of charge, once a year and after any incident.

13.2. Because the Pyxis code is public, you can check how the service works directly. Given the size
of the service, we do not offer on-site audits or access to the production systems; the providers'
reports and certifications (AWS, Databricks/Neon, Vercel) are available on their websites.

13.3. We cooperate with the ANPD and other competent authorities in inspections involving the data
of your projects.

## Clause 14 — Liability

14.1. Each party is liable for the damage it causes by breaching the LGPD or this agreement. We, as
processor, are liable to the data subjects under art. 42 of the LGPD: when we breach the data
protection legislation or fail to follow your lawful instructions.

14.2. Between you and us, Clause 19 (Liability) of the Terms of Use applies. Nothing in it reduces
the rights of the data subjects or the right of recourse under art. 42, § 4, of the LGPD.

## Clause 15 — Requests from authorities

15.1. We only hand over data from your projects to an authority when there is a court order or a
request made by someone with the legal authority to make it (Marco Civil da Internet (Brazilian
Internet Civil Framework), Lei nº 12.965/2014, art. 10).

15.2. Before handing it over, we notify you, unless the law or the order prohibits the notice. We
hand over only what is required.

## Clause 16 — Term and changes

16.1. This agreement remains in force for as long as the Terms of Use are in force and, after them,
until the data is deleted in accordance with Clause 12.

16.2. Changes to this agreement follow the change rule of the Terms of Use (30 days' notice and the
right to terminate). Changes required by law or by the ANPD may take effect earlier; in that case,
you may terminate the agreement with a pro rata refund of the paid and unused period.

---

## Schedule I — Description of the processing

**1. Purpose.** Measure the use of the customer's sites and apps and show the analysis to the
customer; handle data subject requests; keep the service secure and running.

**2. Data subjects.** (a) Visitors to the customer's sites and apps; (b) users of the customer's
system whom the customer identifies with the `identify` function.

**3. Data in each stored event.**

| Data | What it is |
|---|---|
| Event identifier | Random number generated in the browser |
| Event name | `page_view` (page viewed), `api_request` (call to the site's API), `identify` or a name the customer defines |
| Date and time | The browser's, corrected for clock skew, and the time of receipt on the server |
| Visit identifier | Random number stored in the tab's `sessionStorage`; replaced when the tab is closed or after 30 minutes of inactivity |
| User identifier | Only if the customer uses `identify`: the internal identifier of the account in the customer's system, with up to 64 letters, digits, `-` or `_` (does not accept `@`, and therefore does not accept an email address) |
| Page | Only the path, in template form: segments that look like identifiers (numbers, long codes, email addresses) become `:id`; without domain and without parameters |
| Source of the visit | Only the domain the visitor came from (for example, `google.com`), without the full address |
| Campaign | `utm_source`, `utm_medium` and `utm_campaign`, if they are in the address; the channel (paid, email, social, campaign, organic search, other site or direct) calculated from them and from the source |
| Ad click | Only true or false. The click code (such as `gclid`) is not stored |
| Device | Category: mobile, tablet, desktop or other |
| Browser and operating system | Only the family (for example, `chrome`, `safari`, `android`, `ios`), without version |
| Country, state and city | Country code (2 letters) and state (code and name), provided by the AWS network at the time of the request. The **city** (approximate name, inferred from the IP address by the AWS network), only in projects in which the account owner has turned on that option (Terms of Use, Clause 4.5), which comes turned off, and only when the state was also provided |
| Properties | Up to 10 per event, defined by the customer: key with up to 40 characters (`a-z`, `0-9`, `_`) and a short value (text of up to 100 characters, number or true/false) |
| Calls to the site's API (`api_request`) | Method, route in template form, response code, duration and, if any, the error code |

**4. What Pyxis does not store.**

- **IP address:** used only in the memory of the API function, to limit abuse, for the duration of
  the limit window (1 minute for sending events; 15 minutes for dashboard sign-in). It is never
  recorded in the database or in the logs.
- **Full browser string (user agent):** read on the spot to determine the device category, the
  browser family and the operating system family; then discarded. Visits from known bots are
  discarded.
- **Cookies:** the tracker does not create cookies on the customer's sites.
- **Full page address, address parameters (other than campaign ones), browser fingerprint, postal
  code (CEP) and coordinates:** never.
- **City:** only in projects in which the account owner has turned on that option. When it is
  turned off, the city stops being read, and the cities already stored are deleted within the
  periods of Clause 12.8.

**5. Sensitive personal data.** It must not be sent (Clause 6.1, item 3). Pyxis was not designed to
process it.

**6. Weekly email digest.** Every Monday, each person with access to the project who has not turned
off the digest receives aggregate figures for the week: visits, identified people (count only),
conversions, failed writes, visits per day, most frequent pages and events and the routes with
the most failures. The digest carries no visitor or user identifiers.

**7. Processing operations.** Receipt, validation, classification, storage, querying, aggregation,
display in the dashboard, delivery through the query API, through the MCP server and to connected
apps, sending of the aggregate digest by email, copying (export), suspension of intake (Clause 5.4)
and deletion.

**8. Frequency and duration.** Continuous, while the tracker is installed and the agreement is in
force. Events stored for 13 months; deletion at the end of the agreement in accordance with
Clause 12.

**9. Where.** Database and API in São Paulo (Brazil). Dashboard in functions in the São Paulo region.
Situations with a foreign element in Clause 9.5.

**10. Access through the MCP server, tokens and connected apps.** The dashboard data leaves Pyxis by
three routes, all chosen by a person with access to the project, who uses them in their own name:

1. **Token in the local MCP server or in another program:** the person creates an access token and
   uses it in the Pyxis MCP server (`pyxis-mcp`), which runs on their computer, or in another
   program. The data goes to that computer and to the artificial intelligence tool they chose.
2. **Token at the address `https://api.pyxis-analytics.dev/mcp`:** the same, with the MCP server
   running inside our API; the data goes to the program the person configured with the token.
3. **Connected app (Claude connector):** the person connects Claude or Claude Code, by Anthropic,
   and allows the connection on a dashboard page (Terms of Use, Clause 13.10). The data the app
   requests goes from our API directly to Anthropic's servers, in the United States (Claude), or to
   the person's computer and from there to Anthropic (Claude Code).

By any of these routes, the app only reads, and only what the person sees in the dashboard: the
aggregate figures and also the visit lists and the timeline of each visit, with the user identifier
sent through the `identify` function (item 3). Sending the data this way is an instruction of yours (Clause 5.1,
item 4) and takes place at the person's request, within the app they chose: that app, including
Anthropic, is **not** our sub-processor, processes the data under the terms that apply between it
and whoever uses it, and it is up to you to assess its use, including whether there is an
international transfer and under which mechanism (art. 4 of the Regulation approved by Resolução
CD/ANPD nº 19/2024), and the notice to visitors (Clause 6.1, items 2 and 8, and Schedule IV). We
give you the information available to us for this assessment (art. 4, § 1, of the same Regulation;
Clause 9.6). Each person revokes their connections in Settings → Connected apps, and the account
owner can remove a person from a project (Terms of Use, Clause 13.3).

**11. Export of events.** At the request of the account owner, a routine generates a compressed CSV
file with all the events the project stores, with the fields in item 3. The file is kept in a
private, encrypted AWS repository in the São Paulo region and is deleted automatically 7 days after
it becomes ready. Only the account owner downloads the file, through the dashboard, with a new link
for each download, valid for 5 minutes. Once downloaded, the file is your responsibility.

---

## Schedule II — Security measures in force

Checked in the service's code and infrastructure configuration on October 14, 2026 and October 15,
2026; item 1 (city), on October 29, 2026.

**1. Privacy by design.** No cookies on the measured sites; IP and full browser string never stored;
pages reduced to templates; a server-side barrier that discards values shaped like an email address
and numbers with 10 or more digits in properties, campaign parameters and the user identifier; the
visitor's state, and the city only when the customer turns on that option in the project, which
comes turned off; the browser's "do not track" signals (Global Privacy Control and Do Not Track)
respected by the tracker, which sends nothing when they are on; an option not to be measured
(`optOut`) for the visitor; events deleted after 13 months.

**2. Encryption in transit.** Browser → API: HTTPS with TLS 1.2 or higher and 2-year HSTS. Content
delivery network → API function: HTTPS only (TLS 1.2). Function → database: TLS with verification of
the server certificate (`sslmode=verify-full`). Dashboard: HTTPS only.

**3. Encryption at rest.** Neon database with AES-256; AWS logs encrypted by default; secrets
(database passwords and service keys) in AWS Systems Manager Parameter Store, encrypted, never in
the code.

**4. Access to the dashboard.**

- Passwordless sign-in: a 6-digit code sent to the authorized email, valid for 10 minutes, stored
  only as a hash (SHA-256), with up to 5 attempts per code and up to 5 codes per hour per email; code
  requests limited to 5 every 15 minutes per source address. An email without access receives no
  code and is not recorded.
- Session: a random 256-bit value stored in the database only as a hash; `__Host-` cookie with
  `HttpOnly`, `Secure` and `SameSite=Lax`; maximum duration of 7 days and automatic end after
  24 hours without use; the person sees the open sessions and ends them one by one or all at once.
- Dashboard write actions accepted only from the dashboard's own origin.
- Only the account owner changes projects, origins, keys and people, requests exports and closes the
  account; invited people only read.

**5. Isolation between customers.** Every query is filtered by the project and by the list of people
with access to it. Requesting someone else's project responds as if it did not exist. There are
automated tests for this.

**6. Keys and tokens.**

- Public key (goes on the site): only identifies the project and is only accepted when the request
  comes from an origin registered in the project.
- Secret key (only on the customer's server): shown only once when created, stored only as a hash,
  compared in constant time, revocable; limited to 60 calls per minute.
- Access tokens (for agents and programs): **read-only**; stored only as a hash; valid for 30, 90 or
  365 days; up to 10 active per person; revocable at any time in the dashboard; limited to 60 queries
  per minute and, in the API's MCP server, to 120 messages per minute. They cannot be used for
  sign-in, writing or deletion.
- App connections (Claude connector): only Claude and Claude Code, recognized by the identification
  documents that Anthropic publishes, with the return address checked against those documents;
  explicit consent on a dashboard page, which shows the app, the return address and the projects;
  a single-use code valid for 5 minutes and bound to a cryptographic proof (PKCE, S256); an access
  credential of 1 hour and a renewal credential exchanged on each use, both stored only as a hash; a
  renewal credential presented again after being exchanged ends the connection; **read-only**,
  through the same queries as the dashboard; up to 10 active connections per person; end after 90
  days without use; revocable at any time in the dashboard; limited to 120 messages per minute in
  the MCP server and to 60 queries per minute. They cannot be used for sign-in, writing or deletion.

**7. Protection against abuse.** Limit on sending batches per source address and per project; batch
of at most 50 events and 32 KB; strict validation of each field; invalid events discarded; intake
paused when the account reaches 150% of the monthly event limit on the paid plan, or 100% on the
free plan; the technical logs state when an
event or a property was refused and under which rule, without storing the refused value.

**8. Infrastructure.** The API function refuses calls that do not pass through the content delivery
network (edge secret checked in constant time). The application's database user cannot change the
database structure; migrations use a separate user. Each function has its own AWS permissions role,
with the minimum necessary.

**9. Logs.** The API logs are structured and carry a request identifier, internal identifiers (of the
project, of the dashboard person and of the connection), event names and, for connections, which app
connected; **they do not carry email, IP, token, key or visitors' data**. They are kept for 14 days
and then disappear.

**10. Monitoring.** Email alarms for: many sign-in attempts with a wrong code, many refused code
requests, unexpected API errors, failures and throttling of the API function, and database size.

**11. Development.** Public code with automated security review (CodeQL), secret scanning with push
blocking, dependency alerts and updates, dependency auditing and automated tests with full coverage
on every change. Deployment to production is done only by the person in charge, after the tests have
passed.

**12. Backups.** Neon's: point-in-time recovery history of up to 7 days and encrypted backups kept
for up to 30 days.

**13. Incident response.** In accordance with Clause 11, with a record of each incident kept for 5
years.

---

## Schedule III — Sub-processors

Status as of October 15, 2026.

**Sub-processors that process data of the visitors to your sites:**

| Provider | What it does in Pyxis | Where | Processing agreement | Retention of copies and logs |
|---|---|---|---|---|
| **Amazon Web Services (AWS)** | API that receives the events and answers queries; daily routines (13-month cleanup, monthly usage, icons, end of accounts) and weekly routines (digest); event export files (Amazon S3); technical logs; secrets storage; content delivery network (CloudFront) in front of the API | São Paulo region (sa-east-1). The content delivery network receives requests at points of presence worldwide, without storing them | AWS Customer Agreement and the AWS Data Processing Addendum. AWS undertakes not to move the data out of the chosen region, except as necessary to provide the service or comply with the law | API logs: 14 days. Export files: 7 days |
| **Neon** (Databricks, Inc., USA) | Database (Postgres) where the events and the project configuration are kept | Servers in the AWS São Paulo region (aws-sa-east-1); company in the USA | Neon/Databricks terms and the Databricks Data Processing Addendum | Point-in-time recovery history: up to 7 days. Backups: up to 30 days |
| **Vercel Inc.** (USA) | Hosts the dashboard (`app.pyxis-analytics.dev`): builds the pages that show your figures to whoever is signed in | Functions in the São Paulo region (gru1); company and main processing in the USA | Vercel Data Processing Addendum | Technical logs of requests to the dashboard: 1 day |

**Providers that do not receive visitors' data** (listed for transparency; the processing they carry
out is covered by the Pyxis Privacy Policy):

| Provider | What it does | Where |
|---|---|---|
| **Amazon SES** (Amazon Web Services) | Sends the service emails: sign-in and registration codes, invitations, welcome, usage and end-of-account notices, notice that an export is ready (with the dashboard link, not the file) and the weekly digest with aggregate figures | São Paulo region (sa-east-1) |
| **Stripe** (Stripe Brasil Soluções de Pagamento – Instituição de Pagamento Ltda. and Stripe, LLC, USA) | Subscription billing | Brazil and USA |
| **ImprovMX** (ImprovMX Incorporated, USA) | Forwards the emails sent to hello@pyxis-analytics.dev | Transient reception in France; company in the USA |
| **Google** (Google LLC, USA) | Mailbox where the support messages are kept (personal account, without a processor agreement: Google processes the messages as controller, in accordance with its own privacy policy) | USA and other countries |

**Apps that people with access connect** (not sub-processors; Schedule I, item 10):

| App | Who it is | What it receives | Where |
|---|---|---|---|
| **Claude** and **Claude Code** | Anthropic, PBC (USA) | The data the app requests, when a person with access has connected it and uses it | USA |

Do not send visitors' data in support messages. If you need to show a case, use the visit or user
identifier, never the person's name or email.

---

## Schedule IV — Template notice for your site

Suggested text for your site's privacy policy. Adjust it to what your site actually sends. It does
not replace your own analysis.

> **Site usage measurement**
>
> We use Pyxis to understand how the site is used: which pages are viewed, where visits come from
> and which features are used. The measurement **does not use cookies**, **does not store your IP
> address** and **does not store your full browser string**. We record the page viewed (without the
> address parameters, except campaign ones), the site you came from, the type of device, the browser
> and operating system family, the country and the state (never the city) and the actions we have
> marked on the site. Each visit receives a random number that stays only in the browser tab and is
> discarded when the tab is closed or after 30 minutes of inactivity; there is no identifier that
> recognizes you on another visit.
>
> *(If you turned on the city in the project, replace "the country and the state (never the city)"
> with "the country, the state and the approximate city, inferred from your IP address at the time
> of access, without storing the IP". If your site also uses the `identify` function, replace, in
> the next paragraph, "we link the events of that visit to your account's internal number" with "we
> link the events of that visit, including the approximate city, to your account's internal
> number". If this notice was already published without the city, highlight the change and the date
> on which it takes effect.)*
>
> *(Include the paragraph below only if your site uses the `identify` function.)* When you sign in
> to your account, we link the events of that visit to your account's internal number, never to your
> name or email. If you delete your account or ask us to, we delete those events.
>
> *(Optional: include it if your team connects artificial intelligence tools to Pyxis.)* We may
> query these figures with artificial intelligence tools we choose, such as Claude, by Anthropic,
> which receive only what we ask of them.
>
> The data is stored in Brazil and deleted after 13 months. Pyxis processes this data on our behalf,
> as processor. If your browser sends the Global Privacy Control or "Do Not Track" signal, nothing is
> sent. To exercise your rights under the LGPD, contact us through the channel indicated in this
> policy.
