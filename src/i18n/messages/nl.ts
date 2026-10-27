import { translation } from '../messages';

function forms<const One extends string, const Other extends string>(one: One, other: Other) {
  return { one, other } as const;
}

export const nl = translation({
  meta: {
    description:
      'Productanalyse die privacy vooropstelt: geen cookies bij je bezoekers, geen persoonsgegevens, geen derde partijen.',
    screenTitle: '{screen} · {project}',
    demoShareTitle: 'Livedemo van {app}',
  },
  screens: {
    overview: 'Overzicht',
    funnel: 'Funnel',
    features: 'Functies',
    requests: 'Verzoeken',
    timeline: 'Tijdlijn',
    visits: 'Bezoeken',
    devices: 'Apparaten',
    acquisition: 'Acquisitie',
    loading: '{screen} laden…',
  },
  nav: {
    label: 'Hoofdnavigatie',
    openMenu: 'Menu openen',
    openMenuWithNews: 'Menu openen, er is nieuws',
    arrivals: {
      visits: forms('{count} nieuw bezoek', '{count} nieuwe bezoeken'),
      conversions: forms('{count} nieuwe conversie', '{count} nieuwe conversies'),
      namedEvents: forms('{count} nieuw event', '{count} nieuwe events'),
      failedRequests: forms('{count} nieuw mislukt verzoek', '{count} nieuwe mislukte verzoeken'),
      manyVisits: 'Meer dan 99 nieuwe bezoeken',
      manyConversions: 'Meer dan 99 nieuwe conversies',
      manyNamedEvents: 'Meer dan 99 nieuwe events',
      manyFailedRequests: 'Meer dan 99 nieuwe mislukte verzoeken',
      refresh: 'Vernieuwen',
      refreshing: 'Vernieuwen…',
      onTheSiteNow: '{count} nu op de site',
      moreSinceLastRead: '{count} meer sinds je laatst keek',
      newVisit: 'Nieuw',
    },
    closeMenu: 'Menu sluiten',
    section: 'Analyse',
    switchProject: 'Ander project kiezen. Huidig project:',
    newProject: 'Nieuw project',
    signOut: 'Uitloggen',
    signOutEverywhere: 'Overal uitloggen',
    signingOut: 'Uitloggen…',
    signOutFailed: 'Uitloggen is niet gelukt. Probeer het opnieuw.',
    projectSection: 'Project',
    settings: 'Instellingen',
    account: 'Account en voorkeuren',
    language: 'Taal',
    billing: 'Account en facturatie',
  },
  theme: {
    switch: 'Thema wisselen',
    toLight: 'Naar licht thema',
    toDark: 'Naar donker thema',
    label: 'Thema',
    light: 'Licht',
    dark: 'Donker',
    system: 'Systeem',
  },
  periodSelector: {
    label: 'Periode',
    presets: {
      today: 'Vandaag',
      '7d': '7 dagen',
      '30d': '30 dagen',
    },
    custom: 'Aangepast',
    apply: 'Toepassen',
    applying: 'Toepassen…',
    previousMonth: 'Vorige maand',
    nextMonth: 'Volgende maand',
    pickLastDay: 'Vanaf {day}: kies nu de laatste dag.',
    chosenRange: '{range} · {days}',
    dayCount: forms('{count} dag', '{count} dagen'),
    limit: 'Maximaal {days} dagen, uiterlijk tot en met vandaag.',
  },
  signIn: {
    title: 'Inloggen bij Pyxis',
    intro: 'We mailen je een code van {digits} cijfers. Je hoeft geen wachtwoord te onthouden.',
    sessionEnded: 'Je sessie is beëindigd. Log opnieuw in om verder te gaan.',
    email: 'E-mail',
    emailPlaceholder: 'jij@bedrijf.nl',
    demoEmail:
      'Demomodus: er wordt geen e-mail verstuurd. Elk e-mailadres werkt; gebruik daarna de code <code/>.',
    sendCode: 'Code versturen',
    sending: 'Versturen…',
    checkTitle: 'Check je e-mail',
    checkBody:
      'Als dit adres kan inloggen bij Pyxis, is er een code onderweg. Die verloopt over 10 minuten.',
    change: 'Wijzigen',
    changeEmail: 'E-mailadres wijzigen',
    code: 'Code van {digits} cijfers',
    codeSent: 'Code verstuurd.',
    demoCode: 'Demomodus: er wordt geen e-mail verstuurd. Gebruik de code <code/>.',
    demoFill: '{code} invullen',
    verify: 'Controleren en doorgaan',
    verifying: 'Controleren…',
    resend: 'Nieuwe code versturen',
    resendIn: 'Nieuwe code versturen over {time}',
    resent: 'Nieuwe code verstuurd. Alleen de nieuwste werkt.',
    errors: {
      invalidCode:
        'Ongeldige of verlopen code. Check de nieuwste e-mail of vraag een nieuwe code aan.',
      rateLimited:
        'Te veel pogingen vanaf dit netwerk. Wacht een paar minuten en probeer het opnieuw.',
      unreachable: 'Pyxis is niet bereikbaar. Check je verbinding en probeer het opnieuw.',
    },
    validation: {
      emailMissing: 'Vul je e-mailadres in.',
      emailMalformed: 'Vul een volledig e-mailadres in, zoals jij@bedrijf.nl.',
      codeIncomplete: 'Vul alle {digits} cijfers van de code in.',
    },
  },
  signInPage: {
    title: 'Inloggen',
    privacy:
      'Productanalyse die privacy vooropstelt · geen cookies bij je bezoekers, geen persoonsgegevens',
    noAccount:
      'Nog geen account? <plans>Bekijk de abonnementen</plans> of <demo>open de demo</demo>, met verzonnen gegevens.',
    noCode:
      '<strong>Na een paar minuten nog niets?</strong> Misschien heeft dit e-mailadres nog geen Pyxis-account.',
    seePlans: 'Bekijk de abonnementen',
    startTrial: '14 dagen gratis proberen',
    startFree: 'Gratis beginnen',
    createAccount: 'Account aanmaken',
  },
  errorPanel: {
    title: 'Deze gegevens konden niet worden geladen',
    body: 'Het dashboard kon deze gegevens niet lezen. Probeer het zo opnieuw.',
    retry: 'Opnieuw proberen',
    detail: 'fout-id {digest}',
  },
  notFound: {
    title: 'Pagina niet gevonden',
    outside: 'Deze pagina bestaat niet, of je hebt geen toegang tot dit project.',
    toProjects: 'Naar je projecten',
    inProject: 'Op dit adres staat niets in dit project.',
    toOverview: 'Overzicht openen',
  },
  states: {
    loading: 'Laden…',
    emptyPeriod: {
      title: 'Niets in deze periode',
      body: 'Er is in deze periode geen event binnengekomen.',
      bodyWithLatest:
        'Er is in deze periode geen event binnengekomen. Het laatste kwam binnen op {date}.',
      widerPeriod: 'Bekijk de laatste 30 dagen',
    },
    noActivity: {
      title: 'Nog geen events in deze periode',
      install:
        'Installeer de SDK op je site, dan verschijnen de eerste paginaweergaven hier binnen een minuut.',
      guide: 'De volledige installatiehandleiding staat in de <readme>README van de SDK</readme>.',
    },
    noConversionEvent:
      'Voor dit project is geen conversie-event ingesteld, dus conversies worden niet getoond. Wie Pyxis beheert, stelt er een in met het commando <code>project:update</code> van de API en de optie <code>--conversion-event</code>.',
    noProjects: {
      title: 'Nog geen projecten',
      body: '<email/> kan inloggen, maar heeft nog geen toegang tot een project gekregen. Vraag wie deze Pyxis beheert om <code>admin:grant</code> uit te voeren voor je e-mailadres.',
      create: 'Je eerste project aanmaken',
      bodyOwner:
        'Je account is klaar. Maak een project aan voor je site en installeer daarna Pyxis erop.',
      finish: 'Je abonnement afronden',
      bodyUnfinished:
        'Je account wacht op een abonnement. Rond het abonnement af om projecten aan te maken.',
    },
  },
  demo: {
    label: 'Demomelding',
    notice:
      'Demogegevens: verzonnen cijfers voor twee denkbeeldige producten. Hier wordt geen echte bezoeker getoond.',
    homePage: 'Wat is Pyxis?',
    projectNames: { store: 'Mijn site', docs: 'Demo Docs' },
  },
  shell: {
    skipToContent: 'Naar de inhoud',
    privacy: 'Geen cookies, geen persoonsgegevens',
  },
  language: {
    label: 'Taal',
    current: 'Taal: {name}',
  },
  settings: {
    title: 'Instellingen',
    subtitle:
      'Hoe {project} is ingesteld, en de e-mails die je erover krijgt. Projectinstellingen wijzig je via de opdrachtregel.',
    subtitleOwner: 'Hoe {project} is ingesteld, de sleutels, en de e-mails die je erover krijgt.',
    subtitleMember:
      'Hoe {project} is ingesteld, en de e-mails die je erover krijgt. Alleen de eigenaar van het account wijzigt het project.',
    project: {
      heading: 'Project',
      name: 'Naam',
      timezone: 'Tijdzone',
      conversionEvent: 'Conversie-event',
      noConversionEvent: 'Geen, dus conversies worden niet getoond',
      created: 'Aangemaakt',
      createdOn: 'Aangemaakt op {date}',
    },
    activity: {
      heading: 'Activiteit',
      firstEvent: 'Oudste bewaarde event',
      latestEvent: 'Laatste event',
      waiting: 'Wachten op het eerste event',
      install:
        'Installeer de SDK met een publieke sleutel hieronder; paginaweergaven van de toegestane origins verschijnen binnen een minuut.',
    },
    origins: {
      heading: 'Toegestane origins',
      note: 'Alleen pagina’s op deze origins kunnen events versturen met een publieke sleutel.',
      none: 'Er is nog geen origin toegestaan, dus geen enkele pagina kan events versturen.',
    },
    keys: {
      heading: 'Sleutels',
      public: 'Publieke sleutels',
      publicNote: 'Een publieke sleutel staat in de pagina’s van je site, dus die is niet geheim.',
      noLiveKey: 'Dit project heeft geen actieve publieke sleutel, dus het meet niets.',
      revokedForGood:
        'Een ingetrokken sleutel werkt nooit meer. Als de toegang van een account eindigt, worden de sleutels ingetrokken, en ze blijven ingetrokken als het account terugkomt.',
      createBelow:
        'Maak hieronder een publieke sleutel aan en zet die op je site in plaats van de oude.',
      createInSettings:
        'Maak een publieke sleutel aan in <settings>Instellingen</settings> en zet die op je site in plaats van de oude.',
      ownerOnly: 'Alleen de eigenaar van het account kan er een aanmaken.',
      secret: 'Geheime sleutels',
      secretNote:
        'Met een geheime sleutel kan de backend van je site de gegevens van een persoon wissen en exporteren. Hij wordt opgeslagen als hash en hier nooit getoond.',
      noSecretKey: 'Geen actieve geheime sleutel.',
      created: 'Aangemaakt op {date}',
    },
    deletionHeld:
      'De verwijdering van dit project is opgeschort: het kan pas worden verwijderd als Pyxis de opschorting opheft. Vragen hierover? Mail naar <mail>hello@pyxis-analytics.dev</mail>.',
    retention: {
      heading: 'Bewaartermijn',
      body: 'Events worden {months} maanden bewaard; daarna verwijdert een dagelijkse taak ze.',
    },
  },
  projectForm: {
    heading: 'Project',
    name: 'Naam',
    origins: 'Toegestane origins',
    originsNote:
      'Alleen pagina’s op deze origins kunnen events versturen met een publieke sleutel. Schrijf schema, host en poort, zoals https://shop.example.com; maximaal {max}.',
    origin: 'Origin {number}',
    originPlaceholder: 'https://shop.example.com',
    conversionEventPlaceholder: 'signup_completed',
    addOrigin: 'Origin toevoegen',
    removeOrigin: 'Origin {number} verwijderen',
    timezone: 'Tijdzone',
    timezoneNote:
      'De dagen en uren in de rapporten en in de wekelijkse samenvatting volgen deze tijdzone.',
    conversionEvent: 'Conversie-event',
    conversionEventNote: 'Optioneel. Het event dat als conversie telt, zoals signup_completed.',
    save: 'Wijzigingen opslaan',
    saving: 'Opslaan…',
    saved: 'Opgeslagen',
    nameMissing: 'Geef het project een naam.',
    nameTooLong: 'Gebruik maximaal {max} tekens.',
    originsMissing: 'Geef minstens één origin op.',
    originsInvalid:
      'Schrijf elke origin als schema, host en poort, zoals https://shop.example.com.',
    originsTooMany: 'Gebruik maximaal {max} origins.',
    timezoneInvalid: 'Kies een tijdzone uit de lijst.',
    conversionEventInvalid:
      'Gebruik kleine letters, cijfers en underscores, en begin met een letter.',
    invalid: 'Deze instellingen zijn geweigerd. Controleer de velden en probeer het opnieuw.',
    subscriptionRequired:
      'Dit account heeft geen lopend abonnement, dus de projecten kunnen niet worden gewijzigd.',
    failed: 'De wijzigingen zijn niet opgeslagen. Probeer het opnieuw.',
  },
  projectKeys: {
    newPublic: 'Nieuwe publieke sleutel',
    newSecret: 'Nieuwe geheime sleutel',
    creating: 'Aanmaken…',
    publicCreated: 'Publieke sleutel aangemaakt. Zet hem in je pagina’s en trek daarna de oude in.',
    tooMany:
      'Dit project heeft {max} actieve sleutels van dit type, het maximum. Trek er eerst een in.',
    revoke: 'Intrekken',
    revoking: 'Intrekken…',
    revoked: 'Sleutel ingetrokken',
    onlyPublicKey:
      'De enige publieke sleutel blijft staan, anders kan de site geen events versturen.',
    lastPublicKey:
      'De laatste publieke sleutel blijft staan, anders kan de site geen events versturen. Maak eerst een nieuwe aan.',
    subscriptionRequired:
      'Dit account heeft geen lopend abonnement, dus de sleutels kunnen niet worden gewijzigd.',
    failed: 'Dat is niet gelukt. Probeer het opnieuw.',
    revealHeading: 'Kopieer de geheime sleutel nu',
    revealNote:
      'Dit is de enige keer dat hij wordt getoond: Pyxis bewaart er alleen een hash van. Zet hem in de omgeving van je backend, nooit in een pagina.',
    copy: 'Kopiëren',
    copied: 'Gekopieerd',
    selected: 'Geselecteerd, druk op Ctrl+C',
    done: 'Klaar',
  },
  deleteProject: {
    heading: 'Project verwijderen',
    note: 'Verwijdert {project}, de events en de sleutels definitief, en de site stopt meteen met het versturen van events. Dit kan niet ongedaan worden gemaakt.',
    confirm: 'Typ {project} om te bevestigen',
    delete: 'Project definitief verwijderen',
    deleting: 'Verwijderen…',
    nameMismatch: 'De getypte naam is niet de naam van dit project.',
    failed: 'Het project is niet verwijderd. Probeer het opnieuw.',
    deletionOnHold:
      'Zolang Pyxis de verwijdering opschort, kan er in dit account niets worden verwijderd. Mail naar hello@pyxis-analytics.dev.',
  },
  people: {
    heading: 'Personen',
    noteOwner:
      'Wie dit project kan openen. Iedereen logt in met een code die naar het eigen e-mailadres wordt gestuurd. Het account heeft ruimte voor {max} personen, jij meegerekend.',
    note: 'Wie dit project kan openen.',
    owner: 'Eigenaar',
    member: 'Lid',
    you: '{email} (jij)',
    added: 'Toegevoegd op {date}',
    email: 'E-mailadres',
    emailPlaceholder: 'anna@example.com',
    add: 'Persoon toevoegen',
    adding: 'Toevoegen…',
    invited: '{email} is toegevoegd en heeft een e-mail gekregen over het inloggen.',
    alreadyThere: '{email} heeft al toegang tot dit project.',
    emailMissing: 'Vul het e-mailadres in van de persoon die je wilt toevoegen.',
    emailInvalid: 'Vul een e-mailadres in, zoals anna@example.com.',
    limitReached:
      'Het account heeft al {max} personen, jij meegerekend. Verwijder iemand om een ander toe te voegen.',
    subscriptionRequired:
      'Dit account heeft geen lopend abonnement, dus er kan niemand worden toegevoegd.',
    failed: 'Er is niemand toegevoegd. Probeer het opnieuw.',
    remove: 'Verwijderen',
    removing: 'Verwijderen…',
    removed: 'Verwijderd',
    ownerStays: 'De eigenaar houdt toegang tot elk project van het account.',
    removeFailed: 'Die persoon is niet verwijderd. Probeer het opnieuw.',
  },
  account: {
    title: 'Account en facturatie',
    back: 'Terug naar het dashboard',
    noAccount:
      'Je bent geen eigenaar van een Pyxis-account. De facturatie van de projecten die je opent, hoort bij hun eigenaar.',
    plan: 'Abonnement',
    planWithInterval: 'Abonnement: {interval}',
    monthly: 'Maandelijks',
    yearly: 'Jaarlijks',
    status: {
      trialing:
        'Gratis proefperiode tot {date}. Daarna wordt het abonnement in rekening gebracht, tenzij je opzegt.',
      active: 'Actief. Wordt verlengd op {date}.',
      past_due:
        'De laatste betaling is mislukt. Stripe probeert het de komende dagen opnieuw; werk je kaartgegevens bij om te blijven meten.',
      ending: 'Opgezegd. Je houdt toegang tot {date}, zonder verdere kosten.',
      ended:
        'Beëindigd op {date}. De projecten meten niet meer, en alles wordt verwijderd op {deletion}.',
      incomplete:
        'Het abonnement is niet afgerond. Kies een abonnement om de gratis proefperiode te starten.',
      incompleteFree:
        'Het abonnement is niet afgerond. Kies een abonnement om af te sluiten; het wordt vanaf vandaag in rekening gebracht.',
      comped: 'Een account aangeboden door Pyxis.',
      free: 'Gratis abonnement: maximaal {events} events per maand.',
      trialingUndated:
        'Gratis proefperiode. Daarna wordt het abonnement in rekening gebracht, tenzij je opzegt.',
      activeUndated: 'Actief.',
      endingUndated:
        'Opgezegd. Je houdt toegang tot het einde van de periode, zonder verdere kosten.',
      endedUndated:
        'Beëindigd. De projecten meten niet meer, en alles wordt dertig dagen na het einde verwijderd.',
      endedHeld: 'Beëindigd op {date}. De projecten meten niet meer.',
      endedHeldUndated: 'Beëindigd. De projecten meten niet meer.',
    },
    usage: 'Events deze maand',
    usageCount: '{count} van {limit}',
    measured: 'Gemeten op {date}.',
    notMeasured: 'Deze maand nog niet gemeten.',
    paused:
      'Het meten is gepauzeerd tot {date}: het account heeft deze maand {events} events bereikt.',
    limits: 'Maximaal {projects} en {people}, jij meegerekend.',
    suspended:
      'Geschorst op {date}. De projecten meten niet meer, en hun schermen blijven gesloten tot de schorsing is opgeheven.',
    suspensionReason: 'Reden: {reason}',
    contest: 'Bezwaar maken? Mail naar <mail>hello@pyxis-analytics.dev</mail>.',
    deletionHeld:
      'Verwijdering opgeschort: er wordt niets in dit account verwijderd tot Pyxis de opschorting opheft.',
    resubscribe:
      'Neem vóór {date} opnieuw een abonnement om de gegevens te behouden: er is geen nieuwe gratis proefperiode, het abonnement wordt vanaf vandaag in rekening gebracht, en de oude sleutels blijven ingetrokken, dus elk project heeft een nieuwe publieke sleutel nodig.',
    resubscribeUndated:
      'Neem opnieuw een abonnement om de gegevens te behouden: er is geen nieuwe gratis proefperiode, het abonnement wordt vanaf vandaag in rekening gebracht, en de oude sleutels blijven ingetrokken, dus elk project heeft een nieuwe publieke sleutel nodig.',
    resubscribeFree:
      'Neem vóór {date} opnieuw een abonnement om de gegevens te behouden: het abonnement wordt vanaf vandaag in rekening gebracht, en de oude sleutels blijven ingetrokken, dus elk project heeft een nieuwe publieke sleutel nodig.',
    resubscribeFreeUndated:
      'Neem opnieuw een abonnement om de gegevens te behouden: het abonnement wordt vanaf vandaag in rekening gebracht, en de oude sleutels blijven ingetrokken, dus elk project heeft een nieuwe publieke sleutel nodig.',
    exempt: 'Tot {date} wordt het meten niet gepauzeerd als de maandlimiet wordt overschreden.',
    freePause:
      'Met het gratis abonnement pauzeert het meten zodra de maand {events} events bereikt, en het gaat op de 1e weer verder.',
    paidPlan: {
      heading: 'Het betaalde abonnement',
      offer:
        'Tot 100.000 events per maand, 3 projecten en 3 personen, voor R$ 39 per maand of R$ 390 per jaar. Het wordt vandaag afgerekend en verlengt tot je opzegt.',
      resumes: 'Het meten gaat binnen een minuut na het afsluiten weer verder.',
    },
    fit: {
      dueBy:
        'Dit account bevat meer dan het gratis abonnement toestaat. Zorg dat het uiterlijk {date} past, anders eindigt het account die dag:',
      projects: 'Verwijder {count}: het gratis abonnement staat {limit} toe.',
      people: 'Verwijder {count}: het gratis abonnement staat {limit} toe, jij meegerekend.',
      where: 'Projecten en personen verwijder je in de Instellingen van elk project.',
    },
    afterCancel: {
      backToFree:
        'Als je opzegt, gaat het account aan het einde van de periode terug naar het gratis abonnement, met zijn projecten en gegevens: tot {events} events per maand, en daarboven pauzeert het meten tot de 1e.',
      backToFreeOn:
        'Op {date} gaat het account terug naar het gratis abonnement, met zijn projecten en gegevens: tot {events} events per maand, en daarboven pauzeert het meten tot de 1e.',
      backToFreeAtTheEnd:
        'Aan het einde van de periode gaat het account terug naar het gratis abonnement, met zijn projecten en gegevens: tot {events} events per maand, en daarboven pauzeert het meten tot de 1e.',
      ends: 'Als je opzegt, eindigt het account aan het einde van de periode. Om het op het gratis abonnement te houden, zorg dat het er vóór die tijd in past:',
      endsOn:
        'Op {date} eindigt het account. Om het op het gratis abonnement te houden, zorg dat het er vóór die tijd in past:',
      endsAtTheEnd:
        'Aan het einde van de periode eindigt het account. Om het op het gratis abonnement te houden, zorg dat het er vóór die tijd in past:',
    },
    notice: {
      suspended: 'Dit account is geschorst, dus de projecten meten niet meer.',
      why: 'Bekijk waarom',
      paymentFailed:
        'De laatste betaling is mislukt. Werk je kaartgegevens bij om te blijven meten.',
      ending: 'Je abonnement eindigt op {date}.',
      ended: 'Je abonnement is beëindigd. Alles wordt verwijderd op {date}.',
      endedHeld: 'Je abonnement is beëindigd. De verwijdering van de gegevens is opgeschort.',
      paused:
        'Het meten is gepauzeerd tot {date}: het account is over zijn maandlimiet aan events gegaan.',
      freePlanPaused:
        'Het meten is gepauzeerd: het account heeft deze maand de {events} events van het gratis abonnement bereikt. Het gaat op {date} weer verder, of binnen een minuut na het afsluiten van een abonnement.',
      subscribe: 'Nu abonneren',
      nearQuota: 'Deze maand heeft het account {share} van zijn events gebruikt.',
      open: 'Facturatie openen',
    },
  },
  accountSuspended: {
    title: 'Dit account is geschorst',
    explanation:
      'Het account waartoe dit project behoort is geschorst, dus de schermen blijven gesloten en de sites worden niet meer gemeten tot de schorsing is opgeheven.',
    owner:
      'De eigenaar van het account vindt de reden, en hoe je bezwaar maakt, onder Account en facturatie.',
    open: 'Account en facturatie openen',
  },
  projectIngestion: {
    label: 'Projectstatus',
    suspended:
      'Pyxis heeft de ontvangst van events voor dit project op {date} geschorst, dus het meet niets. De schermen blijven open.',
    reason: 'Reden: {reason}',
    contest:
      'Bezwaar maken? De eigenaar van het account mailt naar <mail>hello@pyxis-analytics.dev</mail>.',
  },
  billing: {
    subscribeAgain: 'Opnieuw abonneren',
    resubscribeUnavailable:
      'Opnieuw abonneren kan nog niet via het dashboard. Mail naar hello@pyxis-analytics.dev, dan activeren wij het abonnement weer.',
    manage: 'Facturatie beheren',
    finish: 'Abonnement afronden',
    subscribe: 'Nu abonneren',
    opening: 'Stripe openen…',
    interval: 'Facturatie',
    monthly: 'Maandelijks',
    yearly: 'Jaarlijks',
    noBillingYet: 'Er is nog geen facturatie om te beheren.',
    subscriptionExists: 'Dit account heeft al een abonnement. Laad de pagina opnieuw.',
    unavailable: 'Facturatie is nu niet beschikbaar. Probeer het later opnieuw.',
    failed: 'Stripe kon niet worden geopend. Probeer het opnieuw.',
  },
  exportEvents: {
    heading: 'Events exporteren',
    note: 'Alle events die dit project bewaart, in een gecomprimeerd CSV-bestand. Dat duurt een paar minuten: je krijgt een e-mail met de link, en het bestand wordt {days} dagen bewaard. Maximaal {max} exports per dag.',
    request: 'Events exporteren',
    requesting: 'Aanvragen…',
    requested: 'Het bestand wordt klaargezet. Je krijgt een e-mail als het klaar is.',
    alreadyWaiting: 'Er wordt al een export van dit project klaargezet.',
    open: 'Export openen',
    limitReached:
      'Je hebt vandaag {max} exports van dit project aangevraagd, het maximum per dag. Probeer het morgen opnieuw.',
    unavailable: 'Exporteren is nu niet beschikbaar. Probeer het later opnieuw.',
    failed: 'De export is niet aangevraagd. Probeer het opnieuw.',
  },
  exportPage: {
    title: 'Export',
    subtitle: 'De events van {project}, in een gecomprimeerd CSV-bestand.',
    pending: 'Bestand wordt klaargezet…',
    pendingNote:
      'Deze pagina controleert om de paar seconden opnieuw, en je krijgt ook een e-mail als het klaar is.',
    done: '{count} events, beschikbaar tot {date}.',
    download: 'Bestand downloaden',
    downloadNote: 'Elke download vraagt een nieuwe link aan, die vijf minuten geldig is.',
    expired:
      'Het bestand is op {date} verwijderd, een week nadat het klaar was. Vraag een nieuwe export aan in Instellingen.',
    gone: 'Het bestand is niet meer beschikbaar. Vraag een nieuwe export aan in Instellingen.',
    failed: 'De export is mislukt. Vraag een nieuwe export aan in Instellingen.',
    settings: 'Instellingen openen',
    requestedAt: 'Aangevraagd op {date}',
  },
  closeAccount: {
    heading: 'Account opheffen',
    note: 'Zegt het abonnement nu op en trekt de sleutels van elk project in, zodat de sites geen events meer versturen. Alles wordt dertig dagen later verwijderd; exporteer eerst wat je nodig hebt.',
    refundNote:
      'Een eerste betaling van de afgelopen zeven dagen wordt volledig terugbetaald. Anders wordt er niets terugbetaald.',
    freeNote:
      'Trekt de sleutels van elk project in, zodat de sites geen events meer versturen. Alles wordt dertig dagen later verwijderd; exporteer eerst wat je nodig hebt.',
    confirm: 'Typ je e-mailadres om te bevestigen',
    close: 'Account definitief opheffen',
    closing: 'Opheffen…',
    closed: 'Het account is opgeheven. Alles wordt verwijderd op {date}.',
    refunded: '{amount} is teruggestort op je kaart.',
    confirmationMismatch: 'Dat is niet je e-mailadres, dus er is niets opgeheven.',
    alreadyEnded: 'Dit account is al beëindigd.',
    unavailable:
      'Stripe kon het abonnement niet opzeggen, dus er is niets opgeheven. Probeer het later opnieuw.',
    failed: 'Het account is niet opgeheven. Probeer het opnieuw.',
  },
  withdrawal: {
    heading: 'Herroeping',
    note: 'Binnen 7 dagen na de eerste betaling kun je herroepen: het abonnement wordt meteen opgezegd, die betaling wordt volledig terugbetaald en het account gaat terug naar het gratis abonnement, met zijn projecten en gegevens.',
    start: 'Abonnement herroepen',
    question:
      'Nu herroepen? Het abonnement stopt meteen en de eerste betaling gaat terug naar je kaart.',
    confirm: 'Herroepen en terugbetaald krijgen',
    keep: 'Abonnement houden',
    withdrawing: 'Herroepen…',
    done: 'Je hebt het abonnement herroepen. Het account is terug op het gratis abonnement.',
    refunded: '{amount} is teruggestort op je kaart.',
    refundByHand:
      'De automatische terugbetaling is niet gelukt, dus Pyxis betaalt de eerste betaling met de hand terug.',
    fitBy:
      'Het account bevat meer dan het gratis abonnement toestaat: zorg dat het uiterlijk {date} past, anders eindigt het die dag.',
    freePlanClosed:
      'Het gratis abonnement is nu gesloten, dus er is geen abonnement om naar terug te gaan. Zeg op via Facturatie beheren om de verlenging te stoppen.',
    noPaidSubscription:
      'Dit account heeft geen betaald abonnement om te herroepen. Laad de pagina opnieuw.',
    windowClosed:
      'De 7 dagen om te herroepen zijn voorbij. Zeg op via Facturatie beheren om de verlenging te stoppen: het abonnement loopt door tot het einde van de periode.',
    unavailable:
      'Stripe kon het abonnement niet opzeggen, dus er is niets veranderd. Probeer het later opnieuw.',
    failed: 'De herroeping is niet gelukt. Probeer het opnieuw.',
  },
  newProject: {
    title: 'Nieuw project',
    intro:
      'Een project meet één site. Het adres ervan wordt de enige origin die events mag versturen; je kunt later andere toevoegen in Instellingen.',
    name: 'Projectnaam',
    namePlaceholder: 'Mijn winkel',
    site: 'Adres van de site',
    sitePlaceholder: 'https://shop.example.com',
    timezone: 'Tijdzone',
    conversionEvent: 'Conversie-event (optioneel)',
    conversionEventPlaceholder: 'signup_completed',
    create: 'Project aanmaken',
    creating: 'Aanmaken…',
    nameMissing: 'Geef het project een naam.',
    nameTooLong: 'Gebruik maximaal {max} tekens.',
    siteMissing: 'Vul het adres van de site in.',
    siteInvalid: 'Schrijf het adres als schema en host, zoals https://shop.example.com.',
    timezoneInvalid: 'Kies een tijdzone uit de lijst.',
    conversionEventInvalid:
      'Gebruik kleine letters, cijfers en underscores, en begin met een letter.',
    limitReached:
      'Het account heeft al {max} projecten. Verwijder er een via de instellingen van dat project om een nieuw project aan te maken.',
    subscriptionRequired:
      'Dit account heeft geen lopend abonnement, dus het kan geen projecten aanmaken.',
    invalid: 'Deze instellingen zijn geweigerd. Controleer de velden en probeer het opnieuw.',
    failed: 'Het project is niet aangemaakt. Probeer het opnieuw.',
    noAccount: 'Alleen de eigenaar van een account met een lopend abonnement maakt projecten aan.',
    back: 'Terug naar het dashboard',
  },
  install: {
    title: 'Installeren',
    subtitle: 'Verstuur de eerste events van {project}.',
    step1: '1. Installeer Pyxis op je site',
    npm: 'Met een bundler (npm):',
    script: 'Of in gewone HTML, vóór de afsluitende body-tag:',
    step2: '2. Open een pagina van je site',
    step2Note:
      'Paginaweergaven van {origin} verschijnen hier binnen een minuut. Adblockers kunnen ze tegenhouden; probeer een privévenster.',
    waiting: 'Wachten op het eerste event…',
    waitingNote: 'Deze pagina controleert om de paar seconden opnieuw.',
    received: 'Het eerste event is binnen.',
    open: 'Dashboard openen',
    copy: 'Kopiëren',
    copied: 'Gekopieerd',
    selected: 'Geselecteerd, druk op Ctrl+C',
    privacy:
      'Pyxis plaatst geen cookie bij je bezoekers en slaat geen IP-adres of persoonsgegevens op. Vermeld in je privacybeleid dat de site het gebruik meet met Pyxis.',
    how: 'Zo installeer je',
    yourself: 'Zelf',
    withAgent: 'Met een AI-agent',
    agent: {
      lead: 'Open de repository van de site in Claude Code, in Cursor of in een andere coding-agent en plak dit verzoek. Het bevat al de publieke sleutel en het adres van dit project.',
      prompt:
        'Installeer Pyxis op deze site volgens {recipe}. De publieke sleutel van het project is {key}, het endpoint is {endpoint} en de site staat op {origin}. Meet de pagina’s en registreer bij elke belangrijke actie een event, zonder persoonsgegevens. Geef aan het eind een lijst van de bestanden die je hebt gewijzigd en van elk event dat je hebt aangemaakt, met naam en eigenschappen, zodat ik ze kan nakijken.',
      promptAnySite:
        'Installeer Pyxis op deze site volgens {recipe}. De publieke sleutel van het project is {key} en het endpoint is {endpoint}. Meet de pagina’s en registreer bij elke belangrijke actie een event, zonder persoonsgegevens. Geef aan het eind een lijst van de bestanden die je hebt gewijzigd en van elk event dat je hebt aangemaakt, met naam en eigenschappen, zodat ik ze kan nakijken.',
      steps: {
        open: 'Open de repository van je site in Claude Code, in Cursor of in een andere coding-agent.',
        paste: 'Plak het verzoek hierboven en laat de agent zijn werk doen.',
        review:
          'Kijk na wat hij heeft gewijzigd: het pakket, de <code>init</code> en de events die hij opsomt. Haal weg of hernoem wat je niet wilt.',
        publish:
          'Publiceer de site en open een van de pagina’s. Stap 2, hieronder, laat weten wanneer het eerste event binnenkomt.',
      },
      changes: {
        title: 'Wat de agent gaat wijzigen',
        package:
          '<code>package.json</code>: het pakket <code>pyxis-analytics</code>, zonder andere afhankelijkheid.',
        init: 'Eén bestand dat op elke pagina in de browser draait: de <code>init</code> met je sleutel.',
        track: 'Een <code>track</code>-aanroep bij elke belangrijke actie, nadat die gelukt is.',
        csp: 'Het beveiligingsbeleid (CSP), als de site er een heeft, met het adres van de API.',
        only: 'De agent wijzigt alleen de code van de site. Hij schrijft niets in Pyxis.',
      },
      rules:
        'De agent volgt de regels in <code>llms.txt</code>: geen persoonsgegevens, geldige eventnamen, het adres van de API in de CSP.',
    },
    step3: '3. Controleer het met Claude (optioneel)',
    claude: {
      body: 'Koppel Claude aan Pyxis en vraag of de eerste events zijn binnengekomen. Claude leest dezelfde cijfers als dit dashboard, wijzigt nooit iets, en je trekt de koppeling in wanneer je wilt, onder <settings>Instellingen</settings>.',
      connect:
        'Open in Claude <code>claude.ai/directory/pyxis</code> en kies Connect. Voer in Claude Code dit commando uit en daarna /mcp om in te loggen:',
      allow: 'Bij het koppelen vraagt een scherm van Pyxis je om de koppeling toe te staan.',
    },
    ask: {
      lead: 'Claude al gekoppeld? Vraag:',
      question: 'Hoeveel bezoeken had {project} vandaag, en waar kwamen ze vandaan?',
    },
    phone: {
      copy: 'Adres kopiëren',
      title: 'Installeren doe je op een computer',
      body: 'Pyxis komt in de code van je site. Open deze pagina op een computer, of kopieer het adres en stuur het naar wie de site beheert.',
    },
  },
  signUp: {
    title: 'Start je gratis proefperiode',
    intro:
      '{days} dagen gratis, daarna het abonnement dat je kiest. Geen kosten als je tijdens de proefperiode opzegt.',
    oneTrial: 'Eén gratis proefperiode per klant.',
    plan: 'Abonnement',
    monthly: 'Maandelijks',
    yearly: 'Jaarlijks',
    email: 'E-mail',
    emailPlaceholder: 'jij@bedrijf.nl',
    terms:
      'Ik heb de <link>Gebruiksvoorwaarden, de Verwerkersovereenkomst en het Privacybeleid</link> (versie {version}) gelezen en ga ermee akkoord.',
    termsMissing: 'Ga akkoord met de voorwaarden om door te gaan.',
    sendCode: 'Code versturen',
    sending: 'Versturen…',
    checkTitle: 'Check je e-mail',
    checkBody: 'We hebben een code van {digits} cijfers gestuurd. Die verloopt over 10 minuten.',
    code: 'Code van {digits} cijfers',
    change: 'Wijzigen',
    changeEmail: 'E-mailadres wijzigen',
    verify: 'Doorgaan',
    verifying: 'Controleren…',
    resend: 'Nieuwe code versturen',
    resendIn: 'Nieuwe code versturen over {time}',
    resent: 'Er is een nieuwe code onderweg.',
    preparing: 'Betaling voorbereiden…',
    invalidCode: 'Deze code is onjuist of verlopen. Controleer hem, of vraag een nieuwe aan.',
    termsOutdated:
      'De voorwaarden zijn gewijzigd terwijl deze pagina openstond. Lees de nieuwe versie en ga er opnieuw mee akkoord.',
    closed: 'De registratie is gesloten terwijl deze pagina openstond.',
    rateLimited: 'Te veel pogingen vanaf dit adres. Wacht een paar minuten en probeer het opnieuw.',
    unreachable: 'Pyxis is niet bereikbaar. Probeer het opnieuw.',
    checkoutFailed:
      'Je account is klaar, maar de betaalpagina is niet geopend. Rond de betaling af onder Account en facturatie.',
    openAccount: 'Account en facturatie openen',
    demoCode: 'Dit is de demo: de code is <code/>.',
    demoFill: '{code} gebruiken',
    haveAccount: 'Heb je al een account?',
    signIn: 'Inloggen',
    finishTitle: 'Rond je abonnement af',
    finishBody:
      'Je account wacht op een abonnement. Kies er een om de gratis proefperiode te starten.',
    freeTitle: 'Maak je gratis account aan',
    freeIntro: 'Gratis: maximaal {events} events per maand, op één site. Zonder kaart.',
    fullTitle: 'Maak je account aan',
    fullIntro:
      'Het gratis abonnement is op dit moment vol. Maak je account aan en het wacht op een plek, of neem direct daarna het betaalde abonnement.',
    opening: 'Je account wordt geopend…',
    waitTitle: 'Het gratis abonnement is op dit moment vol',
    waitBody:
      'Je account is klaar en wacht op een plek in het gratis abonnement: we mailen je zodra er een vrijkomt, en het wacht maximaal {days} dagen. Je kunt ook nu het betaalde abonnement nemen.',
  },
  signUpPage: {
    title: 'Registreren',
    closedTitle: 'Registreren kan nog niet',
    closedBody:
      'Pyxis is voorlopig alleen op uitnodiging. Mail naar hello@pyxis-analytics.dev, of probeer de livedemo.',
    demo: 'Livedemo openen',
    home: 'Terug naar de homepage',
  },
  welcome: {
    activeAgain: 'Je abonnement is weer actief.',
    nextAgain:
      'Je projecten meten weer zodra hun sites een nieuwe publieke sleutel gebruiken: maak er een aan in de instellingen van elk project.',
    title: 'Welkom bij Pyxis',
    confirming: 'Je abonnement wordt bevestigd…',
    confirmingNote:
      'Dit duurt een paar seconden en de pagina controleert vanzelf opnieuw. Duurt het langer, dan krijg je een e-mail zodra het klaar is.',
    trial: 'Je gratis proefperiode is gestart. Die loopt tot {date}.',
    active: 'Je abonnement is bevestigd.',
    free: 'Je account staat op het gratis abonnement.',
    freeLimits:
      'Maximaal {events} events per maand, {projects} en {people}, met alle functies en zonder kaart. Het meten pauzeert wanneer de maand {pauseAt} events bereikt en gaat op de 1e weer verder.',
    next: 'Maak nu een project aan voor je site en installeer Pyxis erop.',
    create: 'Je eerste project aanmaken',
    dashboard: 'Dashboard openen',
  },
  emailPreferences: {
    heading: 'E-mail',
    weeklyDigest: 'Wekelijkse samenvatting',
    weeklyDigestNote:
      'Elke maandag de week die op zondag eindigde in {timezone}: bezoeken, conversies, mislukte schrijfverzoeken, toppagina’s en events. Elke beheerder kiest dit voor zichzelf.',
    on: 'Aan',
    off: 'Uit',
    saving: 'Opslaan…',
    saved: 'Opgeslagen',
    failed: 'De wijziging is niet opgeslagen. Probeer het opnieuw.',
  },
  connectedApps: {
    heading: 'Gekoppelde apps',
    note: 'Apps die je toestemming hebt gegeven om de cijfers van je projecten te lezen. Elke app leest alleen, uit elk project dat je kunt openen. Trek de toegang in en de app stopt meteen; de app vraagt je dan om opnieuw te koppelen.',
    empty: 'Nog geen apps gekoppeld.',
    connected: 'Gekoppeld',
    lastUsed: 'Laatst gebruikt',
    connectHeading: 'Pyxis koppelen aan Claude',
    stepOpen: 'Open in Claude Customize, daarna Connectors, en kies Add custom connector.',
    stepAddress: 'Noem hem Pyxis en plak dit adres:',
    stepAllow: 'Kies Connect, log in bij Pyxis in het venster dat opent en kies Toestaan.',
    everywhere: 'Het werkt in Claude op het web, op je computer en op je telefoon.',
    claudeCode: 'Voer in Claude Code dit commando uit en daarna /mcp om in te loggen:',
  },
  connections: {
    copy: 'Kopiëren',
    copied: 'Gekopieerd',
    selected: 'Geselecteerd, druk op Ctrl+C',
    revoke: 'Intrekken',
    revoking: 'Intrekken…',
    revoked: 'App ontkoppeld',
    revokeFailed: 'De app is niet ontkoppeld. Probeer het opnieuw.',
  },
  sessions: {
    heading: 'Sessies',
    note: 'Elk apparaat waarop je bent ingelogd. Als je een sessie beëindigt, wordt dat apparaat bij zijn volgende verzoek uitgelogd.',
    thisDevice: 'Dit apparaat',
    device: '{browser} op {os}',
    unknownDevice: 'Onbekende browser',
    signedIn: 'Ingelogd',
    lastUsed: 'Laatst gebruikt',
    end: 'Beëindigen',
    ending: 'Beëindigen…',
    ended: 'Sessie beëindigd',
    failed: 'De sessie is niet beëindigd. Probeer het opnieuw.',
  },
  accessTokens: {
    heading: 'Toegangstokens',
    note: 'Laat een AI-agent of een script de cijfers lezen die je hier ziet, uit elk project dat je kunt openen. Een token leest alleen: het wijzigt nooit iets, en het werkt niet meer zodra je het intrekt.',
    name: 'Naam',
    namePlaceholder: 'Claude Code, Cursor…',
    nameMissing: 'Geef het token een naam, zodat je het later herkent.',
    nameTooLong: 'Gebruik maximaal {max} tekens.',
    lifetime: 'Verloopt over',
    lifetime30: '30 dagen',
    lifetime90: '90 dagen',
    lifetime365: '1 jaar',
    create: 'Token aanmaken',
    creating: 'Aanmaken…',
    failed: 'Het token is niet aangemaakt. Probeer het opnieuw.',
    tooMany: 'Je hebt {max} tokens, het maximum. Trek er een in om een nieuw token aan te maken.',
    revealHeading: 'Kopieer je nieuwe token nu',
    revealNote:
      'Dit is de enige keer dat het wordt getoond. Kwijtgeraakt? Trek het in en maak een nieuw token aan.',
    usage: 'Stuur het mee in de Authorization-header:',
    copy: 'Kopiëren',
    copied: 'Gekopieerd',
    selected: 'Geselecteerd, druk op Ctrl+C',
    done: 'Klaar',
    empty: 'Nog geen tokens.',
    created: 'Aangemaakt',
    lastUsed: 'Laatst gebruikt',
    neverUsed: 'Nooit gebruikt',
    expires: 'Verloopt',
    revoke: 'Intrekken',
    revoking: 'Intrekken…',
    revoked: 'Token ingetrokken',
    revokeFailed: 'Het token is niet ingetrokken. Probeer het opnieuw.',
  },
  connect: {
    title: 'Een app koppelen',
    heading: '{app} koppelen aan Pyxis?',
    asks: '{app} ({host}) vraagt om de cijfers van je projecten te lezen.',
    signedInAs: 'Ingelogd als {email}',
    accessHeading: 'Wat de app kan',
    access:
      'Alleen lezen: dezelfde cijfers die je in dit dashboard ziet, uit elk project dat je kunt openen. De app wijzigt nooit iets.',
    projectsHeading: 'Je projecten',
    noProjects:
      'Je hebt nog geen projecten. De app leest later de projecten die je dan kunt openen.',
    dataHeading: 'Waar de gegevens naartoe gaan',
    dataToCompany:
      'De gegevens die {app} opvraagt, inclusief je e-mailadres, gaan naar {company} in de Verenigde Staten, dat ze verwerkt volgens zijn eigen voorwaarden. Sta dit alleen toe als je daarmee akkoord gaat.',
    dataToApp:
      'De gegevens die {app} opvraagt, inclusief je e-mailadres, gaan naar het bedrijf erachter ({host}), dat ze verwerkt volgens zijn eigen voorwaarden. Sta dit alleen toe als je daarmee akkoord gaat.',
    returnHeading: 'Waar dit venster hierna heen gaat',
    returnTo: 'Terug naar {host}.',
    loopback:
      'Het antwoord gaat naar een programma op deze computer. Sta dit alleen toe als je de koppeling zojuist zelf in {app} op deze computer hebt gestart.',
    notYou: 'Heb je dit niet zojuist in {app} gestart? Kies dan Annuleren.',
    revokeLater: 'Je kunt de koppeling altijd intrekken in Instellingen.',
    goneHeading: 'Dit koppelingsverzoek is niet meer geldig',
    back: 'Terug naar het dashboard',
  },
  consent: {
    allow: 'Toestaan',
    allowing: 'Toestaan…',
    cancel: 'Annuleren',
    cancelling: 'Annuleren…',
    leaving: 'Terug naar {app}…',
    tooMany:
      'Je hebt al {max} gekoppelde apps, het maximum. Trek er een in via <settings>Instellingen</settings> om een andere te koppelen.',
    failed: 'Er is niets verstuurd. Probeer het opnieuw.',
    gone: 'Er is al op gereageerd, of er zijn meer dan {minutes} minuten verstreken. Ga terug naar Claude en koppel Pyxis opnieuw.',
  },
  chartPanel: {
    showAs: 'Weergeven als',
    chart: 'Grafiek',
    table: 'Tabel',
  },
  visitsLink: {
    purpose: ': bekijk de bezoeken',
  },
  units: {
    points: '{points} pp',
  },
  counts: {
    visit: forms('{count} bezoek', '{count} bezoeken'),
    matchingVisit: forms('{count} gevonden bezoek', '{count} gevonden bezoeken'),
    person: forms('{count} persoon', '{count} personen'),
    project: forms('{count} project', '{count} projecten'),
    day: forms('{count} dag', '{count} dagen'),
    page: forms('{count} pagina', '{count} pagina’s'),
    event: forms('{count} event', '{count} events'),
    item: forms('{count} item', '{count} items'),
    write: forms('{count} schrijfverzoek', '{count} schrijfverzoeken'),
    request: forms('{count} verzoek', '{count} verzoeken'),
    failure: forms('{count} fout', '{count} fouten'),
    failedRead: forms('{count} mislukt leesverzoek', '{count} mislukte leesverzoeken'),
    failedRequest: forms('{count} mislukt verzoek', '{count} mislukte verzoeken'),
    clientError: forms('{count} clientfout (4xx)', '{count} clientfouten (4xx)'),
    serverError: forms('{count} serverfout (5xx)', '{count} serverfouten (5xx)'),
    conversionEvent: forms('{count} conversie-event', '{count} conversie-events'),
  },
  period: {
    presets: {
      today: 'vandaag',
      '7d': 'laatste 7 dagen',
      '30d': 'laatste 30 dagen',
    },
    rangeProblems: {
      notADate: 'een van de datums is geen geldige kalenderdatum',
      inverted: 'het eindigt vóór het begint',
      future: 'het eindigt na vandaag',
      tooLong: 'het is langer dan {days} dagen',
    },
    rejectedRange:
      'Dat bereik is niet gebruikt: {problem}. In plaats daarvan worden de laatste {days} dagen getoond.',
  },
  glossary: {
    visit:
      'Een bezoek is één browsertabblad, van het eerste tot het laatste event; twee tabbladen worden nooit aan elkaar gekoppeld.',
    identifiedUser:
      'Een geïdentificeerde gebruiker is een unieke gebruikers-id die de site aan identify() heeft doorgegeven, meestal als iemand inlogt; een bezoek zonder id is anoniem.',
    conversion:
      'Een conversie is een bezoek dat het conversie-event van het project minstens één keer heeft verstuurd; de conversie-events tellen elke keer dat het werd verstuurd.',
    write:
      'Een schrijfverzoek is een POST, PUT, PATCH of DELETE die met trackRequest() is verstuurd.',
    failure: 'Een fout is een status van 400 of hoger, of helemaal geen antwoord.',
    changeTone:
      'Een verandering is alleen groen of rood als de vorige periode minstens {base} telde en de waarde {change} of meer veranderde ({points} procentpunt voor het foutpercentage van schrijfverzoeken).',
  },
  metrics: {
    noChange: 'geen verandering',
  },
  overview: {
    subtitle: 'Hoe {project} in de periode is gebruikt',
    kpiToggleHint: 'Toont dit cijfer per dag in de grafiek hieronder.',
    topPages: {
      title: 'Toppagina’s',
      empty: 'Geen paginaweergaven in deze periode.',
      page: 'Pagina',
      views: 'Weergaven',
      visits: 'Bezoeken',
      shareOfViews: 'Aandeel in weergaven',
    },
    topEvents: {
      title: 'Topevents',
      empty:
        'Geen benoemde events in deze periode. Events die met <code>track()</code> zijn verstuurd, verschijnen hier.',
      inVisits: 'in {visits}',
    },
    kpis: {
      visits: 'Bezoeken',
      identifiedUsers: 'Geïdentificeerde gebruikers',
      conversions: 'Conversies',
      writeErrorRate: 'Foutpercentage schrijfverzoeken',
    },
    notes: {
      identifiedUsers: 'minstens één keer ingelogd',
      writeErrors: '{failed} van {writes} mislukt',
      shareOfVisits: '{share} van {visits}',
      conversionEvents: '{event} · {share}',
      convertingVisits: '{share} verstuurde {event} · {events}',
    },
    drillDowns: {
      visits: 'Bekijk de bezoeken',
      identifiedVisits: 'Bekijk geïdentificeerde bezoeken',
      convertingVisits: 'Bekijk bezoeken met conversie',
      failingRoutes: 'Bekijk routes met fouten',
    },
    spoken: {
      change: 'verandering',
      better: 'beter',
      worse: 'slechter',
    },
    comparison: {
      dayBefore: 'vs. de dag ervoor',
      previousDays: 'vs. vorige {days} dagen',
      soFarToday: 'vandaag tot nu toe vs. heel gisteren',
      previousFullDays: 'vs. vorige {days} volledige dagen',
      yesterdayUntil: 'vs. gisteren tot {time}',
      previousDaysUntil: 'vs. vorige {days} dagen, tot {time}',
    },
  },
  overviewChart: {
    activityTitle: 'Activiteit per dag',
    dayTitle: 'Activiteit van de dag',
    activitySubject: 'Paginaweergaven en benoemde events',
    subjectInPeriod: '{subject}, {period}',
    previousPeriod: 'Vorige periode',
    day: 'Dag',
    pageViews: 'Paginaweergaven',
    namedEvents: 'Benoemde events',
    metricTitle: '{metric} per dag',
    gaps: {
      noValue: 'geen waarde',
      noWrites: 'geen schrijfverzoeken',
    },
    statistics: {
      noneOnAnyDay: 'elke dag {gap}',
      total: '{total} in totaal',
      range: 'tussen {lowest} en {highest} per dag',
      gapDays: '{gap} op {days}',
    },
    summary: {
      lineChart: 'Lijngrafiek van {days}.',
      series: '{series}: {statistics}.',
      previous: 'Gestippeld: de vorige periode.',
    },
    caption: '{subject} per dag, {period}',
    captionWithPrevious: '{caption}, met de vorige periode',
    columns: {
      comparedWith: 'Vergeleken met',
      previous: '{series} toen',
    },
    point: '{series}, {day}',
  },
  acquisition: {
    subtitle: 'Waar de bezoeken aan {project} vandaan komen',
    paidVisits: 'Betaalde bezoeken',
    footnote:
      'Een advertentieklik wordt herkend aan de klik-id in de URL van de landingspagina. Pyxis bewaart alleen dát die er was, nooit de id zelf, en van een verwijzende site alleen het domein.',
    sources: {
      title: 'Bronnen',
      description:
        'De campagnebron, anders de verwijzende site, van de eerste pagina van elk bezoek',
      empty: 'Geen bezoeken met een bron in deze periode.',
      source: 'Bron',
      medium: 'Medium',
      visits: 'Bezoeken',
    },
    channelChart: {
      title: 'Bezoeken per kanaal',
      description: 'Alle bezoeken per kanaal waarlangs ze binnenkwamen, {period}',
      caption: 'Bezoeken per kanaal per dag, {period}',
      day: 'Dag',
      total: 'Totaal',
    },
    channels: {
      paid: 'Betaald',
      email: 'E-mail',
      social: 'Sociale media',
      campaign: 'Andere campagnes',
      organic: 'Organisch zoeken',
      referral: 'Verwijzing',
      direct: 'Direct',
    },
    directSource: 'Direct',
    adClickSource: '(advertentieklik)',
    topChannel: 'Topkanaal',
    topUnpaidChannel: 'Onbetaald topkanaal',
    shareOfVisits: '{share} van {visits}',
    fromAdClicks: '{visits} via advertentieklikken',
    conversionColumns: {
      conversions: 'Conversies',
      conversionRate: 'Conversieratio',
      converted: '{conversions} geconverteerd',
    },
    campaigns: {
      title: 'Campagnes',
      description:
        'De campagnetag (utm_campaign) van de eerste pagina van elk bezoek, met de bron die hem meebracht; de 20 die de meeste bezoeken opleverden',
      empty: 'In deze periode kwam geen bezoek binnen met een campagnetag.',
      campaign: 'Campagne',
      source: 'Bron',
      visits: 'Bezoeken',
      visitsLinkPurpose: ': bekijk de bezoeken via {source}',
    },
    summary: {
      bars: 'Gestapelde staafgrafiek van {days},',
      range: 'tussen {lowest} en {highest} bezoeken per dag.',
      channels: 'Bezoeken per kanaal: {channels}.',
      channel: '{channel} {visits}',
    },
  },
  devices: {
    types: {
      mobile: 'Mobiel',
      desktop: 'Desktop',
      tablet: 'Tablet',
    },
    other: 'Overig',
    otherCountries: 'Andere landen',
    otherRegions: 'Andere regio’s',
    unknownRegion: 'Onbekend',
    convertedOfVisits: '{converted} van {visits}',
    subtitle: 'Waarmee mensen {project} bezoeken',
    panels: {
      deviceType: 'Apparaattype',
      browser: 'Browser',
      operatingSystem: 'Besturingssysteem',
    },
    columns: {
      country: 'Land',
      region: 'Regio',
      visits: 'Bezoeken',
      share: 'Aandeel',
      conversionRate: 'Conversieratio',
    },
    countries: 'Landen',
    regions: 'Regio’s',
    conversionByDevice: {
      title: 'Conversie per apparaat',
      description: 'Aandeel van de bezoeken die <code/> verstuurden',
    },
    footnote:
      'Apparaat, browser en systeem worden op de server afgeleid uit de user agent van de browser, die daarna wordt weggegooid. Het land en de regio komen van het edgenetwerk, nooit van een opgeslagen IP-adres, en de stad wordt nooit vastgelegd. Oudere bezoeken hebben alleen het land.',
  },
  requests: {
    noResponse: 'Geen antwoord',
    figures: {
      writes: 'Schrijfverzoeken',
      errorRate: 'Foutpercentage schrijfverzoeken',
      slowestRoute: 'Traagste route',
      failedReads: 'Mislukte leesverzoeken',
      failingRoutes: 'Routes met fouten',
    },
    notes: {
      writes: 'POST-, PUT-, PATCH- en DELETE-aanroepen vanuit de browser',
      withNoResponse: '{count} zonder antwoord',
      noFailures: 'Geen fouten in {writes}',
      failed: '{failed} mislukt: {kinds}',
      noFailedRead: 'Geen mislukte leesverzoeken in deze periode',
      mostFailing: 'Meeste fouten: {route}, {failures}',
      noWrites: 'Geen schrijfverzoeken in deze periode',
      slowestMedian: 'mediaan van {route}',
    },
    duration: '{milliseconds} ms',
    routeSummary: {
      reads: '{failedReads} · mediaan {median}',
      writes: '{requests} · {errorShare} fouten · mediaan {median}',
    },
    failureDays: {
      title: 'Fouten per dag',
      description: {
        writes: 'Alle mislukte schrijfverzoeken, naar wat er misging, {period}',
        reads: 'Alle mislukte leesverzoeken, naar wat er misging, {period}',
      },
      classes: {
        clientError: 'Clientfouten (4xx)',
        serverError: 'Serverfouten (5xx)',
        noResponse: 'Geen antwoord',
      },
      day: 'Dag',
      total: 'Totaal',
      caption: 'Fouten per dag naar wat er misging, {period}',
      none: 'Er is in deze periode niets mislukt.',
      summary: {
        bars: 'Gestapelde staafgrafiek van {days},',
        range: 'tussen {lowest} en {highest} fouten per dag.',
        classes: 'Naar wat er misging: {classes}.',
        class: '{label} {count}',
      },
    },
    routeDays: {
      heading: 'Per dag',
      loading: 'De dagen van deze route laden…',
      failed: 'De dagen van deze route konden niet worden geladen.',
      retry: 'Opnieuw proberen',
      unavailable: 'Cijfers per dag vereisen een nieuwere Pyxis-API.',
      none: {
        writes: 'Geen aanroepen van deze route in deze periode.',
        reads: 'Geen mislukte leesverzoeken van deze route in deze periode.',
      },
      quietDays: {
        writes: forms(
          '{count} dag zonder aanroepen staat niet in de lijst.',
          '{count} dagen zonder aanroepen staan niet in de lijst.',
        ),
        reads: forms(
          '{count} dag zonder mislukte leesverzoeken staat niet in de lijst.',
          '{count} dagen zonder mislukte leesverzoeken staan niet in de lijst.',
        ),
      },
      columns: {
        day: 'Dag',
        total: 'Totaal',
        failed: 'Mislukt',
        median: 'Mediaan',
        p95: 'p95',
      },
    },
    page: {
      subtitle: {
        writes: 'Alle schrijfverzoeken van {project}, en hoe ze afliepen',
        reads: 'De leesverzoeken van {project} die mislukten',
      },
      kinds: {
        label: 'Soort verzoek',
        writes: 'Schrijfverzoeken',
        reads: 'Mislukte leesverzoeken',
      },
      readsNeedApi: {
        title: 'Mislukte leesverzoeken vereisen een nieuwere Pyxis-API',
        body: 'Deze API rapporteert alleen schrijfverzoeken. Werk pyxis-api bij om de mislukte GET-aanroepen te tonen; de schrijfverzoeken staan op het tabblad Schrijfverzoeken.',
      },
      empty: {
        reads:
          'Geen mislukte leesverzoeken in deze periode. GET-aanroepen die met trackRequest() zijn verstuurd, verschijnen hier als ze mislukken.',
        readsFromScreen: 'Geen mislukte leesverzoeken vanuit {screen} in deze periode.',
        writesFromScreen: 'Geen schrijfverzoeken vanuit {screen} in deze periode.',
        failing: 'Geen routes met fouten in deze periode.',
        writes:
          'Geen schrijfverzoeken in deze periode. Aanroepen die met trackRequest() zijn verstuurd, verschijnen hier.',
      },
      footnote: {
        ownTab:
          'Mislukte leesverzoeken hebben een eigen tabblad; Bezoeken en de Tijdlijn tellen mislukte lees- en schrijfverzoeken samen.',
        failedRead:
          'Een mislukt leesverzoek is een GET die met trackRequest() is verstuurd en met 400 of hoger antwoordde, of nooit antwoordde. Een site verstuurt zijn leesverzoeken mogelijk alleen als ze mislukken, dus leesverzoeken hebben geen foutpercentage. Bezoeken en de Tijdlijn tellen mislukte lees- en schrijfverzoeken samen.',
        source: 'Alleen het routetemplate wordt bewaard, nooit de waarden uit de URL of de body.',
      },
    },
    filters: {
      label: 'Tonen',
      all: 'Alle routes',
      failingOnly: 'Alleen met fouten',
      fromScreen: 'Vanuit scherm <screen/>',
      clearScreen: 'Schermfilter wissen',
      clear: 'Wissen',
      hint: 'Selecteer een route om de statuscodes, de schermen waar hij misging en de laatste fouten te zien.',
    },
    table: {
      heading: 'Routes',
      columns: {
        route: 'Route',
        total: 'Totaal',
        failed: 'Mislukt',
        outcomes: 'Gelukt · fouten',
        statuses: 'Statuscodes',
        median: 'Mediaan',
        p95: 'p95',
      },
      showDetails: '{route}, details tonen',
      successShare: '{share} ok',
      errorShare: '{share} fouten',
    },
    details: {
      close: 'Sluiten',
      statuses: 'Statuscodes',
      whereItFailed: 'Waar het misging',
      screenFailed: '{failed} mislukt',
      onlyThisScreen: ': toon alleen de verzoeken vanuit dit scherm',
      latestFailures: 'Laatste fouten',
      noFailures: 'Geen fouten in deze periode.',
      failedVisits: 'Bekijk alle bezoeken met een mislukte {method} {route}',
      noErrorCode: 'Geen foutcode',
      openVisit: 'Bezoek {visit} openen',
    },
  },
  properties: {
    otherValues: 'Andere waarden',
  },
  features: {
    subtitle: 'Wat mensen het meest gebruiken in {project}',
    kindLabel: 'Soort functie',
    kinds: {
      events: 'Events',
      screens: 'Schermen',
    },
    search: {
      events: 'Events zoeken',
      screens: 'Schermen zoeken',
      submit: 'Zoeken',
      submitting: 'Zoeken…',
      clear: 'Wissen',
    },
    titles: {
      events: 'Meest gebruikte events',
      screens: 'Meest bezochte schermen',
    },
    nameHeaders: {
      events: 'Event',
      screens: 'Scherm',
    },
    nothingYet: {
      events:
        'Geen benoemde events in deze periode. Events die met track() zijn verstuurd, verschijnen hier.',
      screens: 'Geen paginaweergaven in deze periode.',
    },
    noMatch: 'Niets gevonden voor “{query}”.',
    columns: {
      count: 'Aantal',
      visits: 'Bezoeken',
      trend: 'Trend',
      share: 'Aandeel',
    },
    footnote:
      'Events worden door de site verstuurd met de Pyxis-SDK; open er een om te zien hoe de waarden van de eigenschappen verdeeld zijn. Schermen zijn paginaweergaven gegroepeerd per padtemplate, dus /orders/8213 en /orders/8214 tellen als /orders/:id.',
  },
  propertyBreakdown: {
    toggle: 'Eigenschappen van {event}',
    loading: 'Eigenschappen van {event} laden…',
    failed: 'De eigenschappen van {event} konden niet worden geladen.',
    retry: 'Opnieuw proberen',
    none: '{event} had in deze periode geen eigenschappen.',
    carriedBy: '· meegestuurd door {carriedBy}',
    columns: {
      value: 'Waarde',
      share: 'Aandeel',
      count: 'Aantal',
      visits: 'Bezoeken',
    },
    valuePurpose: ': bekijk de bezoeken waarin {key} gelijk is aan {value}',
  },
  funnel: {
    openedPage: '{path} geopend',
    start: 'Start',
    continued: '{share} ging door',
    dropped: '{count} afgehaakt',
    reachedLastStep: 'Laatste stap bereikt door {reached} van {subjects}',
    noStepToCompare: 'Geen stap om te vergelijken',
    transition: 'Stap {from} → {to}',
    transitionNote: '{from} → {to} · {share} ging door',
    medianTime: 'mediaan {duration} na de vorige stap',
    timeToFinish: 'Mediane tijd tot het einde',
    timeToFinishNote: 'van stap 1 tot stap {last}, voor wie die bereikte',
    page: {
      subtitle: 'Waar mensen doorgaan en waar ze afhaken in {project}',
      countBy: 'Tellen per',
      modes: {
        visit: 'Per bezoek',
        user: 'Per persoon',
      },
      overallConversion: 'Totale conversie',
      biggestDropOff: 'Grootste uitval',
      stepsHeading: 'Funnel',
      modeNotes: {
        visit: 'Per bezoek: een stap telt alleen na de vorige, in hetzelfde bezoek',
        user: 'Per persoon: stappen kunnen over meerdere bezoeken lopen zodra de persoon is geïdentificeerd',
      },
    },
    build: {
      title: 'Bouw een funnel',
      body: 'Een funnel heeft 2 tot 8 stappen, elk een paginapad (<code>*</code> staat voor elke reeks tekens) of een eventnaam. Een stap telt alleen na de stap ervoor. De stappen staan in het adres, dus een bladwijzer bewaart de funnel.',
      example: 'Begin met een voorbeeldfunnel',
    },
    subjects: {
      reachedLink: '{count}, toon wie stap {step} bereikte',
      droppedLink: '{dropped}, toon wie vóór stap {step} afhaakte',
      reached: forms('{subjects} bereikte stap {step}', '{subjects} bereikten stap {step}'),
      dropped: forms(
        '{subjects} bereikte stap {previous} maar nooit stap {step}',
        '{subjects} bereikten stap {previous} maar nooit stap {step}',
      ),
      columns: {
        visit: 'Bezoek',
        person: 'Persoon',
        reachedAt: 'Laatst bereikte stap',
      },
      openVisit: '{visit}, open dit bezoek in de tijdlijn',
      openPerson: '{user}, open de tijdlijn van deze persoon',
      order: 'Nieuwste eerst, 50 per keer.',
      older: 'Oudere tonen',
      newest: 'Terug naar de nieuwste',
      close: 'Lijst sluiten',
      empty: 'Niemand in deze periode.',
    },
  },
  visits: {
    problems: {
      propertyNeedsEvent: 'Een eigenschapsfilter heeft een event nodig.',
      propertyFormat:
        'Een eigenschapsfilter is sleutel=waarde: een sleutel van kleine letters, cijfers en _, en een waarde van 1 tot {max} tekens.',
      country: 'Een land is de tweeletterige code, zoals BR.',
      region: 'Een regio is de land- en regiocode, zoals BR-SP.',
      source: 'Een bron heeft maximaal {max} tekens.',
      campaign: 'Een campagne heeft maximaal {max} tekens.',
      route: 'Een verzoek is een methode en een route, zoals POST /orders/:id.',
    },
    accountLink: '{user}, open de tijdlijn van deze gebruiker',
    shortAccountLink: '{shown}, open de tijdlijn van gebruiker {user}',
    noFailedRequest: 'Geen mislukt verzoek',
    page: {
      subtitle: 'Alle bezoeken aan {project} in de periode, nieuwste eerst',
      footnote:
        'Hoogtepunten zijn de eerste vijf benoemde events, op volgorde. Een mislukt verzoek is een lees- of schrijfverzoek dat met trackRequest() is verstuurd en met 400 of hoger antwoordde, of nooit antwoordde; Verzoeken toont de schrijfverzoeken en de mislukte leesverzoeken op aparte tabbladen.',
      empty: {
        filtered: 'Geen bezoek voldoet aan deze filters in deze periode.',
        all: 'Geen bezoeken in deze periode. Een bezoek verschijnt hier zodra je site het eerste event verstuurt.',
      },
    },
    filters: {
      label: 'Bezoeken filteren',
      toggle: 'Filters',
      toggleActive: 'Filters · {count} actief',
      pages: {
        legend: 'Bezochte pagina’s',
        hint: 'Een bezoek moet elke opgegeven pagina hebben bekeken. Een * staat voor willekeurige tekens, zoals in /blog/*.',
        path: 'Bekeken pagina',
        path2: 'En pagina',
        path3: 'En ook pagina',
      },
      event: 'Met event',
      property: 'Met eigenschap',
      propertyHint: 'sleutel=waarde, op het event hierboven',
      channel: 'Kanaal',
      anyChannel: 'Elk kanaal',
      device: 'Apparaat',
      anyDevice: 'Elk apparaat',
      account: 'Account',
      anyone: 'Iedereen',
      identities: {
        identified: 'Geïdentificeerd',
        anonymous: 'Anoniem',
      },
      country: 'Land',
      countryHint: 'Tweeletterige code',
      region: 'Regio',
      regionHint: 'Land- en regiocode',
      source: 'Bron',
      sourceHint: 'Zoals Acquisitie hem noemt',
      campaign: 'Campagne',
      route: 'Met verzoek',
      routeHint: 'Methode en route',
      failed: 'Met een mislukt verzoek',
      placeholders: {
        path: '/pricing',
        event: 'signup_completed',
        property: 'plan=pro',
        country: 'BR',
        region: 'BR-SP',
        source: 'google',
        campaign: 'spring_sale',
        route: 'POST /orders',
      },
      leftOut: 'Sommige filters zijn weggelaten:',
      apply: 'Filters toepassen',
      applying: 'Toepassen…',
      clear: 'Filters wissen',
      applied: {
        label: 'Toegepaste filters',
        item: '{filter}: <value/>',
        remove: '{filter} verwijderen: {value}',
        removeFlag: '{filter} verwijderen',
        clearAll: 'Alles wissen',
      },
      unapplied: 'Wijzigingen nog niet toegepast',
      undo: 'Ongedaan maken',
    },
    table: {
      heading: 'Bezoeken',
      columns: {
        started: 'Gestart',
        duration: 'Duur',
        entryPage: 'Instappagina',
        pages: 'Pagina’s',
        highlights: 'Hoogtepunten',
        failed: 'Mislukt<hidden>e verzoeken</hidden>',
        device: 'Apparaat',
        channel: 'Kanaal',
        account: 'Account',
      },
      openVisit: '{started}, bezoek {visit} openen',
      channelNote: 'Kanaal: {channel}',
      anonymous: 'Anoniem',
      everyVisit: 'Dat zijn alle bezoeken van deze periode.',
      load: 'Oudere bezoeken laden',
      loading: 'Oudere bezoeken laden…',
      failed: 'Oudere bezoeken konden niet worden geladen. Probeer het opnieuw.',
    },
  },
  timeline: {
    lookupHints: {
      visit: 'Een bezoek-id ziet eruit als 94810767-edf6-4c2b-9a1d-2e3f4a5b6c01.',
      user: 'Een gebruikers-id heeft 1 tot 64 letters, cijfers, koppeltekens of underscores.',
    },
    openedPage: '{path} geopend',
    linkedToUser: 'Bezoek gekoppeld aan de gebruiker',
    visitHeading: 'Bezoek {visit} · {started}',
    userTitle: 'Gebruiker {user}',
    visitTitle: 'Bezoek {visit}',
    duration: {
      hours: '{hours} u {minutes} min',
      minutes: '{minutes} min {seconds} s',
      seconds: '{seconds} s',
    },
    page: {
      subtitle: 'Alles wat één persoon of één bezoek deed in {project}, op volgorde',
      tryPerson: 'Probeer {user}',
    },
    lookUp: {
      title: 'Zoek een persoon of een bezoek op',
      body: 'Typ een gebruikers-id, de id die je site aan identify() doorgeeft, om alle bezoeken van die persoon te zien, of een bezoek-id om één bezoek te zien. Events, paginaweergaven en verzoeken staan in de volgorde waarin ze gebeurden, in de tijdzone van het project.',
      demoPerson: 'Open de tijdlijn van demopersoon {user}',
    },
    notFound: {
      title: 'Geen bezoeken gevonden voor {lookup}',
      body: 'De id is misschien verkeerd getypt, de bezoeken zijn misschien ouder dan de bewaartermijn, of de gegevens van de persoon zijn misschien gewist.',
    },
    filters: {
      label: 'Tonen',
      all: 'Alles',
      pages: 'Paginaweergaven',
      events: 'Events',
      requests: 'Verzoeken',
      errors: 'Alleen fouten',
    },
    search: {
      lookUp: 'Opzoeken',
      kinds: {
        user: 'Een persoon, op gebruikers-id',
        visit: 'Eén bezoek, op bezoek-id',
      },
      ids: {
        user: 'Gebruikers-id',
        visit: 'Bezoek-id',
      },
      submit: 'Tijdlijn tonen',
      pending: 'Opzoeken…',
      rejected: 'Er is niets opgezocht. {hint}',
    },
    older: {
      everyVisit: 'Dat zijn alle bezoeken.',
      load: 'Oudere bezoeken laden',
      loading: 'Oudere bezoeken laden…',
      failed: 'Oudere bezoeken konden niet worden geladen. Probeer het opnieuw.',
    },
    card: {
      allVisitsOf: 'Alle bezoeken van {user}',
      nothingOfThisKind: 'Niets van deze soort in dit bezoek.',
    },
  },
  funnelEditor: {
    heading: 'Stappen',
    open: 'Stappen bewerken',
    close: 'Editor sluiten',
    stepType: 'Type van stap {step}',
    types: {
      page: 'Paginapad',
      event: 'Eventnaam',
    },
    stepValue: {
      page: 'Paginapad van stap {step}',
      event: 'Eventnaam van stap {step}',
    },
    placeholders: {
      page: '/pricing of /blog/*',
      event: 'signup_completed',
    },
    moveUp: 'Stap {step} omhoog',
    moveDown: 'Stap {step} omlaag',
    remove: 'Stap {step} verwijderen',
    removeShort: 'Verwijderen',
    add: 'Stap toevoegen',
    stepCount: '{steps} van {max} stappen, minstens {min}',
    apply: 'Toepassen',
    applying: 'Toepassen…',
    status: {
      ready: 'Pas toe om deze {steps} stappen te tellen.',
      fillIn: 'Vul elke stap in om toe te passen.',
      fix: 'Herstel de gemarkeerde stappen om toe te passen.',
    },
    problems: {
      pathStart: 'Een paginapad begint met "/".',
      pathLength: 'Een paginapad heeft maximaal {max} tekens.',
      eventName:
        'Een eventnaam begint met een kleine letter en bevat alleen kleine letters, cijfers en _, maximaal 64.',
    },
  },
  timeOfDay: {
    title: 'Wanneer bezoeken beginnen',
    description: 'Bezoeken ({period}) per weekdag en uur van hun eerste paginaweergave.',
    summary: 'Drukst: {weekday}, {from} tot {to} ({visits}).',
    summaryEmpty: 'Er is in deze periode geen bezoek begonnen.',
    cell: '{weekday}, {from}: {visits}',
    weekday: 'Weekdag',
    table: 'Bezoeken per weekdag en uur',
    fewer: 'Minder',
    more: 'Meer',
  },
  engagement: {
    entryTitle: 'Waar bezoeken beginnen',
    entryDescription:
      'De pagina’s waarop bezoeken begonnen ({period}), en hoeveel er daarna weggingen.',
    exitTitle: 'Waar bezoeken eindigen',
    exitDescription: 'De laatste pagina die elk bezoek bekeek ({period}).',
    page: 'Pagina',
    visits: 'Bezoeken',
    singlePage: 'Daarna weg',
    lengthTitle: 'Hoe lang bezoeken duren',
    lengthDescription: 'Van het eerste tot het laatste event van elk bezoek ({period}).',
    length: 'Duur',
    share: 'Aandeel',
    medianLabel: 'Mediane bezoekduur',
    singlePageLabel: 'Eén pagina bekeken',
    summary: 'Mediane bezoekduur {median}; {share} van de bezoeken bekeek één pagina.',
    noMedian: 'geen bezoeken',
    noPages: 'Geen paginaweergaven in deze periode.',
    units: {
      seconds: '{count} s',
      minutes: '{count} min',
    },
    lengths: {
      under: 'Minder dan {upper}',
      between: '{lower} tot {upper}',
      atLeast: '{lower} of meer',
    },
  },
  funnelSegments: {
    title: 'De funnel per {by}',
    description: 'Bezoeken ({period}) die elke stap bereikten, per {by}, op één schaal.',
    dimensions: {
      device: 'apparaattype',
      channel: 'kanaal',
    },
    tabs: {
      device: 'Per apparaat',
      channel: 'Per kanaal',
    },
    label: 'Funnel opsplitsen',
    table: 'Funnelstappen per segment',
    segment: 'Segment',
    step: 'Stap {number}',
    conversion: 'Totaal',
    unknown: 'Onbekend',
    empty: 'In deze periode bereikte geen bezoek de eerste stap.',
    userMode:
      'Per persoon zijn apparaat en kanaal niet gedefinieerd: schakel over naar per bezoek om de funnel op te splitsen.',
  },
  exports: {
    download: 'CSV downloaden',
    asCsv: '{label} als CSV',
    overview: {
      daily: 'Activiteit per dag',
      pages: 'Toppagina’s',
      events: 'Topevents',
    },
    acquisition: {
      sources: 'Bronnen',
      campaigns: 'Campagnes',
      channels: 'Bezoeken per kanaal',
    },
    devices: 'Apparaattypen, browsers, systemen, landen en regio’s',
    features: {
      events: 'Events',
      screens: 'Schermen',
    },
    requests: {
      writes: 'Schrijfverzoeken',
      reads: 'Mislukte leesverzoeken',
    },
    visits: 'Nieuwste {visits} bezoeken',
  },
  landing: {
    meta: {
      title: 'Wat converteert en wat mislukt op je site, zonder cookies · Pyxis',
      descriptionFree:
        'Productanalyse die laat zien bij welke funnelstap mensen afhaken en welke verzoeken van je site mislukten, in het dashboard of in Claude. Geen cookies, geen IP, geen persoonsgegevens. Gratis tot {events} events per maand.',
      description:
        'Productanalyse die laat zien bij welke funnelstap mensen afhaken en welke verzoeken van je site mislukten, in het dashboard of in Claude. Geen cookies, geen IP, geen persoonsgegevens. 14 dagen gratis.',
    },
    nav: {
      label: 'Hoofdmenu',
      menu: 'Menu',
      demo: 'Livedemo',
      privacy: 'Privacy',
      claude: 'Vraag het Claude',
      install: 'Installeren',
      pricing: 'Prijzen',
      language: 'Taal',
      signIn: 'Inloggen',
    },
    hero: {
      eyebrow: 'Geen cookies · geen IP · connector voor Claude',
      title:
        'Ontdek wat converteert en wat mislukt op je site, zonder persoonsgegevens te verzamelen.',
      lead: 'Pyxis laat zien bij welke funnelstap mensen afhaken en welke verzoeken van je site bij elk bezoek mislukten. Bekijk het in het dashboard of vraag het aan Claude.',
      openDemo: 'Open de livedemo',
      seePricing: 'Bekijk de prijzen',
      note: 'Zonder registratie. Verzonnen gegevens. Opent direct in het dashboard.',
      startFree: 'Gratis beginnen',
      seePaidPlan: 'Bekijk het betaalde abonnement',
      freeNote:
        'Gratis voor maximaal {events} events per maand op één site, zonder kaart. De demo opent zonder registratie.',
      freeFullNote:
        'Het gratis abonnement is op dit moment vol: registreer je en je account wacht op een plek, of neem het betaalde abonnement.',
      trialNote:
        '14 dagen gratis; je kaart wordt pas op dag 15 belast. De demo opent zonder registratie.',
      claudeTag: 'In de directory van Claude',
      claude: 'Vraag Claude naar je cijfers',
    },
    forWhom: {
      eyebrow: 'Voor wie',
      title: 'Voor wie moet weten waar mensen afhaken',
      lead: 'Hetzelfde dashboard, drie manieren om het te gebruiken.',
      store: {
        title: 'Webshop of online bedrijf',
        body: 'Hoeveel mensen een bestelling beginnen en bij welke stap ze afhaken: winkelwagen, bezorging of betaling. Uitgesplitst naar telefoon en computer, en naar waar het bezoek vandaan kwam.',
        link: 'Bekijk een funnel in de demo',
      },
      agency: {
        title: 'Developer of bureau',
        body: 'Installeer het op de sites van je klanten en geef elke klant alleen toegang tot zijn eigen project, met inloggen via een code per e-mail. Tot 3 sites en 3 personen per account; voor meer een plan op maat.',
        link: 'Bekijk de prijzen',
      },
      product: {
        title: 'Product of SaaS',
        body: 'Welke functies worden gebruikt, waar de registratie mensen verliest en welke routes van je API mislukken, zonder cookie bij je gebruikers.',
        link: 'Bekijk de schermen van het dashboard',
      },
      install:
        'Programmeer je niet? De installatie kan een AI-agent doen, wie je site heeft gebouwd of een bureau. <link>Zo installeer je het</link>',
    },
    preview: {
      label: 'Voorbeeld van het scherm Overzicht',
      range: 'Laatste 30 dagen',
      current: 'Deze periode',
      previous: 'Vorige periode',
      dropOff: 'Grootste uitval in de funnel',
      failingWrite: 'Schrijfverzoek dat het vaakst mislukt',
      failed: '{share} mislukt',
      invented: 'Verzonnen gegevens, net als de livedemo.',
    },
    proof: {
      size: { value: 'minder dan 5 KB', label: 'Pyxis-code, gzipped' },
      dependencies: { value: '0', label: 'runtime-afhankelijkheden' },
      coverage: { value: '100%', label: 'testdekking in alle vier de repository’s' },
      license: { value: 'MIT', label: 'licentie, infrastructuur inbegrepen' },
    },
    never: {
      eyebrow: 'Privacy',
      title: 'Wat nooit wordt opgeslagen',
      raw: 'Een gewone tag zou versturen:',
      kept: 'Wat overblijft:',
      lead: 'Vijf dingen die een gewone analysetag zou versturen, en wat er van elk overblijft. De browser schrapt als eerste; de API controleert opnieuw voordat er iets in de database komt.',
      rows: {
        address: {
          label: 'Pagina-adres',
          where: 'In de browser',
          raw: 'https://shop.example/orders/48213?email=ana@example.com&utm_source=news',
          kept: '/orders/:id · utm_source=news',
        },
        ip: {
          label: 'IP-adres',
          where:
            'Bij de API: land en regio, daarna wordt het adres weggegooid. De stad wordt nooit gelezen.',
          raw: '203.0.113.7',
          kept: 'BR · BR-BA',
        },
        browser: {
          label: 'Browser',
          where: 'Bij de API: ingedeeld, daarna weggegooid',
          raw: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36',
          kept: 'desktop · Chrome · Windows',
        },
        property: {
          label: 'Event-eigenschap',
          where:
            'Bij de API: alles wat eruitziet als een e-mailadres, een telefoonnummer of een fiscaal nummer',
          raw: '"coupon": "ana@example.com"',
          kept: 'weggegooid',
        },
        visit: {
          label: 'Bezoek',
          where: 'In de browser: geen cookie, niets wat twee tabbladen koppelt',
          raw: 'cookie: visitor_id=8f2c41d0…; Max-Age=34560000',
          kept: 'sessionStorage · eindigt met het tabblad',
        },
      },
      foot: 'Een browser die “niet volgen” verstuurt (Global Privacy Control of Do Not Track) schakelt Pyxis uit voordat er iets in de wachtrij komt. Events worden na 13 maanden verwijderd.',
    },
    answers: {
      eyebrow: 'Dashboard',
      title: 'Waar het dashboard antwoord op geeft',
      lead: 'Acht schermen, elk rond één vraag. Elke kaart opent dat scherm in de livedemo.',
      open: 'Openen in de demo',
      agent:
        'Liever vragen? Koppel Pyxis aan Claude, dan leest Claude dezelfde cijfers, zonder iets te wijzigen. <link>Zo koppel je het</link>',
      questions: {
        overview:
          'Hoeveel bezoeken, conversies en mislukte schrijfverzoeken deze periode, vergeleken met de vorige?',
        acquisition: 'Welke kanalen, bronnen en campagnes brengen bezoeken die converteren?',
        devices: 'Van welke apparaten, browsers, landen en regio’s komen bezoeken?',
        features: 'Welke events en schermen worden gebruikt, en hoe is één eigenschap verdeeld?',
        funnel: 'Waar verliest een registratie mensen, en hoe lang duurt elke stap?',
        requests: 'Welke routes van je API mislukken, hoe vaak en hoe traag?',
        visits:
          'Welke bezoeken deden één bepaald ding, gefilterd op pagina, event, kanaal, apparaat of fout?',
        timeline: 'Wat deed één bezoek, of één ingelogde persoon, op volgorde?',
      },
    },
    askClaude: {
      eyebrow: 'MCP-connector',
      title: 'Vraag het Claude in plaats van door grafieken te spitten',
      lead: 'Koppel Pyxis één keer aan Claude en vraag in je eigen woorden: hoe vorige week ging, waar de registratie mensen verliest, welke route begon te falen. Claude leest dezelfde cijfers als het dashboard, via vijftien tools die alleen lezen. Het zit bij het abonnement in, zonder extra kosten.',
      connect: 'In een minuut koppelen',
      directory: {
        badge: 'Nieuw',
        title: 'Pyxis staat in de connectordirectory van Claude',
        body: 'Open de pagina van Pyxis in de directory, kies Connect en log in bij Pyxis in het venster dat opent. Het werkt in Claude op het web, op je computer en op je telefoon.',
        open: 'Openen in de directory van Claude',
        or: 'Of voeg hem toe als custom connector:',
      },
      example: {
        label: 'Een voorbeeldgesprek',
        you: 'Jij',
        claude: 'Claude',
        question: 'Hoe ging vorige week, en waar verliest de registratie mensen?',
        used: 'Claude las:',
        connected: 'MCP gekoppeld',
        replay: 'Opnieuw afspelen',
        answer:
          'Het aantal bezoeken steeg met 12% ten opzichte van de week ervoor, en de conversies met 8%. De registratie verliest de meeste mensen tussen het formulier en de e-mailcode: 41% stopt daar, en op telefoons is dat 52%. Op een computer verliest die stap 23%.',
        invented: 'Verzonnen gesprek en cijfers, net als de livedemo.',
      },
      promises: {
        reads: {
          title: 'Alleen lezen',
          body: 'Elk van de vijftien tools is één leesactie op de Pyxis-API. Claude kan nooit iets wijzigen of verwijderen.',
        },
        revoke: {
          title: 'Jij trekt het in',
          body: 'Elke koppeling staat onder Instellingen, Gekoppelde apps, en stopt zodra je die intrekt. Na 90 dagen zonder gebruik eindigt ze vanzelf.',
        },
        personal: {
          title: 'Niets persoonlijks om af te geven',
          body: 'Events bevatten geen cookie, geen IP-adres en geen user agent, dus wat Claude leest ook niet.',
        },
      },
      foot: 'Wat Claude opvraagt, gaat van de Pyxis-API naar Anthropic, dat het verwerkt volgens zijn eigen voorwaarden. Cursor en andere MCP-clients koppelen met een toegangstoken dat je aanmaakt in Instellingen. <link>De volledige handleiding</link>',
    },
    report: {
      eyebrow: 'Rapporten',
      title: 'Elke maandag de week in je mailbox',
      lead: 'Bezoeken, conversies en mislukte schrijfverzoeken vergeleken met de week ervoor, de toppagina’s en de routes die het vaakst mislukten. Zonder het dashboard te openen en zonder iemand iets te vragen.',
      items: {
        digest: {
          title: 'Aan voor elke admin van het project',
          body: 'Hij komt elke maandag, met de week afgesloten in de tijdzone van je project en in de taal waarin je het dashboard gebruikt. Hij bevat alleen opgetelde cijfers, niets persoonlijks. Ook een week zonder bezoeken komt binnen, met de datum van het laatste event: zo valt een kapotte installatie op zonder dat je het dashboard opent. Uitzetten kan bij Instellingen.',
        },
        csv: {
          title: 'Een CSV van elk scherm',
          body: 'Overzicht, Acquisitie, Apparaten, Functies, Verzoeken en Bezoeken downloaden als CSV wat ze tonen, voor de gekozen periode.',
        },
        export: {
          title: 'Alle events in één bestand',
          body: 'De projectexport bundelt alles wat het project bewaart in een gecomprimeerde CSV. De link komt binnen een paar minuten per e-mail.',
        },
      },
      mail: {
        label: 'Een voorbeeld van de e-mail met de wekelijkse samenvatting',
        kicker: 'Wekelijkse samenvatting',
        visits: 'Bezoeken',
        identifiedUsers: 'Geïdentificeerde gebruikers',
        convertingVisits: 'Bezoeken met conversie',
        failedWrites: 'Mislukte schrijfverzoeken',
        visitsPerDay: 'Bezoeken per dag',
        failingRoutes: 'Routes met fouten',
        openWeek: 'De week openen in het dashboard',
        versusWeekBefore: '{change} vs. de week ervoor ({previous})',
        unchangedFromWeekBefore: 'geen verandering vs. de week ervoor ({previous})',
        weekBeforeOnly: '{previous} de week ervoor',
        shareOfVisits: '{share} van de bezoeken',
        ofWrites: 'van {writes} schrijfverzoeken, {rate}',
        noWrites: 'geen schrijfverzoeken',
        failedOf: '{failed} van {total} mislukt',
      },
    },
    nudge: {
      label: 'Nieuws: Pyxis in Claude',
      badge: 'Nieuw',
      title: 'MCP-toegang is er!',
      tips: {
        agents:
          'Koppel Claude en andere AI-agents aan je Pyxis-cijfers, via het Model Context Protocol.',
        ask: 'Vraag “hoe ging vorige week?” en Claude leest je cijfers.',
        connect: 'In een minuut gekoppeld. Alleen lezen, en je trekt het in wanneer je wilt.',
        privacy: 'Claude ziet dezelfde cijfers als je dashboard, en niets persoonlijks.',
      },
      another: 'Nog een tip',
      cta: 'Bekijk hoe je koppelt',
      dismiss: 'Sluiten',
    },
    install: {
      eyebrow: 'Installeren',
      title: 'Wat een site toevoegt',
      lead: 'Eén pakket en twee regels. Paginaweergaven worden vanzelf vastgelegd; een benoemd event is één aanroep.',
      steps: {
        label: 'Zo begin je, in 3 stappen',
        account: {
          title: 'Maak het account en het project aan',
          bodyFree:
            'In het dashboard, met een e-mailadres en zonder kaart: het gratis abonnement dekt één site. Het project krijgt meteen zijn publieke sleutel.',
          body: 'In het dashboard, met een e-mailadres en een kaart: 14 dagen gratis. Het project krijgt meteen zijn publieke sleutel.',
        },
        install: {
          title: 'Installeer het, zelf of met een AI-agent',
          body: 'Eén pakket en twee regels in de code van de site, of een verzoek aan Claude Code, Cursor of een andere agent.',
        },
        ask: {
          title: 'Vraag het',
          body: 'Open het dashboard, of koppel Claude en vraag hoe de week ging en waar mensen afhaken.',
        },
      },
      copy: 'Kopiëren',
      copied: 'Gekopieerd',
      selected: 'Geselecteerd, druk op Ctrl+C',
      note: 'Sleutels worden uitgegeven door wie de API draait, en er is momenteel geen openbare registratie. Alle vier de repository’s hebben een MIT-licentie, de AWS-infrastructuur (Terraform) inbegrepen.',
      noteFree:
        'Je sleutels horen bij je account: begin hieronder gratis, of draai je eigen Pyxis. Alle vier de repository’s hebben een MIT-licentie, de AWS-infrastructuur (Terraform) inbegrepen.',
      noteOpen:
        'Je sleutels horen bij je account: start hieronder de gratis proefperiode, of draai je eigen Pyxis. Alle vier de repository’s hebben een MIT-licentie, de AWS-infrastructuur (Terraform) inbegrepen.',
      requests:
        'Om te zien welke aanroepen naar je API mislukken, wikkel je je HTTP-client één keer in <code>trackRequest()</code>. <link>Bekijk het voorbeeld</link>',
      agent: {
        title: 'Of vraag het je AI-agent',
        lead: 'Open de repository van de site in Claude Code, in Cursor of in een andere agent en plak:',
        prompt:
          'Installeer Pyxis op deze site volgens https://pyxis-analytics.dev/llms.txt. De publieke sleutel van mijn project is pyxis_pk_… en het endpoint is https://api.pyxis-analytics.dev. Meet de pagina’s en registreer bij elke stap van de bestelling een event, zonder persoonsgegevens.',
        ready:
          'Zodra het account en het project zijn aangemaakt, staat een verzoek als dit klaar op het scherm Installeren van het dashboard, met de sleutel van je project in plaats van <code>pyxis_pk_…</code>.',
        foot: 'De agent volgt de regels in <code>llms.txt</code>: geen persoonsgegevens, geldige eventnamen, het API-adres in de CSP. Koppel daarna Claude aan Pyxis om te controleren dat de eerste events zijn aangekomen.',
        badge: 'Installeer zonder code te schrijven',
        agents: 'Werkt met coding-agents zoals',
        others: 'en andere die llms.txt lezen',
        copyRequest: 'Kopieer het verzoek voor de agent',
        requestCopied: 'Verzoek gekopieerd. Plak het in je agent',
      },
    },
    public: {
      eyebrow: 'Engineering',
      title: 'In het openbaar gebouwd',
      production:
        'Meet sinds oktober 2026 echte sites, <bolsoverde>bolsoverde.com</bolsoverde> en <blog>de blog van de auteur</blog>, op geen van beide met een cookie.',
      items: {
        coverage:
          '100% van de statements, branches, functies en regels gedekt in alle vier de repository’s. De CI faalt daaronder.',
        realServices:
          'Integratietests tegen een echte Postgres, en end-to-endtests in een echte browser met toegankelijkheidscontroles van axe.',
        provenance:
          'De Pyxis-code die sites installeren wordt vanuit GitHub Actions naar npm gepubliceerd, met herkomstbewijs (provenance).',
        decisions: 'Beslissingen vastgelegd als architecture decision records in elke repository.',
        storybook: 'Een Storybook waarin elke story ook een toegankelijkheidstest is.',
      },
      storybook: 'Elk dashboardcomponent en zijn toestanden',
      apiReference: 'Gegenereerd uit de eigen schema’s van de routes',
      playground: 'De echte Pyxis-code, met elke batch die hij zou versturen',
    },
    architecture: {
      eyebrow: 'Architectuur',
      title: 'Hoe de onderdelen samenwerken',
      site: { name: 'Je site', note: 'pyxis-analytics in de browser' },
      edge: { name: 'CloudFront', note: 'Vóór de API' },
      api: { name: 'API', note: 'NestJS op AWS Lambda, in São Paulo' },
      database: {
        name: 'Postgres',
        note: 'Neon, benaderd via een rol die het schema niet kan wijzigen',
      },
      dashboard: { name: 'Dashboard', note: 'Next.js op Vercel, leest de API' },
      retention: { name: 'Dagelijkse taak', note: 'Verwijdert events na 13 maanden' },
      digest: { name: 'Wekelijkse samenvatting', note: 'Elke maandag een e-mail' },
    },
    comparison: {
      eyebrow: 'Vergeleken',
      title: 'Pyxis en een typische tag met cookies',
      aspect: 'Aspect',
      typical: 'Typische tag met cookies',
      table: 'Vergelijkingstabel',
      rows: {
        cookie: {
          aspect: 'Cookie bij je bezoekers',
          pyxis: 'Geen',
          typical: 'Een id-cookie, meestal maanden bewaard',
        },
        address: {
          aspect: 'IP-adres',
          pyxis: 'Gelezen voor land en regio, nooit opgeslagen',
          typical: 'Hangt af van de tool en de instellingen',
        },
        linking: {
          aspect: 'Koppelt de bezoeken van een anonieme bezoeker',
          pyxis: 'Nooit: een bezoek is één tabblad',
          typical: 'Ja, via de cookie',
        },
        thirdParties: {
          aspect: 'Derde partijen',
          pyxis: 'Geen',
          typical: 'Hangt af van de tool; soms een advertentienetwerk',
        },
        agents: {
          aspect: 'Een AI-agent vragen naar de cijfers',
          pyxis: 'Ja: een connector voor Claude, alleen lezend',
          typical: 'Hangt af van de tool',
        },
        failedRequests: {
          aspect: 'Mislukte verzoeken van de site, per bezoek',
          pyxis: 'Ja: route, status en duur',
          typical: 'Hangt af van de tool',
        },
        trackerSize: {
          aspect: 'Grootte van de code die de site laadt, gzipped',
          pyxis: 'Minder dan 5 KB',
          typical: 'Meestal 30 tot 150 KB',
        },
        source: { aspect: 'Broncode', pyxis: 'MIT, op GitHub', typical: 'Verschilt' },
      },
      foot: '“Typisch” beschrijft een gangbare opzet, niet één specifiek product.',
    },
    pricing: {
      eyebrow: 'Prijzen',
      title: 'Eén abonnement, in reais, met alles wat de demo laat zien',
      titleFree: 'Twee abonnementen, in reais, allebei met alles wat de demo laat zien',
      paidName: 'Betaald',
      paidHow:
        'Iedereen begint op het gratis abonnement: neem het betaalde onder Account en facturering, per maand of per jaar, direct afgerekend. Binnen 7 dagen na de eerste betaling kun je herroepen en krijg je het volledige bedrag terug.',
      freeOpenNote:
        'Registreer je met een e-mailadres en zonder kaart: het dashboard opent meteen, op het gratis abonnement.',
      free: {
        name: 'Gratis',
        price: 'R$ 0',
        note: 'Zonder einddatum, zolang de site erin past.',
        start: 'Gratis beginnen',
        included: {
          events: 'Tot {events} events per maand',
          sites: 'Eén site',
          people: 'Alleen jij in het dashboard',
          history: '13 maanden geschiedenis',
          digest: 'Een wekelijkse samenvatting per e-mail',
          agents: 'De Claude-connector (MCP) en toegangstokens voor AI-agents',
          pause: 'Het meten pauzeert bij {events} events tot de 1e, met een e-mail bij 80%',
          card: 'Zonder kaart',
        },
      },
      lead: 'Geen kosten per bezoeker, per functie of per geïdentificeerde persoon. Je bezoekers krijgen nog steeds geen cookie, en er worden geen persoonsgegevens verzameld.',
      period: 'Factuurperiode',
      monthly: 'Maandelijks',
      monthlyLabel: 'Maandelijks, R$ 39 per maand',
      yearly: 'Jaarlijks',
      yearlyLabel: 'Jaarlijks, R$ 390 per jaar, 2 maanden gratis',
      saving: '2 maanden gratis',
      monthlyPrice: 'R$ 39',
      perMonth: 'per maand',
      monthlyNote: 'of R$ 390 per jaar, met 2 maanden gratis',
      yearlyPrice: 'R$ 390',
      perYear: 'per jaar',
      yearlyNote: 'dat is R$ 32,50 per maand',
      approximateMonthly:
        'Prijs in reais: ongeveer {amount} per maand. De betaalpagina toont het exacte bedrag in je eigen valuta.',
      approximateYearly:
        'Prijs in reais: ongeveer {amount} per jaar. De betaalpagina toont het exacte bedrag in je eigen valuta.',
      included: {
        events: 'Tot 100.000 events per maand',
        sites: 'Tot 3 sites',
        people: 'Tot 3 personen in het dashboard',
        history: '13 maanden geschiedenis',
        digest: 'Een wekelijkse samenvatting per e-mail',
        agents: 'De Claude-connector (MCP) en toegangstokens voor AI-agents',
      },
      ask: 'Toegang aanvragen',
      askTitle: 'Mail naar',
      askIntro: 'Vertel in een paar regels:',
      askSite: 'het adres van de site, of sites, tot 3;',
      askVisits: 'ongeveer hoeveel bezoeken die per maand krijgt;',
      askEmail: 'het e-mailadres van wie in het dashboard gaat inloggen.',
      askReply:
        'In het antwoord staat de betaallink. Zodra je bent geabonneerd, krijg je binnen 2 werkdagen toegang tot het dashboard.',
      askMail: 'Openen in mijn e-mailapp',
      mailSubject: 'Ik wil Pyxis gebruiken',
      trial: '14 dagen gratis. Je kaart wordt pas op dag 15 belast, en je kunt altijd opzeggen.',
      invite:
        'Voorlopig is toegang alleen op uitnodiging: je vraagt het aan, krijgt de betaallink en hebt na het abonneren binnen 2 werkdagen toegang tot het dashboard.',
      moreTitle: 'Voor bureaus en developers',
      moreFree:
        'Meet de sites van je klanten: elke klant logt in met zijn eigen e-mailadres en ziet alleen zijn project. Het betaalde abonnement omvat tot 3 sites en 3 personen, jij meegerekend. Voor meer klanten: laat via hello@pyxis-analytics.dev weten hoeveel sites en personen, en we reageren binnen 2 werkdagen met een abonnement op maat.',
      more: 'Meet de sites van je klanten: elke klant logt in met zijn eigen e-mailadres en ziet alleen zijn project. Het abonnement omvat tot 3 sites en 3 personen, jij meegerekend. Voor meer klanten: laat via hello@pyxis-analytics.dev weten hoeveel sites en personen, en we reageren binnen 2 werkdagen met een abonnement op maat.',
      moreLink: 'Vraag naar een abonnement voor bureaus',
      moreSubject: 'Een Pyxis-abonnement voor een bureau',
      start: 'Start je gratis proefperiode',
      openNote:
        'Registreer je met een e-mailadres en een kaart; het dashboard opent zodra het abonnement is bevestigd.',
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Vragen die mensen stellen',
      items: {
        cookies: {
          question: 'Plaatst Pyxis cookies bij mijn bezoekers?',
          answer:
            'Nee. De id van een bezoek staat in de <code>sessionStorage</code> van het tabblad en verdwijnt als het tabblad sluit. Cookies bestaan alleen in het Pyxis-dashboard zelf, voor de mensen die het gebruiken, nooit op de sites die het meet.',
        },
        address: {
          question: 'Slaat het IP-adressen op?',
          answer:
            'Nee. CloudFront geeft de API het land en de regio van elk verzoek door; het adres zelf wordt nergens weggeschreven, en de stad wordt nooit gelezen.',
        },
        people: {
          question: 'Kan het zien dat twee bezoeken van dezelfde persoon komen?',
          answer:
            'Alleen bij mensen die op je site zijn ingelogd, via je eigen interne id, nooit een e-mailadres. Anonieme bezoeken worden nooit gekoppeld: niet tussen tabbladen, niet tussen dagen.',
        },
        optOut: {
          question: 'Kan een bezoeker het meten uitzetten?',
          answer:
            'Global Privacy Control en Do Not Track schakelen Pyxis uit, en een site kan een eigen schakelaar aanbieden met <code>optOut()</code> en <code>trackingStatus()</code>.',
        },
        retention: {
          question: 'Hoe lang worden gegevens bewaard?',
          answer:
            'Dertien maanden; daarna verwijdert een dagelijkse taak ze. De events van een persoon kun je op elk moment vanuit je backend exporteren of wissen.',
        },
        claude: {
          question: 'Kan ik Claude vragen stellen over mijn cijfers?',
          answer:
            'Ja. Pyxis staat in de connectordirectory van Claude: open <code>claude.ai/directory/pyxis</code>, kies Connect en log in bij Pyxis. Voer in Claude Code <code>claude mcp add</code> uit met het adres <code>https://api.pyxis-analytics.dev/mcp</code>. Claude leest dan de cijfers van elk project dat je kunt openen, en wijzigt niets. Je trekt de toegang in onder Instellingen, Gekoppelde apps.',
        },
        use: {
          question: 'Kan ik het op mijn site gebruiken?',
          answer:
            'Ja, op twee manieren: draai Pyxis op je eigen infrastructuur (de code staat met een MIT-licentie op GitHub) of neem een abonnement op de gehoste versie. Vraag daarvoor toegang aan via hello@pyxis-analytics.dev.',
          answerOpen:
            'Ja, op twee manieren: draai Pyxis op je eigen infrastructuur (de code staat met een MIT-licentie op GitHub) of neem een abonnement op de gehoste versie. Iedereen in Brazilië kan zich registreren met een e-mailadres en een kaart: 14 dagen gratis, één keer per klant, en je kunt altijd opzeggen.',
          answerFree:
            'Ja, op twee manieren: draai Pyxis op je eigen infrastructuur (de code staat met een MIT-licentie op GitHub) of gebruik de gehoste versie. Iedereen in Brazilië kan zich registreren met een e-mailadres, zonder kaart, op het gratis abonnement, en het betaalde abonnement nemen als de site meer nodig heeft.',
        },
        agency: {
          question: 'Kan ik Pyxis gebruiken op de sites van mijn klanten?',
          answer:
            'Ja. Maak per site een project aan en voeg de klant toe aan de personen van het project: hij logt in met een code per e-mail en ziet alleen dat project. Het abonnement omvat tot 3 sites en 3 personen, jij meegerekend; voor meer, schrijf naar hello@pyxis-analytics.dev. De <terms>Gebruiksvoorwaarden</terms> regelen dit: als bureau de sites meten van klanten die daarvoor toestemming gaven, is geen doorverkoop.',
          answerFree:
            'Ja. Maak per site een project aan en voeg de klant toe aan de personen van het project: hij logt in met een code per e-mail en ziet alleen dat project. Het gratis abonnement omvat één site en alleen jou; het betaalde abonnement tot 3 sites en 3 personen, jij meegerekend; voor meer, schrijf naar hello@pyxis-analytics.dev. De <terms>Gebruiksvoorwaarden</terms> regelen dit: als bureau de sites meten van klanten die daarvoor toestemming gaven, is geen doorverkoop.',
        },
        noCode: {
          question: 'Ik programmeer niet. Kan ik het installeren?',
          answer:
            'De installatie is een pakket en twee regels in de code van de site, dus iemand moet aan die code zitten: jij met een AI-agent, wie je site heeft gebouwd of een bureau. Daarna vragen het dashboard en Claude geen enkele code meer.',
        },
        aiInstall: {
          question: 'Kan ik een AI vragen het te installeren?',
          answer:
            'Ja. Open de repository van de site in Claude Code, in Cursor of in een andere agent en vraag die Pyxis te installeren volgens <code>https://pyxis-analytics.dev/llms.txt</code>, met de publieke sleutel van je project. De agent voegt het pakket, de <code>init</code>-aanroep en de events toe. Koppel daarna Claude aan Pyxis om te controleren dat de eerste events zijn aangekomen.',
        },
        price: {
          question: 'Wat kost het?',
          answer:
            'R$ 39 per maand of R$ 390 per jaar (twee maanden gratis), met een kaart. Inbegrepen: tot 100.000 events per maand, 3 sites, 3 personen in het dashboard, 13 maanden geschiedenis, de wekelijkse samenvatting en de MCP-server.',
          answerFree:
            'Beide abonnementen hebben alle functies: 13 maanden geschiedenis, de wekelijkse samenvatting en de MCP-server. Het gratis abonnement kost niets en neemt tot {events} events per maand aan, op één site, met alleen jou in het dashboard. Het betaalde abonnement kost R$ 39 per maand of R$ 390 per jaar (twee maanden gratis), met een kaart, direct afgerekend, en neemt tot 100.000 events per maand, 3 sites en 3 personen aan.',
        },
        trial: {
          question: 'Hoe werkt de gratis proefperiode?',
          answer:
            'Je krijgt 14 dagen zonder te betalen, één keer per klant. Je kaart wordt aan het begin gevraagd en pas op dag 15 belast; zeg je vóór die dag op, dan wordt er niets afgeschreven.',
        },
        cancel: {
          question: 'Hoe zeg ik op?',
          answer:
            'Altijd, op twee manieren: zeg op in het facturatieportaal, dan houd je toegang tot het einde van de betaalde periode; of hef het account op in het dashboard, dan eindigt de toegang meteen. Hef je het account op binnen 7 dagen na de eerste betaling, dan krijg je die betaling volledig terug; daarna wordt de al betaalde periode niet terugbetaald. De gegevens van het project worden 30 dagen na het einde van de toegang verwijderd.',
          answerOpen:
            'Altijd, op twee manieren: zeg op in het facturatieportaal, dan houd je toegang tot het einde van de betaalde periode; of hef het account op in het dashboard, dan eindigt de toegang meteen. Hef je het account op binnen 7 dagen na de eerste betaling, dan krijg je die betaling volledig terug; daarna wordt de al betaalde periode niet terugbetaald. De gegevens van het project worden 30 dagen na het einde van de toegang verwijderd. De details staan in de <terms>Gebruiksvoorwaarden</terms>.',
          answerFree:
            'Altijd, in het facturatieportaal: het betaalde abonnement loopt tot het einde van de al betaalde periode, daarna gaat een account met één site en één persoon terug naar het gratis abonnement; een groter account eindigt, en de gegevens worden 30 dagen later verwijderd. Binnen 7 dagen na de eerste betaling kun je herroepen: de betaling wordt volledig terugbetaald en het account gaat terug naar het gratis abonnement als het erin past. Hef je het account op in het dashboard, dan eindigt alles meteen, op elk abonnement. De details staan in de <terms>Gebruiksvoorwaarden</terms>.',
        },
        limit: {
          question: 'Wat als ik over de 100.000 events ga?',
          answer:
            'Je krijgt een e-mail bij 80% en bij 100% van de events van de maand. Bij 150% neemt het account geen events meer aan tot de 1e van de volgende maand, en events die tijdens de pauze worden verstuurd, gaan verloren. Er wordt nooit meer in rekening gebracht dan de prijs.',
        },
        freeLimit: {
          question: 'Wat als ik op het gratis abonnement {events} events haal?',
          answer:
            'Op het gratis abonnement waarschuwt een e-mail bij 80% van de events van de maand. Bij {events} neemt het account geen events meer aan tot de 1e van de volgende maand, en events die tijdens de pauze worden verstuurd, gaan verloren. Met het betaalde abonnement is de pauze binnen een minuut voorbij.',
        },
        payment: {
          question: 'Kan ik met Pix betalen, en krijg ik een factuur?',
          answer:
            'Voorlopig alleen met een kaart; Pix voor het jaarabonnement hangt ervan af of Stripe het inschakelt. Braziliaanse facturen (nota fiscal) worden nog niet uitgegeven: heb je er een nodig, mail dan voordat je je abonneert.',
        },
      },
    },
    story: {
      eyebrow: 'Het verhaal',
      title: 'Waarom Pyxis bestaat',
      body: 'De introductieblogpost legt uit waarom het is gebouwd en wat het nooit opslaat.',
      cta: 'Lees de blogpost',
    },
    measurement: {
      measured: 'Deze pagina wordt door Pyxis zelf gemeten: geen cookie, geen IP-adres opgeslagen.',
      see: 'Bekijk wat er is vastgelegd',
      optOut: 'Meet mijn bezoeken niet',
      off: 'Meten staat uit in deze browser.',
      optIn: 'Weer meten',
      blocked: 'Meten staat uit door “niet volgen” in je browser.',
    },
    recorded: {
      button: 'Wat deze pagina vastlegde',
      title: 'Wat deze pagina vastlegde',
      subtitle: 'Dit bezoek, live. Elke 5 seconden naar Pyxis verstuurd.',
      visit: 'Bezoek {id}… · alleen dit tabblad',
      referrer: 'verwijzer: {host}',
      noReferrer: 'verwijzer: geen',
      empty: 'Nog niets verstuurd. De eerste batch gaat binnen 5 seconden weg.',
      never:
        '<strong>Nooit verstuurd:</strong> je IP-adres, de volledige naam van je browser, een cookie, het volledige adres van de pagina. <strong>Toegevoegd door de server:</strong> land en regio, uit het verzoek; daarna wordt het adres weggegooid.',
      close: 'Sluiten',
    },
    footer: {
      tagline: 'Productanalyse die privacy vooropstelt.',
      product: 'Product',
      pricing: 'Prijzen',
      code: 'Code',
      author: 'Auteur',
      demo: 'Livedemo',
      apiReference: 'API-referentie',
      playground: 'SDK-playground',
      madeBy: 'Gemaakt door Samuel Santana · MIT-licentie',
      contract: 'Contract',
      contractLanguage: 'Niet-bindende vertalingen; de Portugese tekst gaat voor.',
    },
  },
  legal: {
    documentsLabel: 'Contractdocumenten',
    versionsLabel: 'Dit document in andere talen',
    terms: 'Gebruiksvoorwaarden',
    privacy: 'Privacybeleid',
    agreement: 'Verwerkersovereenkomst',
    metaDescription: '{document} van Pyxis (gehost), versie {version}.',
    seller: 'Verkoper: {name} · CPF {taxId} · {address} · {email}',
  },
});
