# Privacybeleid van Pyxis

**Versie {{terms.version}}, van kracht vanaf {{terms.effectiveFrom}}.**

> Dit is een niet-bindende vertaling, alleen ter informatie. De bindende tekst is de Portugese versie
> ([Português](/privacidade)); als de twee verschillen, gaat de Portugese tekst voor.

Dit beleid legt uit welke persoonsgegevens Pyxis **als verwerkingsverantwoordelijke** verwerkt,
waarvoor, op welke rechtsgrond, met wie het die deelt, hoe lang het die bewaart en hoe je je rechten
uitoefent, overeenkomstig de Lei Geral de Proteção de Dados Pessoais (Braziliaanse algemene wet
bescherming persoonsgegevens; Lei nº 13.709/2018, de "LGPD").

Het geldt voor:

1. **klanten** die het gehoste Pyxis afnemen, vertegenwoordigd door de **accounteigenaar**, die de
   registratie doet en het account beheert;
2. **personen met toegang tot het dashboard** (`app.pyxis-analytics.dev`): de accounteigenaar en de
   personen die hij uitnodigt;
3. **wie ons schrijft** op hello@pyxis-analytics.dev;
4. **bezoekers van de homepage** `pyxis-analytics.dev`.

Het gaat **niet** over de bezoekers van de websites van onze klanten. Op die websites beslist de
eigenaar van de website over de meting (de verwerkingsverantwoordelijke); wij treden op als
verwerker, volgens de regels van de Verwerkersovereenkomst. Als je een website hebt bezocht die
Pyxis gebruikt, raadpleeg dan het privacybeleid van die website.

---

## 1. Wie de verwerkingsverantwoordelijke is en hoe je contact met ons opneemt

1.1. De verwerkingsverantwoordelijke is **{{seller.name}}**, natuurlijk persoon, ingeschreven onder
CPF-nummer (Cadastro de Pessoas Físicas; Braziliaans fiscaal nummer van een natuurlijk persoon)
**{{seller.taxId}}**, met adres te **{{seller.address}}**, die de dienst aanbiedt onder de naam
**Pyxis**.

1.2. Kanaal voor elk privacyonderwerp, ook de uitoefening van je rechten:
**hello@pyxis-analytics.dev**. De berichten worden door de verwerkingsverantwoordelijke zelf gelezen
en beantwoord.

1.3. Als kleine verwerkingsorganisatie (agente de tratamento de pequeno porte) wijzen we geen
encarregado (functionaris voor gegevensbescherming in de zin van de LGPD) aan; dit kanaal vervult de
rol die is voorzien in art. 41, § 2, I, van de LGPD (Resolução CD/ANPD nº 2/2022, art. 11, en
Resolução CD/ANPD nº 18/2024, art. 3, § 3 — besluiten van de raad van bestuur van de ANPD, de
Braziliaanse nationale gegevensbeschermingsautoriteit).

## 2. Welke gegevens we verwerken, waarvoor, op welke rechtsgrond en hoe lang

### 2.1. Personen met toegang tot het dashboard

