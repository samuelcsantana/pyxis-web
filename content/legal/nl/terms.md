# Gebruiksvoorwaarden van Pyxis

**Versie {{terms.version}}, van kracht vanaf {{terms.effectiveFrom}}.**

> Dit is een niet-bindende vertaling, alleen ter informatie. De bindende tekst is de Portugese versie
> ([Português](/termos)); als de twee verschillen, gaat de Portugese tekst voor.

Deze voorwaarden vormen de overeenkomst tussen jou en ons voor het gebruik van **het gehoste Pyxis**:
de dienst voor analyse van het gebruik van websites die wij exploiteren op `pyxis-analytics.dev`,
`app.pyxis-analytics.dev` en `api.pyxis-analytics.dev`. Lees ze aandachtig, vooral de passages die
met **Let op** zijn gemarkeerd, omdat die rechten beperken.

## Samenvatting van de overeenkomst

Deze samenvatting vervangt de volledige tekst niet, maar laat zien wat het belangrijkst is voordat
je de overeenkomst sluit.

1. **Wie de dienst aanbiedt:** {{seller.name}}, natuurlijk persoon, CPF {{seller.taxId}} (Artikel 1).
2. **Prijs:** R$ 39,00 per maand of R$ 390,00 per jaar, met creditcard, via Stripe, met
   **automatische verlenging** totdat je opzegt (Artikel 8).
3. **Gratis proefperiode:** 14 dagen, één keer per klant. De kaart wordt bij het begin gevraagd, en
   Stripe stuurt 7 dagen voor het einde een herinnering. **Als je niet opzegt vóór het einde van de
   proefperiode, vindt de eerste afschrijving plaats op de 15e dag** (Artikelen 6.4 en 8.3).
4. **Limieten van het abonnement:** tot 100.000 events per maand, tot 3 websites, tot 3 personen in
   het dashboard (jijzelf meegerekend) en 13 maanden historie. We waarschuwen je wanneer het account
   80% en 100% van de events van de maand bereikt. **Let op: bij 150% wordt de ontvangst van events
   gepauzeerd tot de 1e van de volgende maand**, en de events die tijdens de pauze worden verzonden,
   gaan verloren. Er wordt niets in rekening gebracht boven de prijs (Artikel 7).
5. **Herroeping:** volledige terugbetaling als je binnen 7 dagen na de eerste afschrijving afziet van
   de overeenkomst. Hef je binnen die termijn je account in het dashboard op, dan gebeurt de
   terugboeking automatisch (Artikel 10).
6. **Opzegging:** op elk moment, op twee manieren. Via het Stripe-portaal loopt de toegang door tot
   het einde van de betaalde periode. Hef je het account in het dashboard op, dan **eindigt de
   toegang direct**. **Let op: na de 7 dagen van het herroepingsrecht is er geen evenredige
   terugbetaling van de al betaalde periode**, bij geen van beide manieren (Artikel 11).
7. **Verwijdering van de gegevens:** **30 dagen na het einde van de toegang worden het account, de
   projecten en alle events definitief verwijderd.** Tot dan kun je de events via het dashboard
   exporteren (Artikel 11).
8. **Beschikbaarheid:** **Let op: er is geen beschikbaarheidsgarantie (SLA)**; we doen ons best om
   de dienst online te houden (Artikel 15). Support per e-mail, met antwoord binnen 2 werkdagen
   (Artikel 16).
9. **Je belangrijkste verplichtingen:** **geen persoonsgegevens in de events verzenden** (naam,
   e-mailadres, CPF, telefoonnummer enz.), de bezoekers van je website over de meting informeren en
   geen misbruik van de dienst maken (Artikel 12).
10. **Let op: opschorting en beëindiging wegens misbruik.** Bij misbruik (bijvoorbeeld
    persoonsgegevens in de events, het meten van wie heeft gevraagd niet gemeten te worden, vervalst
    verkeer, een aanval, fraude of een herhaalde gratis proefperiode) kunnen we het getroffen deel
    van de dienst opschorten en, in ernstige of herhaalde gevallen, de overeenkomst beëindigen. In de
    regel waarschuwen we vooraf en geven we een termijn om het te herstellen; we vermelden altijd de
    reden en je kunt bezwaar maken (Artikel 18).
11. **Persoonsgegevens:** jij bent de verwerkingsverantwoordelijke voor de gegevens van de bezoekers
    van je website; wij zijn de verwerker (Artikel 14 en Verwerkersovereenkomst). Als een persoon met
    toegang Claude of Claude Code aan Pyxis koppelt, gaan de cijfers die die persoon opvraagt naar
    Anthropic, dat niet onze leverancier is (Artikel 13.10).

---

## Artikel 1 — Wie de dienst aanbiedt en hoe je contact met ons opneemt

1.1. Het gehoste Pyxis wordt aangeboden door **{{seller.name}}**, natuurlijk persoon, ingeschreven
onder CPF-nummer (Cadastro de Pessoas Físicas; Braziliaans fiscaal nummer van een natuurlijk
persoon) **{{seller.taxId}}**, met adres te **{{seller.address}}** ("wij"). **Pyxis** is de naam van
de dienst.

1.2. Contact voor elk onderwerp, ook opzegging, herroeping, support, bezwaar tegen een opschorting
en persoonsgegevens: **hello@pyxis-analytics.dev**.

1.3. "Jij" is de natuurlijke persoon of rechtspersoon die de dienst afneemt om een of meer websites
te meten.

## Artikel 2 — Begrippen in deze voorwaarden

2.1. **Dienst:** het door ons gehoste Pyxis: de API die de gegevens ontvangt en opvragingen beantwoordt
(`api.pyxis-analytics.dev`), het dashboard (`app.pyxis-analytics.dev`), de wekelijkse samenvatting
per e-mail en de toegang via tokens en via gekoppelde apps, ook via de MCP-server.

2.2. **Tracker:** het pakket `pyxis-analytics` (open source) dat je op je website installeert om
events naar de dienst te sturen.

2.3. **Project:** de configuratie van een van je websites in de dienst (naam, toegestane adressen,
tijdzone, conversie-event, sleutels en events).

2.4. **Event:** elk record dat door de tracker of door je integratie wordt verzonden, zoals een
bekeken pagina of een actie die je hebt gemarkeerd.

2.5. **Personen met toegang:** de accounteigenaar en de personen die hij uitnodigt om het dashboard
te gebruiken.

2.6. **Periode:** de betaalde maand of het betaalde jaar van je abonnement.

2.7. **Consument:** wie de dienst afneemt als eindafnemer, in de zin van art. 2 van het Código de
Defesa do Consumidor (Braziliaanse consumentenbeschermingswet; Lei nº 8.078/1990).

2.8. **Account:** de registratie van de afnemer, waartoe het abonnement, de projecten en de personen
met toegang behoren.

2.9. **Accounteigenaar:** de persoon die de registratie heeft gedaan (of die je hebt aangewezen
toen wij het account op je verzoek aanmaakten) en die namens jou projecten, sleutels, personen,
exports en facturering beheert.

2.10. **Einde van de toegang:** de datum waarop het account geen events meer ontvangt en de
projecten niet meer kan wijzigen: het einde van de betaalde periode of van de proefperiode na een
opzegging (Artikel 11.2), de opheffing van het account (Artikelen 11.6 en 18.7) of het einde van het
abonnement wegens niet-betaling (Artikel 9.2).

## Artikel 3 — Aanvaarding, wie de overeenkomst kan sluiten en contractdocumenten

3.1. Je aanvaardt deze voorwaarden op een van deze manieren:

1. **bij de registratie via het dashboard** (`app.pyxis-analytics.dev/sign-up`), door het
   aanvinkvakje voor aanvaarding van de Gebruiksvoorwaarden, de Verwerkersovereenkomst en het
   Privacybeleid aan te vinken, waarbij het versienummer wordt getoond. We bewaren de aanvaarde
   versie en de datum en het tijdstip van aanvaarding (zonder je IP-adres te bewaren). De
   betaalpagina van Stripe vraagt vóór het abonnement opnieuw om aanvaarding;
2. **wanneer wij het account op je verzoek aanmaken** (Artikel 6.2), door op onze e-mail te
   antwoorden met de bevestiging dat je de daarin vermelde versie aanvaardt, voordat wij de toegang
   vrijgeven.

Als je niet akkoord gaat, registreer je dan niet en sluit geen abonnement af.

