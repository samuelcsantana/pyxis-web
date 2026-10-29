import { translation } from '../messages';

function forms<const One extends string, const Other extends string>(one: One, other: Other) {
  return { zero: other, one, many: other, other } as const;
}

export const de = translation({
  meta: {
    description:
      'Datenschutzfreundliche Produktanalyse: keine Cookies bei deinen Besuchern, keine personenbezogenen Daten, keine Dritten.',
    screenTitle: '{screen} · {project}',
    demoShareTitle: 'Live-Demo von {app}',
  },
  screens: {
    overview: 'Übersicht',
    funnel: 'Funnel',
    features: 'Funktionen',
    requests: 'Anfragen',
    timeline: 'Zeitleiste',
    visits: 'Besuche',
    devices: 'Geräte',
    acquisition: 'Akquisition',
    loading: '{screen} wird geladen…',
  },
  nav: {
    label: 'Hauptnavigation',
    openMenu: 'Menü öffnen',
    openMenuWithNews: 'Menü öffnen, es gibt Neues',
    arrivals: {
      visits: forms('{count} neuer Besuch', '{count} neue Besuche'),
      conversions: forms('{count} neue Conversion', '{count} neue Conversions'),
      namedEvents: forms('{count} neues Ereignis', '{count} neue Ereignisse'),
      failedRequests: forms(
        '{count} neue fehlgeschlagene Anfrage',
        '{count} neue fehlgeschlagene Anfragen',
      ),
      manyVisits: 'Mehr als 99 neue Besuche',
      manyConversions: 'Mehr als 99 neue Conversions',
      manyNamedEvents: 'Mehr als 99 neue Ereignisse',
      manyFailedRequests: 'Mehr als 99 neue fehlgeschlagene Anfragen',
      refresh: 'Aktualisieren',
      refreshing: 'Wird aktualisiert…',
      onTheSiteNow: '{count} gerade auf der Website',
      moreSinceLastRead: '{count} mehr als beim letzten Mal',
      newVisit: 'Neu',
    },
    closeMenu: 'Menü schließen',
    section: 'Analyse',
    switchProject: 'Projekt wechseln. Aktuelles Projekt:',
    newProject: 'Neues Projekt',
    signOut: 'Abmelden',
    signOutEverywhere: 'Überall abmelden',
    signingOut: 'Wird abgemeldet…',
    signOutFailed: 'Abmelden fehlgeschlagen. Versuch es erneut.',
    projectSection: 'Projekt',
    settings: 'Einstellungen',
    account: 'Konto und Präferenzen',
    language: 'Sprache',
    billing: 'Konto und Abrechnung',
    help: 'Hilfe und Support',
  },
  theme: {
    switch: 'Design wechseln',
    toLight: 'Zum hellen Design wechseln',
    toDark: 'Zum dunklen Design wechseln',
    label: 'Design',
    light: 'Hell',
    dark: 'Dunkel',
    system: 'System',
  },
  periodSelector: {
    label: 'Zeitraum',
    presets: {
      today: 'Heute',
      '7d': '7 Tage',
      '30d': '30 Tage',
    },
    custom: 'Benutzerdefiniert',
    apply: 'Anwenden',
    applying: 'Wird angewendet…',
    previousMonth: 'Vorheriger Monat',
    nextMonth: 'Nächster Monat',
    pickLastDay: 'Ab {day}: Wähle jetzt den letzten Tag.',
    chosenRange: '{range} · {days}',
    dayCount: forms('{count} Tag', '{count} Tage'),
    limit: 'Bis zu {days} Tage, spätestens bis heute.',
  },
  signIn: {
    title: 'Bei Pyxis anmelden',
    intro:
      'Wir schicken dir einen {digits}-stelligen Code per E-Mail. Kein Passwort, das du dir merken musst.',
    sessionEnded: 'Deine Sitzung wurde beendet. Melde dich erneut an, um weiterzumachen.',
    email: 'E-Mail',
    emailPlaceholder: 'du@firma.de',
    demoEmail:
      'Demo-Modus: Es wird keine E-Mail verschickt. Jede E-Mail-Adresse funktioniert, danach nutzt du den Code <code/>.',
    sendCode: 'Code senden',
    sending: 'Wird gesendet…',
    checkTitle: 'Prüf dein Postfach',
    checkBody:
      'Wenn sich diese Adresse bei Pyxis anmelden kann, ist ein Code unterwegs. Er läuft in 10 Minuten ab.',
    change: 'Ändern',
    changeEmail: 'E-Mail-Adresse ändern',
    code: '{digits}-stelliger Code',
    codeSent: 'Code gesendet.',
    demoCode: 'Demo-Modus: Es wird keine E-Mail verschickt. Nutze den Code <code/>.',
    demoFill: '{code} eintragen',
    verify: 'Prüfen und weiter',
    verifying: 'Wird geprüft…',
    resend: 'Neuen Code senden',
    resendIn: 'Neuen Code senden in {time}',
    resent: 'Neuer Code gesendet. Nur der neueste funktioniert.',
    errors: {
      invalidCode:
        'Ungültiger oder abgelaufener Code. Prüf die neueste E-Mail oder fordere einen neuen Code an.',
      rateLimited:
        'Zu viele Versuche aus diesem Netzwerk. Warte ein paar Minuten und versuch es erneut.',
      unreachable: 'Pyxis ist nicht erreichbar. Prüf deine Verbindung und versuch es erneut.',
    },
    validation: {
      emailMissing: 'Gib deine E-Mail-Adresse ein.',
      emailMalformed: 'Gib eine vollständige E-Mail-Adresse ein, z. B. du@firma.de.',
      codeIncomplete: 'Gib alle {digits} Ziffern des Codes ein.',
    },
  },
  signInPage: {
    title: 'Anmelden',
    privacy:
      'Datenschutzfreundliche Produktanalyse · keine Cookies bei deinen Besuchern, keine personenbezogenen Daten',
    noAccount:
      'Noch kein Konto? <plans>Sieh dir die Pläne an</plans> oder <demo>öffne die Demo</demo> mit erfundenen Daten.',
    noCode:
      '<strong>Nach ein paar Minuten noch nichts da?</strong> Sieh im Spam-Ordner nach. Vielleicht gibt es für diese E-Mail-Adresse noch kein Pyxis-Konto.',
    noCodeSupport:
      'Du hast schon ein Konto und der Code kommt nicht an? Schreib von dieser Adresse an <mail>{email}</mail>.',
    seePlans: 'Pläne ansehen',
    startTrial: '14 Tage kostenlos testen',
    startFree: 'Kostenlos starten',
    createAccount: 'Konto erstellen',
  },
  errorPanel: {
    title: 'Diese Daten konnten nicht geladen werden',
    body: 'Das Dashboard konnte diese Daten nicht lesen. Versuch es gleich noch einmal.',
    retry: 'Erneut versuchen',
    detail: 'Fehler-ID {digest}',
  },
  notFound: {
    title: 'Seite nicht gefunden',
    outside: 'Diese Seite gibt es nicht, oder du hast keinen Zugriff auf das Projekt.',
    toProjects: 'Zu deinen Projekten',
    inProject: 'Unter dieser Adresse gibt es in diesem Projekt nichts.',
    toOverview: 'Übersicht öffnen',
  },
  states: {
    loading: 'Wird geladen…',
    emptyPeriod: {
      title: 'Nichts in diesem Zeitraum',
      body: 'In diesem Zeitraum ist kein Ereignis eingegangen.',
      bodyWithLatest: 'In diesem Zeitraum ist kein Ereignis eingegangen. Das letzte kam am {date}.',
      widerPeriod: 'Letzte 30 Tage ansehen',
    },
    noActivity: {
      title: 'Noch keine Ereignisse in diesem Zeitraum',
      install:
        'Installiere das SDK auf deiner Website, dann erscheinen die ersten Seitenaufrufe hier innerhalb einer Minute.',
      guide: 'Die vollständige Einrichtungsanleitung steht in der <readme>README des SDK</readme>.',
    },
    noConversionEvent:
      'Für dieses Projekt ist kein Conversion-Ereignis festgelegt, daher werden keine Conversions angezeigt. Der Betreiber legt eines mit dem API-Befehl <code>project:update</code> und der Option <code>--conversion-event</code> fest.',
    noProjects: {
      title: 'Noch keine Projekte',
      body: '<email/> kann sich anmelden, hat aber noch kein Projekt freigegeben bekommen. Bitte den Betreiber dieser Pyxis-Instanz, <code>admin:grant</code> für deine E-Mail-Adresse auszuführen.',
      create: 'Erstes Projekt anlegen',
      bodyOwner:
        'Dein Konto ist bereit. Lege ein Projekt für deine Website an und installiere dann Pyxis darauf.',
      finish: 'Abo abschließen',
      bodyUnfinished:
        'Dein Konto wartet auf einen Plan. Schließ das Abo ab, um Projekte anzulegen.',
    },
  },
  demo: {
    label: 'Demo-Hinweis',
    notice:
      'Demodaten: erfundene Zahlen für zwei ausgedachte Produkte. Hier werden keine echten Besucher gezeigt.',
    homePage: 'Was ist Pyxis?',
    projectNames: { store: 'Meine Website', docs: 'Demo Docs' },
  },
  shell: {
    skipToContent: 'Zum Inhalt springen',
    privacy: 'Keine Cookies, keine personenbezogenen Daten',
  },
  language: {
    label: 'Sprache',
    current: 'Sprache: {name}',
  },
  settings: {
    title: 'Einstellungen',
    subtitle:
      'Wie {project} eingerichtet ist und welche E-Mails du dazu bekommst. Projekteinstellungen werden über die Kommandozeile geändert.',
    subtitleOwner:
      'Wie {project} eingerichtet ist, seine Schlüssel und die E-Mails, die du dazu bekommst.',
    subtitleMember:
      'Wie {project} eingerichtet ist und welche E-Mails du dazu bekommst. Nur der Inhaber des Kontos ändert das Projekt.',
    project: {
      heading: 'Projekt',
      name: 'Name',
      timezone: 'Zeitzone',
      conversionEvent: 'Conversion-Ereignis',
      noConversionEvent: 'Keines, daher werden keine Conversions angezeigt',
      created: 'Angelegt',
      createdOn: 'Angelegt am {date}',
    },
    activity: {
      heading: 'Aktivität',
      firstEvent: 'Ältestes gespeichertes Ereignis',
      latestEvent: 'Neuestes Ereignis',
      waiting: 'Warten auf das erste Ereignis',
      install:
        'Installiere das SDK mit einem der öffentlichen Schlüssel unten; Seitenaufrufe von den erlaubten Origins erscheinen innerhalb einer Minute.',
    },
    origins: {
      heading: 'Erlaubte Origins',
      note: 'Nur Seiten auf diesen Origins können mit einem öffentlichen Schlüssel Ereignisse senden.',
      none: 'Noch kein Origin erlaubt, daher kann keine Seite Ereignisse senden.',
    },
    keys: {
      heading: 'Schlüssel',
      public: 'Öffentliche Schlüssel',
      publicNote:
        'Ein öffentlicher Schlüssel steht in den Seiten deiner Website und ist daher kein Geheimnis.',
      noLiveKey:
        'Dieses Projekt hat keinen aktiven öffentlichen Schlüssel und misst deshalb nicht.',
      revokedForGood:
        'Ein widerrufener Schlüssel funktioniert nie wieder. Endet der Zugriff eines Kontos, werden seine Schlüssel widerrufen und bleiben es auch, wenn das Konto zurückkommt.',
      createBelow:
        'Lege unten einen öffentlichen Schlüssel an und ersetze damit den alten auf deiner Website.',
      createInSettings:
        'Lege in den <settings>Einstellungen</settings> einen öffentlichen Schlüssel an und ersetze damit den alten auf deiner Website.',
      ownerOnly: 'Nur der Inhaber des Kontos kann einen anlegen.',
      secret: 'Geheime Schlüssel',
      secretNote:
        'Mit einem geheimen Schlüssel kann das Backend deiner Website die Daten einer Person löschen und exportieren. Er wird nur als Hash gespeichert und hier nie angezeigt.',
      noSecretKey: 'Kein aktiver geheimer Schlüssel.',
      created: 'Angelegt am {date}',
    },
    deletionHeld:
      'Die Löschung dieses Projekts ist zurückgestellt: Es kann erst gelöscht werden, wenn Pyxis sie wieder freigibt. Fragen dazu an <mail>hello@pyxis-analytics.dev</mail>.',
    retention: {
      heading: 'Datenaufbewahrung',
      body: 'Ereignisse werden {months} Monate lang aufbewahrt, danach löscht ein täglicher Job sie.',
    },
  },
  projectForm: {
    heading: 'Projekt',
    name: 'Name',
    origins: 'Erlaubte Origins',
    originsNote:
      'Nur Seiten auf diesen Origins können mit einem öffentlichen Schlüssel Ereignisse senden. Gib Schema, Host und Port an, z. B. https://shop.example.com; höchstens {max}.',
    origin: 'Origin {number}',
    originPlaceholder: 'https://shop.example.com',
    conversionEventPlaceholder: 'signup_completed',
    addOrigin: 'Origin hinzufügen',
    removeOrigin: 'Origin {number} entfernen',
    timezone: 'Zeitzone',
    timezoneNote: 'Tage und Uhrzeiten in den Berichten und im Wochenbericht richten sich danach.',
    conversionEvent: 'Conversion-Ereignis',
    conversionEventNote:
      'Optional. Das Ereignis, das als Conversion zählt, z. B. signup_completed.',
    save: 'Änderungen speichern',
    saving: 'Wird gespeichert…',
    saved: 'Gespeichert',
    nameMissing: 'Gib dem Projekt einen Namen.',
    nameTooLong: 'Höchstens {max} Zeichen.',
    originsMissing: 'Gib mindestens einen Origin an.',
    originsInvalid:
      'Gib jeden Origin als Schema, Host und Port an, z. B. https://shop.example.com.',
    originsTooMany: 'Höchstens {max} Origins.',
    timezoneInvalid: 'Wähle eine Zeitzone aus der Liste.',
    conversionEventInvalid:
      'Nur Kleinbuchstaben, Ziffern und Unterstriche, beginnend mit einem Buchstaben.',
    invalid: 'Diese Einstellungen wurden abgelehnt. Prüf die Felder und versuch es erneut.',
    subscriptionRequired:
      'Dieses Konto hat kein laufendes Abo, daher können seine Projekte nicht geändert werden.',
    failed: 'Die Änderungen wurden nicht gespeichert. Versuch es erneut.',
  },
  projectKeys: {
    newPublic: 'Neuer öffentlicher Schlüssel',
    newSecret: 'Neuer geheimer Schlüssel',
    creating: 'Wird angelegt…',
    publicCreated:
      'Öffentlicher Schlüssel angelegt. Bau ihn in deine Seiten ein und widerrufe dann den alten.',
    tooMany:
      'Dieses Projekt hat {max} aktive Schlüssel dieser Art, mehr geht nicht. Widerrufe zuerst einen.',
    revoke: 'Widerrufen',
    revoking: 'Wird widerrufen…',
    revoked: 'Schlüssel widerrufen',
    onlyPublicKey:
      'Der einzige öffentliche Schlüssel bleibt, sonst könnte die Website keine Ereignisse senden.',
    lastPublicKey:
      'Der letzte öffentliche Schlüssel bleibt, sonst könnte die Website keine Ereignisse senden. Lege zuerst einen weiteren an.',
    subscriptionRequired:
      'Dieses Konto hat kein laufendes Abo, daher können seine Schlüssel nicht geändert werden.',
    failed: 'Das hat nicht geklappt. Versuch es erneut.',
    revealHeading: 'Kopiere den geheimen Schlüssel jetzt',
    revealNote:
      'Er wird nur dieses eine Mal angezeigt: Pyxis speichert nur einen Hash davon. Bewahre ihn in der Umgebung deines Backends auf, nie in einer Seite.',
    copy: 'Kopieren',
    copied: 'Kopiert',
    selected: 'Markiert, drück Strg+C',
    done: 'Fertig',
  },
  deleteProject: {
    heading: 'Projekt löschen',
    note: 'Löscht {project}, seine Ereignisse und seine Schlüssel endgültig, und die Website sendet sofort keine Ereignisse mehr. Das lässt sich nicht rückgängig machen.',
    confirm: 'Gib {project} ein, um zu bestätigen',
    delete: 'Projekt endgültig löschen',
    deleting: 'Wird gelöscht…',
    nameMismatch: 'Der eingegebene Name ist nicht der Name dieses Projekts.',
    failed: 'Das Projekt wurde nicht gelöscht. Versuch es erneut.',
    deletionOnHold:
      'In diesem Konto kann nichts gelöscht werden, solange Pyxis die Löschung zurückstellt. Schreib an hello@pyxis-analytics.dev.',
  },
  people: {
    heading: 'Personen',
    noteOwner:
      'Wer dieses Projekt öffnen kann. Jede Person meldet sich mit einem Code an, der an ihre E-Mail-Adresse geht. Im Konto ist Platz für {max} Personen, dich eingeschlossen.',
    note: 'Wer dieses Projekt öffnen kann.',
    owner: 'Inhaber',
    member: 'Mitglied',
    you: '{email} (du)',
    added: 'Hinzugefügt am {date}',
    email: 'E-Mail-Adresse',
    emailPlaceholder: 'ana@example.com',
    add: 'Person hinzufügen',
    adding: 'Wird hinzugefügt…',
    invited:
      '{email} wurde hinzugefügt und hat eine E-Mail mit der Anleitung zur Anmeldung bekommen.',
    alreadyThere: '{email} hat bereits Zugriff auf dieses Projekt.',
    emailMissing: 'Gib die E-Mail-Adresse der Person ein, die du hinzufügen willst.',
    emailInvalid: 'Gib eine E-Mail-Adresse ein, z. B. ana@example.com.',
    limitReached:
      'Das Konto hat bereits seine {max} Personen, dich eingeschlossen. Entferne jemanden, um eine weitere hinzuzufügen.',
    subscriptionRequired:
      'Dieses Konto hat kein laufendes Abo, daher kann niemand hinzugefügt werden.',
    failed: 'Niemand wurde hinzugefügt. Versuch es erneut.',
    remove: 'Entfernen',
    removing: 'Wird entfernt…',
    removed: 'Entfernt',
    ownerStays: 'Der Inhaber behält den Zugriff auf alle Projekte des Kontos.',
    removeFailed: 'Die Person wurde nicht entfernt. Versuch es erneut.',
  },
  account: {
    title: 'Konto und Abrechnung',
    back: 'Zurück zum Dashboard',
    noAccount:
      'Du besitzt kein eigenes Pyxis-Konto. Die Abrechnung der Projekte, die du öffnest, liegt bei ihrem Inhaber.',
    plan: 'Plan',
    planWithInterval: 'Plan: {interval}',
    monthly: 'Monatlich',
    yearly: 'Jährlich',
    status: {
      trialing:
        'Kostenlose Testphase bis {date}. Danach wird der Plan berechnet, außer du kündigst.',
      active: 'Aktiv. Verlängert sich am {date}.',
      past_due:
        'Die letzte Abbuchung ist fehlgeschlagen. Stripe versucht es in den nächsten Tagen erneut; aktualisiere die Karte, damit weiter gemessen wird.',
      ending: 'Gekündigt. Der Zugriff bleibt bis {date} bestehen, ohne weitere Abbuchung.',
      ended:
        'Beendet am {date}. Die Projekte messen nicht mehr, und am {deletion} wird alles gelöscht.',
      incomplete:
        'Das Abo wurde nicht abgeschlossen. Wähle einen Plan, um die kostenlose Testphase zu starten.',
      incompleteFree:
        'Das Abo wurde nicht abgeschlossen. Wähle einen Plan, um es abzuschließen; abgebucht wird ab heute.',
      comped: 'Ein Konto, das Pyxis dir schenkt.',
      free: 'Kostenloser Plan: bis zu {events} Ereignisse im Monat.',
      trialingUndated: 'Kostenlose Testphase. Danach wird der Plan berechnet, außer du kündigst.',
      activeUndated: 'Aktiv.',
      endingUndated:
        'Gekündigt. Der Zugriff bleibt bis zum Ende des Zeitraums bestehen, ohne weitere Abbuchung.',
      endedUndated:
        'Beendet. Die Projekte messen nicht mehr, und dreißig Tage nach dem Ende wird alles gelöscht.',
      endedHeld: 'Beendet am {date}. Die Projekte messen nicht mehr.',
      endedHeldUndated: 'Beendet. Die Projekte messen nicht mehr.',
    },
    usage: 'Ereignisse in diesem Monat',
    usageCount: '{count} von {limit}',
    measured: 'Stand: {date}.',
    notMeasured: 'In diesem Monat noch nicht gezählt.',
    paused:
      'Die Messung ist bis {date} pausiert: Das Konto hat diesen Monat {events} Ereignisse erreicht.',
    limits: 'Bis zu {projects} und {people}, dich eingeschlossen.',
    suspended:
      'Gesperrt am {date}. Seine Projekte messen nicht mehr, und ihre Ansichten bleiben geschlossen, bis die Sperre aufgehoben wird.',
    suspensionReason: 'Grund: {reason}',
    contest: 'Um Einspruch einzulegen, schreib an <mail>hello@pyxis-analytics.dev</mail>.',
    deletionHeld:
      'Die Löschung ist zurückgestellt: In diesem Konto wird nichts gelöscht, bis Pyxis sie wieder freigibt.',
    resubscribe:
      'Schließ vor dem {date} erneut ein Abo ab, um die Daten zu behalten: Es gibt keine neue kostenlose Testphase, der Plan wird ab heute berechnet, und die alten Schlüssel bleiben widerrufen, also braucht jedes Projekt einen neuen öffentlichen Schlüssel.',
    resubscribeUndated:
      'Schließ erneut ein Abo ab, um die Daten zu behalten: Es gibt keine neue kostenlose Testphase, der Plan wird ab heute berechnet, und die alten Schlüssel bleiben widerrufen, also braucht jedes Projekt einen neuen öffentlichen Schlüssel.',
    resubscribeFree:
      'Schließ vor dem {date} erneut ein Abo ab, um die Daten zu behalten: Der Plan wird ab heute berechnet, und die alten Schlüssel bleiben widerrufen, also braucht jedes Projekt einen neuen öffentlichen Schlüssel.',
    resubscribeFreeUndated:
      'Schließ erneut ein Abo ab, um die Daten zu behalten: Der Plan wird ab heute berechnet, und die alten Schlüssel bleiben widerrufen, also braucht jedes Projekt einen neuen öffentlichen Schlüssel.',
    exempt:
      'Die Messung wird bis {date} nicht pausiert, auch wenn das Monatslimit überschritten wird.',
    freePause:
      'Im kostenlosen Plan pausiert die Messung, sobald der Monat {events} Ereignisse erreicht, und läuft am 1. wieder an.',
    paidPlan: {
      heading: 'Der kostenpflichtige Plan',
      offer:
        'Bis zu 100.000 Ereignisse pro Monat, 3 Projekte und 3 Personen, für R$ 39 pro Monat oder R$ 390 pro Jahr. Abgebucht wird heute, und das Abo verlängert sich, bis du kündigst.',
      resumes: 'Die Messung läuft innerhalb einer Minute nach dem Abschluss wieder an.',
    },
    fit: {
      dueBy:
        'Dieses Konto enthält mehr, als der kostenlose Plan erlaubt. Pass es bis {date} an, sonst endet das Konto an diesem Tag:',
      projects: 'Lösche {count}: Der kostenlose Plan erlaubt {limit}.',
      people: 'Entferne {count}: Der kostenlose Plan erlaubt {limit}, dich eingeschlossen.',
      where:
        'Projekte löschst und Personen entfernst du in den Einstellungen des jeweiligen Projekts.',
    },
    afterCancel: {
      backToFree:
        'Wenn du kündigst, kehrt das Konto am Ende des Zeitraums in den kostenlosen Plan zurück, mit seinen Projekten und Daten: bis zu {events} Ereignisse im Monat, darüber pausiert die Messung bis zum 1.',
      backToFreeOn:
        'Am {date} kehrt das Konto in den kostenlosen Plan zurück, mit seinen Projekten und Daten: bis zu {events} Ereignisse im Monat, darüber pausiert die Messung bis zum 1.',
      backToFreeAtTheEnd:
        'Am Ende des Zeitraums kehrt das Konto in den kostenlosen Plan zurück, mit seinen Projekten und Daten: bis zu {events} Ereignisse im Monat, darüber pausiert die Messung bis zum 1.',
      ends: 'Wenn du kündigst, endet das Konto am Ende des Zeitraums. Damit es stattdessen im kostenlosen Plan bleibt, pass es vorher an:',
      endsOn:
        'Am {date} endet das Konto. Damit es stattdessen im kostenlosen Plan bleibt, pass es vorher an:',
      endsAtTheEnd:
        'Am Ende des Zeitraums endet das Konto. Damit es stattdessen im kostenlosen Plan bleibt, pass es vorher an:',
    },
    notice: {
      suspended: 'Dieses Konto ist gesperrt, daher messen seine Projekte nicht mehr.',
      why: 'Grund ansehen',
      paymentFailed:
        'Die letzte Abbuchung ist fehlgeschlagen. Aktualisiere die Karte, damit weiter gemessen wird.',
      ending: 'Dein Abo endet am {date}.',
      ended: 'Dein Abo ist beendet. Am {date} wird alles gelöscht.',
      endedHeld: 'Dein Abo ist beendet. Die Löschung der Daten ist zurückgestellt.',
      paused:
        'Die Messung ist bis {date} pausiert: Das Konto hat seine monatlichen Ereignisse überschritten.',
      freePlanPaused:
        'Die Messung ist pausiert: Das Konto hat diesen Monat die {events} Ereignisse des kostenlosen Plans erreicht. Sie läuft am {date} wieder an, oder innerhalb einer Minute nach dem Abschluss eines Abos.',
      subscribe: 'Jetzt abonnieren',
      nearQuota: 'In diesem Monat hat das Konto {share} seiner Ereignisse verbraucht.',
      open: 'Abrechnung öffnen',
    },
  },
  support: {
    title: 'Hilfe und Support',
    subtitle: 'Sprich mit den Menschen hinter Pyxis oder finde die Antwort in der Dokumentation.',
    copy: 'Kopieren',
    copied: 'Kopiert',
    selected: 'Markiert, drück Strg+C',
    writeHeading: 'An den Support schreiben',
    fromAccount: 'Schreib von {email}, damit wir wissen, um welches Konto es geht.',
    paidReply:
      'Im kostenpflichtigen Tarif bestätigen wir den Eingang deiner Nachricht und antworten innerhalb von {days} Werktagen.',
    freeReply:
      'Im kostenlosen Tarif antworten wir per E-Mail innerhalb von {days} Tagen zu Vertrag, Tarif und Limits, Abrechnung, Kündigung und personenbezogenen Daten. Fragen zu Installation und Nutzung laufen über GitHub.',
    noPersonalData:
      'Um einen Fall zu zeigen, schick die ID des Besuchs, nie personenbezogene Daten deiner Besucher.',
    docsHeading: 'Installation und Nutzung',
    install: 'So installierst du Pyxis',
    installBody: 'Das Snippet mit deinem Schlüssel, Schritt für Schritt.',
    code: 'Dokumentation des Pyxis-Codes',
    codeBody: 'track, identify, trackRequest und alle Optionen.',
    agents: 'Anleitung für KI-Agenten',
    agentsBody: 'Was Claude Code, Cursor oder ein anderer Agent liest, bevor er Pyxis installiert.',
    question: 'Auf GitHub fragen',
    questionBody: 'Fragen sind öffentlich: Füge nie Schlüssel oder personenbezogene Daten ein.',
    securityHeading: 'Eine Sicherheitslücke gefunden?',
    securityBody: 'Melde sie vertraulich über GitHub, nie in einem öffentlichen Issue.',
    securityLink: 'Vertraulich melden',
    accountHeading: 'Support',
  },
  accountSuspended: {
    title: 'Dieses Konto ist gesperrt',
    explanation:
      'Das Konto, zu dem dieses Projekt gehört, ist gesperrt. Seine Ansichten bleiben geschlossen, und seine Websites werden nicht mehr gemessen, bis die Sperre aufgehoben wird.',
    owner:
      'Der Inhaber des Kontos findet den Grund und wie man Einspruch einlegt unter Konto und Abrechnung.',
    open: 'Konto und Abrechnung öffnen',
  },
  projectIngestion: {
    label: 'Projektstatus',
    suspended:
      'Pyxis hat den Empfang von Ereignissen für dieses Projekt am {date} gesperrt, daher misst es nicht. Seine Ansichten bleiben geöffnet.',
    reason: 'Grund: {reason}',
    contest:
      'Um Einspruch einzulegen, schreibt der Inhaber des Kontos an <mail>hello@pyxis-analytics.dev</mail>.',
  },
  billing: {
    subscribeAgain: 'Erneut abonnieren',
    resubscribeUnavailable:
      'Ein erneutes Abo ist im Dashboard noch nicht möglich. Schreib an hello@pyxis-analytics.dev, dann aktivieren wir das Abo wieder.',
    manage: 'Abrechnung verwalten',
    finish: 'Abo abschließen',
    subscribe: 'Jetzt abonnieren',
    opening: 'Stripe wird geöffnet…',
    interval: 'Abrechnungszeitraum',
    monthly: 'Monatlich',
    yearly: 'Jährlich',
    noBillingYet: 'Es gibt noch keine Abrechnung zu verwalten.',
    subscriptionExists: 'Dieses Konto hat bereits ein Abo. Lade die Seite neu.',
    unavailable: 'Die Abrechnung ist gerade nicht verfügbar. Versuch es später erneut.',
    failed: 'Stripe konnte nicht geöffnet werden. Versuch es erneut.',
  },
  exportEvents: {
    heading: 'Ereignisse exportieren',
    note: 'Alle Ereignisse, die dieses Projekt aufbewahrt, in einer komprimierten CSV-Datei. Das dauert ein paar Minuten: Du bekommst eine E-Mail mit dem Link, und die Datei wird {days} Tage lang aufbewahrt. Bis zu {max} Exporte pro Tag.',
    request: 'Ereignisse exportieren',
    requesting: 'Wird angefordert…',
    requested: 'Die Datei wird vorbereitet. Du bekommst eine E-Mail, sobald sie fertig ist.',
    alreadyWaiting: 'Ein Export dieses Projekts wird bereits vorbereitet.',
    open: 'Export öffnen',
    limitReached:
      'Du hast heute {max} Exporte dieses Projekts angefordert, das Maximum pro Tag. Versuch es morgen erneut.',
    unavailable: 'Exporte sind gerade nicht verfügbar. Versuch es später erneut.',
    failed: 'Der Export wurde nicht angefordert. Versuch es erneut.',
  },
  exportPage: {
    title: 'Export',
    subtitle: 'Die Ereignisse von {project} in einer komprimierten CSV-Datei.',
    pending: 'Datei wird vorbereitet…',
    pendingNote:
      'Diese Seite prüft alle paar Sekunden erneut, und du bekommst außerdem eine E-Mail, sobald die Datei fertig ist.',
    done: '{count} Ereignisse, verfügbar bis {date}.',
    download: 'Datei herunterladen',
    downloadNote: 'Jeder Download fordert einen neuen Link an, der fünf Minuten gültig ist.',
    expired:
      'Die Datei wurde am {date} gelöscht, eine Woche nachdem sie fertig war. Fordere in den Einstellungen eine neue an.',
    gone: 'Die Datei ist nicht mehr verfügbar. Fordere in den Einstellungen eine neue an.',
    failed: 'Der Export ist fehlgeschlagen. Fordere in den Einstellungen einen neuen an.',
    settings: 'Einstellungen öffnen',
    requestedAt: 'Angefordert am {date}',
  },
  closeAccount: {
    heading: 'Konto schließen',
    note: 'Kündigt das Abo sofort und widerruft die Schlüssel aller Projekte, sodass die Websites keine Ereignisse mehr senden. Dreißig Tage später wird alles gelöscht; exportiere vorher, was du brauchst.',
    refundNote:
      'Eine erste Zahlung aus den letzten sieben Tagen wird vollständig erstattet. Sonst wird nichts erstattet.',
    freeNote:
      'Widerruft die Schlüssel aller Projekte, sodass die Websites keine Ereignisse mehr senden. Dreißig Tage später wird alles gelöscht; exportiere vorher, was du brauchst.',
    confirm: 'Gib zur Bestätigung deine E-Mail-Adresse ein',
    close: 'Konto endgültig schließen',
    closing: 'Wird geschlossen…',
    closed: 'Das Konto ist geschlossen. Am {date} wird alles gelöscht.',
    refunded: '{amount} wurden auf deine Karte erstattet.',
    confirmationMismatch: 'Das ist nicht deine E-Mail-Adresse, daher wurde nichts geschlossen.',
    alreadyEnded: 'Der Zugriff dieses Kontos ist bereits beendet.',
    unavailable:
      'Stripe konnte das Abo nicht kündigen, daher wurde nichts geschlossen. Versuch es später erneut.',
    failed: 'Das Konto wurde nicht geschlossen. Versuch es erneut.',
  },
  withdrawal: {
    heading: 'Widerruf',
    note: 'Innerhalb von 7 Tagen nach der ersten Zahlung kannst du widerrufen: Das Abo wird sofort gekündigt, diese Zahlung wird vollständig erstattet, und das Konto kehrt mit seinen Projekten und Daten in den kostenlosen Plan zurück.',
    start: 'Abo widerrufen',
    question:
      'Jetzt widerrufen? Das Abo endet sofort, und die erste Zahlung geht zurück auf deine Karte.',
    confirm: 'Widerrufen und Erstattung erhalten',
    keep: 'Abo behalten',
    withdrawing: 'Wird widerrufen…',
    done: 'Du hast das Abo widerrufen. Das Konto ist wieder im kostenlosen Plan.',
    refunded: '{amount} wurden auf deine Karte erstattet.',
    refundByHand:
      'Die automatische Erstattung hat nicht geklappt, daher erstattet Pyxis die erste Zahlung von Hand.',
    fitBy:
      'Das Konto enthält mehr, als der kostenlose Plan erlaubt: Pass es bis {date} an, sonst endet es an diesem Tag.',
    freePlanClosed:
      'Der kostenlose Plan ist gerade geschlossen, daher gibt es keinen Plan, in den das Konto zurückkehren kann. Um die Verlängerung zu stoppen, kündige unter Abrechnung verwalten.',
    noPaidSubscription:
      'Dieses Konto hat kein bezahltes Abo, das widerrufen werden kann. Lade die Seite neu.',
    windowClosed:
      'Die 7 Tage für den Widerruf sind vorbei. Um die Verlängerung zu stoppen, kündige unter Abrechnung verwalten: Der Plan läuft bis zum Ende des Zeitraums.',
    unavailable:
      'Stripe konnte das Abo nicht kündigen, daher hat sich nichts geändert. Versuch es später erneut.',
    failed: 'Der Widerruf hat nicht geklappt. Versuch es erneut.',
  },
  newProject: {
    title: 'Neues Projekt',
    intro:
      'Ein Projekt misst eine Website. Die Adresse der Website wird der einzige Origin, der Ereignisse senden darf; weitere kannst du später in den Einstellungen hinzufügen.',
    name: 'Projektname',
    namePlaceholder: 'Mein Shop',
    site: 'Adresse der Website',
    sitePlaceholder: 'https://shop.example.com',
    timezone: 'Zeitzone',
    conversionEvent: 'Conversion-Ereignis (optional)',
    conversionEventPlaceholder: 'signup_completed',
    create: 'Projekt anlegen',
    creating: 'Wird angelegt…',
    nameMissing: 'Gib dem Projekt einen Namen.',
    nameTooLong: 'Höchstens {max} Zeichen.',
    siteMissing: 'Gib die Adresse der Website ein.',
    siteInvalid: 'Gib die Adresse als Schema und Host an, z. B. https://shop.example.com.',
    timezoneInvalid: 'Wähle eine Zeitzone aus der Liste.',
    conversionEventInvalid:
      'Nur Kleinbuchstaben, Ziffern und Unterstriche, beginnend mit einem Buchstaben.',
    limitReached:
      'Das Konto hat bereits seine {max} Projekte. Lösche eines in seinen Einstellungen, um ein neues anzulegen.',
    subscriptionRequired:
      'Dieses Konto hat kein laufendes Abo und kann daher keine Projekte anlegen.',
    invalid: 'Diese Einstellungen wurden abgelehnt. Prüf die Felder und versuch es erneut.',
    failed: 'Das Projekt wurde nicht angelegt. Versuch es erneut.',
    noAccount: 'Nur der Inhaber eines Kontos mit laufendem Abo legt Projekte an.',
    back: 'Zurück zum Dashboard',
  },
  install: {
    title: 'Installieren',
    subtitle: 'Sende die ersten Ereignisse von {project}.',
    step1: '1. Installiere Pyxis auf deiner Website',
    npm: 'Mit einem Bundler (npm):',
    script: 'Oder in reinem HTML, vor dem schließenden body-Tag:',
    step2: '2. Öffne eine Seite deiner Website',
    step2Note:
      'Seitenaufrufe von {origin} erscheinen hier innerhalb einer Minute. Werbeblocker können sie aufhalten; probier es in einem privaten Fenster.',
    waiting: 'Warten auf das erste Ereignis…',
    waitingNote: 'Diese Seite prüft alle paar Sekunden erneut.',
    received: 'Das erste Ereignis ist da.',
    open: 'Dashboard öffnen',
    copy: 'Kopieren',
    copied: 'Kopiert',
    selected: 'Markiert, drück Strg+C',
    privacy:
      'Pyxis speichert bei deinen Besuchern kein Cookie, keine IP-Adresse und keine personenbezogenen Daten. Erwähne in deiner Datenschutzerklärung, dass die Website ihre Nutzung mit Pyxis misst.',
    how: 'So installierst du',
    yourself: 'Selbst',
    withAgent: 'Mit einem KI-Agenten',
    agent: {
      lead: 'Öffne das Repository der Website in Claude Code, in Cursor oder in einem anderen Coding-Agenten und füge diese Anfrage ein. Sie enthält schon den öffentlichen Schlüssel und die Adresse dieses Projekts.',
      prompt:
        'Installiere Pyxis auf dieser Website nach {recipe}. Der öffentliche Schlüssel des Projekts ist {key}, der Endpoint ist {endpoint} und die Website ist unter {origin}. Miss die Seiten und erfasse bei jeder wichtigen Aktion ein Ereignis, ohne personenbezogene Daten. Liste am Ende die Dateien auf, die du geändert hast, und jedes Ereignis, das du angelegt hast, mit Name und Eigenschaften, damit ich sie prüfen kann.',
      promptAnySite:
        'Installiere Pyxis auf dieser Website nach {recipe}. Der öffentliche Schlüssel des Projekts ist {key} und der Endpoint ist {endpoint}. Miss die Seiten und erfasse bei jeder wichtigen Aktion ein Ereignis, ohne personenbezogene Daten. Liste am Ende die Dateien auf, die du geändert hast, und jedes Ereignis, das du angelegt hast, mit Name und Eigenschaften, damit ich sie prüfen kann.',
      steps: {
        open: 'Öffne das Repository deiner Website in Claude Code, in Cursor oder in einem anderen Coding-Agenten.',
        paste: 'Füge die Anfrage oben ein und lass den Agenten arbeiten.',
        review:
          'Prüfe, was er geändert hat: das Paket, das <code>init</code> und die Ereignisse, die er auflistet. Entferne oder benenne um, was du nicht willst.',
        publish:
          'Veröffentliche die Website und öffne eine ihrer Seiten. Schritt 2, hier unten, zeigt an, wann das erste Ereignis ankommt.',
      },
      changes: {
        title: 'Was der Agent ändert',
        package:
          '<code>package.json</code>: das Paket <code>pyxis-analytics</code>, ohne weitere Abhängigkeit.',
        init: 'Eine Datei, die auf jeder Seite im Browser läuft: das <code>init</code> mit deinem Schlüssel.',
        track:
          'Ein <code>track</code>-Aufruf bei jeder wichtigen Aktion, nachdem sie geklappt hat.',
        csp: 'Die Sicherheitsrichtlinie (CSP), falls die Website eine hat, mit der Adresse der API.',
        only: 'Der Agent ändert nur den Code der Website. Er schreibt nichts in Pyxis.',
      },
      rules:
        'Der Agent folgt den Regeln in <code>llms.txt</code>: keine personenbezogenen Daten, gültige Ereignisnamen, die Adresse der API in der CSP.',
    },
    step3: '3. Mit Claude prüfen (optional)',
    claude: {
      body: 'Verbinde Claude mit Pyxis und frag, ob die ersten Ereignisse angekommen sind. Claude liest dieselben Zahlen wie dieses Dashboard, ändert nie etwas, und du widerrufst die Verbindung jederzeit unter <settings>Einstellungen</settings>.',
      connect:
        'Öffne in Claude <code>claude.ai/directory/pyxis</code> und wähle Connect. Führe in Claude Code diesen Befehl aus und dann /mcp, um dich anzumelden:',
      allow: 'Beim Verbinden bittet dich ein Pyxis-Fenster, die Verbindung zu erlauben.',
    },
    ask: {
      lead: 'Claude schon verbunden? Frag:',
      question: 'Wie viele Besuche hatte {project} heute, und woher kamen sie?',
    },
    phone: {
      copy: 'Adresse kopieren',
      title: 'Die Installation erfolgt am Computer',
      body: 'Pyxis kommt in den Code deiner Website. Öffne diese Seite am Computer, oder kopiere ihre Adresse und schick sie der Person, die sich um die Website kümmert.',
    },
  },
  signUp: {
    title: 'Starte deine kostenlose Testphase',
    intro:
      '{days} Tage kostenlos, danach der Plan deiner Wahl. Keine Abbuchung, wenn du während der Testphase kündigst.',
    oneTrial: 'Eine kostenlose Testphase pro Kunde.',
    plan: 'Plan',
    monthly: 'Monatlich',
    yearly: 'Jährlich',
    email: 'E-Mail',
    emailPlaceholder: 'du@firma.de',
    terms:
      'Ich habe die <link>Nutzungsbedingungen, den Auftragsverarbeitungsvertrag und die Datenschutzerklärung</link> (Version {version}) gelesen und akzeptiere sie.',
    termsMissing: 'Akzeptiere die Bedingungen, um fortzufahren.',
    sendCode: 'Code senden',
    sending: 'Wird gesendet…',
    checkTitle: 'Prüf dein Postfach',
    checkBody: 'Wir haben dir einen {digits}-stelligen Code geschickt. Er läuft in 10 Minuten ab.',
    code: '{digits}-stelliger Code',
    change: 'Ändern',
    changeEmail: 'E-Mail-Adresse ändern',
    verify: 'Weiter',
    verifying: 'Wird geprüft…',
    resend: 'Neuen Code senden',
    resendIn: 'Neuen Code senden in {time}',
    resent: 'Ein neuer Code ist unterwegs.',
    noCode:
      'Nach ein paar Minuten noch nichts da? Sieh im Spam-Ordner nach oder schreib von dieser Adresse an <mail>{email}</mail>.',
    preparing: 'Zahlung wird vorbereitet…',
    invalidCode: 'Dieser Code ist falsch oder abgelaufen. Prüf ihn oder fordere einen neuen an.',
    termsOutdated:
      'Die Bedingungen haben sich geändert, während diese Seite offen war. Lies die neue Version und akzeptiere sie erneut.',
    closed: 'Die Registrierung wurde geschlossen, während diese Seite offen war.',
    rateLimited:
      'Zu viele Versuche aus diesem Netzwerk. Warte ein paar Minuten und versuch es erneut.',
    unreachable: 'Pyxis ist nicht erreichbar. Versuch es erneut.',
    checkoutFailed:
      'Dein Konto ist bereit, aber die Zahlungsseite hat sich nicht geöffnet. Schließ die Zahlung unter Konto und Abrechnung ab.',
    openAccount: 'Konto und Abrechnung öffnen',
    demoCode: 'Das ist die Demo: Der Code lautet <code/>.',
    demoFill: '{code} verwenden',
    haveAccount: 'Du hast schon ein Konto?',
    signIn: 'Anmelden',
    finishTitle: 'Abo abschließen',
    finishBody:
      'Dein Konto wartet auf einen Plan. Wähle einen, um die kostenlose Testphase zu starten.',
    freeTitle: 'Erstelle dein kostenloses Konto',
    freeIntro: 'Kostenlos: bis zu {events} Ereignisse im Monat, auf einer Website. Ohne Karte.',
    fullTitle: 'Erstelle dein Konto',
    fullIntro:
      'Der kostenlose Plan ist gerade voll. Erstelle dein Konto, dann wartet es auf einen Platz, oder abonniere gleich danach den kostenpflichtigen Plan.',
    opening: 'Dein Konto wird geöffnet…',
    waitTitle: 'Der kostenlose Plan ist gerade voll',
    waitBody:
      'Dein Konto ist bereit und wartet auf einen Platz im kostenlosen Plan: Wir schreiben dir, sobald einer frei wird, und es wartet bis zu {days} Tage. Du kannst auch jetzt den kostenpflichtigen Plan abonnieren.',
  },
  signUpPage: {
    title: 'Registrieren',
    closedTitle: 'Die Registrierung ist noch nicht offen',
    closedBody:
      'Pyxis ist derzeit nur auf Einladung verfügbar. Schreib an hello@pyxis-analytics.dev oder probier die Live-Demo aus.',
    demo: 'Live-Demo öffnen',
    home: 'Zurück zur Startseite',
  },
  welcome: {
    activeAgain: 'Dein Abo ist wieder aktiv.',
    nextAgain:
      'Deine Projekte messen wieder, sobald ihre Websites einen neuen öffentlichen Schlüssel verwenden: Lege in den Einstellungen jedes Projekts einen an.',
    title: 'Willkommen bei Pyxis',
    confirming: 'Dein Abo wird bestätigt…',
    confirmingNote:
      'Das dauert ein paar Sekunden, und die Seite prüft von selbst erneut. Dauert es länger, bekommst du eine E-Mail, sobald es erledigt ist.',
    trial: 'Deine kostenlose Testphase hat begonnen. Sie läuft bis {date}.',
    active: 'Dein Abo ist bestätigt.',
    free: 'Dein Konto ist im kostenlosen Plan.',
    freeLimits:
      'Bis zu {events} Ereignisse im Monat, {projects} und {people}, mit allen Funktionen und ohne Karte. Die Messung pausiert, wenn der Monat {pauseAt} Ereignisse erreicht, und läuft am 1. wieder an.',
    fromFreePlan:
      'Das Konto nimmt jetzt bis zu {events} Ereignisse im Monat an, {projects} und {people}. War die Messung pausiert, läuft sie innerhalb einer Minute wieder an.',
    next: 'Lege als Nächstes ein Projekt für deine Website an und installiere Pyxis darauf.',
    create: 'Erstes Projekt anlegen',
    dashboard: 'Dashboard öffnen',
  },
  cityOption: {
    heading: 'Stadt der Besucher',
    label: 'Ungefähre Stadt der Besucher erfassen',
    note: 'Standardmäßig aus. Das Edge-Netzwerk leitet die Stadt aus der IP-Adresse ab, die nicht gespeichert wird, und die Stadt wird nur zusammen mit der Region gespeichert. Schalte sie nur ein, wenn der Datenschutzhinweis deiner Website das sagt: Mit identify wird die Stadt den Personen zugeordnet, die du identifizierst.',
    on: 'An',
    off: 'Aus',
    confirmTitle: 'Stadt ausschalten?',
    confirmBody:
      'Die Stadt wird innerhalb einer Minute nicht mehr gelesen, und die schon erfassten Städte dieses Projekts werden innerhalb von 48 Stunden gelöscht, wenn sie ausgeschaltet bleibt. Das lässt sich nicht rückgängig machen.',
    confirm: 'Ausschalten und löschen',
    keep: 'Eingeschaltet lassen',
    saving: 'Wird gespeichert…',
    saved: 'Gespeichert',
    failed: 'Die Änderung wurde nicht gespeichert. Versuche es noch einmal.',
    subscriptionRequired:
      'Die Änderung wurde nicht gespeichert: Das Konto braucht einen aktiven Tarif.',
    readOnlyOn:
      'Dieses Projekt erfasst die ungefähre Stadt der Besucher. Nur der Kontoinhaber kann das ändern.',
    readOnlyOff:
      'Dieses Projekt erfasst die Stadt der Besucher nicht. Nur der Kontoinhaber kann das ändern.',
  },
  emailPreferences: {
    heading: 'E-Mail',
    weeklyDigest: 'Wochenbericht',
    weeklyDigestNote:
      'Jeden Montag die Woche, die am Sonntag in {timezone} endete: Besuche, Conversions, fehlgeschlagene Schreibzugriffe, Top-Seiten und Ereignisse. Jeder Admin entscheidet selbst.',
    on: 'An',
    off: 'Aus',
    saving: 'Wird gespeichert…',
    saved: 'Gespeichert',
    failed: 'Die Änderung wurde nicht gespeichert. Versuch es erneut.',
  },
  connectedApps: {
    heading: 'Verbundene Apps',
    note: 'Apps, denen du erlaubt hast, die Zahlen deiner Projekte zu lesen. Jede liest nur, und zwar aus allen Projekten, die du öffnen kannst. Widerrufst du sie, stoppt sie sofort; die App bittet dich dann, sie erneut zu verbinden.',
    empty: 'Noch keine Apps verbunden.',
    connected: 'Verbunden',
    lastUsed: 'Zuletzt genutzt',
    connectHeading: 'Pyxis mit Claude verbinden',
    stepOpen: 'Öffne in Claude „Customize“, dann „Connectors“, und wähle „Add custom connector“.',
    stepAddress: 'Nenne ihn Pyxis und füge diese Adresse ein:',
    stepAllow: 'Wähle „Connect“, melde dich im neuen Fenster bei Pyxis an und wähle „Zulassen“.',
    everywhere:
      'Das funktioniert mit Claude im Web, auf deinem Computer und auf deinem Smartphone.',
    claudeCode: 'Führe in Claude Code diesen Befehl aus und dann /mcp, um dich anzumelden:',
  },
  connections: {
    copy: 'Kopieren',
    copied: 'Kopiert',
    selected: 'Markiert, drück Strg+C',
    revoke: 'Widerrufen',
    revoking: 'Wird widerrufen…',
    revoked: 'App getrennt',
    revokeFailed: 'Die App wurde nicht getrennt. Versuch es erneut.',
  },
  sessions: {
    heading: 'Sitzungen',
    note: 'Alle Geräte, auf denen du angemeldet bist. Beendest du eine Sitzung, wird das Gerät bei seiner nächsten Anfrage abgemeldet.',
    thisDevice: 'Dieses Gerät',
    device: '{browser} auf {os}',
    unknownDevice: 'Unbekannter Browser',
    signedIn: 'Angemeldet',
    lastUsed: 'Zuletzt genutzt',
    end: 'Beenden',
    ending: 'Wird beendet…',
    ended: 'Sitzung beendet',
    failed: 'Die Sitzung wurde nicht beendet. Versuch es erneut.',
  },
  accessTokens: {
    heading: 'Zugriffstokens',
    note: 'Damit kann ein KI-Agent oder ein Skript die Zahlen lesen, die du hier siehst, aus allen Projekten, die du öffnen kannst. Ein Token liest nur: Es ändert nie etwas und funktioniert nicht mehr, sobald du es widerrufst.',
    name: 'Name',
    namePlaceholder: 'Claude Code, Cursor…',
    nameMissing: 'Gib dem Token einen Namen, damit du es später wiedererkennst.',
    nameTooLong: 'Höchstens {max} Zeichen.',
    lifetime: 'Läuft ab in',
    lifetime30: '30 Tagen',
    lifetime90: '90 Tagen',
    lifetime365: '1 Jahr',
    create: 'Token erstellen',
    creating: 'Wird erstellt…',
    failed: 'Das Token wurde nicht erstellt. Versuch es erneut.',
    tooMany: 'Du hast {max} Tokens, mehr geht nicht. Widerrufe eines, um ein neues zu erstellen.',
    revealHeading: 'Kopiere dein neues Token jetzt',
    revealNote:
      'Es wird nur dieses eine Mal angezeigt. Wenn du es verlierst, widerrufe es und erstelle ein neues.',
    usage: 'Sende es im Authorization-Header:',
    copy: 'Kopieren',
    copied: 'Kopiert',
    selected: 'Markiert, drück Strg+C',
    done: 'Fertig',
    empty: 'Noch keine Tokens.',
    created: 'Erstellt',
    lastUsed: 'Zuletzt genutzt',
    neverUsed: 'Nie genutzt',
    expires: 'Läuft ab',
    revoke: 'Widerrufen',
    revoking: 'Wird widerrufen…',
    revoked: 'Token widerrufen',
    revokeFailed: 'Das Token wurde nicht widerrufen. Versuch es erneut.',
  },
  connect: {
    title: 'App verbinden',
    heading: '{app} mit Pyxis verbinden?',
    asks: '{app} ({host}) möchte die Zahlen deiner Projekte lesen.',
    signedInAs: 'Angemeldet als {email}',
    accessHeading: 'Was die App darf',
    access:
      'Nur lesen: dieselben Zahlen, die du in diesem Dashboard siehst, aus allen Projekten, die du öffnen kannst. Sie ändert nie etwas.',
    projectsHeading: 'Deine Projekte',
    noProjects:
      'Du hast noch keine Projekte. Später liest die App die Projekte, die du dann öffnen kannst.',
    dataHeading: 'Wohin die Daten gehen',
    dataToCompany:
      'Die Daten, die {app} anfragt, einschließlich deiner E-Mail-Adresse, gehen an {company} in den USA, das sie nach eigenen Bedingungen verarbeitet. Erlaube das nur, wenn du einverstanden bist.',
    dataToApp:
      'Die Daten, die {app} anfragt, einschließlich deiner E-Mail-Adresse, gehen an das Unternehmen dahinter ({host}), das sie nach eigenen Bedingungen verarbeitet. Erlaube das nur, wenn du einverstanden bist.',
    returnHeading: 'Wohin dieses Fenster danach führt',
    returnTo: 'Zurück zu {host}.',
    loopback:
      'Die Antwort geht an ein Programm auf diesem Computer. Erlaube das nur, wenn du die Verbindung gerade eben in {app} auf diesem Computer gestartet hast.',
    notYou: 'Wenn du das nicht gerade eben in {app} gestartet hast, wähle Abbrechen.',
    revokeLater: 'Du kannst die Verbindung jederzeit in den Einstellungen widerrufen.',
    goneHeading: 'Diese Verbindungsanfrage ist beendet',
    back: 'Zurück zum Dashboard',
  },
  consent: {
    allow: 'Zulassen',
    allowing: 'Wird zugelassen…',
    cancel: 'Abbrechen',
    cancelling: 'Wird abgebrochen…',
    leaving: 'Zurück zu {app}…',
    tooMany:
      'Du hast bereits {max} verbundene Apps, mehr geht nicht. Widerrufe eine in den <settings>Einstellungen</settings>, um eine weitere zu verbinden.',
    failed: 'Es wurde nichts gesendet. Versuch es erneut.',
    gone: 'Die Anfrage wurde schon beantwortet, oder es sind mehr als {minutes} Minuten vergangen. Geh zurück zu Claude und verbinde Pyxis erneut.',
  },
  chartPanel: {
    showAs: 'Anzeigen als',
    chart: 'Diagramm',
    table: 'Tabelle',
  },
  visitsLink: {
    purpose: ': Besuche ansehen',
  },
  units: {
    points: '{points} Pp.',
  },
  counts: {
    visit: forms('{count} Besuch', '{count} Besuche'),
    matchingVisit: forms('{count} passender Besuch', '{count} passende Besuche'),
    person: forms('{count} Person', '{count} Personen'),
    project: forms('{count} Projekt', '{count} Projekte'),
    day: forms('{count} Tag', '{count} Tage'),
    page: forms('{count} Seite', '{count} Seiten'),
    event: forms('{count} Ereignis', '{count} Ereignisse'),
    item: forms('{count} Eintrag', '{count} Einträge'),
    write: forms('{count} Schreibzugriff', '{count} Schreibzugriffe'),
    request: forms('{count} Anfrage', '{count} Anfragen'),
    failure: forms('{count} Fehler', '{count} Fehler'),
    failedRead: forms(
      '{count} fehlgeschlagener Lesezugriff',
      '{count} fehlgeschlagene Lesezugriffe',
    ),
    failedRequest: forms('{count} fehlgeschlagene Anfrage', '{count} fehlgeschlagene Anfragen'),
    clientError: forms('{count} Client-Fehler (4xx)', '{count} Client-Fehler (4xx)'),
    serverError: forms('{count} Server-Fehler (5xx)', '{count} Server-Fehler (5xx)'),
    conversionEvent: forms('{count} Conversion-Ereignis', '{count} Conversion-Ereignisse'),
  },
  period: {
    presets: {
      today: 'heute',
      '7d': 'letzte 7 Tage',
      '30d': 'letzte 30 Tage',
    },
    rangeProblems: {
      notADate: 'eine der Datumsangaben ist kein Kalenderdatum',
      inverted: 'er endet, bevor er beginnt',
      future: 'er endet nach heute',
      tooLong: 'er ist länger als {days} Tage',
    },
    rejectedRange:
      'Dieser Zeitraum wurde nicht verwendet: {problem}. Stattdessen werden die letzten {days} Tage angezeigt.',
  },
  glossary: {
    visit:
      'Ein Besuch ist ein Browser-Tab, vom ersten bis zum letzten Ereignis; zwei Tabs werden nie verknüpft.',
    identifiedUser:
      'Ein identifizierter Nutzer ist eine eindeutige Nutzer-ID, die die Website an identify() übergeben hat, meist bei der Anmeldung; ein Besuch ohne sie ist anonym.',
    conversion:
      'Eine Conversion ist ein Besuch, der das Conversion-Ereignis des Projekts mindestens einmal gesendet hat; bei den Conversion-Ereignissen zählt jedes Senden.',
    write: 'Ein Schreibzugriff ist ein POST, PUT, PATCH oder DELETE, gesendet mit trackRequest().',
    failure: 'Ein Fehler ist ein Status ab 400 oder gar keine Antwort.',
    changeTone:
      'Eine Veränderung ist nur dann grün oder rot, wenn der vorherige Zeitraum mindestens {base} gezählt hat und sie {change} oder mehr beträgt ({points} Prozentpunkte bei der Fehlerquote der Schreibzugriffe).',
  },
  metrics: {
    noChange: 'keine Veränderung',
  },
  overview: {
    subtitle: 'Wie {project} im Zeitraum genutzt wurde',
    kpiToggleHint: 'Zeigt diesen Wert pro Tag im Diagramm unten.',
    topPages: {
      title: 'Top-Seiten',
      empty: 'Keine Seitenaufrufe in diesem Zeitraum.',
      page: 'Seite',
      views: 'Aufrufe',
      visits: 'Besuche',
      shareOfViews: 'Anteil an Aufrufen',
    },
    topEvents: {
      title: 'Top-Ereignisse',
      empty:
        'Keine benannten Ereignisse in diesem Zeitraum. Mit <code>track()</code> gesendete Ereignisse erscheinen hier.',
      inVisits: 'verteilt auf {visits}',
    },
    kpis: {
      visits: 'Besuche',
      identifiedUsers: 'Identifizierte Nutzer',
      conversions: 'Conversions',
      writeErrorRate: 'Fehlerquote bei Schreibzugriffen',
    },
    notes: {
      identifiedUsers: 'mindestens einmal angemeldet',
      writeErrors: '{failed} fehlgeschlagen · {writes} insgesamt',
      shareOfVisits: '{share} · {visits} insgesamt',
      conversionEvents: '{event} · {share}',
      convertingVisits: '{share} sendeten {event} · {events}',
    },
    drillDowns: {
      visits: 'Besuche ansehen',
      identifiedVisits: 'Identifizierte Besuche ansehen',
      convertingVisits: 'Besuche mit Conversion ansehen',
      failingRoutes: 'Fehlerhafte Routen ansehen',
    },
    spoken: {
      change: 'Veränderung',
      better: 'besser',
      worse: 'schlechter',
    },
    comparison: {
      dayBefore: 'ggü. dem Vortag',
      previousDays: 'ggü. den {days} Tagen davor',
      soFarToday: 'heute bisher ggü. dem ganzen gestrigen Tag',
      previousFullDays: 'ggü. den {days} vollen Tagen davor',
      yesterdayUntil: 'ggü. gestern bis {time}',
      previousDaysUntil: 'ggü. den {days} Tagen davor, jeweils bis {time}',
    },
    comparisonFiltered: {
      dayBefore: 'ggü. dem Vortag, gleiche Filter',
      previousDays: 'ggü. den {days} Tagen davor, gleiche Filter',
      soFarToday: 'heute bisher ggü. dem ganzen gestrigen Tag, gleiche Filter',
      previousFullDays: 'ggü. den {days} vollen Tagen davor, gleiche Filter',
      yesterdayUntil: 'ggü. gestern, gleiche Filter, bis {time}',
      previousDaysUntil: 'ggü. den {days} Tagen davor, gleiche Filter, jeweils bis {time}',
    },
  },
  rowFilter: {
    add: 'Nach {value} filtern',
    title: 'Alle Ansichten nach {value} filtern',
    remove: 'Filter {value} entfernen',
  },
  propertySummary: {
    median: 'Median',
    middleHalf: 'Mittlere Hälfte',
    range: '{low} bis {high}',
    splitBy: 'Aufteilen nach',
    noSplit: 'Nicht aufteilen',
    loading: 'Median von {key} wird gelesen…',
    failed: 'Der Median von {key} konnte nicht gelesen werden.',
    otherValues: 'Andere Werte',
    columns: {
      value: 'Wert',
      median: 'Median',
      middleHalf: 'Mittlere Hälfte',
      events: 'Ereignisse',
    },
  },
  dashboardFilters: {
    label: 'Filter',
    removeAll: 'Filter entfernen',
    newsPaused: 'Neue Ereignisse sind pausiert, solange Filter aktiv sind.',
    empty: {
      title: 'Keine Besuche entsprechen diesen Filtern',
      body: 'Nichts in {period} erfüllt alle Filter oben. Entferne einen davon oder alle.',
    },
    periodFiltered: '{period}, gefiltert nach {filters}',
  },
  overviewChart: {
    activityTitle: 'Aktivität pro Tag',
    dayTitle: 'Aktivität des Tages',
    activitySubject: 'Seitenaufrufe und benannte Ereignisse',
    subjectInPeriod: '{subject}, {period}',
    previousPeriod: 'Vorheriger Zeitraum',
    day: 'Tag',
    pageViews: 'Seitenaufrufe',
    namedEvents: 'Benannte Ereignisse',
    metricTitle: '{metric} pro Tag',
    gaps: {
      noValue: 'kein Wert',
      noWrites: 'keine Schreibzugriffe',
    },
    statistics: {
      noneOnAnyDay: 'an allen Tagen {gap}',
      total: '{total} insgesamt',
      range: 'zwischen {lowest} und {highest} pro Tag',
      gapDays: '{gap} für {days}',
    },
    summary: {
      lineChart: 'Liniendiagramm über {days}.',
      series: '{series}: {statistics}.',
      previous: 'Gestrichelt: der vorherige Zeitraum.',
    },
    caption: '{subject} pro Tag, {period}',
    captionWithPrevious: '{caption}, mit dem vorherigen Zeitraum',
    columns: {
      comparedWith: 'Verglichen mit',
      previous: '{series} davor',
    },
    point: '{series}, {day}',
  },
  acquisition: {
    subtitle: 'Woher die Besuche von {project} kommen',
    paidVisits: 'Bezahlte Besuche',
    footnote:
      'Ein Anzeigenklick wird an der Klick-ID in der Einstiegs-URL erkannt. Pyxis speichert nur, dass sie vorhanden war, nie die ID selbst, und von einer verweisenden Website nur die Domain.',
    sources: {
      title: 'Quellen',
      description:
        'Die Kampagnenquelle, sonst die verweisende Website, der ersten Seite jedes Besuchs',
      empty: 'Keine Besuche mit Quelle in diesem Zeitraum.',
      source: 'Quelle',
      medium: 'Medium',
      visits: 'Besuche',
    },
    channelChart: {
      title: 'Besuche nach Kanal',
      description: 'Alle Besuche nach dem Kanal, über den sie kamen, {period}',
      caption: 'Besuche nach Kanal pro Tag, {period}',
      day: 'Tag',
      total: 'Gesamt',
    },
    channels: {
      paid: 'Bezahlt',
      email: 'E-Mail',
      social: 'Social Media',
      campaign: 'Andere Kampagnen',
      organic: 'Organische Suche',
      referral: 'Verweis',
      direct: 'Direkt',
    },
    directSource: 'Direkt',
    adClickSource: '(Anzeigenklick)',
    topChannel: 'Stärkster Kanal',
    topUnpaidChannel: 'Stärkster unbezahlter Kanal',
    shareOfVisits: '{share} · {visits} insgesamt',
    fromAdClicks: '{visits} über Anzeigenklicks',
    conversionColumns: {
      conversions: 'Conversions',
      conversionRate: 'Conversion-Rate',
      converted: '{conversions} konvertiert',
    },
    campaigns: {
      title: 'Kampagnen',
      description:
        'Der Kampagnenparameter (utm_campaign) der ersten Seite jedes Besuchs, mit der Quelle, die ihn mitbrachte; die 20 mit den meisten Besuchen',
      empty: 'In diesem Zeitraum kam kein Besuch mit Kampagnenparameter.',
      campaign: 'Kampagne',
      source: 'Quelle',
      visits: 'Besuche',
      visitsLinkPurpose: ': Besuche von {source} ansehen',
    },
    summary: {
      bars: 'Gestapeltes Balkendiagramm über {days},',
      range: 'zwischen {lowest} und {highest} Besuchen pro Tag.',
      channels: 'Besuche nach Kanal: {channels}.',
      channel: '{channel} {visits}',
    },
  },
  devices: {
    types: {
      mobile: 'Smartphone',
      desktop: 'Desktop',
      tablet: 'Tablet',
    },
    other: 'Sonstige',
    otherCountries: 'Andere Länder',
    otherRegions: 'Andere Regionen',
    unknownRegion: 'Unbekannt',
    convertedOfVisits: '{converted} konvertiert · {visits} insgesamt',
    subtitle: 'Womit Menschen {project} nutzen',
    panels: {
      deviceType: 'Gerätetyp',
      browser: 'Browser',
      operatingSystem: 'Betriebssystem',
    },
    columns: {
      country: 'Land',
      region: 'Region',
      visits: 'Besuche',
      share: 'Anteil',
      conversionRate: 'Conversion-Rate',
    },
    countries: 'Länder',
    regions: 'Regionen',
    conversionByDevice: {
      title: 'Conversion nach Gerät',
      description: 'Anteil der Besuche, die <code/> gesendet haben',
    },
    footnote:
      'Gerät, Browser und System werden auf dem Server aus dem User-Agent des Browsers ermittelt, der danach verworfen wird. Land und Region stammen aus dem Edge-Netzwerk, nie aus einer gespeicherten IP-Adresse; die ungefähre Stadt wird nur in einem Projekt erfasst, dessen Inhaber sie in den Einstellungen eingeschaltet hat. Ältere Besuche haben nur das Land.',
  },
  requests: {
    noResponse: 'Keine Antwort',
    figures: {
      writes: 'Schreibzugriffe',
      errorRate: 'Fehlerquote bei Schreibzugriffen',
      slowestRoute: 'Langsamste Route',
      failedReads: 'Fehlgeschlagene Lesezugriffe',
      failingRoutes: 'Fehlerhafte Routen',
    },
    notes: {
      writes: 'POST-, PUT-, PATCH- und DELETE-Aufrufe aus dem Browser',
      withNoResponse: '{count} ohne Antwort',
      noFailures: '{writes}, keiner fehlgeschlagen',
      failed: '{failed} fehlgeschlagen: {kinds}',
      noFailedRead: 'Kein Lesezugriff ist in diesem Zeitraum fehlgeschlagen',
      mostFailing: 'Am häufigsten: {route}, {failures}',
      noWrites: 'Keine Schreibzugriffe in diesem Zeitraum',
      slowestMedian: 'Median von {route}',
    },
    duration: '{milliseconds} ms',
    routeSummary: {
      reads: '{failedReads} · Median {median}',
      writes: '{requests} · {errorShare} Fehler · Median {median}',
    },
    failureDays: {
      title: 'Fehler pro Tag',
      description: {
        writes: 'Alle fehlgeschlagenen Schreibzugriffe, nach Fehlerart, {period}',
        reads: 'Alle fehlgeschlagenen Lesezugriffe, nach Fehlerart, {period}',
      },
      classes: {
        clientError: 'Client-Fehler (4xx)',
        serverError: 'Server-Fehler (5xx)',
        noResponse: 'Keine Antwort',
      },
      day: 'Tag',
      total: 'Gesamt',
      caption: 'Fehler pro Tag nach Fehlerart, {period}',
      none: 'In diesem Zeitraum ist nichts fehlgeschlagen.',
      summary: {
        bars: 'Gestapeltes Balkendiagramm über {days},',
        range: 'zwischen {lowest} und {highest} Fehlern pro Tag.',
        classes: 'Nach Fehlerart: {classes}.',
        class: '{label} {count}',
      },
    },
    routeDays: {
      heading: 'Tag für Tag',
      loading: 'Die Tage dieser Route werden geladen…',
      failed: 'Die Tage dieser Route konnten nicht geladen werden.',
      retry: 'Erneut versuchen',
      unavailable: 'Für die tageweise Ansicht ist eine neuere Pyxis-API nötig.',
      none: {
        writes: 'Keine Aufrufe dieser Route in diesem Zeitraum.',
        reads: 'Keine fehlgeschlagenen Lesezugriffe auf diese Route in diesem Zeitraum.',
      },
      quietDays: {
        writes: forms(
          '{count} Tag ohne Aufruf wird nicht aufgeführt.',
          '{count} Tage ohne Aufruf werden nicht aufgeführt.',
        ),
        reads: forms(
          '{count} Tag ohne fehlgeschlagenen Lesezugriff wird nicht aufgeführt.',
          '{count} Tage ohne fehlgeschlagenen Lesezugriff werden nicht aufgeführt.',
        ),
      },
      columns: {
        day: 'Tag',
        total: 'Gesamt',
        failed: 'Fehlgeschlagen',
        median: 'Median',
        p95: 'p95',
      },
    },
    page: {
      subtitle: {
        writes: 'Alle Schreibzugriffe von {project} und wie sie ausgingen',
        reads: 'Die fehlgeschlagenen Lesezugriffe von {project}',
      },
      kinds: {
        label: 'Art der Anfrage',
        writes: 'Schreibzugriffe',
        reads: 'Lesefehler',
      },
      readsNeedApi: {
        title: 'Für fehlgeschlagene Lesezugriffe ist eine neuere Pyxis-API nötig',
        body: 'Diese API meldet nur Schreibzugriffe. Aktualisiere pyxis-api, um die fehlgeschlagenen GET-Aufrufe aufzulisten; die Schreibzugriffe findest du im Tab Schreibzugriffe.',
      },
      empty: {
        reads:
          'Kein Lesezugriff ist in diesem Zeitraum fehlgeschlagen. Mit trackRequest() gesendete GET-Aufrufe erscheinen hier, wenn sie fehlschlagen.',
        readsFromScreen: 'Keine fehlgeschlagenen Lesezugriffe aus {screen} in diesem Zeitraum.',
        writesFromScreen: 'Keine Schreibzugriffe aus {screen} in diesem Zeitraum.',
        failing: 'Keine Route ist in diesem Zeitraum fehlgeschlagen.',
        writes:
          'Keine Schreibzugriffe in diesem Zeitraum. Mit trackRequest() gesendete Aufrufe erscheinen hier.',
      },
      footnote: {
        ownTab:
          'Fehlgeschlagene Lesezugriffe haben einen eigenen Tab; Besuche und Zeitleiste zählen fehlgeschlagene Lese- und Schreibzugriffe zusammen.',
        failedRead:
          'Ein fehlgeschlagener Lesezugriff ist ein mit trackRequest() gesendetes GET, das mit 400 oder höher oder gar nicht geantwortet hat. Eine Website sendet ihre Lesezugriffe eventuell nur, wenn sie fehlschlagen, daher gibt es für Lesezugriffe keine Fehlerquote. Besuche und Zeitleiste zählen fehlgeschlagene Lese- und Schreibzugriffe zusammen.',
        source:
          'Gespeichert wird nur das Routen-Template, nie die Werte aus der URL oder der Body.',
      },
    },
    filters: {
      label: 'Anzeigen',
      all: 'Alle Routen',
      failingOnly: 'Nur fehlerhafte',
      fromScreen: 'Aus Ansicht <screen/>',
      clearScreen: 'Ansichtsfilter entfernen',
      clear: 'Entfernen',
      hint: 'Wähle eine Route, um ihre Statuscodes, die Ansichten, in denen sie fehlschlug, und ihre letzten Fehler zu sehen.',
    },
    table: {
      heading: 'Routen',
      columns: {
        route: 'Route',
        total: 'Gesamt',
        failed: 'Fehlgeschlagen',
        outcomes: 'Erfolg · Fehler',
        statuses: 'Statuscodes',
        median: 'Median',
        p95: 'p95',
      },
      showDetails: '{route}, Details anzeigen',
      successShare: '{share} ok',
      errorShare: '{share} Fehler',
    },
    details: {
      close: 'Schließen',
      statuses: 'Statuscodes',
      whereItFailed: 'Wo es fehlschlug',
      screenFailed: '{failed} fehlgeschlagen',
      onlyThisScreen: ': nur die Anfragen aus dieser Ansicht anzeigen',
      latestFailures: 'Letzte Fehler',
      noFailures: 'Keine Fehler in diesem Zeitraum.',
      failedVisits: 'Alle Besuche mit fehlgeschlagenem {method} {route} ansehen',
      noErrorCode: 'Kein Fehlercode',
      openVisit: 'Besuch {visit} öffnen',
    },
  },
  properties: {
    otherValues: 'Andere Werte',
  },
  features: {
    subtitle: 'Was in {project} am meisten genutzt wird',
    kindLabel: 'Art der Funktion',
    kinds: {
      events: 'Ereignisse',
      screens: 'Ansichten',
    },
    search: {
      events: 'Ereignisse suchen',
      screens: 'Ansichten suchen',
      submit: 'Suchen',
      submitting: 'Wird gesucht…',
      clear: 'Leeren',
    },
    titles: {
      events: 'Meistgenutzte Ereignisse',
      screens: 'Meistbesuchte Ansichten',
    },
    nameHeaders: {
      events: 'Ereignis',
      screens: 'Ansicht',
    },
    nothingYet: {
      events:
        'Keine benannten Ereignisse in diesem Zeitraum. Mit track() gesendete Ereignisse erscheinen hier.',
      screens: 'Keine Seitenaufrufe in diesem Zeitraum.',
    },
    noMatch: 'Keine Treffer für „{query}“.',
    columns: {
      count: 'Anzahl',
      visits: 'Besuche',
      trend: 'Trend',
      share: 'Anteil',
    },
    footnote:
      'Ereignisse sendet die Website mit dem Pyxis-SDK; öffne eines, um zu sehen, wie sich seine Eigenschaftswerte verteilen. Ansichten sind Seitenaufrufe, gruppiert nach Pfad-Template, sodass /orders/8213 und /orders/8214 als /orders/:id zählen.',
  },
  propertyBreakdown: {
    toggle: 'Eigenschaften von {event}',
    loading: 'Die Eigenschaften von {event} werden geladen…',
    failed: 'Die Eigenschaften von {event} konnten nicht geladen werden.',
    retry: 'Erneut versuchen',
    none: '{event} hatte in diesem Zeitraum keine Eigenschaften.',
    carriedBy: '· {carriedBy} mit dieser Eigenschaft',
    columns: {
      value: 'Wert',
      share: 'Anteil',
      count: 'Anzahl',
      visits: 'Besuche',
    },
    valuePurpose: ': Besuche ansehen, bei denen {key} gleich {value} ist',
  },
  funnel: {
    openedPage: '{path} geöffnet',
    start: 'Start',
    continued: '{share} machten weiter',
    dropped: '{count} abgesprungen',
    reachedLastStep: 'Letzten Schritt erreicht: {reached} · {subjects} insgesamt',
    noStepToCompare: 'Kein Schritt zum Vergleichen',
    transition: 'Schritt {from} → {to}',
    transitionNote: '{from} → {to} · {share} machten weiter',
    medianTime: 'Median {duration} nach dem vorherigen Schritt',
    timeToFinish: 'Mediane Zeit bis zum Abschluss',
    timeToFinishNote: 'von Schritt 1 bis Schritt {last}, für alle, die ihn erreicht haben',
    page: {
      subtitle: 'Wo Menschen in {project} weitermachen und wo sie abspringen',
      countBy: 'Zählen nach',
      modes: {
        visit: 'Pro Besuch',
        user: 'Pro Person',
      },
      overallConversion: 'Gesamt-Conversion',
      biggestDropOff: 'Größter Absprung',
      stepsHeading: 'Funnel',
      modeNotes: {
        visit: 'Pro Besuch: Ein Schritt zählt nur nach dem vorherigen, im selben Besuch',
        user: 'Pro Person: Schritte können sich über mehrere Besuche erstrecken, sobald die Person identifiziert ist',
      },
    },
    build: {
      title: 'Funnel erstellen',
      body: 'Ein Funnel hat 2 bis 8 Schritte, jeder ein Seitenpfad (<code>*</code> steht für beliebige Zeichen) oder ein Ereignisname. Ein Schritt zählt nur nach dem vorherigen. Die Schritte stehen in der Adresse, ein Lesezeichen speichert also den Funnel.',
      example: 'Mit einem Beispiel-Funnel starten',
    },
    subjects: {
      reachedLink: '{count}, alle auflisten, die Schritt {step} erreicht haben',
      droppedLink: '{dropped}, alle auflisten, die vor Schritt {step} ausgestiegen sind',
      reached: forms(
        '{subjects} hat Schritt {step} erreicht',
        '{subjects} haben Schritt {step} erreicht',
      ),
      dropped: forms(
        '{subjects} hat Schritt {previous} erreicht, aber nie Schritt {step}',
        '{subjects} haben Schritt {previous} erreicht, aber nie Schritt {step}',
      ),
      columns: {
        visit: 'Besuch',
        person: 'Person',
        reachedAt: 'Letzter erreichter Schritt',
      },
      openVisit: '{visit}, diesen Besuch in der Zeitleiste öffnen',
      openPerson: '{user}, Zeitleiste dieser Person öffnen',
      order: 'Neueste zuerst, jeweils 50.',
      older: 'Ältere anzeigen',
      newest: 'Zurück zu den neuesten',
      close: 'Liste schließen',
      empty: 'Niemand in diesem Zeitraum.',
    },
  },
  visits: {
    problems: {
      propertyNeedsEvent: 'Ein Eigenschaftsfilter braucht ein Ereignis.',
      propertyFormat:
        'Ein Eigenschaftsfilter hat die Form Schlüssel=Wert: ein Schlüssel aus Kleinbuchstaben, Ziffern und _ und ein Wert mit 1 bis {max} Zeichen.',
      country: 'Ein Land wird mit seinem zweistelligen Code angegeben, z. B. BR.',
      region: 'Eine Region wird mit Länder- und Regionscode angegeben, z. B. BR-SP.',
      city: 'Eine Stadt hat höchstens {max} Zeichen.',
      source: 'Eine Quelle hat höchstens {max} Zeichen.',
      campaign: 'Eine Kampagne hat höchstens {max} Zeichen.',
      route: 'Eine Anfrage besteht aus Methode und Route, z. B. POST /orders/:id.',
    },
    accountLink: '{user}, Zeitleiste dieses Nutzers öffnen',
    shortAccountLink: '{shown}, Zeitleiste des Nutzers {user} öffnen',
    noFailedRequest: 'Keine fehlgeschlagene Anfrage',
    page: {
      subtitle: 'Alle Besuche von {project} im Zeitraum, neueste zuerst',
      footnote:
        'Highlights sind die ersten fünf benannten Ereignisse eines Besuchs, in ihrer Reihenfolge. Eine fehlgeschlagene Anfrage ist ein mit trackRequest() gesendeter Lese- oder Schreibzugriff, der mit 400 oder höher oder gar nicht geantwortet hat; Anfragen listet die Schreibzugriffe und die fehlgeschlagenen Lesezugriffe in getrennten Tabs.',
      empty: {
        filtered: 'Kein Besuch passt in diesem Zeitraum zu diesen Filtern.',
        all: 'Keine Besuche in diesem Zeitraum. Ein Besuch erscheint hier, sobald deine Website ihr erstes Ereignis sendet.',
      },
    },
    filters: {
      label: 'Besuche filtern',
      toggle: 'Filter',
      toggleActive: 'Filter · {count} aktiv',
      pages: {
        legend: 'Besuchte Seiten',
        hint: 'Ein Besuch muss jede angegebene Seite aufgerufen haben. Ein * steht für beliebige Zeichen, z. B. /blog/*.',
        path: 'Aufgerufene Seite',
        path2: 'Und Seite',
        path3: 'Und außerdem Seite',
      },
      event: 'Mit Ereignis',
      property: 'Mit Eigenschaft',
      propertyHint: 'Schlüssel=Wert, beim Ereignis oben',
      channel: 'Kanal',
      anyChannel: 'Jeder Kanal',
      device: 'Gerät',
      anyDevice: 'Jedes Gerät',
      browser: 'Browser',
      anyBrowser: 'Jeder Browser',
      os: 'System',
      anySystem: 'Jedes System',
      account: 'Konto',
      anyone: 'Alle',
      identities: {
        identified: 'Identifiziert',
        anonymous: 'Anonym',
      },
      country: 'Land',
      countryHint: 'Zweistelliger Code',
      region: 'Region',
      regionHint: 'Länder- und Regionscode',
      city: 'Stadt',
      cityHint: 'Genauer Name, mit der Region',
      source: 'Quelle',
      sourceHint: 'Wie in Akquisition benannt',
      campaign: 'Kampagne',
      route: 'Mit Anfrage',
      routeHint: 'Methode und Route',
      failed: 'Mit fehlgeschlagener Anfrage',
      placeholders: {
        path: '/pricing',
        event: 'signup_completed',
        property: 'plan=pro',
        country: 'BR',
        region: 'BR-SP',
        city: 'Campinas',
        source: 'google',
        campaign: 'spring_sale',
        route: 'POST /orders',
      },
      leftOut: 'Einige Filter wurden ausgelassen:',
      apply: 'Filter anwenden',
      applying: 'Wird angewendet…',
      clear: 'Filter entfernen',
      applied: {
        label: 'Aktive Filter',
        item: '{filter}: <value/>',
        remove: '{filter} entfernen: {value}',
        removeFlag: '{filter} entfernen',
        clearAll: 'Alle entfernen',
      },
      unapplied: 'Änderungen noch nicht angewendet',
      undo: 'Rückgängig',
    },
    table: {
      heading: 'Besuche',
      columns: {
        started: 'Beginn',
        duration: 'Dauer',
        entryPage: 'Einstiegsseite',
        pages: 'Seiten',
        highlights: 'Highlights',
        failed: 'Fehlgeschlagene<hidden> Anfragen</hidden>',
        device: 'Gerät',
        channel: 'Kanal',
        account: 'Konto',
      },
      openVisit: '{started}, Besuch {visit} öffnen',
      channelNote: 'Kanal: {channel}',
      anonymous: 'Anonym',
      everyVisit: 'Das sind alle Besuche dieses Zeitraums.',
      load: 'Ältere Besuche laden',
      loading: 'Ältere Besuche werden geladen…',
      failed: 'Ältere Besuche konnten nicht geladen werden. Versuch es erneut.',
    },
  },
  timeline: {
    lookupHints: {
      visit: 'Eine Besuchs-ID sieht so aus: 94810767-edf6-4c2b-9a1d-2e3f4a5b6c01.',
      user: 'Eine Nutzer-ID hat 1 bis 64 Buchstaben, Ziffern, Bindestriche oder Unterstriche.',
    },
    openedPage: '{path} geöffnet',
    linkedToUser: 'Besuch mit dem Nutzer verknüpft',
    visitHeading: 'Besuch {visit} · {started}',
    userTitle: 'Nutzer {user}',
    visitTitle: 'Besuch {visit}',
    duration: {
      hours: '{hours} h {minutes} min',
      minutes: '{minutes} min {seconds} s',
      seconds: '{seconds} s',
    },
    page: {
      subtitle: 'Alles, was eine Person oder ein Besuch in {project} getan hat, der Reihe nach',
      tryPerson: '{user} ausprobieren',
    },
    lookUp: {
      title: 'Person oder Besuch nachschlagen',
      body: 'Gib eine Nutzer-ID ein, die deine Website an identify() übergibt, um alle Besuche dieser Person zu sehen, oder eine Besuchs-ID für einen einzelnen Besuch. Ereignisse, Seitenaufrufe und Anfragen erscheinen in der Reihenfolge, in der sie passiert sind, in der Zeitzone des Projekts.',
      demoPerson: 'Zeitleiste der Demo-Person {user} öffnen',
    },
    notFound: {
      title: 'Keine Besuche für {lookup} gefunden',
      body: 'Vielleicht ist die ID falsch geschrieben, die Besuche sind älter als die Aufbewahrungsfrist, oder die Daten der Person wurden gelöscht.',
    },
    filters: {
      label: 'Anzeigen',
      all: 'Alles',
      pages: 'Seitenaufrufe',
      events: 'Ereignisse',
      requests: 'Anfragen',
      errors: 'Nur Fehler',
    },
    search: {
      lookUp: 'Nachschlagen',
      kinds: {
        user: 'Eine Person, per Nutzer-ID',
        visit: 'Ein Besuch, per Besuchs-ID',
      },
      ids: {
        user: 'Nutzer-ID',
        visit: 'Besuchs-ID',
      },
      submit: 'Zeitleiste anzeigen',
      pending: 'Wird gesucht…',
      rejected: 'Es wurde nichts nachgeschlagen. {hint}',
    },
    older: {
      everyVisit: 'Das sind alle Besuche.',
      load: 'Ältere Besuche laden',
      loading: 'Ältere Besuche werden geladen…',
      failed: 'Ältere Besuche konnten nicht geladen werden. Versuch es erneut.',
    },
    card: {
      allVisitsOf: 'Alle Besuche von {user}',
      nothingOfThisKind: 'Nichts dieser Art in diesem Besuch.',
    },
  },
  funnelEditor: {
    heading: 'Schritte',
    open: 'Schritte bearbeiten',
    close: 'Editor schließen',
    stepType: 'Typ von Schritt {step}',
    types: {
      page: 'Seitenpfad',
      event: 'Ereignisname',
    },
    stepValue: {
      page: 'Seitenpfad von Schritt {step}',
      event: 'Ereignisname von Schritt {step}',
    },
    placeholders: {
      page: '/pricing oder /blog/*',
      event: 'signup_completed',
    },
    moveUp: 'Schritt {step} nach oben',
    moveDown: 'Schritt {step} nach unten',
    remove: 'Schritt {step} entfernen',
    removeShort: 'Entfernen',
    add: 'Schritt hinzufügen',
    stepCount: '{steps} von {max} Schritten, mindestens {min}',
    apply: 'Anwenden',
    applying: 'Wird angewendet…',
    status: {
      ready: 'Anwenden, um diese {steps} Schritte zu zählen.',
      fillIn: 'Fülle alle Schritte aus, um sie anzuwenden.',
      fix: 'Korrigiere die markierten Schritte, um sie anzuwenden.',
    },
    problems: {
      pathStart: 'Ein Seitenpfad beginnt mit „/“.',
      pathLength: 'Ein Seitenpfad hat höchstens {max} Zeichen.',
      eventName:
        'Ein Ereignisname beginnt mit einem Kleinbuchstaben und enthält nur Kleinbuchstaben, Ziffern und _, höchstens 64.',
    },
  },
  timeOfDay: {
    title: 'Wann Besuche beginnen',
    description: 'Besuche nach Wochentag und Uhrzeit ihres ersten Seitenaufrufs, {period}.',
    summary: 'Am meisten los: {weekday}, {from} bis {to} ({visits}).',
    summaryEmpty: 'In diesem Zeitraum hat kein Besuch begonnen.',
    cell: '{weekday}, {from}: {visits}',
    weekday: 'Wochentag',
    table: 'Besuche nach Wochentag und Uhrzeit',
    fewer: 'Weniger',
    more: 'Mehr',
  },
  engagement: {
    entryTitle: 'Wo Besuche beginnen',
    entryDescription:
      'Die Seiten, auf denen Besuche begannen, und wie viele danach gingen, {period}.',
    exitTitle: 'Wo Besuche enden',
    exitDescription: 'Die letzte Seite, die jeder Besuch aufgerufen hat, {period}.',
    page: 'Seite',
    visits: 'Besuche',
    singlePage: 'Danach gegangen',
    lengthTitle: 'Wie lange Besuche dauern',
    lengthDescription: 'Vom ersten bis zum letzten Ereignis jedes Besuchs, {period}.',
    length: 'Dauer',
    share: 'Anteil',
    medianLabel: 'Besuchsdauer (Median)',
    singlePageLabel: 'Eine Seite aufgerufen',
    summary:
      'Besuchsdauer (Median): {median}; {share} der Besuche haben nur eine Seite aufgerufen.',
    noMedian: 'keine Besuche',
    noPages: 'Kein Seitenaufruf in diesem Zeitraum.',
    units: {
      seconds: '{count} s',
      minutes: '{count} min',
    },
    lengths: {
      under: 'Unter {upper}',
      between: '{lower} bis {upper}',
      atLeast: '{lower} oder mehr',
    },
  },
  funnelSegments: {
    title: 'Der Funnel nach {by}',
    description:
      'Besuche, die jeden Schritt erreicht haben, nach {by}, auf einer gemeinsamen Skala, {period}.',
    dimensions: {
      device: 'Gerätetyp',
      channel: 'Kanal',
    },
    tabs: {
      device: 'Nach Gerät',
      channel: 'Nach Kanal',
    },
    label: 'Funnel aufteilen',
    table: 'Funnel-Schritte pro Segment',
    segment: 'Segment',
    step: 'Schritt {number}',
    conversion: 'Gesamt',
    unknown: 'Unbekannt',
    empty: 'In diesem Zeitraum hat kein Besuch den ersten Schritt erreicht.',
    userMode:
      'Pro Person sind Gerät und Kanal nicht eindeutig: Wechsle zu „Pro Besuch“, um den Funnel aufzuteilen.',
  },
  exports: {
    download: 'CSV herunterladen',
    asCsv: '{label} als CSV',
    overview: {
      daily: 'Aktivität pro Tag',
      pages: 'Top-Seiten',
      events: 'Top-Ereignisse',
    },
    acquisition: {
      sources: 'Quellen',
      campaigns: 'Kampagnen',
      channels: 'Besuche nach Kanal',
    },
    devices: 'Gerätetypen, Browser, Systeme, Länder und Regionen',
    features: {
      events: 'Ereignisse',
      screens: 'Ansichten',
    },
    requests: {
      writes: 'Schreibzugriffe',
      reads: 'Fehlgeschlagene Lesezugriffe',
    },
    visits: 'Die neuesten {visits} Besuche',
  },
  landing: {
    meta: {
      title: 'Was auf deiner Website konvertiert und was fehlschlägt, ohne Cookies · Pyxis',
      descriptionFree:
        'Produktanalyse, die zeigt, bei welchem Funnel-Schritt Menschen aufhören und welche Anfragen deiner Website fehlgeschlagen sind, im Dashboard oder in Claude. Ohne Cookies, ohne IP, ohne personenbezogene Daten. Kostenlos bis zu {events} Ereignisse im Monat.',
      description:
        'Produktanalyse, die zeigt, bei welchem Funnel-Schritt Menschen aufhören und welche Anfragen deiner Website fehlgeschlagen sind, im Dashboard oder in Claude. Ohne Cookies, ohne IP, ohne personenbezogene Daten. 14 Tage kostenlos.',
    },
    nav: {
      label: 'Hauptmenü',
      menu: 'Menü',
      demo: 'Live-Demo',
      privacy: 'Datenschutz',
      claude: 'Claude fragen',
      install: 'Installation',
      pricing: 'Preise',
      language: 'Sprache',
      signIn: 'Anmelden',
    },
    hero: {
      eyebrow: 'Ohne Cookies · ohne IP · Connector für Claude',
      title:
        'Finde heraus, was auf deiner Website konvertiert und was fehlschlägt, ohne personenbezogene Daten zu erheben.',
      lead: 'Pyxis zeigt, bei welchem Schritt im Funnel Menschen aufhören und welche Anfragen deiner Website bei jedem Besuch fehlgeschlagen sind. Sieh es dir im Dashboard an oder frag Claude.',
      openDemo: 'Live-Demo öffnen',
      seePricing: 'Preise ansehen',
      note: 'Ohne Registrierung. Erfundene Daten. Öffnet direkt das Dashboard.',
      startFree: 'Kostenlos starten',
      seePaidPlan: 'Kostenpflichtigen Plan ansehen',
      freeNote:
        'Kostenlos bis zu {events} Ereignisse im Monat auf einer Website, ohne Karte. Die Demo öffnet ohne Registrierung.',
      freeFullNote:
        'Der kostenlose Plan ist gerade voll: Registriere dich, dann wartet dein Konto auf einen Platz, oder abonniere den kostenpflichtigen Plan.',
      trialNote:
        '14 Tage kostenlos; die Karte wird erst am 15. Tag belastet. Die Demo öffnet ohne Registrierung.',
      claudeTag: 'Im Verzeichnis von Claude',
      claude: 'Frag Claude nach deinen Zahlen',
    },
    forWhom: {
      eyebrow: 'Für wen',
      title: 'Für alle, die wissen müssen, wo Menschen aufhören',
      lead: 'Dasselbe Dashboard, drei Arten, es zu nutzen.',
      store: {
        title: 'Onlineshop oder Onlinegeschäft',
        body: 'Wie viele Menschen eine Bestellung beginnen und bei welchem Schritt sie aufgeben: Warenkorb, Versand oder Zahlung. Getrennt nach Smartphone und Computer und nach der Herkunft des Besuchs.',
        link: 'Einen Funnel in der Demo ansehen',
      },
      agency: {
        title: 'Entwickler oder Agentur',
        body: 'Installiere es auf den Websites deiner Kunden und gib jedem Kunden nur Zugriff auf sein eigenes Projekt, mit Anmeldung per Code an die E-Mail. Bis zu 3 Websites und 3 Personen pro Konto; für mehr ein Plan nach Maß.',
        link: 'Preise ansehen',
      },
      product: {
        title: 'Produkt oder SaaS',
        body: 'Welche Funktionen genutzt werden, wo die Registrierung Menschen verliert und welche Routen deiner API fehlschlagen, ohne Cookie bei deinen Nutzern.',
        link: 'Die Ansichten des Dashboards ansehen',
      },
      install:
        'Du programmierst nicht? Die Installation kann ein KI-Agent übernehmen, wer deine Website gebaut hat oder eine Agentur. <link>So wird installiert</link>',
    },
    preview: {
      label: 'Vorschau der Übersicht',
      range: 'Letzte 30 Tage',
      current: 'Dieser Zeitraum',
      previous: 'Vorheriger Zeitraum',
      dropOff: 'Größter Absprung im Funnel',
      failingWrite: 'Schreibzugriff, der am häufigsten fehlschlägt',
      failed: '{share} fehlgeschlagen',
      invented: 'Erfundene Daten, wie in der Live-Demo.',
    },
    proof: {
      size: { value: 'unter 5 KB', label: 'Pyxis-Code, gzip-komprimiert' },
      dependencies: { value: '0', label: 'Laufzeit-Abhängigkeiten' },
      coverage: { value: '100\u00a0%', label: 'Testabdeckung in allen vier Repositorys' },
      license: { value: 'MIT', label: 'Lizenz, Infrastruktur inklusive' },
    },
    never: {
      eyebrow: 'Datenschutz',
      title: 'Was nie gespeichert wird',
      raw: 'Ein gewöhnliches Tracking-Tag würde senden:',
      kept: 'Was übrig bleibt:',
      lead: 'Fünf Dinge, die ein gewöhnliches Tracking-Tag senden würde, und was davon übrig bleibt. Der Browser kürzt zuerst; die API prüft noch einmal, bevor irgendetwas die Datenbank erreicht.',
      rows: {
        address: {
          label: 'Seitenadresse',
          where: 'Im Browser',
          raw: 'https://shop.example/orders/48213?email=ana@example.com&utm_source=news',
          kept: '/orders/:id · utm_source=news',
        },
        ip: {
          label: 'IP-Adresse',
          where:
            'In der API: Land und Region, die Stadt nur, wenn die Website sie eingeschaltet hat; danach wird die Adresse verworfen.',
          raw: '203.0.113.7',
          kept: 'BR · BR-BA',
        },
        browser: {
          label: 'Browser',
          where: 'In der API: klassifiziert, dann verworfen',
          raw: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36',
          kept: 'Desktop · Chrome · Windows',
        },
        property: {
          label: 'Ereigniseigenschaft',
          where:
            'In der API: alles, was wie eine E-Mail-Adresse, Telefonnummer oder Steuer-ID aussieht',
          raw: '"coupon": "ana@example.com"',
          kept: 'verworfen',
        },
        visit: {
          label: 'Besuch',
          where: 'Im Browser: kein Cookie, nichts, was zwei Tabs verknüpft',
          raw: 'cookie: visitor_id=8f2c41d0…; Max-Age=34560000',
          kept: 'sessionStorage · endet mit dem Tab',
        },
      },
      foot: 'Ein Browser, der „Nicht verfolgen“ sendet (Global Privacy Control oder Do Not Track), schaltet Pyxis ab, bevor irgendetwas in die Warteschlange kommt. Ereignisse werden nach 13 Monaten gelöscht.',
    },
    answers: {
      eyebrow: 'Dashboard',
      title: 'Was das Dashboard beantwortet',
      lead: 'Acht Ansichten, jede rund um eine Frage. Jede Karte öffnet diese Ansicht in der Live-Demo.',
      open: 'In der Demo öffnen',
      agent:
        'Lieber fragen? Verbinde Pyxis mit Claude, und Claude liest dieselben Zahlen, ohne etwas zu ändern. <link>So verbindest du es</link>',
      questions: {
        overview:
          'Wie viele Besuche, Conversions und fehlgeschlagene Schreibzugriffe in diesem Zeitraum, verglichen mit dem vorherigen?',
        acquisition: 'Welche Kanäle, Quellen und Kampagnen bringen Besuche, die konvertieren?',
        devices: 'Von welchen Geräten, Browsern, Ländern und Regionen kommen die Besuche?',
        features:
          'Welche Ereignisse und Ansichten werden genutzt, und wie verteilt sich eine Eigenschaft?',
        funnel: 'Wo verliert eine Registrierung Menschen, und wie lange dauert jeder Schritt?',
        requests: 'Welche Routen deiner API schlagen fehl, wie oft und wie langsam?',
        visits:
          'Welche Besuche haben etwas Bestimmtes getan, gefiltert nach Seite, Ereignis, Kanal, Gerät oder Fehler?',
        timeline: 'Was hat ein Besuch oder eine angemeldete Person getan, der Reihe nach?',
      },
    },
    askClaude: {
      eyebrow: 'MCP-Connector',
      title: 'Frag Claude, statt dich durch Diagramme zu wühlen',
      lead: 'Verbinde Pyxis einmal mit Claude und frag in deinen eigenen Worten: wie die letzte Woche lief, wo die Registrierung Menschen verliert, welche Route angefangen hat fehlzuschlagen. Claude liest dieselben Zahlen wie das Dashboard, über sechzehn Tools, die nur lesen. Im Plan enthalten, ohne Aufpreis.',
      connect: 'In einer Minute verbinden',
      directory: {
        badge: 'Neu',
        title: 'Pyxis ist im Connector-Verzeichnis von Claude',
        body: 'Öffne die Seite von Pyxis im Verzeichnis, wähle „Connect“ und melde dich im neuen Fenster bei Pyxis an. Das funktioniert mit Claude im Web, auf deinem Computer und auf deinem Smartphone.',
        open: 'Im Verzeichnis von Claude öffnen',
        or: 'Oder füge ihn als benutzerdefinierten Connector hinzu:',
      },
      example: {
        label: 'Ein Beispielgespräch',
        you: 'Du',
        claude: 'Claude',
        question: 'Wie lief die letzte Woche, und wo verliert die Registrierung Menschen?',
        used: 'Claude hat gelesen:',
        connected: 'MCP verbunden',
        replay: 'Erneut abspielen',
        answer:
          'Die Besuche sind gegenüber der Vorwoche um 12\u00a0% gestiegen, die Conversions um 8\u00a0%. Die Registrierung verliert die meisten Menschen zwischen dem Formular und dem E-Mail-Code: 41\u00a0% steigen dort aus, auf Smartphones sind es 52\u00a0%. Am Computer verliert dieser Schritt 23\u00a0%.',
        invented: 'Erfundenes Gespräch und erfundene Zahlen, wie in der Live-Demo.',
      },
      promises: {
        reads: {
          title: 'Nur lesend',
          body: 'Jedes der sechzehn Tools ist ein Lesezugriff auf die Pyxis-API. Claude kann nie etwas ändern oder löschen.',
        },
        revoke: {
          title: 'Jederzeit widerrufbar',
          body: 'Jede Verbindung steht unter Einstellungen → Verbundene Apps und endet in dem Moment, in dem du sie widerrufst. Nach 90 Tagen ohne Nutzung endet sie von selbst.',
        },
        personal: {
          title: 'Nichts Persönliches zum Weitergeben',
          body: 'Ereignisse enthalten kein Cookie, keine IP-Adresse und keinen User-Agent, also enthält auch das, was Claude liest, nichts davon.',
        },
      },
      foot: 'Was Claude anfragt, geht von der Pyxis-API an Anthropic, das es nach eigenen Bedingungen verarbeitet. Cursor und andere MCP-Clients verbinden sich mit einem Zugriffstoken, das du in den Einstellungen erstellst. <link>Die vollständige Anleitung</link>',
    },
    report: {
      eyebrow: 'Berichte',
      title: 'Jeden Montag die Woche in deinem Postfach',
      lead: 'Besuche, Conversions und fehlgeschlagene Schreibzugriffe im Vergleich zur Vorwoche, die Top-Seiten und die Routen mit den meisten Fehlern. Ohne das Dashboard zu öffnen und ohne jemanden zu fragen.',
      items: {
        digest: {
          title: 'Für jeden Admin des Projekts eingeschaltet',
          body: 'Er kommt jeden Montag, mit der Woche abgeschlossen in der Zeitzone deines Projekts und in der Sprache, in der du das Dashboard nutzt. Er enthält nur Summen, nichts Persönliches. Auch eine Woche ohne Besuche kommt an, mit dem Datum des letzten Ereignisses: So fällt eine kaputte Installation auf, ohne dass du das Dashboard öffnest. Ausschalten in den Einstellungen.',
        },
        csv: {
          title: 'Eine CSV-Datei pro Ansicht',
          body: 'Übersicht, Akquisition, Geräte, Funktionen, Anfragen und Besuche laden als CSV herunter, was sie zeigen, für den gewählten Zeitraum.',
        },
        export: {
          title: 'Alle Ereignisse in einer Datei',
          body: 'Der Projektexport fasst alles, was das Projekt speichert, in einer komprimierten CSV-Datei zusammen. Der Link kommt in wenigen Minuten per E-Mail.',
        },
      },
      mail: {
        label: 'Ein Beispiel der E-Mail mit dem Wochenbericht',
        kicker: 'Wochenbericht',
        visits: 'Besuche',
        identifiedUsers: 'Identifizierte Nutzer',
        convertingVisits: 'Besuche mit Conversion',
        failedWrites: 'Fehlgeschlagene Schreibzugriffe',
        visitsPerDay: 'Besuche pro Tag',
        failingRoutes: 'Fehlerhafte Routen',
        openWeek: 'Woche im Dashboard öffnen',
        versusWeekBefore: '{change} ggü. der Vorwoche ({previous})',
        unchangedFromWeekBefore: 'keine Veränderung ggü. der Vorwoche ({previous})',
        weekBeforeOnly: '{previous} in der Vorwoche',
        shareOfVisits: '{share} der Besuche',
        ofWrites: 'von {writes} Schreibzugriffen, {rate}',
        noWrites: 'keine Schreibzugriffe',
        failedOf: '{failed} von {total} fehlgeschlagen',
      },
    },
    nudge: {
      label: 'Neu: Pyxis in Claude',
      badge: 'Neu',
      title: 'MCP-Zugriff ist da!',
      tips: {
        agents:
          'Verbinde Claude und andere KI-Agenten über das Model Context Protocol mit deinen Pyxis-Zahlen.',
        ask: 'Frag „Wie lief die letzte Woche?“, und Claude liest deine Zahlen.',
        connect: 'In einer Minute verbunden. Nur lesend, und du kannst es jederzeit widerrufen.',
        privacy: 'Claude sieht dieselben Zahlen wie dein Dashboard und nichts Persönliches.',
      },
      another: 'Noch ein Tipp',
      cta: 'So verbindest du es',
      dismiss: 'Schließen',
    },
    install: {
      eyebrow: 'Installation',
      title: 'Was eine Website hinzufügt',
      lead: 'Ein Paket und zwei Zeilen. Seitenaufrufe werden automatisch erfasst; ein benanntes Ereignis ist ein Aufruf.',
      steps: {
        label: 'So fängst du an, in 3 Schritten',
        account: {
          title: 'Konto und Projekt anlegen',
          bodyFree:
            'Im Dashboard, mit einer E-Mail und ohne Karte: Der kostenlose Plan umfasst eine Website. Das Projekt kommt gleich mit seinem öffentlichen Schlüssel.',
          body: 'Im Dashboard, mit einer E-Mail und einer Karte: 14 Tage kostenlos. Das Projekt kommt gleich mit seinem öffentlichen Schlüssel.',
        },
        install: {
          title: 'Installieren, selbst oder mit einem KI-Agenten',
          body: 'Ein Paket und zwei Zeilen im Code der Website, oder eine Bitte an Claude Code, Cursor oder einen anderen Agenten.',
        },
        ask: {
          title: 'Fragen',
          body: 'Öffne das Dashboard, oder verbinde Claude und frag, wie die Woche lief und wo Menschen aufhören.',
        },
      },
      copy: 'Kopieren',
      copied: 'Kopiert',
      selected: 'Markiert, drück Strg+C',
      note: 'Schlüssel vergibt, wer die API betreibt, und eine öffentliche Registrierung gibt es derzeit nicht. Alle vier Repositorys stehen unter MIT-Lizenz, die AWS-Infrastruktur (Terraform) eingeschlossen.',
      noteFree:
        'Deine Schlüssel bekommst du mit deinem Konto: Starte unten kostenlos oder betreibe dein eigenes Pyxis. Alle vier Repositorys stehen unter MIT-Lizenz, die AWS-Infrastruktur (Terraform) eingeschlossen.',
      noteOpen:
        'Deine Schlüssel bekommst du mit deinem Konto: Starte unten die kostenlose Testphase oder betreibe dein eigenes Pyxis. Alle vier Repositorys stehen unter MIT-Lizenz, die AWS-Infrastruktur (Terraform) eingeschlossen.',
      requests:
        'Um zu sehen, welche Aufrufe an deine API fehlschlagen, umschließe deinen HTTP-Client einmal mit <code>trackRequest()</code>. <link>Beispiel ansehen</link>',
      agent: {
        title: 'Oder bitte deinen KI-Agenten',
        lead: 'Öffne das Repository der Website in Claude Code, in Cursor oder in einem anderen Agenten und füge ein:',
        prompt:
          'Installiere Pyxis auf dieser Website nach https://pyxis-analytics.dev/llms.txt. Der öffentliche Schlüssel meines Projekts ist pyxis_pk_… und der Endpoint ist https://api.pyxis-analytics.dev. Miss die Seiten und erfasse bei jedem Schritt der Bestellung ein Ereignis, ohne personenbezogene Daten.',
        ready:
          'Sobald Konto und Projekt angelegt sind, steht eine Anfrage wie diese auf der Seite „Installieren“ im Dashboard fertig bereit, mit dem Schlüssel deines Projekts statt <code>pyxis_pk_…</code>.',
        foot: 'Der Agent hält sich an die Regeln in <code>llms.txt</code>: keine personenbezogenen Daten, gültige Ereignisnamen, die API-Adresse in der CSP. Verbinde danach Claude mit Pyxis, um zu prüfen, ob die ersten Ereignisse angekommen sind.',
        badge: 'Installieren, ohne Code zu schreiben',
        agents: 'Funktioniert mit Coding-Agenten wie',
        others: 'und anderen, die llms.txt lesen',
        copyRequest: 'Anfrage für den Agenten kopieren',
        requestCopied: 'Anfrage kopiert. Füge sie in deinen Agenten ein',
      },
    },
    public: {
      eyebrow: 'Engineering',
      title: 'Öffentlich entwickelt',
      production:
        'Misst seit Oktober 2026 echte Websites, <bolsoverde>bolsoverde.com</bolsoverde> und <blog>den Blog des Autors</blog>, beide ohne Cookie.',
      items: {
        coverage:
          '100\u00a0% der Anweisungen, Verzweigungen, Funktionen und Zeilen in allen vier Repositorys abgedeckt. Darunter schlägt die CI fehl.',
        realServices:
          'Integrationstests gegen ein echtes Postgres und End-to-End-Tests in einem echten Browser mit axe-Barrierefreiheitsprüfungen.',
        provenance:
          'Der Pyxis-Code, den Websites installieren, wird über GitHub Actions mit Herkunftsnachweis (Provenance) auf npm veröffentlicht.',
        decisions:
          'Entscheidungen als Architecture Decision Records in jedem Repository festgehalten.',
        storybook: 'Ein Storybook, in dem jede Story auch ein Barrierefreiheitstest ist.',
      },
      storybook: 'Jede Dashboard-Komponente und ihre Zustände',
      apiReference: 'Aus den eigenen Schemas der Routen generiert',
      playground: 'Der echte Pyxis-Code, der jeden Batch zeigt, den er senden würde',
    },
    architecture: {
      eyebrow: 'Architektur',
      title: 'Wie die Teile zusammenpassen',
      site: { name: 'Deine Website', note: 'pyxis-analytics im Browser' },
      edge: { name: 'CloudFront', note: 'Vor der API' },
      api: { name: 'API', note: 'NestJS auf AWS Lambda, in São Paulo' },
      database: {
        name: 'Postgres',
        note: 'Neon, erreicht über eine Rolle, die das Schema nicht ändern kann',
      },
      dashboard: { name: 'Dashboard', note: 'Next.js auf Vercel, liest die API' },
      retention: { name: 'Täglicher Job', note: 'Löscht Ereignisse nach 13 Monaten' },
      digest: { name: 'Wochenbericht', note: 'Eine E-Mail jeden Montag' },
    },
    comparison: {
      eyebrow: 'Im Vergleich',
      title: 'Pyxis und ein typisches Tracking-Tag mit Cookies',
      aspect: 'Aspekt',
      typical: 'Typisches Tracking-Tag mit Cookies',
      table: 'Vergleichstabelle',
      rows: {
        cookie: {
          aspect: 'Cookie bei deinen Besuchern',
          pyxis: 'Keins',
          typical: 'Ein ID-Cookie, meist monatelang gespeichert',
        },
        address: {
          aspect: 'IP-Adresse',
          pyxis: 'Für Land und Region gelesen, nie gespeichert',
          typical: 'Hängt vom Tool und seinen Einstellungen ab',
        },
        linking: {
          aspect: 'Verknüpft die Besuche eines anonymen Besuchers',
          pyxis: 'Nie: Ein Besuch ist ein Tab',
          typical: 'Ja, über das Cookie',
        },
        thirdParties: {
          aspect: 'Dritte',
          pyxis: 'Keine',
          typical: 'Hängt vom Tool ab; manchmal ein Werbenetzwerk',
        },
        agents: {
          aspect: 'Einen KI-Agenten nach den Zahlen fragen',
          pyxis: 'Ja: ein Connector für Claude, nur lesend',
          typical: 'Hängt vom Tool ab',
        },
        failedRequests: {
          aspect: 'Fehlgeschlagene Anfragen der Website, bei jedem Besuch',
          pyxis: 'Ja: Route, Status und Dauer',
          typical: 'Hängt vom Tool ab',
        },
        trackerSize: {
          aspect: 'Größe des Codes, den die Website lädt, gzip-komprimiert',
          pyxis: 'Unter 5 KB',
          typical: 'Meist 30 bis 150 KB',
        },
        source: { aspect: 'Quellcode', pyxis: 'MIT, auf GitHub', typical: 'Unterschiedlich' },
      },
      foot: '„Typisch“ beschreibt ein verbreitetes Setup, kein bestimmtes Produkt.',
    },
    pricing: {
      eyebrow: 'Preise',
      title: 'Ein Plan, in Real, mit allem, was die Demo zeigt',
      titleFree: 'Zwei Pläne, in Real, beide mit allem, was die Demo zeigt',
      paidName: 'Kostenpflichtig',
      paidHow:
        'Alle starten im kostenlosen Plan: Abonniere unter Konto und Abrechnung, monatlich oder jährlich, sofort berechnet. Innerhalb von 7 Tagen nach der ersten Abbuchung kannst du widerrufen und bekommst den Betrag vollständig zurück.',
      freeOpenNote:
        'Registriere dich mit einer E-Mail und ohne Karte: Das Dashboard öffnet sofort, im kostenlosen Plan.',
      free: {
        name: 'Kostenlos',
        price: 'R$ 0',
        note: 'Ohne Enddatum, solange die Website hineinpasst.',
        start: 'Kostenlos starten',
        included: {
          events: 'Bis zu {events} Ereignisse pro Monat',
          sites: 'Eine Website',
          people: 'Nur du im Dashboard',
          history: '13 Monate Verlauf',
          digest: 'Ein Wochenbericht per E-Mail',
          agents: 'Der Claude-Connector (MCP) und Zugriffstokens für KI-Agenten',
          pause:
            'Die Messung pausiert bei {events} Ereignissen bis zum 1., mit einer E-Mail bei 80\u00a0%',
          card: 'Ohne Karte',
        },
      },
      lead: 'Keine Kosten pro Besucher, pro Funktion oder pro identifizierter Person. Deine Besucher bekommen weiterhin kein Cookie, und es werden keine personenbezogenen Daten erhoben.',
      period: 'Abrechnungszeitraum',
      monthly: 'Monatlich',
      monthlyLabel: 'Monatlich, R$ 39 pro Monat',
      yearly: 'Jährlich',
      yearlyLabel: 'Jährlich, R$ 390 pro Jahr, 2 Monate gratis',
      saving: '2 Monate gratis',
      monthlyPrice: 'R$ 39',
      perMonth: 'pro Monat',
      monthlyNote: 'oder R$ 390 pro Jahr, mit 2 Monaten gratis',
      yearlyPrice: 'R$ 390',
      perYear: 'pro Jahr',
      yearlyNote: 'das sind R$ 32,50 pro Monat',
      approximateMonthly:
        'Preis in Real: etwa {amount} pro Monat. Die Zahlungsseite zeigt den genauen Betrag in deiner Währung.',
      approximateYearly:
        'Preis in Real: etwa {amount} pro Jahr. Die Zahlungsseite zeigt den genauen Betrag in deiner Währung.',
      included: {
        events: 'Bis zu 100.000 Ereignisse pro Monat',
        sites: 'Bis zu 3 Websites',
        people: 'Bis zu 3 Personen im Dashboard',
        history: '13 Monate Verlauf',
        digest: 'Ein Wochenbericht per E-Mail',
        agents: 'Der Claude-Connector (MCP) und Zugriffstokens für KI-Agenten',
      },
      ask: 'Zugang anfragen',
      askTitle: 'Schreib an',
      askIntro: 'Nenne in ein paar Zeilen:',
      askSite: 'die Adresse der Website oder Websites, bis zu 3;',
      askVisits: 'ungefähr wie viele Besuche sie pro Monat hat;',
      askEmail: 'die E-Mail-Adresse der Person, die sich im Dashboard anmelden wird.',
      askReply:
        'Mit der Antwort kommt der Zahlungslink. Sobald du abonniert hast, bekommst du innerhalb von 2 Werktagen Zugang zum Dashboard.',
      askMail: 'In meinem E-Mail-Programm öffnen',
      mailSubject: 'Ich möchte Pyxis nutzen',
      trial:
        '14 Tage kostenlos. Die Karte wird erst am 15. Tag belastet, und du kannst jederzeit kündigen.',
      invite:
        'Derzeit gibt es Zugang nur auf Einladung: Du fragst an, bekommst den Zahlungslink und, sobald du abonniert hast, innerhalb von 2 Werktagen Zugang zum Dashboard.',
      moreTitle: 'Für Agenturen und Entwickler',
      moreFree:
        'Miss die Websites deiner Kunden: Jeder Kunde meldet sich mit seiner eigenen E-Mail an und sieht nur sein Projekt. Der kostenpflichtige Plan umfasst bis zu 3 Websites und 3 Personen, dich eingeschlossen. Für mehr Kunden schreib uns an hello@pyxis-analytics.dev, wie viele Websites und Personen du brauchst, und wir antworten innerhalb von 2 Werktagen mit einem passenden Plan.',
      more: 'Miss die Websites deiner Kunden: Jeder Kunde meldet sich mit seiner eigenen E-Mail an und sieht nur sein Projekt. Der Plan umfasst bis zu 3 Websites und 3 Personen, dich eingeschlossen. Für mehr Kunden schreib uns an hello@pyxis-analytics.dev, wie viele Websites und Personen du brauchst, und wir antworten innerhalb von 2 Werktagen mit einem passenden Plan.',
      moreLink: 'Nach einem Plan für Agenturen fragen',
      moreSubject: 'Ein Pyxis-Plan für eine Agentur',
      start: 'Kostenlos testen',
      openNote:
        'Registriere dich mit einer E-Mail-Adresse und einer Karte; das Dashboard öffnet sich, sobald das Abo bestätigt ist.',
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Häufige Fragen',
      items: {
        cookies: {
          question: 'Setzt Pyxis Cookies bei meinen Besuchern?',
          answer:
            'Nein. Die ID eines Besuchs liegt im <code>sessionStorage</code> des Tabs und endet, wenn der Tab geschlossen wird. Cookies gibt es nur im Pyxis-Dashboard selbst, für die Menschen, die es nutzen, nie auf den Websites, die es misst.',
        },
        address: {
          question: 'Speichert es IP-Adressen?',
          answer:
            'Nein. CloudFront teilt der API Land und Region jeder Anfrage mit, die ungefähre Stadt nur in einem Projekt, dessen Inhaber sie eingeschaltet hat; die Adresse selbst wird nirgends gespeichert.',
        },
        people: {
          question: 'Kann es erkennen, dass zwei Besuche von derselben Person stammen?',
          answer:
            'Nur bei Menschen, die auf deiner Website angemeldet sind, über deine eigene interne ID, nie über eine E-Mail-Adresse. Anonyme Besuche werden nie verknüpft: weder über Tabs noch über Tage hinweg.',
        },
        optOut: {
          question: 'Kann ein Besucher widersprechen?',
          answer:
            'Global Privacy Control und Do Not Track schalten Pyxis ab, und eine Website kann mit <code>optOut()</code> und <code>trackingStatus()</code> einen eigenen Schalter anbieten.',
        },
        retention: {
          question: 'Wie lange werden Daten aufbewahrt?',
          answer:
            'Dreizehn Monate, dann löscht ein täglicher Job sie. Die Ereignisse einer Person lassen sich jederzeit aus deinem Backend exportieren oder löschen.',
        },
        claude: {
          question: 'Kann ich Claude nach meinen Zahlen fragen?',
          answer:
            'Ja. Pyxis ist im Connector-Verzeichnis von Claude: Öffne <code>claude.ai/directory/pyxis</code>, wähle „Connect“ und melde dich bei Pyxis an. Führe in Claude Code <code>claude mcp add</code> mit der Adresse <code>https://api.pyxis-analytics.dev/mcp</code> aus. Claude liest dann die Zahlen aller Projekte, die du öffnen kannst, und ändert nichts. Widerrufen kannst du es unter Einstellungen → Verbundene Apps.',
        },
        use: {
          question: 'Kann ich es auf meiner Website nutzen?',
          answer:
            'Ja, auf zwei Arten: Betreibe Pyxis auf deiner eigenen Infrastruktur (der Code steht unter MIT-Lizenz auf GitHub) oder abonniere den gehosteten Plan. Für ein Abo fragst du unter hello@pyxis-analytics.dev nach Zugang.',
          answerOpen:
            'Ja, auf zwei Arten: Betreibe Pyxis auf deiner eigenen Infrastruktur (der Code steht unter MIT-Lizenz auf GitHub) oder abonniere den gehosteten Plan. Wer in Brasilien ist, kann sich mit einer E-Mail-Adresse und einer Karte registrieren: 14 Tage kostenlos, einmal pro Kunde, und du kannst jederzeit kündigen.',
          answerFree:
            'Ja, auf zwei Arten: Betreibe Pyxis auf deiner eigenen Infrastruktur (der Code steht unter MIT-Lizenz auf GitHub) oder nutze das gehostete Pyxis. Wer in Brasilien ist, kann sich mit einer E-Mail-Adresse ohne Karte im kostenlosen Plan registrieren und den kostenpflichtigen Plan abonnieren, wenn die Website mehr braucht.',
        },
        agency: {
          question: 'Kann ich Pyxis auf den Websites meiner Kunden nutzen?',
          answer:
            'Ja. Leg pro Website ein Projekt an und füge den Kunden zu den Personen des Projekts hinzu: Er meldet sich mit einem Code per E-Mail an und sieht nur dieses Projekt. Der Plan umfasst bis zu 3 Websites und 3 Personen, dich eingeschlossen; für mehr schreib an hello@pyxis-analytics.dev. Die <terms>Nutzungsbedingungen</terms> regeln das: Als Agentur die Websites von Kunden zu messen, die zugestimmt haben, ist kein Weiterverkauf.',
          answerFree:
            'Ja. Leg pro Website ein Projekt an und füge den Kunden zu den Personen des Projekts hinzu: Er meldet sich mit einem Code per E-Mail an und sieht nur dieses Projekt. Der kostenlose Plan umfasst eine Website und nur dich, der kostenpflichtige Plan bis zu 3 Websites und 3 Personen, dich eingeschlossen; für mehr schreib an hello@pyxis-analytics.dev. Die <terms>Nutzungsbedingungen</terms> regeln das: Als Agentur die Websites von Kunden zu messen, die zugestimmt haben, ist kein Weiterverkauf.',
        },
        noCode: {
          question: 'Ich programmiere nicht. Kann ich es installieren?',
          answer:
            'Die Installation ist ein Paket und zwei Zeilen im Code der Website, also muss jemand diesen Code anfassen: du mit einem KI-Agenten, wer deine Website gebaut hat oder eine Agentur. Danach verlangen das Dashboard und Claude keinen Code mehr.',
        },
        aiInstall: {
          question: 'Kann ich eine KI bitten, es zu installieren?',
          answer:
            'Ja. Öffne das Repository der Website in Claude Code, in Cursor oder in einem anderen Agenten und bitte ihn, Pyxis nach <code>https://pyxis-analytics.dev/llms.txt</code> zu installieren, mit dem öffentlichen Schlüssel deines Projekts. Der Agent fügt das Paket, den <code>init</code>-Aufruf und die Ereignisse hinzu. Verbinde danach Claude mit Pyxis, um zu prüfen, ob die ersten Ereignisse angekommen sind.',
        },
        price: {
          question: 'Was kostet es?',
          answer:
            'R$ 39 pro Monat oder R$ 390 pro Jahr (zwei Monate gratis), per Karte. Enthalten sind bis zu 100.000 Ereignisse pro Monat, 3 Websites, 3 Personen im Dashboard, 13 Monate Verlauf, der Wochenbericht und der MCP-Server.',
          answerFree:
            'Beide Pläne haben alle Funktionen: 13 Monate Verlauf, den Wochenbericht und den MCP-Server. Der kostenlose Plan kostet nichts und nimmt bis zu {events} Ereignisse pro Monat auf einer Website an, nur mit dir im Dashboard. Der kostenpflichtige Plan kostet R$ 39 pro Monat oder R$ 390 pro Jahr (zwei Monate gratis), per Karte, sofort berechnet, und nimmt bis zu 100.000 Ereignisse pro Monat, 3 Websites und 3 Personen an.',
        },
        trial: {
          question: 'Wie funktioniert die kostenlose Testphase?',
          answer:
            'Du testest 14 Tage kostenlos, einmal pro Kunde. Die Karte wird zu Beginn abgefragt und erst am 15. Tag belastet; kündigst du vorher, wird nichts berechnet.',
        },
        cancel: {
          question: 'Wie kündige ich?',
          answer:
            'Jederzeit, auf zwei Arten: Kündige im Abo-Portal, dann bleibt der Zugang bis zum Ende des bezahlten Zeitraums; oder schließ das Konto im Dashboard, dann endet der Zugang sofort. Innerhalb von 7 Tagen nach der ersten Abbuchung wird diese beim Schließen des Kontos vollständig erstattet; danach wird der bereits bezahlte Zeitraum nicht erstattet. Die Daten des Projekts werden 30 Tage nach Ende des Zugriffs gelöscht.',
          answerOpen:
            'Jederzeit, auf zwei Arten: Kündige im Abo-Portal, dann bleibt der Zugang bis zum Ende des bezahlten Zeitraums; oder schließ das Konto im Dashboard, dann endet der Zugang sofort. Innerhalb von 7 Tagen nach der ersten Abbuchung wird diese beim Schließen des Kontos vollständig erstattet; danach wird der bereits bezahlte Zeitraum nicht erstattet. Die Daten des Projekts werden 30 Tage nach Ende des Zugriffs gelöscht. Die Details stehen in den <terms>Nutzungsbedingungen</terms>.',
          answerFree:
            'Jederzeit, im Abo-Portal: Der kostenpflichtige Plan läuft bis zum Ende des bereits bezahlten Zeitraums, danach kehrt ein Konto mit einer Website und einer Person in den kostenlosen Plan zurück; ein größeres endet, und seine Daten werden 30 Tage später gelöscht. Innerhalb von 7 Tagen nach der ersten Abbuchung kannst du widerrufen: Die Abbuchung wird vollständig erstattet, und das Konto kehrt in den kostenlosen Plan zurück, wenn es hineinpasst. Wenn du das Konto im Dashboard schließt, endet alles sofort, in jedem Plan. Die Details stehen in den <terms>Nutzungsbedingungen</terms>.',
        },
        limit: {
          question: 'Was passiert, wenn ich über 100.000 Ereignisse komme?',
          answer:
            'Du bekommst eine E-Mail bei 80\u00a0% und bei 100\u00a0% der Ereignisse des Monats. Bei 150\u00a0% nimmt das Konto bis zum 1. des nächsten Monats keine Ereignisse mehr an, und während der Pause gesendete Ereignisse gehen verloren. Über den Preis hinaus wird nie etwas berechnet.',
        },
        freeLimit: {
          question: 'Was passiert bei {events} Ereignissen im kostenlosen Plan?',
          answer:
            'Im kostenlosen Plan warnt eine E-Mail bei 80\u00a0% der Ereignisse des Monats. Bei {events} nimmt das Konto bis zum 1. des nächsten Monats keine Ereignisse mehr an, und während der Pause gesendete Ereignisse gehen verloren. Ein Abo des kostenpflichtigen Plans hebt die Pause innerhalb einer Minute auf.',
        },
        payment: {
          question: 'Kann ich per Pix zahlen, und gibt es eine Rechnung?',
          answer:
            'Derzeit nur per Karte; Pix für den Jahresplan hängt davon ab, dass Stripe es freischaltet. Brasilianische Rechnungen (Nota Fiscal) werden noch nicht ausgestellt: Wenn du eine brauchst, schreib uns vor dem Abschluss an {email}.',
        },
        support: {
          question: 'Wie erreiche ich den Support?',
          answer:
            'Per E-Mail an {email}, am besten von der E-Mail-Adresse deines Kontos. Im kostenpflichtigen Tarif antworten wir innerhalb von {paidDays} Werktagen. Im kostenlosen Tarif laufen Fragen zu Installation und Nutzung über die GitHub-Issues und die Dokumentation; Vertrag, Tarif, Limits, Abrechnung und personenbezogene Daten bleiben bei der E-Mail, mit einer Antwort innerhalb von {freeDays} Tagen. Eine Sicherheitslücke meldest du vertraulich über GitHub.',
        },
      },
    },
    story: {
      eyebrow: 'Die Geschichte',
      title: 'Warum es Pyxis gibt',
      body: 'Der Einführungsbeitrag erklärt, warum es gebaut wurde und was es nie speichert.',
      cta: 'Beitrag lesen',
    },
    measurement: {
      measured:
        'Diese Seite wird von Pyxis selbst gemessen: kein Cookie, keine gespeicherte IP-Adresse.',
      see: 'Ansehen, was erfasst wurde',
      optOut: 'Meine Besuche nicht messen',
      off: 'Die Messung ist in diesem Browser ausgeschaltet.',
      optIn: 'Wieder messen',
      blocked:
        'Die Messung ist durch die „Nicht verfolgen“-Einstellung deines Browsers ausgeschaltet.',
    },
    recorded: {
      button: 'Was diese Seite erfasst hat',
      title: 'Was diese Seite erfasst hat',
      subtitle: 'Dieser Besuch, live. Wird alle 5 Sekunden an Pyxis gesendet.',
      visit: 'Besuch {id}… · nur dieser Tab',
      referrer: 'Referrer: {host}',
      noReferrer: 'Referrer: keiner',
      empty: 'Noch nichts gesendet. Der erste Batch geht innerhalb von 5 Sekunden raus.',
      never:
        '<strong>Nie gesendet:</strong> deine IP-Adresse, der vollständige Name deines Browsers, ein Cookie, die vollständige Adresse der Seite. <strong>Vom Server ergänzt:</strong> Land, Region und ungefähre Stadt, aus der Anfrage; danach wird die Adresse verworfen.',
      close: 'Schließen',
    },
    footer: {
      tagline: 'Datenschutzfreundliche Produktanalyse.',
      product: 'Produkt',
      pricing: 'Preise',
      code: 'Code',
      support: 'Support',
      supportReply: 'Antwort innerhalb von {days} Werktagen im kostenpflichtigen Tarif.',
      questions: 'Fragen auf GitHub',
      securityReport: 'Sicherheitslücke melden',
      author: 'Autor: {site}',
      demo: 'Live-Demo',
      apiReference: 'API-Referenz',
      playground: 'SDK-Playground',
      madeBy: 'Von Samuel Santana · MIT-Lizenz',
      contract: 'Vertrag',
      contractLanguage: 'Höflichkeitsübersetzungen; maßgeblich ist der portugiesische Text.',
    },
  },
  legal: {
    documentsLabel: 'Vertragsdokumente',
    versionsLabel: 'Dieses Dokument in anderen Sprachen',
    terms: 'Nutzungsbedingungen',
    privacy: 'Datenschutzerklärung',
    agreement: 'Auftragsverarbeitungsvertrag',
    metaDescription: '{document} des gehosteten Pyxis, Version {version}.',
    seller: 'Anbieter: {name} · CPF {taxId} · {address} · {email}',
  },
});