| Gegeven | Waarvoor | Rechtsgrond (LGPD) | Hoe lang |
|---|---|---|---|
| E-mailadres, taal van de e-mails (die van het scherm waarop je bent ingelogd of je hebt geregistreerd), projecten waartoe je toegang hebt, of je de accounteigenaar of een genodigde bent, keuze over de wekelijkse samenvatting, registratiedatum | De inlogcode en de e-mails van de dienst sturen, je projecten tonen en de wekelijkse samenvatting in je taal sturen | Uitvoering van de overeenkomst, voor de accounteigenaar (art. 7, V); ons gerechtvaardigd belang en dat van de klant om toegang te geven aan de personen die de eigenaar heeft uitgenodigd (art. 7, IX) | Zolang je toegang hebt tot een project of eigenaar van een account bent. Wanneer de eigenaar je uit een project verwijdert, eindigt de toegang daartoe direct; als je tot geen enkel project meer toegang hebt, verwijderen we je registratie binnen 30 dagen. In elk geval wordt de registratie samen met het account verwijderd (punt 2.2) |
| Uitnodiging: je e-mailadres, de naam van het project en het e-mailadres van wie je heeft uitgenodigd, in de uitnodigingsmail | Je op de hoogte stellen van de toegang en van wie die heeft gegeven | Ons gerechtvaardigd belang en dat van de klant (art. 7, IX) | De uitnodiging zelf blijft niet in onze database (alleen de registratie uit de rij hierboven); het verzendlog blijft bij de e-mailprovider gedurende diens termijn (punt 3) |
| Inlog- en registratiecodes: e-mailadres, code alleen als hash bewaard, doel (inloggen of registratie), taal, pogingen, tijdstippen | Inloggen en registratie zonder wachtwoord mogelijk maken en herhaalde pogingen verhinderen | Uitvoering van de overeenkomst, precontractuele handelingen en gerechtvaardigd belang bij beveiliging (art. 7, V en IX) | 10 minuten geldig; na het verlopen verwijderd door de dagelijkse routine |
| Sessies: waarde alleen als hash bewaard, datum van begin en van laatste gebruik, apparaatcategorie en familie van de browser en van het besturingssysteem (zonder versie) | Je ingelogd houden en je sessies tonen zodat je ze kunt beëindigen | Uitvoering van de overeenkomst en gerechtvaardigd belang bij beveiliging (art. 7, V en IX) | Maximaal 7 dagen, of 24 uur zonder gebruik; na beëindiging verwijderd door de dagelijkse routine |
| Toegangstokens: naam die je hebt gegeven, waarde alleen als hash bewaard, data van aanmaak, laatste gebruik, geldigheid en intrekking | Programma's en agents je cijfers laten lezen | Uitvoering van de overeenkomst (art. 7, V) | Tot de verwijdering van je registratie (een verlopen of ingetrokken token werkt direct niet meer, maar het record blijft tot dan bestaan) |
| Gekoppelde apps (Claude-connector): de app (Claude of Claude Code), de data waarop je hebt gekoppeld, van het laatste gebruik (hoogstens elke 5 minuten en bij elke vernieuwing vastgelegd) en van de intrekking; inloggegevens van de koppeling alleen als hash bewaard | De app die je hebt gekoppeld je cijfers laten lezen en de koppelingen tonen zodat je ze kunt intrekken | Uitvoering van de overeenkomst, voor de accounteigenaar (art. 7, V); ons gerechtvaardigd belang en dat van de klant om deze functie te bieden aan de personen die de eigenaar heeft uitgenodigd (art. 7, IX) | Zolang de koppeling actief is. De dagelijkse routine verwijdert de ingetrokken of 90 dagen ongebruikte koppeling, de verlopen inloggegevens en de vernieuwingsgegevens die meer dan 30 dagen geleden zijn vervangen |
| Koppelingsverzoeken: de app, het adres waarheen het antwoord teruggaat, de technische gegevens die de app stuurt om het verzoek te beschermen, de tijdstippen, je beslissing (toestaan of annuleren), wie heeft beslist en de eenmalige code alleen als hash bewaard | Het verzoek tonen op de toestemmingspagina en het antwoord alleen leveren aan de app die erom heeft gevraagd | Uitvoering van de overeenkomst, voor de accounteigenaar, en gerechtvaardigd belang bij beveiliging en bij het bieden van de functie aan genodigden (art. 7, V en IX) | Het verzoek is 10 minuten geldig, en de code 5. De dagelijkse routine verwijdert het verzoek 1 dag na het verlopen; daarna blijft alleen de koppeling uit de rij hierboven over |
| Verzendlog van de wekelijkse samenvatting (project, persoon, week, verzenddatum) | Dezelfde samenvatting niet twee keer sturen | Uitvoering van de overeenkomst (art. 7, V) | Tot de verwijdering van het project of van je toegang |
| Technische logs van de API met je interne identificatie (bijvoorbeeld "ingelogd", "sessie beëindigd", "token aangemaakt", "app gekoppeld") | Beveiliging en onderzoek van storingen en incidenten | Gerechtvaardigd belang bij beveiliging (art. 7, IX) | 14 dagen |

**IP-adres:** wanneer je een code aanvraagt of inlogt op het dashboard, wordt het IP-adres alleen in
het geheugen van de server gebruikt om pogingen te beperken (tot 5 per 15 minuten) en verdwijnt het
binnen hoogstens 15 minuten. **Het wordt niet vastgelegd** in onze database of in onze logs. Vercel,
dat het dashboard host, ontvangt het IP-adres en de browser van wie het bezoekt en bewaart die 1 dag
in zijn technische logs (punt 3).

### 2.2. Klanten (accounteigenaren)