3.2. Om de overeenkomst te sluiten, moet je 18 jaar of ouder en handelingsbekwaam zijn. Sluit je de
overeenkomst namens een onderneming, dan verklaar je daartoe bevoegd te zijn, en wordt de
onderneming "jij".

3.3. De dienst wordt aangeboden aan klanten in Brazilië, met een prijs in reais.

3.4. De overeenkomst bestaat uit deze voorwaarden en twee bijlagen:

1. **Bijlage 1 — Verwerkersovereenkomst**, die de gegevens van de bezoekers van je websites regelt;
2. **Bijlage 2 — Privacybeleid van Pyxis**, dat uitlegt welke gegevens wij over jou en over de
   personen met toegang verwerken.

Op het gebied van persoonsgegevens gaat Bijlage 1 voor op deze voorwaarden.

3.5. Na het sluiten van de overeenkomst bevat de welkomstmail de aanvaarde versie en het permanente
adres van die versie, waar je de volledige tekst kunt opslaan of afdrukken. Op verzoek sturen we de
tekst als bestand. Eerdere versies zijn op verzoek beschikbaar.

## Artikel 4 — Wat de dienst doet

4.1. De op je website geïnstalleerde tracker stuurt de bekeken pagina's en de events die je
markeert naar de dienst. De dienst bewaart die events en toont de analyse in het dashboard, alleen
aan de personen met toegang: overzicht, bezoeken, tijdlijn van elk bezoek, funnel, gebruikte
functies, fouten in aanroepen naar de API van je website, acquisitie, apparaten en tijdstippen.

4.2. Wat de dienst, door zijn ontwerp, **niet** doet:

1. hij plaatst geen cookies op je website;
2. hij bewaart het IP-adres van de bezoeker niet: het IP-adres wordt alleen in het geheugen van de
   server gebruikt, gedurende enkele minuten, om misbruik te beperken;
3. hij bewaart niet de volledige browseridentificatie (user agent), alleen de apparaatcategorie en de
   familie van de browser en van het besturingssysteem;
4. hij bewaart niet de stad, alleen het land en de staat;
5. hij bewaart niet het volledige adres van de pagina: alleen het pad in de vorm van een sjabloon,
   zonder parameters, behalve die van campagnes (`utm_source`, `utm_medium`, `utm_campaign`);
6. hij verzendt niets wanneer de browser van de bezoeker vraagt niet gevolgd te worden (Global
   Privacy Control of Do Not Track);
7. hij herkent de anonieme bezoeker niet bij een ander bezoek: elk bezoek heeft een willekeurig
   nummer dat verdwijnt bij het sluiten van het tabblad of na 30 minuten zonder activiteit.

4.3. **Let op:** de cijfers in het dashboard zijn een meting, geen exacte telling. Bezoeken van wie
de tracker blokkeert, van wie vraagt niet gevolgd te worden, van bots en van wie geen verbinding had,
verschijnen niet, en events die worden verzonden terwijl de dienst offline is of de ontvangst is
gepauzeerd (Artikelen 7.2, 15 en 18), gaan verloren (de tracker probeert het enkele seconden opnieuw
zolang de pagina open is, maar niet wanneer de ontvangst is gepauzeerd).

4.4. Ook onderdeel van het abonnement zijn:

1. de **wekelijkse samenvatting per e-mail**, elke maandag, die elke persoon met toegang kan
   uitschakelen in Instellingen;
2. **toegangstokens met alleen leesrechten**, aangemaakt in Instellingen, waarmee programma's en
   agents van kunstmatige intelligentie dezelfde cijfers als in het dashboard kunnen opvragen;
3. de **MCP-server**, op twee manieren: het opensourceprogramma `pyxis-mcp`, dat op je computer
   draait en een toegangstoken gebruikt; of het adres `https://api.pyxis-analytics.dev/mcp`, dat
   Claude en Claude Code als connector gebruiken nadat een persoon met toegang de koppeling heeft
   toegestaan (Artikel 13.10), en dat andere programma's met een toegangstoken gebruiken;
4. de API-routes om **de gegevens van een geïdentificeerde persoon te verwijderen of te kopiëren**,
   met de geheime sleutel van het project;
5. de **export van alle events van een project** als bestand, via het dashboard (Artikel 11.5).

## Artikel 5 — Open source en gehoste dienst

5.1. De code van Pyxis is open, onder de MIT-licentie, in de openbare repositories `pyxis-api`,
`pyxis-sdk`, `pyxis-web` en `pyxis-mcp`. Iedereen mag de code lezen, kopiëren, wijzigen en zelf
draaien, onder de voorwaarden van die licentie.

5.2. Deze voorwaarden gaan alleen over de **door ons gehoste dienst**. Niets hierin beperkt wat de
MIT-licentie toestaat. Als je Pyxis op je eigen infrastructuur draait, zijn deze voorwaarden niet
van toepassing op die installatie.

## Artikel 6 — Hoe het begint: registratie via het dashboard of account op verzoek aangemaakt

6.1. **Registratie via het dashboard.**

1. Op `app.pyxis-analytics.dev/sign-up` kies je het abonnement (maandelijks of jaarlijks), vul je je
   e-mailadres in, aanvaard je de voorwaarden (Artikel 3.1) en bevestig je het e-mailadres met een
   code van 6 cijfers die naar dat adres wordt gestuurd.
2. Vervolgens vul je je kaart in op de betaalpagina van Stripe, waarmee de gratis proefperiode
   begint (Artikel 8.3).
3. Zodra Stripe het abonnement heeft bevestigd, is het account klaar: je maakt je projecten aan in
   het dashboard (tot 3), met het adres van de website, de tijdzone en, als je wilt, het
   conversie-event, en je ontvangt de publieke sleutel en het installatiefragment. Wie de
   registratie heeft gedaan, is de accounteigenaar.

Als je de betaalpagina van Stripe niet afrondt, blijft het account onvolledig, zonder projecten, en
wordt het 7 dagen na de registratie verwijderd. Tot dan kun je het abonnement afronden door opnieuw
in te loggen op het dashboard.

6.2. **Account op verzoek aangemaakt.** We kunnen het account ook voor je aanmaken, op een verzoek
via hello@pyxis-analytics.dev, bijvoorbeeld wanneer het niet mogelijk is de registratie via het
dashboard af te ronden of bij een gratis account dat wij aanbieden. In dat geval spreken we per
e-mail het abonnement en de betaalwijze af, volgt de aanvaarding Artikel 3.1, punt 2, en geven we de
toegang vrij binnen 2 werkdagen na de aanvaarding en, als er kosten zijn, na het afsluiten van het
abonnement. Bij een gratis account wordt niets in rekening gebracht; de rest van deze voorwaarden
geldt onverkort, en we kunnen de kosteloosheid beëindigen met een kennisgeving van 30 dagen,
waarna je het abonnement kunt afsluiten of kunt vertrekken.

6.3. We kunnen een registratie of een verzoek om een account alleen om een objectieve reden
weigeren: (a) de website is niet verenigbaar met aanvaardbaar gebruik (Artikel 12); (b) het verwachte
volume ligt ver boven de limieten van het abonnement; (c) dezelfde persoon of onderneming heeft in de
voorafgaande 12 maanden een account gehad dat wegens ernstig misbruik is beëindigd (Artikel 18.7); of
(d) een herhaalde gratis proefperiode (Artikel 6.4). Als we weigeren nadat er een afschrijving heeft
plaatsgevonden, betalen we het volledige bedrag terug.

6.4. **De gratis proefperiode geldt één keer per klant:** één keer per account (een account dat al
een abonnement heeft gehad, krijgt geen nieuwe proefperiode bij een nieuw abonnement) en één keer per
persoon of onderneming, ook in een ander account, met een ander e-mailadres of een andere kaart. Om
een herhaalde proefperiode met dezelfde kaart op te merken, bewaren we gedurende 12 maanden de door
Stripe berekende "kaartvingerafdruk", nooit het kaartnummer, zoals uitgelegd in het
Privacybeleid (punt 2.7). Wat er bij een herhaalde proefperiode gebeurt, staat in Artikel 18.11.

## Artikel 7 — Abonnement en limieten

7.1. Het abonnement omvat:

| Onderdeel | Limiet |
|---|---|
| Ontvangen events per maand, opgeteld over alle projecten van het account | tot 100.000 |
| Websites (projecten) | tot 3 |
| Personen met toegang tot het dashboard | tot 3, de accounteigenaar meegerekend |
| Historie | 13 maanden (oudere events worden dagelijks verwijderd) |
| Wekelijkse samenvatting per e-mail | inbegrepen |
| Toegangstokens, MCP-server en Claude-connector | inbegrepen |
| Export van de events van een project | via het dashboard, tot 3 per project per dag |
| Support | per e-mail, antwoord binnen 2 werkdagen |

7.2. **Let op: gebruik boven de limiet.**

1. Het gebruik van de maand is de som van de events die zijn opgeslagen in alle projecten van het
   account met een datum in die maand. De maand is de kalendermaand gerekend in UTC (Coordinated
   Universal Time), die in de tijd van Brasília begint om 21.00 uur op de laatste dag van de vorige
   maand.
2. De dienst meet het gebruik één keer per dag, 's nachts. Het gemeten gebruik verschijnt in
   Account en facturatie, in het dashboard.
3. Wanneer de dagelijkse meting 80% en daarna 100% van de limiet vaststelt (80.000 en 100.000
   events), waarschuwen we de accounteigenaar per e-mail, één keer per niveau per maand. **Tot 150%
   wordt er niets geblokkeerd.**
4. **Wanneer de dagelijkse meting 150% van de limiet vaststelt (150.000 events), wordt de ontvangst
   van events van alle projecten van het account gepauzeerd tot de 1e van de volgende maand**, en
   waarschuwen we per e-mail. Tijdens de pauze weigert de dienst de events (antwoord
   `403 quota_exceeded`), die **niet worden opgeslagen en niet kunnen worden hersteld**. Het
   dashboard blijft de al opgeslagen gegevens tonen. De ontvangst wordt aan het begin van de
   volgende maand vanzelf hervat. Omdat de meting dagelijks is, kan het account iets boven 150%
   uitkomen voordat de pauze begint.
5. **We brengen niets in rekening boven de prijs van het abonnement** voor gebruik boven de limiet.
6. Als het account vaak boven de limiet uitkomt, kunnen we per e-mail een abonnement of een prijs
   voorstellen die bij het volume past. Aanvaarden is optioneel.

7.3. De dienst heeft technische limieten tegen misbruik, zoals het aantal batches van events per
minuut per adres en per project en de grootte van elke batch. Die limieten kunnen veranderen om de
dienst te beschermen, zonder de maandelijkse eventlimiet van je abonnement te verlagen.

7.4. De verwijdering van events ouder dan 13 maanden is automatisch en maakt deel uit van de dienst:
**we bewaren geen oudere historie**.

## Artikel 8 — Prijs, gratis proefperiode en facturering

8.1. **Prijs:** R$ 39,00 per maand of R$ 390,00 per jaar. Er zijn geen installatiekosten of andere
kosten.

8.2. **Betaalwijze:** creditcard, verwerkt door Stripe. **Wij zien en bewaren het nummer van je kaart
niet.** Op dit moment accepteren we geen Pix of boleto.

8.3. **Gratis proefperiode:** 14 dagen, te rekenen vanaf de bevestiging van het abonnement op de
betaalpagina van Stripe, één keer per klant (Artikel 6.4). De kaart is bij het begin verplicht, en
tijdens de proefperiode wordt niets in rekening gebracht. Stripe stuurt 7 dagen voor het einde van de
proefperiode een herinnering per e-mail, met de link om op te zeggen. **Als je niet opzegt vóór het
einde van de proefperiode (via het Stripe-portaal of door het account in het dashboard op te
heffen), vindt de eerste afschrijving plaats op de 15e dag** en daarna bij elke nieuwe periode; op
het afschrift van je kaart wordt die eerste afschrijving aangeduid als einde van de proefperiode.
Zeg je tijdens de proefperiode op, dan wordt niets in rekening gebracht. Een account dat al een
abonnement heeft gehad, krijgt geen nieuwe proefperiode bij een nieuw abonnement: de facturering
begint op de dag van het nieuwe abonnement.

8.4. **Automatische verlenging:** het abonnement wordt aan het einde van elke periode automatisch
verlengd, met afschrijving van dezelfde kaart, totdat je opzegt (Artikel 11). De datum van de
volgende afschrijving staat in Account en facturatie, in het dashboard, en Stripe stuurt per e-mail
het betalingsbewijs van elke afschrijving.

8.5. **Prijswijziging:** we kondigen die per e-mail aan **ten minste 30 dagen van tevoren**. De nieuwe
prijs geldt pas vanaf de eerste verlenging na afloop van die termijn; **de al betaalde periode
verandert niet van prijs**. Ga je niet akkoord, zeg dan vóór de verlenging op, zonder kosten.

8.6. **Factuur (nota fiscal):** het betalingsbewijs van elke afschrijving wordt door Stripe
verstuurd. Het uitreiken van een nota fiscal (Braziliaanse fiscale factuur) hangt af van onze
fiscale status; als je een nota fiscal nodig hebt, vraag het dan voordat je de overeenkomst sluit.

## Artikel 9 — Niet-betaling

9.1. Als de afschrijving van een verlenging mislukt, waarschuwt Stripe je per e-mail, met een link om
de kaart bij te werken, en probeert het tot 8 keer opnieuw in de 2 weken daarna; het dashboard toont
ook een melding (Account en facturatie → Facturatie beheren). Als de bank vraagt dat je de
betaling bevestigt (3D Secure), stuurt Stripe de bevestigingslink per e-mail. Stripe waarschuwt ook
per e-mail wanneer de geregistreerde kaart bijna verloopt. Gedurende die termijn blijft de dienst
werken.

9.2. Als de betaling na die pogingen niet is gedaan (tot 2 weken na de eerste mislukking), of als
de door de bank gevraagde bevestiging niet binnen 15 dagen is gegeven, beëindigt Stripe het
abonnement, en dat is het einde van de toegang: uiterlijk de volgende dag worden de sleutels van de
projecten ingetrokken en sturen de websites geen events meer; het dashboard blijft tot de
verwijdering alleen beschikbaar voor raadpleging en export.

9.3. De gegevens worden 30 dagen na het einde van de toegang verwijderd (Artikel 11.4). Tot dan kun
je terugkomen zoals bepaald in Artikel 11.5, punt 3, zonder gegevens te verliezen.

## Artikel 10 — Herroepingsrecht

10.1. Omdat de overeenkomst via internet wordt gesloten, kan de consument binnen 7 dagen na het
sluiten van de overeenkomst daarvan afzien (Código de Defesa do Consumidor, art. 49). Tijdens de
gratis proefperiode wordt niets in rekening gebracht: opzeggen volstaat.

10.2. **We breiden dit recht uit tot alle klanten:** als je binnen **7 dagen na de eerste
afschrijving** (van het maand- of het jaarabonnement) afziet van de overeenkomst, betalen we **het
volledige bedrag** van die afschrijving terug, zonder dat je een reden hoeft op te geven.

10.3. Om dit recht uit te oefenen, gebruik je een van deze middelen:

1. **hef het account op in het dashboard** (Account en facturatie → Account opheffen), hetzelfde
   kanaal waarmee je de overeenkomst hebt gesloten. Binnen de termijn wordt de terugboeking van het
   volledige bedrag automatisch bij Stripe aangevraagd, en het scherm toont het terugbetaalde
   bedrag;
2. of stuur een e-mail naar hello@pyxis-analytics.dev, vanaf het e-mailadres van de
   accounteigenaar, met het woord "arrependimento" (herroeping).

Alleen het opzeggen van het abonnement in het Stripe-portaal leidt niet tot de terugboeking: gebruik
een van de twee middelen hierboven.

10.4. Via het dashboard verschijnt de bevestiging direct op het scherm, en ook per e-mail. Via
e-mail bevestigen we de ontvangst langs dezelfde weg en vragen we de terugboeking binnen 2 werkdagen
bij Stripe aan. Als de automatische terugboeking mislukt, vragen wij die binnen 2 werkdagen
handmatig aan en laten we het je weten. Stripe meldt de terugboeking aan de kaartuitgever; de termijn
waarbinnen die op het afschrift verschijnt, hangt af van de kaartuitgever.

10.5. Bij herroeping wordt het account opgeheven zoals in Artikel 11.6: de toegang eindigt direct en
voor de gegevens geldt Artikel 11.4.

## Artikel 11 — Opzegging en opheffing van het account door jou

11.1. Je kunt op elk moment vertrekken, op twee manieren, met verschillende gevolgen:

1. **het abonnement opzeggen in het Stripe-portaal** (Account en facturatie → Facturatie beheren,
   of via de link in de e-mails van Stripe): dit gaat in aan het einde van de betaalde periode of
   van de proefperiode (Artikel 11.2);