| Gegeven | Waarvoor | Rechtsgrond (LGPD) | Hoe lang |
|---|---|---|---|
| Account: eigenaar, abonnement (gratis of betaald), status van het afgesloten abonnement, periodiciteit, identificaties van de klant en van het abonnement bij Stripe (alleen bij het betaalde abonnement), data (einde van de proefperiode, van de periode, van de toegang, van de verzonden waarschuwingen), maandelijks eventgebruik en verzonden waarschuwingen over het quotum en over een account zonder events | De dienst verlenen, de limieten van het abonnement toepassen, de toegang aan- en uitzetten volgens het gratis of betaalde abonnement en de afsluiting daarvan, het account op het gratis abonnement zonder events waarschuwen en verwijderen, het einde van het account aankondigen | Uitvoering van de overeenkomst (art. 7, V) | Tot de verwijdering van het account: 30 dagen na het einde van de toegang of, bij een account op het gratis abonnement zonder events, 7 dagen na de kennisgeving (Gebruiksvoorwaarden, Artikel 7.6) |
| Aanvaarding van de voorwaarden: aanvaarde versie, datum en tijdstip, account en persoon die heeft aanvaard (zonder IP-adres) | Weten welke versie voor jou geldt en de aanvaarding bewijzen | Uitvoering van de overeenkomst en regelmatige uitoefening van rechten (art. 7, V en VI) | Tot de verwijdering van het account. Wanneer je het betaalde abonnement afsluit, bewaart Stripe, als verwerkingsverantwoordelijke, het record van de aanvaarding op zijn betaalpagina |
| Factureringsgegevens, alleen van wie het betaalde abonnement afsluit, ontvangen via Stripe: naam, e-mailadres, factuuradres, CPF of CNPJ (indien opgegeven; CNPJ: Braziliaans fiscaal nummer van een rechtspersoon), merk, laatste cijfers en vervaldatum van de kaart, betalingsgeschiedenis, terugbetalingen en betwistingen | Het abonnement factureren, betalingsbewijzen sturen, herroeping, terugbetalingen en betwistingen afhandelen, fiscale verplichtingen nakomen | Uitvoering van de overeenkomst (art. 7, V) en nakoming van een wettelijke verplichting (art. 7, II) | Tijdens de overeenkomst en gedurende 5 jaar gerekend vanaf het jaar na dat van elke afschrijving (fiscale bewaartermijn) |
| Configuratie van de projecten: naam, adressen van de websites, tijdzone, conversie-event, publieke sleutel, geheime sleutel alleen als hash bewaard, icoon gekopieerd van de website zelf | De dienst verlenen | Uitvoering van de overeenkomst (art. 7, V) | Tot de verwijdering van het project door de eigenaar of van het account (rij "Account" hierboven) |
| Exportverzoeken: wie het heeft gevraagd, wanneer, status en aantal events | Het exportbestand aanmaken en aan de accounteigenaar leveren | Uitvoering van de overeenkomst (art. 7, V) | Tot de verwijdering van het project. Het bestand zelf wordt 7 dagen nadat het klaar is verwijderd |

**Bij het gratis abonnement vragen we geen kaart en geen factureringsgegevens.** Bij het betaalde
abonnement **ontvangen en bewaren we het kaartnummer niet**: dat blijft bij Stripe. We bewaren alleen
de kaartvingerafdruk uit punt 2.7.

### 2.3. Wie ons schrijft

| Gegeven | Waarvoor | Rechtsgrond (LGPD) | Hoe lang |
|---|---|---|---|
| E-mailadres, naam, inhoud van het bericht en bijlagen | Antwoorden op verzoeken om toegang, vragen, support, klachten en verzoeken van betrokkenen | Precontractuele handelingen en uitvoering van de overeenkomst (art. 7, V); regelmatige uitoefening van rechten (art. 7, VI); gerechtvaardigd belang bij het antwoorden aan wie contact met ons opneemt (art. 7, IX) | Als er een overeenkomst is: tot 5 jaar na het einde daarvan (termijn om schadevergoeding te vorderen, Código de Defesa do Consumidor (Braziliaanse consumentenbeschermingswet), art. 27). Als die er niet is: 1 jaar na het laatste bericht |

### 2.4. Bezoekers van de homepage (`pyxis-analytics.dev`)

De homepage van Pyxis wordt door Pyxis zelf gemeten, met dezelfde regels die we aan klanten bieden.

| Gegeven | Waarvoor | Rechtsgrond (LGPD) | Hoe lang |
|---|---|---|---|
| Bekeken pagina (pad, zonder parameters behalve die van campagnes), acties op de pagina (bijvoorbeeld de demo openen), herkomstwebsite (alleen het domein), campagneparameters, apparaatcategorie, familie van de browser en van het besturingssysteem, land en staat (nooit de stad), willekeurig nummer van het bezoek | Begrijpen hoe de pagina wordt gebruikt en de presentatie van Pyxis verbeteren | Gerechtvaardigd belang (art. 7, IX, en art. 10) | 13 maanden |

De meting **gebruikt geen cookies**, **bewaart geen IP-adres** en ook niet de volledige browser, en
**verzendt niets** als je browser vraagt niet gevolgd te worden (Global Privacy Control of Do Not
Track). Op de pagina zelf toont het paneel "Wat deze pagina vastlegde" elk verzonden event en
kun je daar de meting in deze browser uitschakelen. Vercel, dat de pagina host, bewaart het
IP-adres en de browser van wie de pagina bezoekt 1 dag in zijn technische logs.

### 2.5. Cookies en opslag in de browser

| Waar | Naam | Type | Waarvoor | Duur |
|---|---|---|---|---|
| Dashboard (`app.`) | `__Host-pyxis_session` | Noodzakelijke cookie, `HttpOnly` en `Secure` | Je ingelogd houden | 7 dagen, of tot je uitlogt |
| Dashboard en demo (`app.` en `demo.`) | `pyxis_locale` | Voorkeurscookie | De gekozen taal onthouden | 1 jaar |
| Dashboard en demo | `pyxis_theme` | Voorkeurscookie | Het lichte of donkere thema onthouden, wanneer gekozen | 1 jaar |
| Dashboard | `pyxis:pending-sign-in` | `sessionStorage` (alleen in het tabblad) | Het ingetypte e-mailadres onthouden terwijl je op de code wacht, ook als je de pagina herlaadt | 10 minuten, of tot je het tabblad sluit |
| Homepage | `pyxis:session` | `sessionStorage` (alleen in het tabblad) | Willekeurig nummer van het bezoek | Tot je het tabblad sluit of 30 minuten zonder activiteit |
| Homepage | `pyxis:opt-out` | `localStorage` | Onthouden dat je de meting hebt uitgeschakeld | Tot je die weer inschakelt of de browsergegevens wist |
| Homepage en inlogscherm van het dashboard | `pyxis:theme` | `localStorage` | Het op dit apparaat gekozen thema onthouden | Tot je het wijzigt of de browsergegevens wist |

De homepage plaatst geen cookies. We gebruiken geen cookies van derden, van reclame of van sociale
netwerken, en het dashboard meet het gebruik niet van de personen die erop inloggen.

### 2.6. E-mails die we sturen

We sturen alleen e-mails die met de dienst te maken hebben: inlog- en registratiecodes; uitnodiging
voor een project; welkom, met de aanvaarde versie van de voorwaarden; waarschuwingen bij 80% en 100%
gebruik en van de pauze bij 150%, bij het betaalde abonnement, en bij 80% en van de pauze bij 100%,
bij het gratis abonnement; waarschuwing over een account op het gratis abonnement zonder events;
kennisgeving van het einde van de toegang, herinnering 7 dagen vóór de verwijdering en kennisgeving
van de uitgevoerde verwijdering; melding dat een export klaar is; de wekelijkse samenvatting (die
elke persoon kan uitschakelen in Instellingen); en mededelingen over de overeenkomst, ook
waarschuwingen over misbruik en opschorting. De factureringsmails worden door Stripe zelf verstuurd:
herinnering 7 dagen vóór het einde van de gratis proefperiode (bij proefperiodes die vóór versie 1.3
van de Gebruiksvoorwaarden zijn begonnen), betalingsbewijzen van betalingen en terugbetalingen, melding van een geweigerde betaling, verzoek om
bevestiging van de betaling (3D Secure) en waarschuwing dat de kaart bijna verloopt. **Onze e-mails
volgen niet of ze worden geopend of aangeklikt.** We sturen geen reclame.

### 2.7. Voorkoming van herhaalde gratis proefperiodes

**Sinds versie 1.3 van de Gebruiksvoorwaarden is er geen gratis proefperiode meer**
(Gebruiksvoorwaarden, Artikel 8.3), en registreren we geen nieuwe kaartvingerafdrukken. Dit punt
gaat over de records van de eerder begonnen proefperiodes, die de termijn in de tabel hieronder
volgen en uiterlijk 12 maanden na het begin van de laatste van die proefperiodes verdwijnen.

De gratis proefperiode gold één keer per klant (Gebruiksvoorwaarden, Artikel 8.3). Om op te merken
wanneer dezelfde kaart een tweede proefperiode in een ander account begint, lezen we, wanneer we een
abonnement met gratis proefperiode registreren (in de praktijk: wanneer de proefperiode begint), bij
Stripe de **kaartvingerafdruk** (*fingerprint*) van het abonnement: een code die Stripe berekent op
basis van het kaartnummer en die steeds terugkomt wanneer hetzelfde kaartnummer in ons
Stripe-account wordt gebruikt. **De vingerafdruk is niet het kaartnummer en kan niet worden gebruikt
om te betalen. We ontvangen en bewaren het kaartnummer niet.**