2. **het account opheffen in het dashboard** (Account en facturatie → Account opheffen): dit gaat
   direct in (Artikel 11.6).

Als je dat liever doet, vraag het dan per e-mail aan hello@pyxis-analytics.dev, vanaf het
e-mailadres van de accounteigenaar, met vermelding van welke van de twee je wilt. Zonder die
vermelding voeren we de opzegging van punt 1 uit. We bevestigen de ontvangst langs dezelfde weg.

11.2. **Opzegging in het Stripe-portaal:** de toegang loopt door tot het einde van de betaalde
periode (of van de proefperiode) en **er volgt geen nieuwe afschrijving**. Uiterlijk de dag na het
einde van de toegang worden de sleutels van de projecten ingetrokken en sturen de websites geen
events meer; het dashboard blijft tot de verwijdering alleen beschikbaar voor raadpleging en
export.

11.3. **Let op: buiten het herroepingsrecht (Artikel 10) is er geen evenredige terugbetaling van de
al betaalde periode,** noch bij het maand- noch bij het jaarabonnement, bij geen van beide manieren
van vertrekken. Er wordt alleen terugbetaald in de gevallen die deze voorwaarden uitdrukkelijk
voorzien: Artikelen 6.3, 15.7, 18.9, 18.10, 18.13, 20.2, 21.3 en 22.1 en Artikelen 9.2 en 16.2 van
Bijlage 1.

11.4. **Let op: verwijdering van de gegevens.** **30 dagen na het einde van de toegang**
(Artikel 2.10) verwijdert een automatische routine definitief het account, de projecten en alles
wat daarbij hoort, zoals beschreven in Artikel 12 van Bijlage 1. We waarschuwen de accounteigenaar
per e-mail bij het einde van de toegang, 7 dagen vóór de verwijdering en wanneer die is uitgevoerd.
Daarna **is er geen manier om de gegevens te herstellen**. Alleen bewaard blijven de
factureringsgegevens die de wet voorschrijft te bewaren, het register ter voorkoming van herhaalde
gratis proefperiodes (Privacybeleid, punten 2.2 en 2.7) en wat een wet of een bevel van een
autoriteit voorschrijft te bewaren (Artikel 12.6 van Bijlage 1).

11.5. **De events exporteren en terugkomen.**

1. De accounteigenaar exporteert alle events van een project in de Instellingen van het project. Het
   bestand (gecomprimeerde CSV) is binnen enkele minuten klaar, de melding komt per e-mail, en het
   bestand kan **7 dagen** lang in het dashboard worden gedownload, met een nieuwe link bij elke
   download, geldig gedurende 5 minuten; daarna wordt het bestand verwijderd. Er zijn tot 3 exports
   per project per dag. De export werkt tijdens de overeenkomst en in de 30 dagen na het einde van
   de toegang.
2. Als de export via het dashboard niet werkt, vraag de kopie dan aan via
   hello@pyxis-analytics.dev: we sturen het bestand binnen 10 werkdagen na het verzoek en, als het
   verzoek dicht bij de verwijderingsdatum binnenkomt, stellen we de verwijdering uit totdat we de
   kopie hebben geleverd.
3. Vóór de verwijdering kun je **terugkomen** zonder gegevens te verliezen: kies in Account en
   facturatie "Opnieuw abonneren", of schrijf naar hello@pyxis-analytics.dev en wij activeren het
   abonnement opnieuw. Langs beide wegen is er geen nieuwe gratis proefperiode en begint de
   facturering bij de heractivering. De ingetrokken sleutels komen niet terug: je maakt nieuwe
   sleutels aan in het dashboard en vervangt ze op je website.

11.6. **Het account opheffen via het dashboard.** Alleen de accounteigenaar heft het account op, in
Account en facturatie, door ter bevestiging zijn e-mailadres in te typen. **Let op: de opheffing
gaat direct in en kan niet via het dashboard ongedaan worden gemaakt:**

1. het abonnement wordt onmiddellijk bij Stripe opgezegd, zonder nieuwe afschrijvingen;
2. de sleutels van alle projecten worden direct ingetrokken, en de websites sturen geen events meer;
3. het dashboard blijft tot de verwijdering alleen beschikbaar voor raadpleging en export
   (Artikel 11.5);
4. de gegevens worden 30 dagen na de opheffing verwijderd (Artikel 11.4);
5. als de opheffing binnen 7 dagen na de eerste afschrijving plaatsvindt, wordt het bedrag van die
   afschrijving volledig teruggeboekt (Artikel 10); daarbuiten **is er geen evenredige
   terugbetaling van de betaalde periode** (Artikel 11.3);
6. het scherm bevestigt de opheffing, de datum van verwijdering en het teruggeboekte bedrag, en we
   sturen de bevestiging per e-mail.

Opheffen tijdens de gratis proefperiode leidt niet tot een afschrijving. Als Stripe het abonnement
niet kan opzeggen, wordt niets opgeheven en waarschuwt het scherm je. Als je van gedachten verandert
vóór de verwijdering, geldt Artikel 11.5, punt 3.

## Artikel 12 — Aanvaardbaar gebruik, misbruik en jouw verantwoordelijkheden

12.1. Je verbindt je ertoe de dienst te goeder trouw te gebruiken, alleen om het gebruik van je
websites te meten. **Misbruik is** elk van de onderstaande gedragingen, gepleegd door jou, door de
personen met toegang tot je account of door wie je sleutels, tokens of koppelingen met jouw
toestemming gebruikt:

*Persoonsgegevens en privacy*

1. **direct identificerende persoonsgegevens** in de events verzenden: naam, e-mailadres,
   telefoonnummer, CPF, adres, documentnummer, door de bezoeker getypte tekst of enig gegeven dat op
   zichzelf een persoon identificeert;
2. **gevoelige persoonsgegevens** verzenden (gezondheid, raciale of etnische afkomst, religie,
   politieke opvatting, lidmaatschap van een vakbond, seksueel leven, genetisch of biometrisch
   gegeven);
3. proberen **de barrière voor persoonsgegevens** van de server te omzeilen (Artikel 12.2),
   bijvoorbeeld door een e-mailadres, een document of een telefoonnummer op te splitsen, te
   coderen of te verhullen zodat het erdoorheen komt;
4. in de functie `identify` iets anders gebruiken dan een **interne en ondoorzichtige identificatie**
   van het account in jouw systeem, zoals het e-mailadres, de CPF of het telefoonnummer;
5. **meten wie heeft gevraagd niet gemeten te worden**: het respecteren door de tracker van de
   signalen Global Privacy Control en Do Not Track en van de optie om niet gemeten te worden
   (`optOut`) uitschakelen, omzeilen of wijzigen, of events van die personen langs een andere weg
   verzenden;
6. de dienst gebruiken in combinatie met technieken van browser-fingerprinting of andere middelen om
   anonieme bezoekers te herkennen;

*Verkeer en beveiliging*

7. **vervalste of geautomatiseerde events** verzenden om de cijfers of de dienst op te blazen, te
   vertekenen of te overbelasten (redelijke tests van je eigen installatie zijn geen misbruik);
8. events verzenden vanaf **websites die niet van jou zijn** en ook niet van iemand die je
   toestemming heeft gegeven, of een website van een ander als oorsprong van een project registreren;
9. de **publieke sleutel, de geheime sleutel, het token of de koppeling van een andere klant**
   gebruiken;
10. **de dienst aanvallen**, proberen toegang te krijgen tot gegevens van andere klanten of tot delen
    van de dienst die niet van jou zijn, of kwetsbaarheden testen zonder onze schriftelijke
    toestemming (het te goeder trouw melden van een beveiligingsfout aan hello@pyxis-analytics.dev is
    geen misbruik);
11. **de limieten omzeilen** voor het aantal verzoeken, het maandquotum (Artikel 7.2) of de limieten
    van het abonnement (Artikel 7.1), bijvoorbeeld door het verzenden vanaf één website over meerdere
    accounts of sleutels te verdelen;
12. de geheime sleutel of een toegangstoken opzettelijk of herhaaldelijk **publiceren of delen** (in
    een openbare coderepository, op een pagina, op een forum of in de code die in de browser draait);
    een onbedoeld lek is geen misbruik, maar de gelekte sleutel of het gelekte token wordt ingetrokken
    zoals bepaald in Artikel 13.9;

*Account, abonnement en betaling*