| Gegeven | Waarvoor | Rechtsgrond (LGPD) | Hoe lang |
|---|---|---|---|
| Kaartvingerafdruk, interne identificatie van het account en datum waarop we de kaart bij de proefperiode hebben geregistreerd (in de praktijk: het begin van de proefperiode) | Opmerken dat dezelfde kaart een tweede gratis proefperiode in een ander account begint | Gerechtvaardigd belang bij het voorkomen van misbruik van de gratis proefperiode (art. 7, IX, en art. 10) | **12 maanden gerekend vanaf die datum, ook na de verwijdering van het account**; aan het einde van de termijn verwijdert de dagelijkse routine het record |

1. **Wat er bij een match gebeurt.** Als dezelfde vingerafdruk in de voorafgaande 12 maanden
   al een proefperiode in een ander account is begonnen, legt de dienst het feit vast in de technische
   logs, alleen met de interne identificaties van de accounts en nooit met de vingerafdruk (die logs
   verdwijnen na 14 dagen), en waarschuwt een alarm ons per e-mail.
   **Er gebeurt niets automatisch**: geen afschrijving en geen opzegging. De
   verwerkingsverantwoordelijke onderzoekt het geval, kan de accounteigenaar om uitleg vragen en
   beslist volgens de regels van Artikel 18.11 van de Gebruiksvoorwaarden, die kennisgeving, opgave
   van reden en het recht op bezwaar waarborgen. Het is dus geen beslissing die uitsluitend op
   geautomatiseerde wijze wordt genomen (art. 20).
2. **Waarom we het na de verwijdering van het account bewaren.** Het doel is juist een nieuw account
   te herkennen dat wordt geopend nadat het oude is beëindigd. We bewaren alleen het minimum daarvoor
   (zonder naam, e-mailadres of kaartnummer) en gedurende de termijn die dat gebruik dekt (art. 10,
   § 1).
3. **Grenzen.** Een kaart die via een digitale wallet (zoals Apple Pay of Google Pay) wordt gebruikt,
   kan een andere vingerafdruk hebben dan de fysieke kaart, en dezelfde kaart kan rechtmatig door
   verschillende personen van een onderneming worden gebruikt. Proefperiodes van meer dan 12 maanden
   geleden zijn al verwijderd en tellen niet mee in de vergelijking. Een match is een
   aanwijzing, op zichzelf nooit een bewijs.
4. **Je rechten.** Je kunt om bevestiging van en inzage in dit record vragen en er bezwaar tegen
   maken (punt 6), en we beoordelen het bezwaar met inachtneming van de reden die je opgeeft.

### 2.8. Controle op misbruik

Wanneer we een vermoeden van misbruik controleren (Gebruiksvoorwaarden, Artikelen 12 en 18),
gebruiken we alleen wat de dienst al bewaart: de beveiligingswaarschuwingen, de technische logs van
de API (die aangeven wanneer een event of een eigenschap is geweigerd en op grond van welke regel,
zonder de geweigerde waarde, en die na 14 dagen verdwijnen), de gegevens van het account en van de
facturering, het record van punt 2.7, de events van het project (alleen geraadpleegd voor zover
nodig, zoals de Verwerkersovereenkomst bepaalt) en wat ons wordt gemeld. **We bewaren daarvoor geen
IP-adres of volledige browser, omdat de dienst die niet bewaart.**

| Gegeven | Waarvoor | Rechtsgrond (LGPD) | Hoe lang |
|---|---|---|---|
| Record van de controle: wat is gezien, de verzonden waarschuwingen, je antwoord, de genomen maatregel en de reden | De maatregelen van Artikel 18 van de Voorwaarden eerlijk toepassen en ze kunnen aantonen | Gerechtvaardigd belang (art. 7, IX) en regelmatige uitoefening van rechten (art. 7, VI) | In de mailbox, gedurende de termijnen van punt 2.3 (tot 5 jaar na het einde van de overeenkomst) |

We bewaren andere gegevens alleen langer dan de termijnen van dit beleid als een wet, een
rechterlijk bevel of een vordering van een bevoegde autoriteit dat voorschrijft, of als ze nodig
zijn voor een gerechtelijke, bestuursrechtelijke of arbitrale procedure, en dan alleen de betrokken
gegevens, zo lang als vereist (art. 7, VI, en art. 16, I).

## 3. Met wie we gegevens delen

3.1. **We verkopen geen persoonsgegevens** en delen ze niet voor reclame.

3.2. We gebruiken de onderstaande providers, die gegevens voor onze rekening verwerken (verwerkers)
of, waar aangegeven, voor eigen rekening:

| Provider | Wat hij doet | Welke gegevens hij ontvangt | Waar |
|---|---|---|---|
| **Vercel Inc.** (VS) | Host het dashboard en de homepage | Alles wat je in het dashboard ziet en verzendt; IP-adres en browser van wie het bezoekt (logs gedurende 1 dag) | Functies in São Paulo; hoofdverwerking in de VS |
| **Amazon Web Services (AWS)** | API, automatische routines, technische logs (14 dagen), opslag van geheimen, exportbestanden (7 dagen) | Gegevens van de punten 2.1, 2.2 en 2.7, die er alleen doorheen gaan; technische logs zonder e-mailadres of IP-adres | São Paulo (sa-east-1); wereldwijd distributienetwerk vóór de API, zonder verzoeken op te slaan |
| **Neon** (Databricks, Inc., VS) | Database | De gegevens van de punten 2.1, 2.2 (account, aanvaarding, configuratie, gebruik en exports), 2.4 en 2.7 | Servers in São Paulo; onderneming in de VS; back-ups tot 30 dagen |
| **Amazon SES** (AWS) | Verstuurt de e-mails van de dienst (punt 2.6), zonder het volgen van openen of klikken | E-mailadres van de ontvanger en inhoud van de e-mail. Adressen die de e-mail terugsturen of als spam markeren, komen op de onderdrukkingslijst van ons AWS-account, zodat ze geen e-mails meer ontvangen, totdat ze worden verwijderd | São Paulo (sa-east-1) |
| **Stripe** (Stripe Brasil Soluções de Pagamento – Instituição de Pagamento Ltda. en Stripe, LLC, VS) | Facturering, betaalpagina, facturatieportaal en factureringsmails | Facturerings- en kaartgegevens (punt 2.2); Stripe berekent de kaartvingerafdruk (punt 2.7) | Brazilië en VS. Stripe verwerkt gegevens ook **als verwerkingsverantwoordelijke**, voor fraudepreventie en de nakoming van zijn eigen wettelijke verplichtingen, volgens het privacybeleid van Stripe |
| **ImprovMX** (ImprovMX Incorporated, VS) | Stuurt de e-mails die naar hello@pyxis-analytics.dev worden gestuurd door | Bericht tijdens transport; log van afzender en onderwerp gedurende 7 dagen | Tijdelijke ontvangst in Frankrijk; onderneming in de VS |
| **Google** (Google LLC, VS) | Mailbox waarin de naar hello@pyxis-analytics.dev gestuurde berichten worden bewaard | Ontvangen en verzonden berichten | VS en andere landen. Het is een persoonlijk account, zonder verwerkersovereenkomst: Google verwerkt de berichten **als verwerkingsverantwoordelijke**, volgens het privacybeleid van Google |

3.3. **Autoriteiten.** We verstrekken alleen gegevens aan autoriteiten wanneer er een rechterlijk
bevel is of een vordering van wie daartoe wettelijk bevoegd is, en alleen wat wordt vereist.

3.4. **Klanten en personen met toegang.** De personen met toegang tot een project, ook de
accounteigenaar, zien in Instellingen de lijst met e-mailadressen van wie toegang heeft tot dat
project. Sessies, tokens, gekoppelde apps en de keuze over de wekelijkse samenvatting zijn
individueel: niemand ziet die van een ander. De personen met toegang
kunnen de status van het account en het gebruik van de maand zien (bijvoorbeeld om een pauze wegens
het quotum te begrijpen); alleen de accounteigenaar opent het facturatieportaal van Stripe.

3.5. **Opvolging.** Als de dienst gaat worden verleend door een onderneming die de
verwerkingsverantwoordelijke heeft opgericht of door wie de dienst overneemt, gaan de gegevens naar
die onderneming over, met dezelfde regels als in dit beleid, en laten we het je van tevoren weten.

3.6. **Apps die je koppelt.** Als je Claude of Claude Code aan Pyxis koppelt (Gebruiksvoorwaarden,
Artikel 13.10), of een toegangstoken in een programma gebruikt, verlaten de gegevens die de app
opvraagt Pyxis en gaan ze op jouw verzoek naar die app. Via de Claude-connector gaan ze naar
**Anthropic** (Anthropic, PBC, VS): de cijfers van de projecten die je kunt openen en, omdat de app
leest wie er is gekoppeld, **je inlog-e-mailadres**. Anthropic **is niet onze verwerker**: Anthropic
verwerkt die gegevens volgens de voorwaarden en het privacybeleid die gelden tussen Anthropic en
jou. De toestemmingspagina meldt, vóór **Toestaan**, dat die gegevens naar Anthropic in de Verenigde
Staten gaan (punt 4.4). Om Claude en
Claude Code te herkennen, leest Pyxis het openbare document dat Anthropic over elk ervan publiceert;
bij die raadpleging gaan geen gegevens van jou mee. Je ziet en trekt je koppelingen in via
Instellingen → Gekoppelde apps.