13. de toegang tot de gehoste dienst doorverkopen, verhuren of aan derden doorgeven, of het account
    delen om de limieten voor personen en projecten van het abonnement te overschrijden, zonder
    schriftelijke overeenkomst met ons (als bureau websites meten van je klanten die daarmee hebben
    ingestemd, binnen de limieten van het abonnement, is geen doorverkoop; Artikel 3.2 van Bijlage 1);
14. meer dan één account aanmaken, of een andere persoon, een ander e-mailadres of een andere kaart
    gebruiken, om **de gratis proefperiode te herhalen** of om aan een limiet of een afschrijving te
    ontkomen;
15. **betalingsfraude**: een kaart gebruiken zonder toestemming van de kaarthouder of valse
    factuurgegevens, of te kwader trouw een afschrijving betwisten bij de kaartuitgever,
    bijvoorbeeld door te zeggen dat je een afschrijving niet herkent die je hebt toegestaan en
    waarvan je de dienst hebt gebruikt, zonder eerst bij ons om opzegging of terugbetaling te hebben
    gevraagd (een onterechte afschrijving betwisten is je recht; Artikel 18.12);

*Wet en derden*

16. de dienst gebruiken voor illegale activiteiten, om websites met illegale inhoud te meten of om
    rechten van derden te schenden (privacy, intellectuele eigendom, portretrecht);
17. elk ander gebruik in strijd met de wet of met deze voorwaarden dat schade veroorzaakt, of een
    concreet en aantoonbaar risico op schade schept, voor de andere klanten, de infrastructuur van
    de dienst, de betrokkenen of ons, met inbegrip van wettelijke aansprakelijkheid.

12.2. De server verwijdert automatisch waarden met de vorm van een e-mailadres en reeksen van 10 of
meer cijfers (zoals CPF, CNPJ en telefoonnummer). **Let op:** deze barrière is een tweede laag en
herkent geen namen, adressen of vrije teksten. **De verantwoordelijkheid voor wat je website
verzendt, ligt bij jou.**

12.3. Je verbindt je er ook toe:

1. op je website een privacyverklaring te publiceren die de meting beschrijft (er is een model in
   Bijlage IV van de Verwerkersovereenkomst) en die verklaring in overeenstemming te houden met wat
   je website verzendt;
2. als je website gericht is op kinderen of adolescenten, de meting vooraf te beoordelen in het licht
   van art. 14 van de LGPD;
3. de geheime sleutel en de toegangstokens geheim te houden (Artikel 13);
4. de e-mailadressen van de accounteigenaar en van de personen met toegang actueel te houden
   (Artikel 23);
5. op onze waarschuwingen over misbruik te reageren binnen de aangegeven termijn (Artikel 18).

12.4. **Hoe we misbruik opmerken.** We monitoren de inhoud van je projecten niet doorlopend. We
merken misbruik op aan de hand van wat de dienst al bewaart of ontvangt: de automatische
beveiligingswaarschuwingen (Bijlage II van de Verwerkersovereenkomst, punt 10); de technische logs van de API,
die aangeven wanneer een event of een eigenschap is geweigerd en op grond van welke regel, zonder de
geweigerde waarde, en die na 14 dagen verdwijnen; de in het project opgeslagen events, die alleen
worden geraadpleegd wanneer dat nodig is (Artikel 7.2 van de Verwerkersovereenkomst); de factureringsgegevens
van Stripe; het register van gratis proefperiodes (Privacybeleid, punt 2.7); en wat een andere
persoon of een autoriteit ons meldt. **De dienst bewaart geen IP-adres of volledige
browseridentificatie, en gaat die ook niet bewaren om misbruik te onderzoeken.**

## Artikel 13 — Personen met toegang, sleutels en tokens

13.1. **Personen met toegang.** Het account heeft tot 3 personen met toegang tot het dashboard, de
eigenaar meegerekend. De eigenaar nodigt een persoon uit via diens e-mailadres, voor een of meer
projecten van het account, in Instellingen → Personen. De persoon ontvangt een uitnodigingsmail en
logt in op het dashboard met een code die naar diens e-mailadres wordt gestuurd, zonder
wachtwoord. De eigenaar verwijdert een persoon op hetzelfde scherm, op elk moment.

13.2. De uitgenodigde personen zien de cijfers, de instellingen en de lijst met personen van de
projecten waarvoor ze zijn uitgenodigd, en beheren hun eigen sessies, tokens, gekoppelde apps en
wekelijkse samenvatting. Alleen de eigenaar wijzigt projecten, sleutels, personen en facturering, en
alleen hij exporteert events of heft het account op.

13.3. Wanneer de eigenaar een persoon uit een project verwijdert, eindigt diens toegang tot dat
project direct, ook via de toegangstokens die die persoon heeft aangemaakt en de apps die die
persoon heeft gekoppeld. Wat die persoon al heeft gezien of via een token of een gekoppelde app naar
een ander programma heeft meegenomen, valt buiten ons bereik. Voor de registratie van die persoon
geldt het Privacybeleid (punt 2.1).

13.4. Je bent verantwoordelijk voor het actueel houden van de lijst met personen (bijvoorbeeld het
verwijderen van wie je team heeft verlaten) en voor wat de personen met toegang in de dienst doen.
Door een persoon uit te nodigen, bevestig je dat die weet dat die e-mails van Pyxis zal ontvangen
(uitnodiging, inlogcodes en de wekelijkse samenvatting) en deze voorwaarden kent.

13.5. Elke persoon ziet en beëindigt de eigen sessies in Instellingen, ook "Overal uitloggen". Overal uitloggen trekt de tokens niet in en ontkoppelt de apps niet: elk
daarvan wordt in de eigen lijst ingetrokken (Artikelen 13.8 en 13.10).

13.6. **Publieke sleutel:** wordt op je website geplaatst en identificeert alleen het project. De
dienst accepteert alleen events met die sleutel die afkomstig zijn van de in het project
geregistreerde adressen. De eigenaar vervangt de publieke sleutel in Instellingen.

13.7. **Geheime sleutel:** is alleen nodig als je de routes voor verwijdering en kopie van gegevens
gaat gebruiken. De eigenaar maakt hem aan in Instellingen, en hij wordt één keer getoond. Bewaar hem
alleen op je server, nooit in de browser of in een coderepository. Wij bewaren hem alleen als hash:
als je hem kwijtraakt, trek hem dan in en maak een nieuwe aan.

13.8. **Toegangstokens:** lezen alleen de cijfers van het dashboard en zijn 30, 90 of 365 dagen
geldig. Wie een token aanmaakt, is verantwoordelijk voor het bewaren ervan en kan het op elk moment
intrekken in Instellingen. De gegevens die een token leest, gaan naar het programma waarin het werd
gebruikt (bijvoorbeeld een tool voor kunstmatige intelligentie met de MCP-server, op je computer of
via het adres in Artikel 4.4, punt 3); **de keuze en het gebruik van die tool zijn jouw
verantwoordelijkheid**.

13.9. Als een sleutel uitlekt, trekt de eigenaar hem in en maakt hij direct een nieuwe aan, in
Instellingen; lukt dat niet, laat het ons dan weten: we trekken de sleutel binnen 1 werkdag in. Een
uitgelekt token kan direct worden ingetrokken door degene die het heeft aangemaakt, in Instellingen.
Als we een gepubliceerde geheime sleutel of een gepubliceerd token aantreffen, trekken we die direct
in, om je te beschermen, ook zonder misbruik, en waarschuwen we je daarna (Artikel 18.4, punt 4).

13.10. **Gekoppelde apps (Claude-connector).**

1. **Welke apps.** Op dit moment koppelen alleen **Claude** en **Claude Code**, van Anthropic, zich
   zonder token aan Pyxis, via het adres `https://api.pyxis-analytics.dev/mcp`. We herkennen elk
   daarvan aan het identificatiedocument dat Anthropic publiceert en accepteren langs deze weg geen
   andere apps. Andere programma's gebruiken hetzelfde adres met een toegangstoken (Artikel 13.8).
2. **Wie koppelt.** Elke persoon met toegang, op eigen naam. Wanneer de app om de koppeling vraagt,
   logt de persoon in op het dashboard en ziet op een pagina van Pyxis de app, waarheen het antwoord
   teruggaat (met een waarschuwing wanneer het naar een programma op de eigen computer gaat), wat de
   app zal kunnen lezen en de lijst met projecten. De koppeling bestaat alleen als de persoon
   **Toestaan** kiest; het verzoek is 10 minuten geldig.
3. **Wat de app leest.** **Hij leest alleen**, en alleen wat die persoon in het dashboard ziet, van
   alle projecten die die persoon kan openen: de cijfers, de lijsten met bezoeken en de tijdlijn van
   elk bezoek, met de interne identificatie die je website via de functie `identify` heeft
   verzonden, en het inlog-e-mailadres van de persoon zelf. Hij wijzigt nooit iets en leest nooit
   geheime sleutels, tokens, sessies, de lijst met personen met toegang of de facturering.
4. **Waar de gegevens heen gaan.** De gegevens die de app opvraagt, verlaten Pyxis en gaan naar
   **Anthropic**, in de Verenigde Staten: bij Claude rechtstreeks naar de servers van Anthropic; bij
   Claude Code eerst naar de computer van de persoon en van daaruit naar Anthropic. De
   toestemmingspagina meldt dit vóór **Toestaan**. **Anthropic is niet onze leverancier en ook niet
   onze subverwerker**: degene die kiest te koppelen, is de persoon met toegang, en Anthropic verwerkt
   die gegevens volgens de voorwaarden en het privacybeleid die gelden tussen Anthropic en wie Claude
   gebruikt. **De keuze en het gebruik van die app zijn jouw verantwoordelijkheid**, zoals in
   Artikel 13.8.
5. **Hoe lang het duurt.** De koppeling gebruikt inloggegevens die de app zelf vernieuwt (die voor
   toegang is 1 uur geldig) en die wij alleen als hash bewaren. Ze eindigt wanneer de persoon haar
   intrekt in Instellingen → Gekoppelde apps; na 90 dagen zonder gebruik; wanneer de persoon de
   toegang verliest (Artikel 13.3) of de toegang wordt opgeschort (Artikel 18.2); wanneer het
   account wordt verwijderd (Artikel 11.4); of vanzelf, wanneer al vervangen inloggegevens
   opnieuw worden gebruikt, een teken dat ze mogelijk zijn gekopieerd. Daarna vraagt de app opnieuw om
   te koppelen.
6. **Limieten.** Tot 10 gelijktijdig gekoppelde apps per persoon, en de limieten voor het aantal
   opvragingen per minuut van Bijlage II van de Verwerkersovereenkomst.

## Artikel 14 — Persoonsgegevens

14.1. Wat betreft de gegevens van de bezoekers van je websites **ben jij de
verwerkingsverantwoordelijke** en **zijn wij de verwerker** (Lei nº 13.709/2018, de Lei Geral de
Proteção de Dados Pessoais (LGPD; Braziliaanse algemene wet bescherming persoonsgegevens), art. 5,
VI en VII). De volledige regels staan in **Bijlage 1 — Verwerkersovereenkomst**, die deel uitmaakt
van deze overeenkomst: doel, instructies, beveiliging, subverwerkers, internationale doorgifte,
verzoeken van betrokkenen, incidenten, opschorting van de verwerking en verwijdering.

14.2. Wat betreft je eigen gegevens en die van de personen met toegang (e-mailadressen, account,
aanvaarding van deze voorwaarden, sessies, gekoppelde apps, facturering, voorkoming van herhaalde
proefperiodes en support) **zijn wij de verwerkingsverantwoordelijke**, zoals uitgelegd in
**Bijlage 2 — Privacybeleid van Pyxis**.

## Artikel 15 — Beschikbaarheid, onderbrekingen en wijzigingen van de dienst

15.1. **Let op: er is geen beschikbaarheidsgarantie (SLA).** We doen ons best om de dienst online te
houden en storingen zo snel mogelijk te verhelpen. De dienst wordt door één persoon geëxploiteerd en
is afhankelijk van providers (AWS, dat ook de e-mails verstuurt, Neon, Vercel en Stripe); er kunnen
onderbrekingen zijn.

15.2. **Onderhoud.** We kondigen per e-mail, waar mogelijk vooraf, het onderhoud aan waardoor de
dienst offline kan gaan, en voeren het bij voorkeur buiten kantooruren uit.

15.3. **Onderbrekingen die niet van ons afhangen.** De dienst kan geheel of gedeeltelijk stoppen door
een storing of opschorting bij een provider, door een aanval van derden op de dienst of door toeval
of overmacht (Código Civil (Braziliaans Burgerlijk Wetboek), art. 393). We werken eraan de dienst zo
snel mogelijk te herstellen en, als de onderbreking langer dan 24 uur duurt, waarschuwen we per
e-mail.

15.4. **Wettelijk bevel.** We onderbreken of beperken de dienst geheel of gedeeltelijk wanneer een
wet, een rechterlijk bevel of een besluit van de ANPD (Agência Nacional de Proteção de Dados;
Braziliaanse nationale gegevensbeschermingsautoriteit) of van een andere bevoegde autoriteit dat
vereist (bijvoorbeeld de blokkering van gegevens of de opschorting van een verwerking, LGPD,
art. 52). We voldoen alleen aan wat wordt vereist en laten het je weten, tenzij het bevel die
mededeling verbiedt.

15.5. **Pauze wegens het quotum.** Voor de pauze van de ontvangst van events bij het bereiken van
150% van de maandlimiet geldt Artikel 7.2.

15.6. Als je consument bent, blijven je rechten uit art. 20 van het Código de Defesa do Consumidor
gelden: bij een tekortkoming van de dienst, ook een opschorting die onterecht blijkt
(Artikel 18.9), kun je vragen om het opnieuw verrichten van de dienst, waar van toepassing, om een
evenredige prijsvermindering of om teruggave van het betaalde bedrag.

15.7. We kunnen de dienst verbeteren, schermen wijzigen en functies toevoegen. Tijdens de betaalde
periode verwijderen we de in Artikel 7.1 genoemde functies niet en verslechteren we de
privacytoezeggingen van Artikel 4.2 niet. Als een wijziging van dat soort onvermijdelijk is
(bijvoorbeeld door de wet of omdat een provider iets niet langer aanbiedt), kondigen we die 30 dagen
van tevoren aan, en kun je de overeenkomst beëindigen met evenredige terugbetaling van de betaalde en
niet-gebruikte periode.

## Artikel 16 — Support en klantenservice

16.1. De klantenservice verloopt per e-mail, via hello@pyxis-analytics.dev, voor vragen, klachten,
support, bezwaar tegen een opschorting, opschorting en opzegging.

16.2. We bevestigen de ontvangst van je bericht via hetzelfde e-mailadres en antwoorden **binnen 2
werkdagen** (werkdagen van maandag tot en met vrijdag, met uitzondering van nationale feestdagen).

16.3. De support omvat het gebruik van de gehoste dienst en de installatie van de tracker. Hij omvat
geen ontwikkeling op je website en geen support voor eigen installaties van de open source code.

16.4. Stuur in berichten geen persoonsgegevens van bezoekers. Gebruik de identificatie van het
bezoek of van de gebruiker om een geval te tonen.

## Artikel 17 — Intellectuele eigendom en jouw gegevens

17.1. **De gegevens van je projecten zijn van jou.** We verwerken ze alleen om de dienst te
verlenen, zoals bepaald in de Verwerkersovereenkomst. We verkopen ze niet, gebruiken ze niet voor
reclame en gebruiken ze niet om modellen van kunstmatige intelligentie te trainen.

17.2. De code van Pyxis valt onder de MIT-licentie (Artikel 5). De naam Pyxis, het logo en de
huisstijl zijn van ons; je mag ze niet zonder onze toestemming gebruiken op een manier die
suggereert dat je product van ons is of dat we een samenwerking hebben.

17.3. Als je ons suggesties stuurt, mogen we die vrij gebruiken om Pyxis te verbeteren, zonder
verplichting jegens jou.

## Artikel 18 — Misbruik: opschorting en beëindiging door ons

18.1. **Beginselen.** Bij misbruik (Artikel 12.1) handelen we op basis van feiten die we je kunnen
laten zien, in verhouding tot de ernst en alleen ten aanzien van het getroffen deel van de dienst.
Een zwaardere maatregel wordt alleen gebruikt wanneer de lichtere niet volstaat, en elke maatregel
gaat vergezeld van de schriftelijke reden.

18.2. **Mogelijke maatregelen**, van de lichtste tot de zwaarste:

1. waarschuwing per e-mail, met een termijn om het te herstellen;
2. gedeeltelijke opschorting: een sleutel, een token of de koppeling van een app intrekken; de
   ontvangst van events van een project pauzeren;
   de toegang van een persoon tot het dashboard opschorten;