## 4. Internationale doorgifte

4.1. Onze databases staan in São Paulo, maar verschillende providers uit punt 3 zijn ondernemingen
uit de Verenigde Staten en verwerken of bewaren een deel van de gegevens daar: Vercel (dashboard en
homepage), Stripe (facturering), ImprovMX (doorsturen van e-mail, met tijdelijke ontvangst in
Frankrijk) en Google (mailbox). De e-mails die de dienst verstuurt, gaan via AWS in São Paulo. Neon
(Databricks) bewaart de gegevens in São Paulo, maar is een
onderneming uit de VS waarvan de teams er vandaar toegang toe kunnen hebben. Als je Claude of Claude
Code koppelt (punt 3.6), gaan de gegevens die de app opvraagt ook naar de Verenigde Staten, naar
Anthropic, door jouw keuze.

4.2. **Vorm, doel en duur:** de gegevens gaan naar die providers zodat zij de in punt 3 beschreven
dienst kunnen verlenen, gedurende de termijnen van punt 2, of gedurende de in punt 3 vermelde
termijnen van de logs van elke provider.

4.3. **Landen van bestemming:** Verenigde Staten; Frankrijk (alleen de tijdelijke ontvangst door
ImprovMX); en andere landen waar Google activiteiten heeft.

4.4. **Grondslag:** de doorgifte aan Anthropic wanneer je Claude of Claude Code koppelt (punt 3.6)
berust op je **specifieke en uitdrukkelijk gemarkeerde toestemming** (art. 33, VIII): de
toestemmingspagina meldt, vóór **Toestaan**, dat de gegevens die de app opvraagt, ook je
e-mailadres, naar Anthropic in de Verenigde Staten gaan, en de koppeling bestaat alleen als je die
toestaat; je trekt de toestemming op elk moment in door de koppeling in te trekken in Instellingen →
Gekoppelde apps. Wanneer de doorgifte nodig is om de overeenkomst met jou uit te voeren (facturering,
inloggen op het dashboard en antwoorden op je berichten), berust die op art. 33, IX, in samenhang
met art. 7, V, van de LGPD. Frankrijk maakt deel uit van de Europese Unie, die door de ANPD is
erkend als een gebied met een passend beschermingsniveau (Resolução CD/ANPD nº 32/2026). In de
overige gevallen verbinden de providers zich er in hun gegevensverwerkingsovereenkomsten toe de
gegevens te beschermen en ze alleen te verwerken om de dienst te verlenen; die overeenkomsten
**bevatten nog niet de door de ANPD goedgekeurde modelcontractbepalingen** (Resolução CD/ANPD
nº 19/2024). We volgen de invoering daarvan door de providers en zullen van provider of van
mechanisme wisselen wanneer dat nodig is.

4.5. **Verantwoordelijkheden en beveiliging:** elke provider is verantwoordelijk voor de beveiliging
in zijn eigen omgeving; wij zijn tegenover jou verantwoordelijk voor de verwerking als geheel. De
maatregelen die we nemen, staan in punt 5.

4.6. Je kunt de volledige contractbepalingen van elke provider opvragen, waarop we binnen 15 dagen
antwoorden, en je rechten uitoefenen via het kanaal van punt 1, ook het recht om tegen ons een
verzoekschrift in te dienen bij de ANPD.

## 5. Beveiliging

5.1. Tot de maatregelen die we nemen, behoren:

1. versleutelde verbindingen (HTTPS met TLS 1.2 of hoger) over het hele traject, ook tot aan de
   database, met certificaatverificatie;
2. gegevens in de database in rust versleuteld door de provider;
3. inloggen zonder wachtwoord, met een eenmalige code die 10 minuten geldig is, met een limiet op het
   aantal pogingen;
4. codes, sessies, geheime sleutels, tokens en inloggegevens van gekoppelde apps alleen als hash
   bewaard;
5. sessies met een maximale duur en beëindiging na 24 uur zonder gebruik; je ziet en beëindigt je
   sessies in Instellingen;
6. technische logs zonder e-mailadres, IP-adres, token of sleutel, bewaard gedurende 14 dagen;
7. alarmen bij verdachte inlogpogingen en fouten van de dienst;
8. open source code, met automatische controle op beveiliging en afhankelijkheden.

5.2. Geen enkel systeem is volmaakt veilig. Als zich een beveiligingsincident voordoet dat voor jou
een relevant risico of relevante schade kan meebrengen, melden we dat aan jou en aan de ANPD binnen
de termijnen van de regelgeving (Resolução CD/ANPD nº 15/2024).

## 6. Je rechten

6.1. Je kunt op elk moment vragen om (LGPD, art. 18):