3. opschorting van het hele account: ontvangst van events van alle projecten, dashboard, sleutels,
   tokens en gekoppelde apps;
4. beëindiging van de overeenkomst (Artikel 18.7).

18.3. **Waarschuwing en termijn om te herstellen.** Buiten de gevallen van Artikel 18.4 waarschuwen
we de accounteigenaar vóór een opschorting per e-mail, met vermelding van wat we hebben gezien, welke
regel is overtreden, wat er moet gebeuren en welke maatregel we nemen als het niet wordt hersteld,
en geven we **5 werkdagen** om het te herstellen of toe te lichten. Als je het binnen de termijn
herstelt, wordt niets opgeschort.

18.4. **Let op: onmiddellijke opschorting.** We kunnen alleen in deze gevallen zonder voorafgaande
waarschuwing opschorten, en alleen voor zover nodig om het probleem in te dammen:

1. een aanval op de dienst of op andere klanten, of vervalst of geautomatiseerd verkeer dat de
   stabiliteit van de dienst bedreigt (Artikel 12.1, punten 7, 10 en 11);
2. het verzenden van gevoelige persoonsgegevens in de events, of van direct identificerende
   persoonsgegevens op een manier die bezoekers aan een relevant risico blootstelt (Artikel 12.1,
   punten 1 tot en met 3);
3. ogenschijnlijk illegale activiteit of inhoud (Artikel 12.1, punt 16);
4. een gepubliceerde geheime sleutel of een gepubliceerd token, om welke reden ook, zelfs per
   ongeluk (Artikel 13.9): de maatregel is alleen het intrekken ervan, om jou en de betrokkenen te
   beschermen;
5. een objectieve aanwijzing van betalingsfraude, zoals een kaart die zonder toestemming van de
   kaarthouder wordt gebruikt of valse factuurgegevens (Artikel 12.1, punt 15);
6. een concreet en onmiddellijk risico voor andere klanten, voor de betrokkenen of voor de
   infrastructuur;
7. een wet, een rechterlijk bevel of een besluit van een bevoegde autoriteit (Artikel 15.4).

In die gevallen waarschuwen we de accounteigenaar per e-mail **binnen 1 werkdag** na de
opschorting, met vermelding van de reden, wat is opgeschort, wat je moet doen om terug te keren en
hoe je bezwaar kunt maken, tenzij een wet of een bevel die mededeling verbiedt.

18.5. **Duur en herstel.** De opschorting duurt alleen zo lang als nodig. Wanneer het probleem is
verholpen of het bezwaar is aanvaard, herstellen we binnen 1 werkdag volledig wat was opgeschort.
Ingetrokken sleutels, tokens en koppelingen komen niet terug: je maakt nieuwe sleutels en tokens aan
in het dashboard en koppelt de app opnieuw.

18.6. **Recht op antwoord en bezwaar.** Je kunt op elke waarschuwing reageren en tegen elke maatregel
bezwaar maken per e-mail aan hello@pyxis-analytics.dev, vanaf het e-mailadres van de
accounteigenaar, binnen **10 werkdagen** na de waarschuwing, met je toelichting en het bewijs dat je
hebt. We bevestigen de ontvangst langs dezelfde weg en antwoorden met een gemotiveerde beslissing
**binnen 5 dagen**; bij een onmiddellijke opschorting behandelen we het bezwaar met voorrang. Dit
kanaal vervangt niet en is geen voorwaarde voor je recht om je te wenden tot de Procon (Braziliaanse
consumentenbeschermingsdienst), de andere consumentenbeschermingsinstanties of de rechter.

18.7. **Beëindiging wegens misbruik.** We kunnen de overeenkomst per e-mail en met opgave van reden
beëindigen, alleen nadat we je de gelegenheid hebben gegeven te reageren (Artikel 18.6), tenzij een
wet of een bevel dat verhindert en behalve bij een herhaalde gratis proefperiode, waarvoor de eigen
termijnen van Artikel 18.11 gelden, en alleen wanneer:

1. het misbruik **ernstig** is: een opzettelijke aanval op de dienst of op andere klanten;
   betalingsfraude; illegale activiteit of inhoud; het opzettelijk verzenden van gevoelige
   persoonsgegevens; of een opzettelijke poging om de barrière voor persoonsgegevens of het
   respecteren van wie heeft gevraagd niet gemeten te worden te omzeilen;
2. hetzelfde misbruik zich na herstel **herhaalt**, binnen 12 maanden na de eerste waarschuwing; of
3. het misbruik **niet is hersteld** binnen 30 dagen na een opschorting.

De beëindiging heeft de gevolgen van Artikel 11.6, punten 1 tot en met 4: het abonnement wordt
opgezegd, de sleutels worden ingetrokken, het dashboard blijft 30 dagen beschikbaar voor raadpleging
en export, behoudens een wettelijke belemmering, en de gegevens worden daarna verwijderd
(Artikel 11.4).

18.8. **Gegevens tijdens de opschorting en na de beëindiging.**

1. Tijdens de opschorting blijven de al opgeslagen gegevens opgeslagen en beschermd, gaat de
   verwijdering van events ouder dan 13 maanden door, en wordt er in het opgeschorte deel geen nieuw
   event ontvangen.
2. Je kunt de events blijven exporteren (Artikel 11.5), behalve wanneer de toegang zelf het risico
   is (bijvoorbeeld een aanval vanuit het account) of een wet of bevel dat verhindert; in dat geval
   leveren we de kopie op verzoek zodra de belemmering is opgeheven, en wacht de verwijdering daarop.
3. Na de beëindiging gelden de Artikelen 11.4 en 11.5: 30 dagen om te exporteren, behoudens een
   wettelijke belemmering, en daarna verwijdering.
4. Als een wet, een rechterlijk bevel of een vordering van een bevoegde autoriteit voorschrijft
   gegevens te bewaren, of als die nodig zijn voor een gerechtelijke, bestuursrechtelijke of
   arbitrale procedure, bewaren we alleen die gegevens, zonder ander gebruik, zo lang als vereist, en
   verwijderen we ze daarna (Artikel 12.6 van Bijlage 1).
5. Om misbruik te onderzoeken, gebruiken we alleen wat de dienst al bewaart (Artikel 12.4).

18.9. **Facturering tijdens de opschorting.** Een gedeeltelijke opschorting verandert niets aan de
facturering. Als een opschorting onterecht blijkt, betalen we het bedrag terug dat evenredig is aan
het aantal dagen dat het account was opgeschort, naast je rechten uit Artikel 15.6.

18.10. **Terugbetaling bij beëindiging wegens misbruik.**

1. We betalen het bedrag terug dat evenredig is aan de betaalde en niet-gebruikte periode, gerekend
   vanaf het begin van de opschorting van het hele account of, als die er niet was, vanaf de
   beëindiging. Als de beëindiging plaatsvindt binnen de 7 dagen van Artikel 10, betalen we het
   volledige bedrag van de eerste afschrijving terug.
2. We betalen niet terug voor de periode die tot de opschorting van het hele account al is
   gebruikt, en ook geen bedragen die al naar je zijn teruggegaan via een terugboeking of via een
   door de kaartuitgever aanvaarde betwisting.
3. **Let op: alleen als je geen consument bent**, kunnen we de schade die het misbruik ons aantoonbaar
   heeft berokkend in mindering brengen op dat bedrag, met een schriftelijke berekening (Código
   Civil, arts. 368 en 369); wat dan tekortschiet of overblijft, wordt geregeld volgens Artikel 19.
4. De terugbetaling gaat via Stripe naar de kaart waarmee is betaald, binnen 5 werkdagen na de
   beëindiging.

18.11. **Herhaalde gratis proefperiode.** Wanneer de dienst aangeeft dat de gebruikte kaart in de
voorafgaande 12 maanden al een gratis proefperiode in een ander account is begonnen (Privacybeleid,
punt 2.7), of er een andere objectieve aanwijzing is van een herhaalde proefperiode door dezelfde
persoon of onderneming (Artikel 6.4):

1. gebeurt er niets automatisch: de dienst registreert alleen de match en waarschuwt ons;
   geen afschrijving en geen opzegging;
2. onderzoeken we het geval en vragen we het je zo nodig, met de termijn van Artikel 18.3. Een
   bedrijfskaart die door verschillende personen wordt gebruikt, of een bureau dat voor
   verschillende klanten contracteert, is geen herhaalde proefperiode;