1. bevestiging dat we gegevens van jou verwerken;
2. inzage in die gegevens;
3. rectificatie van onvolledige, onjuiste of verouderde gegevens (bijvoorbeeld het wijzigen van het
   inlog-e-mailadres);
4. anonimisering, blokkering of verwijdering van onnodige of buitensporige gegevens, of van gegevens
   die in strijd met de LGPD worden verwerkt;
5. overdraagbaarheid, volgens de regelgeving van de ANPD; zolang die er niet is, leveren we je
   gegevens in een bestand in een open formaat (JSON);
6. informatie over met wie we je gegevens delen (punt 3);
7. herziening van beslissingen die uitsluitend op geautomatiseerde wijze zijn genomen (punt 7);
8. bezwaar tegen een verwerking op grond van gerechtvaardigd belang, als je van mening bent dat die
   in strijd is met de LGPD;
9. verwijdering van de gegevens, in de door de wet voorziene gevallen. Sommige gegevens moeten
   desondanks worden bewaard, wegens een wettelijke verplichting (bijvoorbeeld de
   factureringsgegevens) of voor verweer in een procedure (LGPD, art. 16).

6.2. **Hoe je een verzoek doet:** schrijf naar hello@pyxis-analytics.dev, bij voorkeur vanaf het
geregistreerde e-mailadres. Als niet kan worden bevestigd dat het verzoek van jou komt, vragen we
een eenvoudige bevestiging voordat we het afhandelen.

6.3. **Termijn:** we bevestigen de ontvangst en antwoorden **binnen 15 dagen**.

6.4. **Personen met toegang tot een project:** de toegang tot het dashboard bestaat omdat de
eigenaar van een account je heeft uitgenodigd. Als je om verwijdering van je e-mailadres vraagt,
eindigt je toegang; we laten het de accounteigenaar weten. Als je de accounteigenaar bent, vereist
de verwijdering van je registratie dat het account wordt opgeheven (Gebruiksvoorwaarden,
Artikel 11.6), en blijven de factureringsgegevens gedurende de wettelijke termijn bewaard
(punt 2.2).

6.5. **Bezoekers van de homepage:** omdat we geen IP-adres, cookie of blijvende identificatie
bewaren, kunnen we je anonieme bezoeken niet terugvinden. Je kunt de meting op de pagina zelf
uitschakelen of het signaal Global Privacy Control in je browser inschakelen.

6.6. Je kunt ook een verzoekschrift indienen bij de **Agência Nacional de Proteção de Dados
(ANPD)**, op `gov.br/anpd`, en bij de consumentenbeschermingsinstanties.

## 7. Geautomatiseerde besluiten

We nemen geen besluiten over jou die uitsluitend op geautomatiseerde verwerking zijn gebaseerd en
je belangen raken, en we stellen geen profielen van je op. De automatische gevolgen van de dienst
zijn regels die voor iedereen gelijk zijn en die jou als persoon niet beoordelen:

1. op het gebied van beveiliging: na te veel pogingen wordt een verzoek om een code of om in te
   loggen enkele minuten geweigerd;
2. op het gebied van de overeenkomst: de ontvangst van events pauzeert wanneer het account 150% van
   de maandlimiet bereikt bij het betaalde abonnement, of 100% bij het gratis abonnement; de toegang
   volgt het gratis of betaalde abonnement en de status van het abonnement bij Stripe; en het account op het
   gratis abonnement zonder events wordt na de kennisgeving verwijderd (Gebruiksvoorwaarden,
   Artikelen 7.2, 7.6 en 9).

Over een overeenkomende kaartvingerafdruk (punt 2.7) en de maatregelen wegens misbruik
(Gebruiksvoorwaarden, Artikel 18) beslist altijd een mens. Als iets hiervan je hindert, neem dan
contact met ons op.

## 8. Kinderen en adolescenten

De dienst wordt afgenomen door personen van 18 jaar en ouder, en de homepage is niet gericht op
kinderen of adolescenten. Als we te weten komen dat we gegevens van een kind zonder rechtsgrond
verwerken, verwijderen we die.

## 9. Wijzigingen van dit beleid

9.1. We publiceren elke nieuwe versie met de datum van inwerkingtreding. Als een wijziging van
invloed is op de manier waarop we je gegevens verwerken, laten we het de klanten en de personen met
toegang ten minste 30 dagen van tevoren per e-mail weten, behalve bij een door de wet vereiste
wijziging, die eerder kan ingaan.

9.2. Eerdere versies zijn op verzoek beschikbaar.

## 10. Contact

**{{seller.name}}**, verwerkingsverantwoordelijke. **hello@pyxis-analytics.dev**. **{{seller.address}}**.