3. als we de herhaalde proefperiode bevestigen, kunnen we het nieuwe account vóór het einde van de
   proefperiode beëindigen, door het abonnement bij Stripe op te zeggen zonder enige afschrijving,
   met kennisgeving en opgave van reden; je kunt bezwaar maken (Artikel 18.6) en je kunt per e-mail
   een abonnement zonder gratis proefperiode afsluiten, met facturering vanaf het nieuwe abonnement;
4. **brengen we nooit iets in rekening vóór de datum die op de betaalpagina van Stripe wordt
   getoond**, en verkorten we de proefperiode nooit om eerder af te schrijven.

18.12. **Betwisting van een afschrijving op de kaart.** Een afschrijving betwisten bij de
kaartuitgever is je recht; we vragen je eerst contact met ons op te nemen (Artikelen 10 en 16). Als
de betwisting wordt aanvaard en het bedrag naar je teruggaat, blijft de betwiste periode onbetaald
en kunnen we die behandelen als niet-betaling, door het abonnement met kennisgeving op te zeggen
(Artikel 9.2). Alleen een betwisting te kwader trouw (Artikel 12.1, punt 15) wordt als misbruik
behandeld.

18.13. **Beëindiging zonder misbruik.** Buiten misbruik beëindigen we de overeenkomst alleen in de
gevallen van de Artikelen 6.2 (einde van de kosteloosheid), 20 (einde van de gehoste dienst),
21.3 (een door de wet vereiste wijziging die je niet aanvaardt) en 22.1 (een overdracht die je niet
aanvaardt), en betalen we altijd het bedrag terug dat evenredig is aan de betaalde en
niet-gebruikte periode; voor de gegevens gelden de Artikelen 11.4 en 11.5.

## Artikel 19 — Aansprakelijkheid

19.1. We zijn aansprakelijk voor het verlenen van de dienst zoals in deze voorwaarden beschreven,
met zorgvuldigheid, en voor het nakomen van de Verwerkersovereenkomst.

19.2. De dienst toont gebruiksstatistieken. We garanderen op basis daarvan geen bedrijfsresultaten,
en de beslissingen die je op basis van de cijfers neemt, zijn de jouwe.

19.3. **Als je consument bent**, beperkt niets in deze voorwaarden de rechten die het Código de
Defesa do Consumidor je garandeert, met inbegrip van het recht op vergoeding van schade veroorzaakt
door een tekortkoming van de dienst.

19.4. **Let op: aansprakelijkheidsbeperking voor wie geen consument is.** Als je de dienst afneemt
voor je beroeps- of bedrijfsactiviteit, buiten een consumentenrelatie, en, in de gerechtvaardigde
situaties die art. 51, I, van het Código de Defesa do Consumidor toelaat, als je een consument bent
die een rechtspersoon is:

1. is onze totale aansprakelijkheid voor schade die verband houdt met deze overeenkomst beperkt tot
   het bedrag dat je ons hebt betaald in de 12 maanden vóór het feit dat de schade heeft veroorzaakt;
2. zijn we niet aansprakelijk voor gederfde winst, verlies van zakelijke kansen of andere
   indirecte schade.

Deze beperking houdt rekening met de lage prijs van het abonnement en de omvang van de dienst, die
door één persoon wordt geëxploiteerd. Ze **is niet van toepassing** op schade veroorzaakt door opzet
of grove schuld van onze kant, noch op verplichtingen die de wet niet toestaat te beperken, en ze
vermindert de rechten van de betrokkenen jegens ons niet (LGPD, art. 42).

19.5. Je bent aansprakelijk voor de schade die je ons of derden toebrengt door deze voorwaarden niet
na te komen, bijvoorbeeld door persoonsgegevens in de events te verzenden, door de bezoekers van je
website niet over de meting te informeren of door ander misbruik als bedoeld in Artikel 12.1.

19.6. Geen van de partijen is aansprakelijk voor vertraging of tekortkoming veroorzaakt door toeval
of overmacht (Código Civil, art. 393).

## Artikel 20 — Beëindiging van de gehoste dienst

20.1. Als we besluiten de gehoste dienst te beëindigen, kondigen we dat per e-mail aan **ten minste
30 dagen van tevoren**.

20.2. In dat geval betalen we het bedrag terug dat evenredig is aan de betaalde en niet-gebruikte
periode, houden we de export van de events (Artikel 11.5) beschikbaar tot het einde van de dienst en
verwijderen we de gegevens overeenkomstig Artikel 12 van Bijlage 1.

20.3. Omdat de code open is, kun je Pyxis op je eigen infrastructuur blijven gebruiken.

## Artikel 21 — Wijzigingen van deze voorwaarden

21.1. We kunnen deze voorwaarden wijzigen. We kondigen dat per e-mail aan **ten minste 30 dagen van
tevoren**, met uitleg van wat er verandert, en we publiceren de nieuwe versie met de datum van
inwerkingtreding. Eerdere versies zijn op verzoek beschikbaar.

21.2. **Wijzigingen die je rechten beperken of je verplichtingen vergroten, gelden voor jou pas vanaf
je eerstvolgende verlenging na die termijn.** Ga je niet akkoord, zeg dan vóór de verlenging op,
zonder kosten.

21.3. Wijzigingen die alleen de dienst verbeteren of de tekst verduidelijken, gelden vanaf de in de
kennisgeving vermelde datum. Wijzigingen die worden vereist door de wet, door een rechterlijke
beslissing of door de ANPD kunnen vóór de verlenging gelden; als een daarvan voor jou niet
aanvaardbaar is, kun je de overeenkomst beëindigen met evenredige terugbetaling van de betaalde en
niet-gebruikte periode.

## Artikel 22 — Overdracht van de overeenkomst

22.1. We kunnen deze overeenkomst overdragen aan een onderneming die door {{seller.name}} is
opgericht of wordt beheerst (bijvoorbeeld zodat de dienst wordt verleend met een CNPJ (Cadastro
Nacional da Pessoa Jurídica; Braziliaans fiscaal nummer van een rechtspersoon)) of aan wie de dienst
overneemt, met behoud van alle bepalingen van deze voorwaarden en van de Verwerkersovereenkomst. We
kondigen dat per e-mail aan ten minste 30 dagen van tevoren; als je niet akkoord gaat, kun je de
overeenkomst beëindigen met evenredige terugbetaling van de betaalde en niet-gebruikte periode.

22.2. Je mag deze overeenkomst niet overdragen zonder onze schriftelijke toestemming.

## Artikel 23 — Communicatie

23.1. We sturen de mededelingen in het kader van deze overeenkomst, ook de waarschuwingen over
misbruik en opschorting, naar het e-mailadres van de accounteigenaar en, wanneer het onderwerp het
gebruik van het dashboard door een persoon, de opschorting van diens toegang of een
beveiligingsincident is, ook naar de betrokken personen met toegang. Houd die e-mailadressen actueel.

23.2. Jouw mededelingen aan ons gaan naar hello@pyxis-analytics.dev.

## Artikel 24 — Algemene bepalingen

24.1. Als een artikel ongeldig wordt geacht, blijven de overige van kracht.

24.2. Als een van de partijen nalaat een recht af te dwingen, betekent dat niet dat zij daarvan
afstand heeft gedaan.

24.3. Deze overeenkomst schept geen vennootschap, arbeidsrelatie of vertegenwoordiging tussen de
partijen.

24.4. Deze overeenkomst wordt in het Portugees gesloten, langs elektronische weg, en geldt als
schriftelijke overeenkomst.

## Artikel 25 — Toepasselijk recht en bevoegde rechter

25.1. Op deze overeenkomst is het Braziliaanse recht van toepassing.

25.2. Neem voordat je naar de rechter stapt contact met ons op via hello@pyxis-analytics.dev: we
willen het oplossen. Dit is een uitnodiging, geen voorwaarde. Als je consument bent, kun je je ook
wenden tot de Procon en de andere consumentenbeschermingsinstanties.

25.3. **Als je consument bent**, kun je een rechtsvordering instellen bij de rechter van je
woonplaats (Código de Defesa do Consumidor, art. 101, I).

25.4. In de overige gevallen wordt gekozen voor de rechter van de comarca (rechtsgebied) van
**Salvador/BA** (deelstaat Bahia), de woonplaats van degene die de dienst verleent.

---

[Bijlage 1 — Verwerkersovereenkomst](/nl/dpa).

[Bijlage 2 — Privacybeleid van Pyxis](/nl/privacy).
